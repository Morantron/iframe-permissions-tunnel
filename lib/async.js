export const waitMs = ms =>
  new Promise(resolve => setTimeout(() => resolve("wait"), ms));

export const timeout = (promise, ms) =>
  Promise.race([
    promise,
    waitMs(ms).then(() => {
      console.log("time out");
      throw new Error("TIMEOUT");
    })
  ]);
