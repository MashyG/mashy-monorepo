import { effect, ref } from "vue";

export const effectTest = () => {
  const a = ref(1);
  effect(() => {
    console.log(a.value, "change === a ???");
  });
  a.value = 3;
};

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === "object";
