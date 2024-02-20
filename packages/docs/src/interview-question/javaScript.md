# Promise

```js
// 定义 Promise 类
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((callback) => callback(this.value));
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((callback) => callback(this.reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    const fulfilledHandler =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    const rejectedHandler =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise = new MyPromise((resolve, reject) => {
      const fulfillCallback = () => {
        try {
          const result = fulfilledHandler(this.value);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      const rejectCallback = () => {
        try {
          const result = rejectedHandler(this.reason);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === "fulfilled") {
        setTimeout(fulfillCallback, 0);
      } else if (this.state === "rejected") {
        setTimeout(rejectCallback, 0);
      } else {
        this.onFulfilledCallbacks.push(fulfillCallback);
        this.onRejectedCallbacks.push(rejectCallback);
      }
    });

    return promise;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => MyPromise.resolve(onFinally()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        })
    );
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }
}
```

# 无感刷新 token

1. 对请求进行拦截，在发送请求前添加 token。

2. 对响应进行拦截，检查返回的状态码，如果状态码表示 token 过期，那么进行 token 刷新操作。

3. 在刷新 token 时，将所有的请求暂时挂起，等待新的 token 获取后，再用新的 token 重新发起这些请求。

```js
import axios from "axios";

// 创建一个axios实例
const instance = axios.create();

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求前添加token
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      // 假设 401 表示token过期
      // 如果token过期，尝试刷新token
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post("/refresh", { token: refreshToken });
        // 保存新的token
        localStorage.setItem("token", res.data.token);
        // 用新的token重新发起被挂起的请求
        return instance(error.config);
      } catch (err) {
        console.log(err);
      }
    }
    return Promise.reject(error);
  }
);
```

# Canvas，SVG 和动画的区别

## 动画（Animation）

- 实现方式：动画可以通过 CSS 动画、JavaScript 动画库（如 GreenSock）或基于**帧**的动画来实现。
- 技术特点：使用 CSS 动画时，你可以通过定义关键帧和过渡效果来控制动画效果。JavaScript 动画库提供了更多的灵活性和控制选项。基于帧的动画则是通过在每一帧之间进行绘制或位置更新来实现动画效果。
- 适用场景：动画可以应用于 HTML 元素、UI 界面、游戏等各种场景。

## Canvas:

- 实现方式：Canvas 是 HTML5 提供的绘图 API，使用 JavaScript 在网页上绘制 2D 图形和动画。
- 技术特点：Canvas 提供了一个位图画布，你可以使用 JavaScript 绘制和处理**像素**数据来实现各种效果。它允许你直接操作像素，因此适用于复杂的图形处理和游戏开发等场景。
- 适用场景：Canvas 适用于需要绘制复杂图形、实现交互式游戏或动态图像的场景。

## SVG（Scalable Vector Graphics）:

- 实现方式：SVG 是一种基于 XML 的矢量图形格式，使用标记语言描述图形元素。
- 技术特点：SVG 使用矢量图形描述，它基于数学公式和几何描述，可以**无损缩放并保持清晰度**。你可以使用 CSS 或 JavaScript 来控制 SVG 元素的样式和行为，包括动画效果。
- 适用场景：SVG 适用于需要在不同分辨率下保持清晰度的图形、数据可视化和可缩放的图形效果等场景。

# Websocket 工作原理？

> WebSocket 是一种网络通信协议，提供了全双工（full-duplex）通信通道，允许服务器和客户端之间进行双向通信。这种通信方式相比于传统的 HTTP 请求，可以更有效地传输小量数据，因为它减少了 HTTP 请求头的开销和频繁的创建连接。

## WebSocket 的基本工作原理

1. 建立连接：首先，客户端发起一个 HTTP 请求到服务器，这个请求被称为握手（handshake）。这个请求看起来和普通的 HTTP 请求类似，但有一些**特殊的头部字段**，如 `Upgrade: websocket` 和 `Connection: Upgrade`，表示客户端希望升级协议到 WebSocket。

