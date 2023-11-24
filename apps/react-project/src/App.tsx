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

function App() {
  return (
    <>
      <div>
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
      <div>
        <h1>下面是Vue项目 Web-Component 注入 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <my-vue-app />
      </div>
      ===============================================================
      <div>
        <h1>click button to show message 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <button onClick={() => sayHello("world!!!")}>hello</button>
      </div>
    </>
  );
}

export default App;
