import { getRouterListener } from '@/share/router'
import { messageRouter } from './routers/index'
import { initApiConfig, initNetworkListener } from './init'

// 注册路由
export const registerRouter = () => {
  const messageListener = getRouterListener(messageRouter)

  chrome.runtime.onMessage.addListener(messageListener)
  console.log('registerRouter successfully!!!')
}

function createBackgroundFunc() {
  // 初始化网络监听器
  initNetworkListener()

  // 初始化API配置
  initApiConfig()

  registerRouter()
  console.log('background loaded')
}
createBackgroundFunc()
