## Component

> Component 底层 React 的处理逻辑是，类组件执行构造函数过程中会在实例上绑定 props 和 context ，初始化置空 refs 属性，原型链上绑定 setState、forceUpdate 方法。对于 updater，React 在实例化类组件之后会单独绑定 update 对象

```ts
function Component(props, context, updater) {
  this.props = props; //绑定props
  this.context = context; //绑定context
  this.refs = emptyObject; //绑定ref
  this.updater = updater || ReactNoopUpdateQueue; //上面所属的updater 对象
}
/* 绑定setState 方法 */
Component.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};
/* 绑定forceupdate 方法 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
};
```

> 函数组件和类组件本质的区别是什么呢？
>
> 对于类组件来说，底层只需要实例化一次，实例中保存了组件的 state 等状态。对于每一次更新只需要调用 render 方法以及对应的生命周期就可以了。但是在函数组件中，每一次更新都是一次新的函数执行，一次函数组件的更新，里面的变量会重新声明。
>
> 为了能让函数组件可以保存一些状态，执行一些副作用钩子，React Hooks 应运而生，它可以帮助记录 React 中组件的状态，处理一些额外的副作用

### 组件通信方式

1. props 和 callback 方式
2. ref 方式
3. React-redux 或 React-mobx 状态管理方式
4. context 上下文方式
5. event bus 事件总线

## state

```ts
setState(obj, callback);
/**
 * 第一个参数：当 obj 为一个对象，则为即将合并的 state ；如果 obj 是一个函数，那么当前组件的 state 和 props 将作为参数，返回值用于合并新的 state。
 * 第二个参数 callback ：callback 为一个函数，函数执行上下文中可以获取当前 setState 更新后的最新 state 的值，可以作为依赖 state 变化的副作用函数，可以用来做一些基于 DOM 的操作。
 **/
```

> 假如一次事件中触发一次如上 setState ，在 React 底层主要做了那些事呢？
>
> 首先，setState 会产生当前更新的优先级（老版本用 expirationTime ，新版本用 lane ）。
>
> 接下来 React 会从 fiber Root 根部 fiber 向下调和子节点，调和阶段将对比发生更新的地方，更新对比 expirationTime ，找到发生更新的组件，合并 state，然后触发 render 函数，得到新的 UI 视图层，完成 render 阶段。
>
> 接下来到 commit 阶段，commit 阶段，替换真实 DOM ，完成此次更新流程。
>
> 此时仍然在 commit 阶段，会执行 setState 中 callback 函数,如上的()=>{ console.log(this.state.number) }，到此为止完成了一次 setState 全过程。

> 一个主要任务渲染过程
>
> render 阶段 render 函数执行 -> commit 阶段真实 DOM 替换 -> setState 回调函数执行 callback 。

![一次 setState 的流程](./src/assets/state-flow.png)

> 注意：对于类组件，如何限制 state 带来的更新作用？
>
> 1. pureComponent 可以对 state 和 props 进行浅比较，如果没有发生变化，那么组件不更新。
>
> 2. shouldComponentUpdate 生命周期可以通过判断前后 state 变化来决定组件需不需要更新，需要更新返回 true，否则返回 false。

### setState 底层原理

> 类组件初始化过程中绑定了负责更新的 **Updater** 对象，对于如果调用 setState 方法，实际上是 React 底层调用 Updater 对象上的 enqueueSetState 方法

**enqueueSetState 作用**: 创建一个 update ，然后放入当前 fiber 对象的待更新队列中，最后开启调度更新，进入上述讲到的更新流程。

```ts
// 精简版
function enqueueSetState() {
  /* 每一次调用`setState`，react 都会创建一个 update 里面保存了 */
  const update = createUpdate(expirationTime, suspenseConfig);
  /* callback 可以理解为 setState 回调函数，第二个参数 */
  callback && (update.callback = callback);
  /* enqueueUpdate 把当前的update 传入当前fiber，待更新队列中 */
  enqueueUpdate(fiber, update);
  /* 开始调度更新 */
  scheduleUpdateOnFiber(fiber, expirationTime);
}
```

### useState

```ts
[state, dispatch] = React.useState(initData);
// state，目的提供给 UI ，作为渲染视图的数据源。
// dispatch 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数。
// initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。
```

> 对于 dispatch 的参数,有两种情况：
>
> 第一种非函数情况，此时将作为新的值，赋予给 state，作为下一次渲染使用;
>
> 第二种是函数的情况，如果 dispatch 的参数为一个函数，这里可以称它为 reducer，reducer 参数，是上一次返回最新的 state，返回值作为新的 state。

> **如何监听 state 变化？**
>
> 类组件 setState 中，有第二个参数 callback 或者是生命周期 componentDidUpdate 可以检测监听到 state 改变或是组件更新。
>
> 那么在函数组件中，如何怎么监听 state 变化呢？这个时候就需要 useEffect 出场了，通常可以把 state 作为依赖项传入 useEffect 第二个参数 deps ，但是注意 useEffect 初始化会默认执行一次。

**注意**：当调用改变 state 的函数 dispatch，在本次函数执行上下文中，是获取不到最新的 state 值的。↓↓↓↓↓↓

**原因**：函数组件更新就是函数的执行，在函数一次执行过程中，函数内部所有变量重新声明，所以改变的 state ，只有在下一次函数组件执行时才会被更新。

## props

1. props 作为一个子组件渲染数据源。
2. props 作为一个通知父组件的回调函数。
3. props 作为一个单纯的组件传递。
4. props 作为渲染函数。
5. render props ， 和 4 的区别是放在了 children 属性上。
6. render component 插槽组件。

props 充当的角色：

1. React 组件层级： 一方面父组件 props 可以把数据层传递给子组件去渲染消费。另一方面子组件可以通过 props 中的 callback ，来向父组件传递信息。还有一种可以将视图容器作为 props 进行渲染。
2. React 更新机制： 作为组件是否更新的重要准则，变化即更新，于是有了 PureComponent ，memo 等性能优化方案。
3. React 插槽层面：把组件的闭合标签里的插槽，转化成 Children 属性

### 兼容 props 的变化

#### 在类组件中

> 使用 componentDidUpdate 生命周期方法来监听 props 的变化。componentDidUpdate 在组件每次更新后都会被调用，你可以在这个方法中比较新旧 props

```ts
class MyComponent extends React.Component {
  componentDidUpdate(prevProps) {
    // Compare the new props with the previous props
    if (this.props.myProp !== prevProps.myProp) {
      console.log("myProp has changed");
    }
  }

  // Rest of the component
}
```

#### 在函数组件中

> 使用 useEffect 钩子来监听 props 的变化。useEffect 接受两个参数：一个函数和一个依赖数组。当依赖数组中的任何值发生变化时，函数就会被执行。

```ts
import React, { useEffect } from "react";

function MyComponent({ myProp }) {
  useEffect(() => {
    console.log("myProp has changed");
  }, [myProp]); // myProp is a dependency

  // Rest of the component
}
```

## Context

[示例](../../../../apps/react-project/src/components/Context.jsx)
