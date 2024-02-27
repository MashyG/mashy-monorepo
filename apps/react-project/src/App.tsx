// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { sayHello } from "@mashy-monorepo/shared";

import "@mashy-monorepo/web-component";

import HelloworldComp from "./components/Helloworld";
import Communication from "./components/Communication";
import CommunicateByRef from "./components/CommunicateByRef";
import CssModule from "./components/CSSModule";
import ContextComp from "./components/Context";
import RenderComp from "./components/Render";
import RenderMoreData from "./components/RenderMoreData";
import EventSystem from "./components/EventSystem";

import Store from "./store";
import { CompA, CompB, ShowInfoComp } from "./components/ReactRedux";
import { Provider } from "react-redux";
import { useState } from "react";

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
        <Provider store={Store}>
          <ShowInfoComp />
          <div>==========================</div>
          <CompA />
          <CompB />
        </Provider>
        <div>==========================</div>
        <EventSystem />
        <div>==========================</div>
        <RenderMoreData />
        <div>==========================</div>
        <RenderComp />
        <div>==========================</div>
        <ContextComp />
        <div>==========================</div>
        <CssModule />
        <div>==========================</div>
        <CommunicateByRef />
        <div>==========================</div>
        <Communication />
        <div>==========================</div>
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

function App() {
  return (
    <>
      {ReactDom()}
      <div style={{ color: "yellowgreen" }}>
        ******************************************
      </div>{" "}
      {VueDom()}
      <div style={{ color: "yellowgreen" }}>
        ******************************************
      </div>{" "}
      {HelloBtn()}
    </>
  );
}

export default App;
