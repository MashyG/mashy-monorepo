import Server from 'react-dom/server'

let Greet = () => <h1>Hello, World 22222 </h1>
console.log(Server.renderToString(<Greet />))
