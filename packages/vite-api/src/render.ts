export const render = () => {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <h1>Hello Vite!</h1>
    <p target="_blank">This is hmr test. ~~~~ </p>
  `;
};

// 条件守卫（接受自身更新）
// if (import.meta.hot) {
//   import.meta.hot.accept((mod: any) => mod.render());
// }
