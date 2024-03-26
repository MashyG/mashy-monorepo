# 元素和组件的区别是什么？

## 元素

### 定义

React 元素是轻量级的、不可变的、纯粹的 JS 对象，**描述了你想要在屏幕上看到的 DOM 节点或其他组件的具体形态**。React 元素并不直接代表 DOM 节点，而是 React 用来描述用户界面（UI）的抽象描述。

### 创建

React 元素是通过 JSX 创建的，比如`<div />，<MyButton />，<MyImage />`或者通过`React.createElement()`创建的。

### 特征：

- **不可变**：React 元素是不可变对象，一旦被创建，你就无法更改它的子元素或者属性。
- **纯粹对象**：不包含任何内部状态或方法，只包含描述 UI 所需的信息，如标签名，属性，子元素等。
- **虚拟表示**：React 使用这些元素创建虚拟 DOM 树，在通过 diff 算法计算出最小变更集，并将变更反映到实际 DOM 中。

## 组件

### 定义

组件是 React 应用的基本构建块，他们是封装了 UI 部分逻辑的独立、可复用的功能块。
组件可以是函数（函数组件）或类（组件），负责接手输入的（props）并返回一个 React 元素（或一组元素）。

### 分类

- **函数组件**：接受 props 作为参数，返回一个 React 元素，不包含内部状态和生命周期方法，适用于纯展示型组件。

```jsx
function MyComponent(props) {
  return <div>{props.message}</div>;
}
```

- **类组件**：继承自 React.Component 类，可以包含 props、state 以及各种生命周期方法，适用于有内部状态管理和生命周期控制的复杂组件。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: "Hello" };
  }

  render() {
    return <div>{this.state.message}</div>;
  }
}
```

### 特征

- **可复用性**：组件可以被多次使用并在不同上下文中渲染。
- **状态持有者**：类组件可以拥有内部状态（state），状态变化可以触发组件重新渲染。
- **生命周期方法**：组件具有多个生命周期方法，如 componentDidMount、componentDidUpdate 和 componentWillUnmount 等，用于执行特定时刻的任务，如获取数据、清理资源等。

# Refs 的使用和 forwardRef 的源码解读

> React 提供了 Refs，帮助我们访问 DOM 节点或在 render 方法中创建的 React 元素

## 三种 Ref 的使用方式

### String refs

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    setTimeout(() => {
      // 2. 通过 this.refs.xxx 获取 DOM 节点
      this.refs.textInput.value = "new value";
    }, 2000);
  }
  render() {
    // 1. ref 直接传入一个字符串
    return (
      <div>
        <input ref="textInput" value="value" />
      </div>
    );
  }
}

root.render(<App />);
```

### 回调 Refs

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    setTimeout(() => {
      // 2. 通过实例属性获取 DOM 节点
      this.textInput.value = "new value";
    }, 2000);
  }
  render() {
    // 1. ref 传入一个回调函数
    // 该函数中接受 React 组件实例或 DOM 元素作为参数
    // 我们通常会将其存储到具体的实例属性（this.textInput）
    return (
      <div>
        <input
          ref={(element) => {
            this.textInput = element;
          }}
          value="value"
        />
      </div>
    );
  }
}

root.render(<App />);
```

### createRef (√.√)

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    // 1. 使用 createRef 创建 Refs
    // 并将 Refs 分配给实例属性 textInputRef，以便在整个组件中引用
    this.textInputRef = React.createRef();
  }
  componentDidMount() {
    setTimeout(() => {
      //  3. 通过 Refs 的 current 属性进行引用
      this.textInputRef.current.value = "new value";
    }, 2000);
  }
  render() {
    // 2. 通过 ref 属性附加到 React 元素
    return (
      <div>
        <input ref={this.textInputRef} value="value" />
      </div>
    );
  }
}
```

## 转发 refs

> 开发一个组件，这个组件需要对组件使用者提供一个 ref 属性，用于让组件使用者获取具体的 DOM 元素，我们就需要进行 Refs 转发，这对于 class 组件并不是一个问题，举个示例代码：

```jsx
class Child extends React.Component {
  render() {
    const { inputRef, ...rest } = this.props;
    // 3. 这里将 props 中的 inputRef 赋给 DOM 元素的 ref
    return <input ref={inputRef} {...rest} placeholder="value" />;
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    // 1. 创建 refs
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    setTimeout(() => {
      // 4. 使用 this.inputRef.current 获取子组件中渲染的 DOM 节点
      this.inputRef.current.value = "new value";
    }, 2000);
  }
  render() {
    // 2. 因为 ref 属性不能通过 this.props 获取，所以这里换了一个属性名
    return <Child inputRef={this.inputRef} />;
  }
}
```

> **我们是不能在函数组件上使用 ref 属性的，因为函数组件没有实例。**

```jsx
// 3. 子组件通过 forwardRef 获取 ref，并通过 ref 属性绑定 React 元素
const Child = forwardRef((props, ref) => (
  <input ref={ref} placeholder="value" />
));

class Parent extends React.Component {
  constructor(props) {
    super(props);
    // 1. 创建 refs
    this.inputRef = React.createRef();
  }
  componentDidMount() {
    setTimeout(() => {
      // 4. 使用 this.inputRef.current 获取子组件中渲染的 DOM 节点
      this.inputRef.current.value = "new value";
    }, 2000);
  }
  render() {
    // 2. 传给子组件的 ref 属性
    return <Child ref={this.inputRef} />;
  }
}
```
