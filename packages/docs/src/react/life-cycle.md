## 生命周期 lifeCycle

![生命周期](./src/assets/lifeCycle.png)

## 在类组件中

### 初始化阶段

执行顺序：constructor -> getDerivedStateFromProps / componentWillMount -> render -> componentDidMount

![初始化阶段](./src/assets/class-comp-init.png)

### 更新阶段

执行顺序：componentWillReceiveProps( props 改变) / getDerivedStateFromProp -> shouldComponentUpdate -> componentWillUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate

![更新阶段](./src/assets/class-comp-update.png)

### 销毁阶段

在一次调和更新中，如果发现元素被移除，就会打对应的 Deletion 标签 ，然后在 commit 阶段就会调用 componentWillUnmount 生命周期，接下来统一卸载组件以及 DOM 元素。

![销毁阶段](./src/assets/class-comp-unmount.png)

### 各个生命周期阶段

**constructor** 的作用：

1. 初始化 state ，比如可以用来截取路由中的参数，赋值给 state 。
2. 对类组件的事件做一些处理，比如绑定 this ， 节流，防抖等。
3. 对类组件进行一些必要生命周期的劫持，渲染劫持，这个功能更适合反向继承的 HOC

**getDerivedStateFromProps**

```ts
getDerivedStateFromProps(nextProps, prevState);
// nextProps 父组件新传递的 props
// prevState 组件在此次渲染前待更新的 state
```

> 这个生命周期用于，在初始化和更新阶段，接受父组件的 props 数据， 可以对 props 进行格式化，过滤等操作，返回值将作为新的 state 合并到 state 中，供给视图渲染层消费。

getDerivedStateFromProps 作用：

1. 代替 componentWillMount 和 componentWillReceiveProps
2. 组件初始化或者更新时，将 props 映射到 state。
3. 返回值与 state 合并完，可以作为 shouldComponentUpdate 第二个参数 newState ，可以判断是否渲染组件。

**render**

> jsx 的各个元素被 React.createElement 创建成 React element 对象的形式。一次 render 的过程，就是创建 React.element 元素的过程。
>
> 操作：createElement 创建元素 , cloneElement 克隆元素 ，React.children 遍历 children

**getSnapshotBeforeUpdate**

```ts
getSnapshotBeforeUpdate(prevProps, preState);
// prevProps更新前的props
// preState更新前的state
```

> 意思： 获取更新前的快照，相当于获取更新前 DOM 的状态

作用：

getSnapshotBeforeUpdate 这个生命周期意义就是配合 componentDidUpdate 一起使用，计算形成一个 snapShot 传递给 componentDidUpdate 。保存一次更新前的信息。

**componentDidUpdate**

> 组件更新

```ts
componentDidUpdate(prevProps, prevState, snapshot);
// prevProps 更新之前的 props
// prevState 更新之前的 state
// snapshot 为 getSnapshotBeforeUpdate 返回的快照，可以是更新前的 DOM 信息
```

作用：

1. componentDidUpdate 生命周期执行，此时 DOM 已经更新，可以直接获取 DOM 最新状态。这个函数里面如果想要使用 setState ，一定要加以限制，否则会引起无限循环。
2. 接受 getSnapshotBeforeUpdate 保存的快照信息。

**componentDidMount**

> 组件初始化

```ts
componentDidMount();
```

作用：

1. 可以做一些关于 DOM 操作，比如基于 DOM 的事件监听器。
2. 对于初始化向服务器请求数据，渲染视图，这个生命周期也是蛮合适的。

**shouldComponentUpdate**

```ts
shouldComponentUpdate(newProps, newState, nextContext);
// 第一个参数新的 props ，第二个参数新的 state ，第三个参数新的 context 。
```

> 这个生命周期，一般用于性能优化，shouldComponentUpdate 返回值决定是否重新渲染的类组件。需要重点关注的是第二个参数 newState ，如果有 getDerivedStateFromProps 生命周期 ，它的返回值将合并到 newState ，供 shouldComponentUpdate 使用。

**componentWillUnmount**

> componentWillUnmount 是组件销毁阶段唯一执行的生命周期，主要做一些收尾工作，比如清除一些可能造成内存泄漏的定时器，延时器，或者是一些事件监听器。

作用

1. 清除延时器，定时器。
2. 一些基于 DOM 的操作，比如事件监听器。

## 在函数组件中

> React hooks 也提供了 api ，用于弥补函数组件没有生命周期的缺陷。其原理主要是运用了 hooks 里面的 useEffect 和 useLayoutEffect。

### useEffect

```ts
useEffect(() => {
  return destory;
}, dep);
// 第一个参数 callback, 返回的 destory ， destory 作为下一次callback执行之前调用，用于清除上一次 callback 产生的副作用。
// 第二个参数作为依赖项，是一个数组，可以有多个依赖项，依赖项改变，执行上一次callback 返回的 destory ，和执行新的 effect 第一个参数 callback 。
```

> 对于 useEffect 执行， React 处理逻辑是采用异步调用 ，对于每一个 effect 的 callback， React 会向 setTimeout 回调函数一样，放入任务队列，等到主线程任务完成，DOM 更新，js 执行完成，视图绘制完毕，才执行。所以 effect 回调函数不会阻塞浏览器绘制视图。

### useLayoutEffect

> useLayoutEffect 和 useEffect 不同的地方是采用了同步执行
>
> 首先 useLayoutEffect 是在 DOM 更新之后，浏览器绘制之前，这样可以方便修改 DOM，获取 DOM 信息，这样浏览器只会绘制一次，如果修改 DOM 布局放在 useEffect ，那 useEffect 执行是在浏览器绘制视图之后，接下来又改 DOM ，就可能会导致浏览器再次回流和重绘。而且由于两次绘制，视图上可能会造成闪现突兀的效果。
>
> useLayoutEffect callback 中代码执行会阻塞浏览器绘制。

**注意**：修改 DOM ，改变布局就用 useLayoutEffect ，其他情况就用 useEffect 。

### useInsertionEffect

> React v18 新添加的 hooks ； useInsertionEffect 的执行的时候，DOM 还没有更新。
> 本质上 useInsertionEffect 主要是解决 CSS-in-JS 在渲染中注入样式的性能问题
