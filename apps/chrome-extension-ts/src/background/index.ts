import type { MessagePayload, MessageResponse } from "@/types";

// 接收来自Popup和Content的消息
chrome.runtime.onMessage.addListener(
  (
    request: MessagePayload,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    if (request.type === "FROM_POPUP") {
      console.log("Background收到来自Popup的消息:", request.message);
      void sendMessageToContent(request.message);
      sendResponse({
        message: "Background已收到并转发！",
        success: true,
      });
    }

    if (request.type === "FROM_CONTENT") {
      console.log("Background收到来自Content的消息:", request.message);
      sendResponse({
        message: "Background已收到Content消息！",
        success: true,
      });
    }
  }
);

// 向Content发送消息
async function sendMessageToContent(message: string): Promise<void> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]?.id) {
    await chrome.tabs.sendMessage(tabs[0].id, {
      type: "FROM_BACKGROUND",
      message,
    } as MessagePayload);
  }
}
