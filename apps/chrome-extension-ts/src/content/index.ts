import type { MessagePayload, MessageResponse } from "@/types";
import App from "@/views/App.vue";
import { createApp } from "vue";

function injectContent() {
  // 注入DOM内容到页面中
  const root = document.createElement("div");
  root.id = "mashy-root";
  document.body.appendChild(root);
  console.log("Content注入DOM");
  // Vue 渲染DOM
  const app = createApp(App);
  app.mount(root);
}

injectContent();

// 接收来自Popup和Background的消息
chrome.runtime.onMessage.addListener(
  (
    request: MessagePayload,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    if (request.type === "FROM_POPUP") {
      console.log("Content收到来自Popup的消息:", request.message);
      injectContent();
      sendResponse({
        message: "已收到消息！",
        success: true,
      });
    }

    if (request.type === "FROM_BACKGROUND") {
      console.log("Content收到来自Background的消息:", request.message);
      sendResponse({
        message: "Content已收到Background消息！",
        success: true,
      });
    }
  }
);

// 向Background发送消息
setInterval(() => {
  chrome.runtime.sendMessage({
    type: "FROM_CONTENT",
    message: "这是来自Content的定时消息",
  } as MessagePayload);
}, 5000);
