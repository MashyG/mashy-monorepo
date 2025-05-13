import { createApp } from 'vue'
import '@root/styles/index.css'
import '@root/styles/element.scss'
import App from './App.vue'

function injectContent() {
  // 注入DOM内容到页面中
  const root = document.createElement('div')
  root.id = 'mashy-root'
  document.body.appendChild(root)
  console.log('Content注入DOM')
  // Vue 渲染DOM
  const app = createApp(App)
  app.mount(root)
}

injectContent()
