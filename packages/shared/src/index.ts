import { merge } from "lodash";
console.log(merge);

export const sayHello = (name: string) => {
  const str = `hello~ ${name}`;
  console.log(str);
  alert(str);
};

// export * from './number'
