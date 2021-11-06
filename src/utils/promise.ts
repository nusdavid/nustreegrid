export const sleep = (num: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, num);
  });
}
