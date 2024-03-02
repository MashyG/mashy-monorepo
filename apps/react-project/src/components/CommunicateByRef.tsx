import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// 子组件
const Son = (_: any, ref: any) => {
  const inputRef: any = useRef(null);
  const [inputValue, setInputValue] = useState("");
  useImperativeHandle(
    ref,
    () => {
      const handleRefs = {
        onFocus() {
          /* 声明方法用于聚焦input框 */
          inputRef?.current?.focus();
        },
        onChangeValue(value: any) {
          /* 声明方法用于改变input的值 */
          setInputValue(value);
        },
      };
      return handleRefs;
    },
    []
  );
  return (
    <div>
      <input
        placeholder="请输入内容"
        ref={inputRef}
        value={inputValue}
        onChange={(val) => setInputValue(val.target.value)}
      />
    </div>
  );
};

const ForwardSon = forwardRef(Son);
// 父组件
export default class Father extends React.Component {
  cur: any = null;
  handerClick() {
    const { onFocus, onChangeValue } = this.cur;
    onFocus(); // 让子组件的输入框获取焦点
    onChangeValue("我是父组件传递来的值！！！！"); // 让子组件input
  }
  render() {
    return (
      <div>
        子组件：
        <ForwardSon ref={(cur) => (this.cur = cur)} />
        <div>------------------</div>
        父组件：
        <button onClick={this.handerClick.bind(this)}>操控子组件</button>
        <div>------------------</div>
        <BtnShowRef />
      </div>
    );
  }
}

class BtnShowRef extends React.Component {
  state = { num: 0 };
  node = null;
  // getDom方法在每次渲染时都是同一个函数实例，所以ref回调函数只会在组件挂载和卸载时被调用，不会因为状态更新而被调用。
  getDom = (node: any) => {
    this.node = node;
    console.log("此时的参数是什么：", this.node);
  };
  render() {
    return (
      <div>
        <div ref={this.getDom}>ref元素节点</div>
        {/*  下面的 ref 回调函数在每次渲染时都会创建一个新的函数实例，
              这会导致ref回调函数在每次渲染时都被调用两次：
              一次是用null作为参数（commitDetachRef），
              一次是用DOM元素作为参数。(commitAttachRef) 
          */}
        {/* <div
          ref={(node) => {
            this.node = node;
            console.log("此时的参数是什么：", this.node);
          }}
        >
          ref元素节点
        </div> */}
        <div> this.state.num ==》{this.state.num}</div>
        <button onClick={() => this.setState({ num: this.state.num + 1 })}>
          点击
        </button>
      </div>
    );
  }
}
