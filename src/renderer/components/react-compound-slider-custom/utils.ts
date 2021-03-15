/* eslint-disable import/prefer-default-export */
export function callAll<T>(...fns: (((e: T) => void) | undefined)[]) {
  return (e: T) => {
    return fns.forEach((fn) => fn && fn(e));
  };
}
