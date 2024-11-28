import type { MessagePayload, MessageResponse } from '@/types'

chrome.runtime.onMessage.addListener(
  (
    request: MessagePayload, 
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    if (request.type === 'FROM_POPUP') {
      console.log('Content收到来自Popup的消息:', request.message)
      sendResponse({ 
        message: '已收到消息！',
        success: true 
      })
    }
    
    if (request.type === 'FROM_BACKGROUND') {
      console.log('Content收到来自Background的消息:', request.message)
      sendResponse({ 
        message: 'Content已收到Background消息！',
        success: true 
      })
    }
  }
)

setInterval(() => {
  chrome.runtime.sendMessage({
    type: 'FROM_CONTENT',
    message: '这是来自Content的定时消息'
  } as MessagePayload)
}, 5000)
