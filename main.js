import "regenerator-runtime/runtime";

import { postMessage, onMessage, onMessageOnce } from "./lib/messaging";
import { timeout } from "./lib/async";

const waitForEvent = eventType => {
  return new Promise(resolve => {
    window.addEventListener(eventType, () => {
      resolve(eventType);
    });
  });
};

const isInIframe = (() => {
  try {
    return window.self !== window.parent;
  } catch (e) {
    return true;
  }
})();

const nullPermissionGranter = async () => "granted";

const permissionGranter =
  DeviceMotionEvent.requestPermission || nullPermissionGranter;

const requiresAskingForPermission = Boolean(
  DeviceMotionEvent.requestPermission
);

const serializeEvent = ({ alpha, beta, gamma }) => ({ alpha, beta, gamma });

/**
 * Calls the method on the parent iframe
 */
const callOnTopFrame = (target, key, descriptor) => {
  let original = descriptor.value;

  if (isInIframe) {
    descriptor.value = async function(...args) {
      await this.waitForHandshake();

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
  constructor() {
    this.callbacks = {};
    this.handshakeReceived = false;

    if (isInIframe) {
      this.waitForHandshake();
    }
  }

  async onOrientationChange(callback) {
    let isPermissionGranted = await this.isPermissionGranted();

    if (!isPermissionGranted) {
      console.warn("Could not add listener, permission not granted");
      return;
    }

    if (isInIframe) {
      this.registerCallback("deviceorientation", callback);

      onMessage("deviceorientation-callback", ({ args }) => {
        this.triggerCallbacks("deviceorientation", args);
      });

      this.setupEventForwarding();
    } else {
      window.addEventListener("deviceorientation", event =>
        callback(serializeEvent(event))
      );
    }
  }

  @callOnTopFrame
  notifyPermissionPromptIsShown() {
    this.triggerCallbacks("permission:prompt-shown");
  }

  @callOnTopFrame
  notifyPermissionPromptIsHidden() {
    this.triggerCallbacks("permission:prompt-hidden");
  }

  onPermissionPromptShown(cb) {
    this.registerCallback("permission:prompt-shown", cb);
  }

  onPermissionPromptHidden(cb) {
    this.registerCallback("permission:prompt-hidden", cb);
  }

  onPermissionRequested(cb) {
    this.registerCallback("permission:requested", cb);
  }

  onPermissionGranted(cb) {
    this.registerCallback("permission:granted", cb);
  }

  onPermissionDenied(cb) {
    this.registerCallback("permission:denied", cb);
  }

  @callOnTopFrame
  async setupEventForwarding() {
    window.addEventListener("deviceorientation", event => {
      postMessage(this.forwardTarget, {
        type: "deviceorientation-callback",
        args: [serializeEvent(event)]
      });
    });
  }

  @callOnTopFrame
  async isPermissionGranted() {
    let result;

    if (!requiresAskingForPermission) {
      return true;
    }

    try {
      await timeout(waitForEvent("deviceorientation"), 500);
      result = true;
    } catch (e) {
      console.error(e);
      result = false;
    }

    return result;
  }

  @callOnTopFrame
  async requestPermission() {
    this.triggerCallbacks("permission:requested");
    let result = await permissionGranter();

    if (result === "granted") {
      this.triggerCallbacks("permission:granted");
    } else {
      this.triggerCallbacks("permission:denied");
    }

    return result;
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
        return;
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

  registerCallback(callbackName, callback) {
    if (!this.callbacks[callbackName]) {
      this.callbacks[callbackName] = [];
    }

    this.callbacks[callbackName].push(callback);
  }

  triggerCallbacks(callbackName, args = []) {
    (this.callbacks[callbackName] || []).forEach(cb => cb(args));
  }
}

export const PermissionsTunnel = new PermissionsTunnelClass();
