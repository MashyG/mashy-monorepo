import "./style.css";
import { render } from "./render";
import { initState } from "./state";

render();

// 条件守卫（接受依赖模块的更新）
// if (import.meta.hot) {
//   import.meta.hot.accept("./render.ts", (newMod: any) => newMod.render());
// }

initState();

// 条件守卫（接受多个子模块的更新）
if (import.meta.hot) {
  import.meta.hot.accept(["./render.ts", "./state.ts"], (modules) => {
    // 自定义更新
    const [renderModule, stateModule] = modules;
    if (renderModule) {
      renderModule.render();
    }
    if (stateModule) {
      stateModule.initState();
    }
  });
}

/**
 * 其他 API
 * 1. import.meta.hot.decline()：相当于表示此模块不可热更新，当模块更新时会强制进行页面刷新
 * 2. import.meta.hot.invalidate():用来强制刷新页面
 * 3. import.meta.hot.on(event, callback): 监听事件(如以下事件)
 *    vite:beforeUpdate 当模块更新时触发；
      vite:beforeFullReload 当即将重新刷新页面时触发；
      vite:beforePrune 当不再需要的模块即将被剔除时触发；
      vite:error 当发生错误时（例如，语法错误）触发。
 * **/
