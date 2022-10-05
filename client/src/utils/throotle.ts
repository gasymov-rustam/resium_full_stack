export const throttle = (delay: number, fn: any) => {
  let throotling = false;
  return (...args: []) => {
    if (throotling) return;
    throotling = true;
    setTimeout(() => (throotling = false), delay);
    return fn(...args);
  };
};
