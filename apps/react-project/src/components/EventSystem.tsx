import { useEffect, useRef } from "react";

export default function EventSystemIndex() {
  const refObj: any = useRef(null);
  useEffect(() => {
    const handler = () => {
      console.log("事件监听");
    };
    refObj.current.addEventListener("click", handler);
    return () => {
      refObj.current.removeEventListener("click", handler);
    };
  }, []);
  const handleClick = () => {
    // console.log("handleClick", e);
    // e.stopPropagation(); /* 阻止事件冒泡，handleFatherClick 事件讲不在触发 */
    console.log("冒泡阶段执行");
  };
  const handleClickCapture = () => {
    console.log("捕获阶段执行");
  };
  const handleFatherClick = () => {
    console.log("父组件冒泡阶段执行");
  };
  const handleFatherClickCapture = () => {
    console.log("父组件捕获阶段执行");
  };
  const styles = {
    padding: "6px",
    backgroundColor: "red",
  };
  return (
    <div
      onClick={handleFatherClick}
      onClickCapture={handleFatherClickCapture}
      style={{ ...styles }}
    >
      <button
        ref={refObj}
        onClick={handleClick}
        onClickCapture={handleClickCapture}
      >
        点击
      </button>
    </div>
  );
}
