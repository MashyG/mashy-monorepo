// 跨浏览器 tab 间通信
class MyBroadcastChannel {
  bc: BroadcastChannel;
  constructor(name: string) {
    console.log("BroadcastChannel", name);
    this.bc = new BroadcastChannel(name);
  }
  send(message: string) {
    console.log("send", message);
    this.bc.postMessage(message);
  }
  onmessage(callback: (event: any) => void) {
    console.log("onmessage", callback);
    this.bc.onmessage = (event: any) => {
      callback(event);
    };
  }
}

export const myBroadcastChannel = new MyBroadcastChannel("mashy");
