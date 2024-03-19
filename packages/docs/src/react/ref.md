# Ref

```ts
// 标准 ref 对象
{
    current:null , // current指向ref对象获取到的实际内容，可以是dom元素，组件实例，或者其他。
}
```

## 创建 Ref

1. 类组件 React.createRef
2. 函数组件 React.useRef

## 类组件获取 Ref 的方式

1. Ref 属性是一个字符串。用一个字符串 ref 标记一个 DOM 元素，一个类组件(函数组件没有实例，不能被 Ref 标记)。React 在底层逻辑，会判断类型，如果是 DOM 元素，会把真实 DOM 绑定在组件 this.refs (组件实例下的 refs )属性上，如果是类组件，会把子组件的实例绑定在 this.refs 上。
2. Ref 属性是一个函数。当用一个函数来标记 Ref 的时候，将作为 callback 形式，等到真实 DOM 创建阶段，执行 callback ，获取的 DOM 元素或组件实例，将以回调函数第一个参数形式传入
3. Ref 属性是一个 ref 对象。createRef 和 useRef

## 通过 forwardRef 跨层级获取 ref

> forwardRef 的初衷就是解决 ref 不能跨层级捕获和传递的问题。 forwardRef 接受了父级元素标记的 ref 信息，并把它转发下去，使得子组件可以通过 props 来接受到上一层级或者是更上层级的 ref

```ts
// 孙组件
function Son(props) {
  const { grandRef } = props;
  return (
    <div>
      <div> i am mashy </div>
      <span ref={grandRef}>这个是想要获取元素</span>
    </div>
  );
}
// 父组件
class Father extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Son grandRef={this.props.grandRef} />
      </div>
    );
  }
}
const NewFather = React.forwardRef((props, ref) => (
  <Father grandRef={ref} {...props} />
));
// 爷组件
class GrandFather extends React.Component {
  constructor(props) {
    super(props);
  }
  node = null;
  componentDidMount() {
    console.log(this.node); // span #text 这个是想要获取元素
  }
  render() {
    return (
      <div>
        <NewFather ref={(node) => (this.node = node)} />
      </div>
    );
  }
}
```

## ref 实现组件通信

1. 类组件 ref： 通过 useRef 创建 ref 对象，并通过该对象调用子组件的 current 中暴露出来的方法

2. 函数组件 forwardRef + useImperativeHandle -> [CommunicateByRef](../../../../apps/react-project/src/components/CommunicateByRef.tsx)
   > useImperativeHandle 接受三个参数：
   >
   > 第一个参数 ref : 接受 forWardRef 传递过来的 ref 。
   > 第二个参数 createHandle ：处理函数，返回值作为暴露给父组件的 ref 对象。
   > 第三个参数 deps :依赖项 deps，依赖项更改形成新的 ref 对象。
