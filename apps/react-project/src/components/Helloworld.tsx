import React from "react";
import { flushSync } from "react-dom";

const HelloWorld = () => {
  const status = false; /* 状态 */
  const toLearn = ["react", "vue", "webpack", "nodejs"];

  const renderFoot = () => <div> i am foot</div>;
  const TextComponent = () => <div> hello , i am function component </div>;

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        {/* element 元素类型 */}
        <div>hello,world</div>
        {/* fragment 类型 */}
        <React.Fragment>
          <div> 👽👽 </div>
        </React.Fragment>
        {/* text 文本类型 */}
        my name is mashy
        {/* 数组节点类型 */}
        {toLearn.map((item) => (
          <div key={item}>let us learn {item} </div>
        ))}
        {/* 组件类型 */}
        <TextComponent />
        {/* 三元运算 */}
        {status ? <TextComponent /> : <div>三元运算</div>}
        {/* 函数执行 */}
        {renderFoot()}
        {/* <button onClick={ ()=> console.log( this.render() ) } >打印render后的内容</button> */}
      </div>
      <div>==========================</div>
      <div>
        <HelloByClassComp />
      </div>
    </>
  );
};

// 类组件
class HelloByClassComp extends React.Component {
  state = { message: `click me`, number: 0 };
  handerClick = () => {
    setTimeout(() => {
      this.setState({ number: 1 });
    });
    this.setState({ number: 2 });
    // flushSync 在同步条件下，会合并之前的 setState | useState，可以理解成，如果发现了 flushSync ，就会先执行更新，如果之前有未更新的 setState ｜ useState ，就会一起合并了
    flushSync(() => {
      this.setState({ number: 3 });
    });
    this.setState({ number: 4 });
  };
  sayHello = () => {
    // this.setState({ message: "This is class component~" });
    this.handerClick();
  };
  // componentDidMount() { // s生命周期：组件挂载完成后执行
  //   console.log("componentDidMount === ", HelloByClassComp);
  // }
  render() {
    console.log("this.state.number ===>>> ", this.state.number);
    return (
      <>
        <h2>class component 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h2>
        <div
          style={{ cursor: "pointer", color: "blue" }}
          onClick={this.sayHello}
        >
          {this.state.message}
        </div>
      </>
    );
  }
}

export default HelloWorld;
