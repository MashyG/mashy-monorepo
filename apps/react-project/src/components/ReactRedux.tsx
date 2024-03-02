import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";

// 组件通信
function ComponentA({ toCompB, compBsay }: any) {
  /* 组件A */
  const [CompAsay, setCompAsay] = useState("");
  return (
    <div className="box">
      <p>我是组件A</p>
      <div> B组件对我说：{compBsay} </div>
      我对B组件说：
      <input
        placeholder="CompAsay"
        onChange={(e) => setCompAsay(e.target.value)}
      />
      <button onClick={() => toCompB(CompAsay)}>确定</button>
    </div>
  );
}
/* 映射state中CompBsay  */
const CompAMapStateToProps = (state: any) => ({
  compBsay: state.info.compBsay,
});
/* 映射toCompB方法到props中 */
const CompAmapDispatchToProps = (dispatch: any) => ({
  toCompB: (mes: any) => dispatch({ type: "SET", payload: { compAsay: mes } }),
});
/* connect包装组件A */
export const CompA = connect(
  CompAMapStateToProps,
  CompAmapDispatchToProps
)(ComponentA);

class ComponentB extends React.Component<any> {
  /* B组件 */
  state = { compBsay: "" };
  handleToA = () => {
    this.props.dispatch({
      type: "SET",
      payload: { compBsay: this.state.compBsay },
    });
  };
  render() {
    return (
      <div className="box">
        <p>我是组件B</p>
        <div> A组件对我说：{this.props.compAsay} </div>
        我对A组件说：
        <input
          placeholder="CompBsay"
          onChange={(e) => this.setState({ compBsay: e.target.value })}
        />
        <button onClick={this.handleToA}>确定</button>
      </div>
    );
  }
}
/* 映射state中 CompAsay  */
const CompBMapStateToProps = (state: any) => ({
  compAsay: state.info.compAsay,
});
export const CompB = connect(CompBMapStateToProps)(ComponentB);

// ===============================================================

// 状态共享
export function ShowInfo(props: any) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "ADD" });
    dispatch({
      type: "SET",
      payload: { name: "mashy", mes: "let us learn React-Redux!" },
    });
  }, []);
  const { info, number } = props;

  return (
    <div>
      <p>
        {info.name ? `hello, my name is ${info.name}` : "what is your name"} ,
        {info.mes ? info.mes : " what do you say? "}{" "}
      </p>
      <span
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => dispatch({ type: "ADD" })}
      >
        👍 {number}
      </span>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  number: state.number,
  info: state.info,
});

export const ShowInfoComp = connect(mapStateToProps)(ShowInfo);
