# React-router 路由

## history, React-router, React-router-dom 三者关系

1. history： history 是整个 React-router 的核心，里面包括两种路由模式下改变路由的方法，和监听路由变化方法等。
2. react-router：既然有了 history 路由监听/改变的核心，那么需要调度组件负责派发这些路由的更新，也需要容器组件通过路由更新，来渲染视图。所以说 React-router 在 history 核心基础上，增加了 Router ，Switch ，Route 等组件来处理视图渲染。
3. react-router-dom： 在 react-router 基础上，增加了一些 UI 层面的拓展比如 Link ，NavLink 。以及两种模式的根部路由 BrowserRouter ，HashRouter 。

## 两种路由主要方式

> React-Router-dom 根据 history 提供的 createBrowserHistory 或者 createHashHistory 创建出不同的 history 对象

1. 开启 history 模式: http://www.xxx.com/home

```tsx
import { BrowserRouter as Router } from "react-router-dom";
function Index() {
  return <Router>{/* ...开启history模式 */}</Router>;
}
```

2. 开启 hash 模式: http://www.xxx.com/#/home

```tsx
import { HashRouter as Router } from "react-router-dom";
// 和history一样
```

## React 路由原理

### BrowserHistory 模式下

> BrowserHistory 模式下的 history 库就是基于上面改变路由，监听路由的方法进行封装处理，最后形成 history 对象，并传递给 Router。

1. 改变路由：React 应用中调用 history.push 改变路由，本质上是调用 window.history.pushState 方法。

   ```ts
   history.pushState(state, title, path);
   history.replaceState(state, title, path);
   // state：一个与指定网址相关的状态对象， popstate 事件触发时，该对象会传入回调函数。如果不需要可填 null。
   // title：新页面的标题，但是所有浏览器目前都忽略这个值，可填 null 。
   // path：新的网址，必须与当前页面处在同一个域。浏览器的地址栏将显示这个地址。
   ```

2. 监听路由 popstate

   ```ts
   window.addEventListener("popstate", function (e) {
     /* 监听改变 */
   });
   ```

### HashHistory 模式下

1. 改变路由 `window.location.hash`
2. 监听路由 `onhashchange`

```ts
window.addEventListener("hashchange", function (e) {
  /* 监听改变 */
});
```

## React-Router 基本构成

### history，location，match

history 对象：history 对象保存改变路由方法 push ，replace，和监听路由方法 listen 等。
location 对象：可以理解为当前状态下的路由信息，包括 pathname ，state 等。
match 对象：这个用来证明当前路由的匹配信息的对象。存放当前路由 path 等信息。

### 路由组件

#### Router

> 整个应用路由的传递者和派发更新者。

### Route

> 核心部分 => 匹配路由，路由匹配，渲染组件
>
> 由于整个路由状态是用 context 传递的，所以 Route 可以通过 RouterContext.Consumer 来获取上一级传递来的路由进行路由匹配，如果匹配，渲染子代路由。并利用 context 逐层传递的特点，将自己的路由信息，向子代路由传递下去。这样也就能轻松实现了嵌套路由。

1. 四种方式

```tsx
// Component 形式：将组件直接传递给 Route 的 component 属性，Route 可以将路由信息隐式注入到页面组件的 props 中，但是无法传递父组件中的信息，比如如上 mes 。
// render 形式：Route 组件的 render 属性，可以接受一个渲染函数，函数参数就是路由信息，可以传递给页面组件，还可以混入父组件信息。
// children 形式：直接作为 children 属性来渲染子组件，但是这样无法直接向子组件传递路由信息，但是可以混入父组件信息。
// renderProps 形式：可以将 childen 作为渲染函数执行，可以传递路由信息，也可以传递父组件信息。
<Route path='/router/component'   component={RouteComponent}   /> { /* Route Component形式 */ }
<Route path='/router/render'  render={(props)=> <RouterRender { ...props }  /> }  {...mes}  /> { /* Render形式 */ }
<Route path='/router/children'  > { /* chilren形式 */ }
    <RouterChildren  {...mes} />
</Route>
<Route path="/router/renderProps"  >
    { (props)=> <RouterRenderProps {...props} {...mes}  /> }  {/* renderProps形式 */}
</Route>
```

2. exact

> 精确匹配，精确匹配原则，pathname 必须和 Route 的 path 完全匹配，才能展示该路由信息

```tsx
<Route path="/router/component" exact component={RouteComponent} />
//表示该路由页面只有 /router/component 这个格式才能渲染，如果 /router/component/a 那么会被判定不匹配，从而导致渲染失败
```

3. react-router-config 库中提供的 renderRoutes

```tsx
const RouteList = [
  {
    name: "首页",
    path: "/router/home",
    exact: true,
    component: Home,
  },
];
function Index() {
  return (
    <div>
      <Meuns />
      {renderRoutes(RouteList)}
    </div>
  );
}
```

### Switch

> 匹配唯一正确的路由并渲染

```tsx
<Switch>
  <Route path="/home" component={Home} />
  <Route path="/list" component={List} />
  <Route path="/my" component={My} />
</Switch>
```

### Redirect

> Redirect 可以在路由不匹配情况下跳转指定某一路由，适合路由不匹配或权限路由的情况。
> **注意:** Switch 包裹的 Redirect 要放在最下面，否则会被 Switch 优先渲染 Redirect ，导致路由页面无法展示。

## 路由使用

### 路由状态获取

1. 路由组件 props
2. withRouter 类组件
3. useHistory 和 useLocation 函数组件

### 路由带参数跳转

1. 路由跳转

> 声明式：`<NavLink to='/home' />` ，利用 `react-router-dom` 里面的 `Link` 或者 `NavLink` 。
>
> 函数式：`histor.push('/home') `。

```ts
function myNew(constructor: any, ...args: any[]) {
  // 创建一个新对象，将其原型设置为构造函数的原型
  const instance = Object.create(constructor.prototype);

  // 调用构造函数，将this绑定到新创建的对象
  const result = constructor.apply(instance, args);

  // 如果构造函数返回了一个对象，那么返回这个对象，否则返回新创建的对象
  return typeof result === "object" && result !== null ? result : instance;
}

// 使用示例
function Person(name: string, age: number) {
  this.name = name;
  this.age = age;
}

const person = myNew(Person, "John", 30);
console.log(person.name); // 输出：John
console.log(person.age); // 输出：30
```
