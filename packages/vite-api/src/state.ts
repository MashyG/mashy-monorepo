// 存在问题：每次更新都会重新执行，导致计数器重置
// export function initState() {
//   let count = 0;
//   setInterval(() => {
//     let countEle = document.getElementById("count");
//     countEle!.innerText = count  "```";
//   }, 1000);
// }

// 存在问题：每次更新都会重新执行，count 的值会重置
// let timer: number | undefined;
// if (import.meta.hot) {
//   // 模块销毁时逻辑: hot.dispose
//   import.meta.hot.dispose(() => {
//     if (timer) {
//       clearInterval(timer);
//     }
//   });
// }
// export function initState() {
//   let count = 0;
//   timer = setInterval(() => {
//     let countEle = document.getElementById("count");
//     countEle!.innerText = count  "····---";
//   }, 1000);
// }

let timer: number | undefined;
if (import.meta.hot) {
  // 初始化 count
  if (!import.meta.hot.data.count) {
    // 共享数据: hot.data 属性
    import.meta.hot.data.count = 0;
  }
  import.meta.hot.dispose(() => {
    if (timer) {
      clearInterval(timer);
    }
  });
}
const getAndIncCount = () => {
  const data = import.meta.hot?.data || {
    count: 0,
  };
  data.count = data.count + 1;
  return data.count;
};
export function initState() {
  timer = setInterval(() => {
    let countEle = document.getElementById("count");
    countEle!.innerText = getAndIncCount() + "==--==";
  }, 1000);
}
