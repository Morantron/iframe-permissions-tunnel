export const waitMs = ms =>
  new Promise(resolve => setTimeout(() => resolve("wait"), ms));

export const timeout = (promise, ms) =>
  Promise.race([
    promise,
    waitMs(ms).then(() => {
      throw new Error("TIMEOUT");
    })
  ]);
