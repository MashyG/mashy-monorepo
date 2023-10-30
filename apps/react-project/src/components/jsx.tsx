import React from "react";

const HelloWorld = () => {
  const status = false; /* 状态 */
  const toLearn = ["react", "vue", "webpack", "nodejs"];

  const renderFoot = () => <div> i am foot</div>;
  const TextComponent = () => <div> hello , i am function component </div>;

  return (
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
  );
};

export default HelloWorld;
