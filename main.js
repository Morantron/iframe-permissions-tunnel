import regeneratorRuntime from "@babel/runtime/regenerator";
import { v4 as uuidv4 } from "uuid";

const onMessage = (type, callback) => {
  const enhancedCallback = event => {
    let message;

    try {
      message = JSON.parse(event.data);
    } catch (e) {
      message = null;
    }

    if (
      !message ||
      !message._iframe_permissions_tunnel ||
      (type !== "*" && message.type !== type)
    ) {
      return;
    }

    callback(message);
  };

  window.addEventListener("message", enhancedCallback);

  return () => window.removeEventListener("message", enhancedCallback);
};

const konsole = {
  log: (...args) => console.log(isInIframe ? "[iframe]" : "[top]", ...args)
};

const onMessageOnce = (type, callback) => {
  let unsubscribe = onMessage(type, () => {
    callback();
    unsubscribe();
  });
};

const postMessage = (target, payload, { wait = false } = {}) =>
  new Promise((resolve, reject) => {
    if (!payload.id) {
      const id = uuidv4();
      payload.id = id;
    }

    payload._iframe_permissions_tunnel = true;

    if (wait) {
      const unsubscribe = onMessage("*", message => {
        if (message.id === payload.id && message.result) {
          unsubscribe();
          resolve(message.result);
        }
      });
    } else {
      resolve();
    }

    target.postMessage(JSON.stringify(payload), "*");
  });

const isInIframe = (() => {
  try {
    return window.self !== window.parent;
  } catch (e) {
    return true;
  }
})();

const NullPermissionGranter = { requestPermission: async () => "granted" };

const PermissionGranterByEventType = {
  deviceorientation:
    DeviceMotionEvent.requestPermission || NullPermissionGranter,
  orientationchange:
    DeviceOrientationEvent.requestPermission || NullPermissionGranter
};

const eventSerializerByEventType = {
  deviceorientation: ({ alpha, beta, gamma }) => ({ alpha, beta, gamma })
};

const identity = a => a;

/**
 * Calls the method on the parent iframe
 */
const callOnTopFrame = (target, key, descriptor) => {
  let original = descriptor.value;

  if (isInIframe) {
    descriptor.value = async (...args) => {
      await target.waitForHandshake();

      let result = await postMessage(
        window.parent,
        {
          type: "method-call",
          method: key,
          args
        },
        { wait: true }
      );

      return result;
    };
  }
};

export class PermissionsTunnelClass {
  constructor({ content, css } = {}) {
    this.callbacks = {};
    this.content = content;
    this.css = css;

    if (isInIframe) {
      this.waitForHandshake();
    }
  }

  async addEventListener(eventType, callback) {
    const isPermissionGranted = await this.requestPermissionFor(eventType);

    if (!isPermissionGranted) {
      return;
    }

    if (isInIframe) {
      this.registerCallback(eventType, callback);

      onMessage(`${eventType}-callback`, ({ args }) => {
        this.callbacks[eventType].forEach(cb => cb(...args));
      });
    }

    this.setupEventForwarding(eventType);
  }

  @callOnTopFrame
  async setupEventForwarding(eventType) {
    const eventSerializer = eventSerializerByEventType[eventType] || identity;

    window.addEventListener(eventType, event => {
      postMessage(this.forwardTarget, {
        type: `${eventType}-callback`,
        args: [eventSerializer(event)]
      });
    });
  }

  @callOnTopFrame
  async requestPermissionFor(eventType) {
    const granter =
      PermissionGranterByEventType[eventType] || NullPermissionGranter;

    return (await granter.requestPermission()) === "granted";
  }

  /**
   * This makes the @callOnTopFrame decorator work
   */
  setupMethodForwading() {
    onMessage("method-call", async message => {
      const { method, args } = message;

      let result = await this[method](...args);

      postMessage(this.forwardTarget, {
        type: "method-call-response",
        id: message.id,
        result
      });

      return result;
    });
  }

  waitForHandshake() {
    return new Promise(resolve => {
      if (this.handshakeReceived) {
        resolve();
      }

      onMessageOnce("handshake", message => {
        this.handshakeReceived = true;
        postMessage(window.parent, { type: "handshake-ack" });
        resolve();
      });
    });
  }

  forwardTo(target) {
    this.forwardTarget = target;

    this.setupMethodForwading();
    this.sendHandshake();
  }

  sendHandshake() {
    let interval = setInterval(() => {
      postMessage(this.forwardTarget, { type: "handshake" });
    }, 100);

    onMessageOnce("handshake-ack", message => {
      clearInterval(interval);
    });
  }

  registerCallback(eventType, callback) {
    if (!this.callbacks[eventType]) {
      this.callbacks[eventType] = [];
    }

    this.callbacks[eventType].push(callback);
  }
}

export const PermissionsTunnel = new PermissionsTunnelClass();
