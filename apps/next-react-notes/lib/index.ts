export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getId = () => {
  return new Date().getTime().toString();
};
