export const CallbackTimeout = async (second: number, callback: () => void) => {
  const nodeJS_Timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
    callback();
    clearTimeout(nodeJS_Timeout);
  }, second * 1000);
};
