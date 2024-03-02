// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { sayHello } from "@mashy-monorepo/shared";

import "@mashy-monorepo/web-component";

import HelloworldComp from "../components/Helloworld";
import Communication from "../components/Communication";
import CommunicateByRef from "../components/CommunicateByRef";
import CssModule from "../components/CSSModule";
import ContextComp from "../components/Context";
import RenderComp from "../components/Render";
import RenderMoreData from "../components/RenderMoreData";
import EventSystem from "../components/EventSystem";

import Store from "../store";
import { CompA, CompB, ShowInfoComp } from "../components/ReactRedux";
import { Provider } from "react-redux";
import { useEffect, useRef, useState } from "react";

const getStyles = (val: boolean) => {
  return { display: val ? "block" : "none" };
};
function ReactDom() {
  const [showReact, setShowReact] = useState(false);
  return (
    <>
      <button onClick={() => setShowReact(!showReact)}>showReactDom</button>
      <div style={getStyles(showReact)}>
        <h1>Study for React 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <div>============= React-Redux =============</div>
        <Provider store={Store}>
          <ShowInfoComp />
          <div>==========================</div>
          <CompA />
          <CompB />
        </Provider>
        <div>============= EventSystem =============</div>
        <EventSystem />
        <div>============= RenderMoreData =============</div>
        <RenderMoreData />
        <div>============ RenderComp ==============</div>
        <RenderComp />
        <div>============ ContextComp ==============</div>
        <ContextComp />
        <div>============ CssModule ==============</div>
        <CssModule />
        <div>============ CommunicateByRef ==============</div>
        <CommunicateByRef />
        <div>============ Communication ==============</div>
        <Communication />
        <div>============= HelloworldComp =============</div>
        <HelloworldComp />
      </div>
    </>
  );
}

function VueDom() {
  const [showVue, setShowVue] = useState(false);
  return (
    <>
      <button onClick={() => setShowVue(!showVue)}>showVueDom</button>
      <div style={getStyles(showVue)}>
        <h1>下面是Vue项目 Web-Component 注入 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <my-vue-app />
      </div>
    </>
  );
}

function HelloBtn() {
  const [showBtn, setShowBtn] = useState(false);
  return (
    <>
      <button onClick={() => setShowBtn(!showBtn)}>showHelloBtn</button>
      <div style={getStyles(showBtn)}>
        <h1>click button to show message 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <button onClick={() => sayHello("world!!!")}>hello</button>
      </div>
    </>
  );
}

function FormItem() {
  const [inputVal, setValue] = useState("");
  const inputRef = useRef(null);
  const showInputDom = () => {
    console.log(inputRef?.current);
  };

  const [showCountDom, setShow] = useState(true);
  function CountDom() {
    const [count, setCount] = useState(0);
    // Similar to componentDidMount and componentDidUpdate: 1st render and every update
    useEffect(() => {
      const timer = setInterval(() => {
        setCount(count + 1);
      }, 2000);

      // return a function to clean up
      return () => {
        console.log("useEffect return", count);
        clearInterval(timer);
      };
    }, [count]);
    return <div>count：{count}</div>;
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        value={inputVal}
        onChange={(val) => setValue(val.target.value)}
        placeholder="input sth..."
      />
      <button onClick={showInputDom}>getInputDom2Console</button>
      <div>
        CountDom：{showCountDom && <CountDom />}
        <button onClick={() => setShow(false)}>hideCountDom</button>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      {<ReactDom />}
      <div style={{ color: "yellowgreen" }}>
        ******************************************
      </div>{" "}
      {<VueDom />}
      <div style={{ color: "yellowgreen" }}>
        ******************************************
      </div>{" "}
      {<HelloBtn />}
      <div style={{ color: "yellowgreen" }}>
        ******************************************
      </div>{" "}
      {<FormItem />}
    </>
  );
}

export default App;
