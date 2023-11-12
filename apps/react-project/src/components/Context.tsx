import React from "react";

const ThemeContext = React.createContext(null);
const ThemeProvider = ThemeContext.Provider; //提供者
export default function ProviderDemo() {
  const [contextValue, setContextValue] = React.useState({
    color: "white",
    background: "gray",
  });
  console.log("父组件更新了！！！！", contextValue);
  return (
    <div>
      <ThemeProvider value={contextValue}>
        <SonForClass />
        <SonForFunc />
        <SonForSubscriber />
        <SonForMemo />
      </ThemeProvider>
      <button
        onClick={() => setContextValue({ color: "#fff", background: "blue" })}
      >
        切换主题
      </button>
    </div>
  );
}

// 类组件 - contextType 方式
class ConsumerDemoForClass extends React.Component {
  render() {
    console.log("consumer ===> 类组件", this.context);
    const { color, background } = this.context;
    return <div style={{ color, background }}>消费者 - 类组件</div>;
  }
}
ConsumerDemoForClass.contextType = ThemeContext;
const SonForClass = React.memo(() => <ConsumerDemoForClass />);

// 函数组件 - useContext 方式
function ConsumerDemoForFunc() {
  const contextValue = React.useContext(ThemeContext); /*  */
  console.log("consumer ===> 函数组件", contextValue);
  const { color, background } = contextValue;
  return (
    <>
      <div style={{ color, background }}>消费者 - 函数组件</div>
    </>
  );
}
const SonForFunc = () => <ConsumerDemoForFunc />;

// 订阅者之 Consumer 方式
const ThemeConsumer = ThemeContext.Consumer; // 订阅消费者

function ConsumerDemoForSubscriber(props) {
  console.log("consumer ===> 订阅者", props);
  const { color, background } = props;
  return <div style={{ color, background }}>消费者 - 订阅者</div>;
}
const SonForSubscriber = () => (
  <>
    <p>context 变成了 props</p>
    <ThemeConsumer>
      {/* 将 context 内容转化成 props  */}
      {(contextValue) => <ConsumerDemoForSubscriber {...contextValue} />}
    </ThemeConsumer>
    <OtherComp />
  </>
);

const OtherComp = () => {
  console.log("OtherComp!!!!!");
  return <>OtherComp</>;
};

// 动态context
const SonForMemo = React.memo(() => (
  <>
    <p>此处OtherComp不会调用render，因为用了React.memo</p>
    <ConsumerDemoForFunc />
    <OtherComp />
  </>
));
