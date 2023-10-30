# JSX

## 初始 JSX

### jsx 转换规则

| jsx 元素类型     | react.createElement                               | 转换后 type 属性           |
| ---------------- | ------------------------------------------------- | -------------------------- |
| element 元素类型 | react element 类型                                | 标签字符串，例如 div       |
| fragment 类型    | react element 类型                                | symbol react.fragment 类型 |
| 文本类型         | 直接字符串                                        | 无                         |
| 数组类型         | 返回数组结构，里面元素被 react.createElement 转换 | 无                         |
| 组件类型         | react element 类型                                | 组件类或者组件函数本身     |
| 三元运算         | / 表达式 先执行三元运算，然后按照上述规则处理     | 看三元运算返回结果         |
| 函数执行         | 先执行函数，然后按照上述规则处理                  | 看函数执行返回结果         |

### fiber 对象

> React 底层调和处理后, React element 对象的每一个子节点都会形成一个与之对应的 **fiber** 对象，然后通过 **sibling、return、child** 将每一个 fiber 对象联系起来

不同种类的 fiber Tag

```ts
// React 针对不同 React element 对象会产生不同 tag (种类) 的fiber 对象。首先，来看一下 tag 与 element 的对应关系：
export const FunctionComponent = 0; // 函数组件
export const ClassComponent = 1; // 类组件
export const IndeterminateComponent = 2; // 初始化的时候不知道是函数组件还是类组件
export const HostRoot = 3; // Root Fiber 可以理解为根元素 ， 通过reactDom.render()产生的根元素
export const HostPortal = 4; // 对应  ReactDOM.createPortal 产生的 Portal
export const HostComponent = 5; // dom 元素 比如 <div>
export const HostText = 6; // 文本节点
export const Fragment = 7; // 对应 <React.Fragment>
export const Mode = 8; // 对应 <React.StrictMode>
export const ContextConsumer = 9; // 对应 <Context.Consumer>
export const ContextProvider = 10; // 对应 <Context.Provider>
export const ForwardRef = 11; // 对应 React.ForwardRef
export const Profiler = 12; // 对应 <Profiler/ >
export const SuspenseComponent = 13; // 对应 <Suspense>
export const MemoComponent = 14; // 对应 React.memo 返回的组件
```

> **fiber 对应关系**
>
> child： 一个由父级 fiber 指向子级 fiber 的指针。
>
> return：一个子级 fiber 指向父级 fiber 的指针。
>
> sibling: 一个 fiber 指向下一个兄弟 fiber 的指针。
>
> **温馨提示：**
>
> 对于上述在 jsx 中写的 map 数组结构的子节点，外层会被加上 fragment ；
>
> map 返回数组结构，作为 fragment 的子节点。

### React 方法

1. React.createElement(type, [props], [...children])
2. React.Children.toArray 可以扁平化、规范化 React.element 的 children 组成的数组
3. React.Children.forEach 去遍历子节点
4. React.isValidElement 这个方法可以用来检测是否为 React element 元素，接收一个参数——待验证对象，如果是返回 true，否则返回 false
5. cloneElement 以 element 元素为样板克隆并返回新的 React element 元素。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。

> React.createElement 和 React.cloneElement 到底有什么区别呢？
>
> 一个是用来创建 element 。另一个是用来修改 element，并返回一个新的 React.element 对象。

### Babel 解析 JSX 流程

JSX 语法实现来源于这两个 babel 插件：

1. @babel/plugin-syntax-jsx ： 使用这个插件，能够让 Babel 有效的解析 JSX 语法。
2. @babel/plugin-transform-react-jsx ：这个插件内部调用了 @babel/plugin-syntax-jsx，可以把 React JSX 转化成 JS 能够识别的 createElement 格式。plugin-syntax-jsx 已经向文件中提前注入了 \_jsxRuntime api
