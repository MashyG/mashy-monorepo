// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { sayHello } from "@mashy-monorepo/shared";

import "@mashy-monorepo/web-component";

import HelloworldComp from "./components/Helloworld";
import Communication from "./components/Communication";
import CommunicateByRef from "./components/CommunicateByRef";
import CssModule from "./components/CssModule";

function App() {
  return (
    <>
      <div>
        <h1>Study for React 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <HelloworldComp />
        <div>==========================</div>
        <Communication />
        <div>==========================</div>
        <CommunicateByRef />
        <div>==========================</div>
        <CssModule />
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
