import { uuid } from "./uuid";

export const onMessage = (type, callback) => {
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

export const onMessageOnce = (type, callback) => {
  let unsubscribe = onMessage(type, () => {
    callback();
    unsubscribe();
  });
};

export const postMessage = (target, payload, { wait = false } = {}) =>
  new Promise((resolve, reject) => {
    if (!payload.id) {
      const id = uuid();
      payload.id = id;
    }

    payload._iframe_permissions_tunnel = true;

    if (wait) {
      const unsubscribe = onMessage("*", message => {
        if (message.id === payload.id && "result" in message) {
          unsubscribe();
          resolve(message.result);
        }
      });
    } else {
      resolve();
    }

    target.postMessage(JSON.stringify(payload), "*");
  });
