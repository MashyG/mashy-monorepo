import React from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { sayHello } from '@mashy-monorepo/shared'

import '@mashy-monorepo/web-component'

function App() {

  const status = false /* 状态 */
  const renderFoot=()=> <div> i am foot</div>
  const toLearn = [ 'react' , 'vue' , 'webpack' , 'nodejs'  ]

  const TextComponent = ()=> <div> hello , i am function component </div> 

  return (
    <>
      <div>
        <h1>Study for React 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <div style={{ marginTop:'100px' }}   >
            { /* element 元素类型 */ }
            <div>hello,world</div>
            { /* fragment 类型 */ }
            <React.Fragment>
                <div> 👽👽 </div>
            </React.Fragment>
            { /* text 文本类型 */ }
            my name is mashy
            { /* 数组节点类型 */ }
            { toLearn.map(item=> <div key={item} >let us learn { item } </div> ) }
            { /* 组件类型 */ }
            <TextComponent/>
            { /* 三元运算 */  }
            { status ? <TextComponent /> : <div>三元运算</div> }
            { /* 函数执行 */ } 
            { renderFoot() }
            {/* <button onClick={ ()=> console.log( this.render() ) } >打印render后的内容</button> */}
        </div>
      </div>
      <div>
        <h1>下面是Vue项目 Web-Component 注入 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <my-vue-app />
      </div>
      ===============================================================
      <div>
        <h1>click button to show message 👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻</h1>
        <button onClick={() => sayHello('world!!!')}>hello</button>
      </div>
    </>
  )
}

export default App
