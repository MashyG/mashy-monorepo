import style from "../assets/styles/index.module.css";
import styled from "styled-components";

const baseStyles = {
  fontSize: "16px",
};
const styles = {
  backgroundColor: "blue",
  padding: "10px",
  borderRadius: "5px",
  color: "white",
};

const Button = styled.button`
  background: blue;
  color: #fff;
  border: none;
  border-radius: 18px;
`;

const NewButton = styled(Button)`
  background: red;
`;

export default function CssModule() {
  return (
    <>
      <div className={style.baseText}>模块化 css</div>
      <div style={{ ...baseStyles, ...styles }}>CSS IN JS</div>
      <Button>蓝色背景的按钮（通过 styled-components实现）</Button>
      <NewButton>继承上一个的按钮，但背景是红色</NewButton>
    </>
  );
}
