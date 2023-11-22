import React, { useState } from "react";
import styles from "../assets/styles/index.module.css";

/* 获取随机颜色 */
function getColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgba(" + r + "," + g + "," + b + ",0.8)";
}
interface Position {
  width: number;
  height: number;
}
/* 获取随机位置 */
function getPostion(position: Position) {
  const { width, height } = position;
  return {
    left: Math.ceil(Math.random() * width) + "px",
    top: Math.ceil(Math.random() * height) + "px",
  };
}
/* 色块组件 */
function Circle({ position }: { position: Position }) {
  const style = React.useMemo(() => {
    //用useMemo缓存，计算出来的随机位置和色值。
    return {
      background: getColor(),
      ...getPostion(position),
    };
  }, []);
  return <div style={style} className={styles.circle} />;
}
class BigDataComp extends React.Component {
  state = {
    dataList: [], // 数据源列表
    renderList: [], // 渲染列表
    position: { width: 0, height: 0 }, // 位置信息
  };
  box: any = React.createRef();
  componentDidMount() {
    const { offsetHeight, offsetWidth } = this.box.current;
    const originList = new Array(20000).fill(1);
    this.setState({
      position: { height: offsetHeight ?? 0, width: offsetWidth ?? 0 },
      dataList: originList,
      renderList: originList,
    });
  }
  render() {
    const { renderList, position } = this.state;
    return (
      <div className={styles.bigData} ref={this.box}>
        {renderList.map((_, index) => (
          <Circle position={position} key={index} />
        ))}
      </div>
    );
  }
}
/* 控制展示Index */
export default () => {
  const [show, setShow] = useState(false);
  const [btnShow, setBtnShow] = useState(true);
  const handleClick = () => {
    setBtnShow(false);
    setTimeout(() => {
      setShow(true);
    }, 0);
  };
  return (
    <div>
      {btnShow ? (
        <button onClick={handleClick}>show</button>
      ) : (
        !show && <div>加载中...</div>
      )}
      {show && <BigDataComp />}
    </div>
  );
};
