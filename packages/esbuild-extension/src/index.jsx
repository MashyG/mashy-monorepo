import Server from 'react-dom/server'
import { createRoot } from 'react-dom/client'
import './styles/index.css'

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
let Greet = () => <h1 className="red">Hello, World 22222~~ </h1>
root.render(<Greet />)

console.log(Server.renderToString(<Greet />))

// CDN 链接
// import { render } from 'https://cdn.skypack.dev/react-dom'
// import React from 'https://cdn.skypack.dev/react'

// let Greet = () => <h1>Hello, juejin!</h1>

// render(<Greet />, document.getElementById('root'))
