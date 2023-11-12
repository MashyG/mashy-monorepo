import React, { useMemo } from "react";

/* 子组件 */
function Children(params: { number: Number }) {
  console.log("子组件渲染");
  return <div>let us learn React! {params.number.toString()} </div>;
}

interface PureChildrenProps {
  number: number;
}
/* 纯组件本身 */
class PureChildren extends React.PureComponent<PureChildrenProps> {
  state = {
    name: "mashy",
    age: 18,
    obj: {
      number: 1,
    },
  };
  changeObjNumber = () => {
    const { obj } = this.state;
    obj.number++;
    this.setState({ obj });
  };
  render() {
    console.log("PureChildren 组件渲染");
    return (
      <div>
        <div> 组件本身改变state </div>
        <button onClick={() => this.setState({ name: "mashy" })}>
          state相同情况
        </button>
        <button onClick={() => this.setState({ age: this.state.age + 1 })}>
          state不同情况
        </button>
        <button onClick={this.changeObjNumber}>state为引用数据类型时候</button>
        <div>hello, React!</div>
      </div>
    );
  }
}

/* 父组件 */
// 不推荐
// export default class Index extends React.Component {
//   state = {
//     numberA: 0,
//     numberB: 0,
//   };
//   component = null;
//   constructor(props) {
//     super(props);
//     this.state = {
//       numberA: 0,
//       numberB: 0,
//     };
//     this.component = <Children number={this.state.numberA} />;
//   }
//   controllComponentRender = () => {
//     /* 通过此函数判断 */
//     const { props } = this.component;
//     if (props.number !== this.state.numberA) {
//       /* 只有 numberA 变化的时候，重新创建 element 对象  */
//       return (this.component = React.cloneElement(this.component, {
//         number: this.state.numberA,
//       }));
//     }
//     return this.component;
//   };

//   render() {
//     return (
//       <div>
//         {this.controllComponentRender()}
//         <button
//           onClick={() => this.setState({ numberA: this.state.numberA + 1 })}
//         >
//           改变numberA - {this.state.numberA}
//         </button>
//         <button
//           onClick={() => this.setState({ numberB: this.state.numberB + 1 })}
//         >
//           改变numberB - {this.state.numberB}
//         </button>
//       </div>
//     );
//   }
// }

// 推荐使用 useMemo
export default function Index() {
  const [numberA, setNumberA] = React.useState(0);
  const [numberB, setNumberB] = React.useState(0);
  return (
    <div>
      {useMemo(
        () => (
          <Children number={numberA} />
        ),
        [numberA]
      )}
      <PureChildren number={numberA} />
      <button onClick={() => setNumberA(numberA + 1)}>改变numberA</button>
      <button onClick={() => setNumberB(numberB + 1)}>改变numberB</button>
    </div>
  );
}