2. 服务器响应：如果服务器支持 WebSocket，并且同意协议升级，它会发送一个 HTTP 响应，其中包含 `Upgrade: websocket` 和 `Connection: Upgrade` 头部字段。此时，协议升级完成，后续的通信将使用 WebSocket 协议，而不是 HTTP。

3. 数据传输：一旦连接建立，客户端和服务器就可以通过这个连接发送和接收数据。数据被封装在 WebSocket "**帧**" 中，**每个帧都包含一个小的头部和负载数据**。头部包含一些元数据，如帧的长度、类型（文本或二进制）等。

4. 保持连接：WebSocket 连接在建立后会保持打开状态，直到客户端或服务器决定关闭它。这使得双方可以随时发送数据，而不需要每次都建立新的连接。

5. 关闭连接：任何一方都可以选择关闭连接，通常通过发送一个特殊的 "**关闭帧（操作码 0x8）**" 来完成。一旦连接关闭，它就不能再被用于数据传输。

# Websocket 如何保证连接成功？断开连接后自动重连？

要确保 WebSocket 连接成功，你可以遵循以下步骤：

1. 创建 WebSocket 对象：在客户端（通常是浏览器）中，使用 JavaScript 创建一个 WebSocket 对象。指定 WebSocket 服务器的 URL，该 URL 包括协议（通常是 ws:// 或 wss://）和服务器的地址和端口号。

2. 监听连接事件：WebSocket 对象提供了几个事件，你可以监听这些事件来处理连接的状态。最重要的事件是 onopen，当连接成功建立时会触发该事件。

3. 监听错误事件：你还可以监听 onerror 事件，以便在连接过程中发生错误时进行处理。

4. 监听关闭事件：通过监听 onclose 事件，可以检测到与 WebSocket 服务器的连接是否关闭。

```js
// 例子：实现连接超时后处理重新连接
const socket = new WebSocket("ws://example.com/socket");
const connectionTimeout = 5000; // 连接超时时间，单位为毫秒
let connectionTimer;

socket.onopen = function (event) {
  console.log("连接已建立");
  clearTimeout(connectionTimer); // 清除连接超时定时器
};

socket.onerror = function (error) {
  console.error("WebSocket 错误:", error);
  clearTimeout(connectionTimer); // 清除连接超时定时器
};

socket.onclose = function (event) {
  console.log("连接已关闭");
  clearTimeout(connectionTimer); // 清除连接超时定时器
};

// 设置连接超时定时器
connectionTimer = setTimeout(function () {
  if (socket.readyState !== WebSocket.OPEN) {
    console.log("连接超时");
    socket.close(); // 关闭连接

    // 执行重连操作或其他处理逻辑
    setTimeout(function () {
      socket = new WebSocket("ws://example.com/socket");
    }, reconnectInterval);
  }
}, connectionTimeout);
```

# 数组部分方法的底层实现（forEach，map，reduce，some，every）

## forEach

```js
Array.prototype.myForEach = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);
  }
};

let arr = [1, 2, 3, 4, 5];
arr.myForEach((item, index) => {
  console.log(item, index);
});
```

## map

```js
Array.prototype.myMap = function (callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

let arr = [1, 2, 3, 4, 5];
let newArr = arr.myMap((item, index) => {
  return item * 2;
});
console.log(newArr);
```

## reduce

```js
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0];
  let startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};

let arr = [1, 2, 3, 4, 5];
let sum = arr.myReduce((acc, cur) => acc + cur, 0);
console.log(sum); // 15
```

## some

```js
Array.prototype.mySome = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return true;
    }
  }
  return false;
};

let arr = [1, 2, 3, 4, 5];
let hasEven = arr.mySome((item, index) => {
  return item % 2 === 0;
});
console.log(hasEven);
```

## every

```js
Array.prototype.myEvery = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i], i, this)) {
      return false;
    }
  }
  return true;
};

let arr = [1, 2, 3, 4, 5];
let allPositive = arr.myEvery((item, index) => {
  return item > 0;
});
console.log(allPositive);
```
