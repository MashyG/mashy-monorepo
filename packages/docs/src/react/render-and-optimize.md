# React 的渲染以及优化

> React 渲染
>
> 对于 React 渲染，你不要仅仅理解成类组件触发 render 函数，函数组件本身执行，事实上，从调度更新任务到调和 fiber，再到浏览器渲染真实 DOM，每一个环节都是渲染的一部分，至于对于每个环节的性能优化，React 在底层已经处理了大部分优化细节，包括设立任务优先级、异步调度、diff 算法、时间分片都是 React 为了提高性能，提升用户体验采取的手段。

> React 提供了 PureComponent，shouldComponentUpdated，memo 等优化手段

> render 阶段作用是什么？
>
> render 的作用是根据一次更新中产生的新状态值，通过 React.createElement，替换成新的状态，得到新的 React element 对象，新的 element 对象上，保存了最新状态值。 createElement 会产生一个全新的 props。到此 render 函数使命完成了。
>
> 接下来，React 会调和由 render 函数产生 chidlren，将子代 element 变成 fiber（这个过程如果存在 alternate，会复用 alternate 进行克隆，如果没有 alternate ，那么将创建一个），将 props 变成 pendingProps ，至此当前组件更新完毕。然后如果 children 是组件，会继续重复上一步，直到全部 fiber 调和完毕。完成 render 阶段。

## React 控制 render 的方法

> 对 render 控制的**本质**
>
> 1. 从父组件直接隔断子组件的渲染，经典的就是 memo，缓存 element 对象
> 2. 组件从自身来控制是否 render ，比如：PureComponent ，shouldComponentUpdate

### 缓存 React.element 对象

1. 可以通过一个函数**缓存**部分不要更新的组件[**controllComponentRender**](../../../../apps/react-project/src/components/Render.jsx) ==> **不推荐该方法 -> 而是使用 useMemo 方法**

```ts
/**
 * create：第一个参数为一个函数，函数的返回值作为缓存值，如上 demo 中把 Children 对应的 element 对象，缓存起来。
 * deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。
 * cacheSomething：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。
 **/
const cacheSomething = useMemo(create, deps);
// useMemo原理：
// useMemo 会记录上一次执行 create 的返回值，并把它绑定在函数组件对应的 fiber 对象上，只要组件不销毁，缓存值就一直存在，但是 deps 中如果有一项改变，就会重新执行 create ，返回值作为新的值记录到 fiber 对象上。
```

> 原理
>
> 每次执行 render 本质上 createElement 会产生一个新的 props，这个 props 将作为对应 fiber 的 pendingProps ，在此 fiber 更新调和阶段，React 会对比 fiber 上老 oldProps 和新的 newProp （ pendingProps ）是否相等，如果相等函数组件就会放弃子组件的调和更新，从而子组件不会重新渲染；如果上述把 element 对象缓存起来，上面 props 也就和 fiber 上 oldProps 指向相同的内存空间，也就是相等，从而跳过了本次更新。

2. **纯组件 PureComponent**

> 规则是浅比较 state 和 props 是否相等
>
> 原型链上会有 isPureReactComponent 属性，在更新组件 updateClassInstance 方法中使用的；
>
> isPureReactComponent 就是判断当前组件是不是纯组件的，如果是 PureComponent 会浅比较 props 和 state 是否相等。

**注意事项**

a. **避免使用箭头函数**。不要给是 PureComponent 子组件绑定箭头函数，因为父组件每一次 render ，如果是箭头函数绑定的话，都会重新生成一个新的箭头函数， PureComponent 对比新老 props 时候，因为是新的函数，所以会判断不想等，而让组件直接渲染，PureComponent 作用终会失效

```jsx
class Index extends React.PureComponent {}
export default class Father extends React.Component {
  render = () => <Index callback={() => {}} />;
}
```

b. **PureComponent 的父组件是函数组件的情况，绑定函数要用 useCallback 或者 useMemo 处理**。这种情况还是很容易发生的，就是在用 class + function 组件开发项目的时候，如果父组件是函数，子组件是 PureComponent ，那么绑定函数要小心，因为函数组件每一次执行，如果不处理，还会声明一个新的函数，所以 PureComponent 对比同样会失效

```jsx
class Index extends React.PureComponent {}
export default function () {
  const callback =
    function handerCallback() {}; /* 每一次函数组件执行重新声明一个新的callback，PureComponent浅比较会认为不想等，促使组件更新  */
  return <Index callback={callback} />;
}
```

3. **shouldComponentUpdate**

> 利用 React 提供的生命周期控制当前组件是否需要更新

```jsx
shouldComponentUpdate(newProp,newState,newContext){
  return true // 根据传入的新的 props 和 state ，或者 newContext 来确定是否更新组件
 }
```

4. **React.memo**

```ts
React.memo(Component, compare);
// Component 原始组件本身
// compare 是一个函数，返回 true 组件不渲染，返回 false 组件重新渲染。和 shouldComponentUpdate 相反
```

> memo 当二个参数 compare 不存在时，会用浅比较原则处理 props ，相当于仅比较 props 版本的 pureComponent 。
>
> memo 同样适合类组件和函数组件。

`REACT_MEMO_TYPE 类型` => fiber 被标记为 MemoComponent 组件
React 对 MemoComponent 类型的 fiber 有单独的更新处理逻辑 updateMemoComponent

```ts
function updateMemoComponent() {
  if (updateExpirationTime < renderExpirationTime) {
    let compare = Component.compare;
    compare = compare !== null ? compare : shallowEqual; //如果 memo 有第二个参数，则用二个参数判定，没有则浅比较props是否相等。
    if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderExpirationTime
      ); //已经完成工作停止向下调和节点。
    }
  }
  // 返回将要更新组件,memo包装的组件对应的fiber，继续向下调和更新。
}
```

[React 渲染过程](../../assets/render-controller.png)
