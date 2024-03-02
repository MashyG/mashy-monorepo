# React Project

## JSX

> 概念：JSX 是 `JavaScript` 和 `XML（HTML）`的缩写，表示在 JS 代码中编写 HTML 模板结构，他是 React 中编写 UI 模板的方式

### 优势

1. HTML 的声明式模板写法
2. JS 的可编程能力

### JSX 的本质

JSX 并不是标准的 JS 语法，他是 JS 的语法扩展，浏览器本身不能识别，需要通过解析工具（Babel）做解析后才能在浏览器中运行

## React 基础事件绑定

语法：`on + 事件名称` = （事件处理程序），整体上遵循驼峰命名法

```jsx
function App() {
  const handleClick = (e, otherParams) => {...}
  <button onClick={(e) => handleClick(e, otherParams)}></button>
}
```

## React 获取 DOM

```jsx
const inputRef = useRef(null)

<input ref={inputRef} />

// 获取DOM对象
console.log(inputRef.current)
```

## 组件通信

### 父子组件通信 - 属性 `props`

> props 可传递任意的数据；只读对象
> 特殊的 props - children：组件的形式

```jsx
functino Son(props: any) {
  console.log(props) // {name: 'mashy', children: <span>!!!</span>, nHandleMsg= ...}
  return (
    <div onClick={() => onHandleMsg('son say...')}>
      hello，{props.name} {props.children}
    </div>
  )
}

function App() {
  const [sonSay, setSonSay] = useState('')
  const handleMsg = (msg) => {
    console.log('son2father -- ', msg)
    setSonSay(msg)
  }

  return (
    <>
      <div>son say：{sonSay}</div>
      <Son name='mashy' onHandleMsg={handleMsg}>
        <span>!!!</span>
      </Son>
    </>
  )
}
```

### 兄弟组件通信

> 借助 “状态提升” 机制，通过父组件进行兄弟组件之间的数据传递

### 跨层组件通信 - `Context`

**步骤**

1. 使用 `createContext` 方法创建一个上下文对象 ctx
2. 在顶层组件中通过 `ctx.Provider` 组件提供数据
3. 在底层组件中通过 `useContext` 钩子函数获取消费数据

## `useState`

> `useState`是一个 React hook(函数)，它允许我们向组件添加一个状态变量，从而控制影响组件的渲染结果**（数据驱动试图）**

```js
const [value, setValue] = useState("");
// 注意：状态（value）不可直接修改，需要嗲用setValue修改
```

## `useEffect`

> useEffect 是一个 React hook 函数，用于在 React 组件中创建不是由事件引起而是由渲染本身引起的操作，比如发送 API 请求，更改 DOM 等等

```js
useEffect(() => {}, []);
// 参数1：副作用函数
// 参数2：可选参数，数组（依赖项）。若为空数组，则副作用函数只会在组件渲染完毕之后执行一次
```

| 依赖项         | 副作用函数执行时机              |
| -------------- | ------------------------------- |
| 没有           | 组件初次渲染 + 组件更新时       |
| 空数组         | 只在组件初次渲染时执行一次      |
| 特定依赖项数组 | 组件初次渲染 + 特定依赖项变化时 |

### 清除副作用

> 在 `useEffect` 中编写的由渲染本身引起的对接组件外部的操作，例如定时器的清除

```jsx
useEffect(() => {
  // 实现副作用操作逻辑
  // ...

  // return 返回的函数会在组件卸载时自动执行
  return () => {
    // 清除副作用逻辑
  };
});
```

## React hook 使用规则

1.  只能在组件中或者其他自定义 hook 函数中使用；
2.  只能在组件顶层调用，不能嵌套在 if、for、其他函数中

> 自定义 `hook` 函数：
> 用于封装可复用的逻辑的函数，且返回可复用的逻辑；在哪个组件中需要则执行该 hook 函数，获取可复用的逻辑来使用

## Redux

> 集中状态管理工具，可以独立于框架运行，类似 Vuex，pinia

state：对象，存放需要管理的数据状态
action：对象，描述数据更改方式（dispatch）
reducer：函数，根据 action 的描述生成一个新的 state

> 两个插件
> `Redux Toolkit` - 官方推荐编写 Redux 逻辑的方式，是一套工具的集合：简化 store 的配置方式；内置 immer 支持可变式状态修改；内置 thunk 更好的异步创建
> `react-redux` - 用来连接 Redux 和 React 组件的中间件：Redux 从 react-redux 中获取组件状态；组件从 react-redux 中更新状态

## React-Router

### 下载

```shell
pnpm i react-router-dom
```

### 使用步骤

1. 注册路由
   ```jsx
    import { createBrowserRouter } from "react-router-dom"
    const router = createBrowserRouter([
      {
        path: '/',
        element: <App />
      }，
      {
        path: '/son',
        children: [
          {
            path: '/son/one',
            element: <div>son/one</div>
          },
          {
            path: '/son/two',
            element: <div>son/two</div>
          }
        ]
      }
    ])
   ```
2. 使用路由组件，并传入路由
   ```jsx
   import { RouterProvider } from "react-router-dom";
   <RouterProvider router={router} />;
   ```

### 路由跳转

1. 声明式

```tsx
import { Link } from "react-router-dom";

<Link to="/">首页</Link>;
```

2. 命令式

```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

<button onClick={() => navigate("/")}>返回首页</button>;
```

### 路由传参方式: `useSearchParams`, `useParams`

```tsx
// 1. useSearchParams
navigate("/params?id=mashy")

const [searchParams] = useSearchParams();
const searchParamsId = searchParams.get("id");

// 2. useParams
// 注意需要配置路由：
{
  path: "/params/:id/:name",
  element: <Params />,
}
navigate("/params/09/mashy")

const params = useParams();
const paramsId = params.id;
const paramsName = params.name;
```

### 嵌套路由

1. 使用 `children` 属性配置路由嵌套关系
2. 使用 `<Outlet />` 组件配置二级路由渲染位置

```tsx
{
  path: "/layout",
  element: <Layout />,
  children: [
    {
      path: "left",
      element: <Left />,
    },
    {
      path: "right",
      element: <Right />,
    },
  ],
}

<>
  <div>Layout Page</div>
  <Link to="/layout/left">左边</Link> | <Link to="/layout/right">右边</Link>
  {/* 配置二级路由 */}
  <Outlet />
</>
```

### 404 路由配置

```tsx
{
  path: "*",
  element: <NotFound />,
}
```

### 2 种路由模式

| 路由模式 | 创建方式            | url 表现  | 底层原理                      | 是否需要后端支持 |
| -------- | ------------------- | --------- | ----------------------------- | ---------------- |
| history  | createBrowserRouter | url/aaa   | history 对象 + pushState 事件 | 需要             |
| hash     | createHashRouter    | url/#/aaa | 监听 hasChange 事件           | 不需要           |
