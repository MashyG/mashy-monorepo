// 从背景页发送消息到 content-script
export const sendMsg2Client = (config: { tabId: number; action: string; params?: any }) => {
  const { tabId, action, params = {} } = config || {}

  return chrome.tabs.sendMessage(tabId, {
    action,
    params
  })
}

// 等待页面加载完成， 从背景页发送消息到 content-script
// export const witePageAndSendMsg2Client = (data: {
//   tabId: number
//   action: string
//   params?: any
// }) => {
//   const { tabId } = data || {}
//   chrome.tabs.onUpdated.addListener(function listener(curTabId, info) {
//     if (tabId !== curTabId || info?.status !== 'complete') {
//       return
//     }

//     chrome.tabs.onUpdated.removeListener(listener)
//     sendMsg2Client(data)
//   })
// }

// export const sendMsg2AllClient = (action: string, params?: any) => {
//   chrome.tabs.query({}, tabs => {
//     tabs.forEach(tab => {
//       sendMsg2Client({
//         tabId: tab.id as number,
//         action,
//         params
//       })
//     })
//   })
// }

// 从 content-script 发送消息到背景页
export const sendMsg2Bg = (action: `/${string}`, params?: any): Promise<any> => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(
      {
        action,
        params
      },
      response => {
        resolve(response)
      }
    )
  })
}
