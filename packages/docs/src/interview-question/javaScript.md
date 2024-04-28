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

# js 如何判断是否是数组？

```js
const isArray = (value) => {
  return Object.prototype.toString.call(value) === "[object Array]"; // √
  // 或者
  return Array.isArray(value); // √
  // 或者
  return value instanceof Array; // prototype属性是可以修改的，所以并不是最初判断为true就一定永远为真
  // 或者
  return value && typeof value === "object" && value.constructor === Array;
};
```

# js 如何处理精度丢失问题？

> 主要原因是计算机内部使用二进制浮点数表示法，而不是十进制。这种二进制表示法在某些情况下无法准确地表示某些十进制小数，从而导致精度丢失

1. 使用**整数**或**字符串**进行计算，而不是浮点数进行计算
2. 使用专门的库或工具：`Decimal.js、Big.js 或 BigNumber.js `
3. 避免直接比较浮点数
4. 限制小数位数

# n = 1, m = 100, js 使用递归实现 n + (n + 1) + ... + m = ?

```js
// 递归实现
// 递归的终止条件：当 n 大于 m 时，递归结束，返回 0。
function sum(n, m) {
  if (n > m) {
    return 0;
  }
  return n + sum(n + 1, m);
}
```

# 闭包是什么？使用场景有哪些？

> 闭包是指有权访问另一个函数作用域中的变量的函数，创建闭包最常见的方式就是在一个函数内部创建另一个函数。
> 在 JavaScript 中，只有函数可以形成新的作用域，当内部函数访问其所在的外部函数的变量时，就形成了一个闭包。

```js
function outer() {
  var count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}

var increase = outer();
increase(); // 输出：1
increase(); // 输出：2
```

## 使用场景

1. **数据封装和私有成员**：JavaScript 对象的属性默认是可以被外部访问和修改的，但有时候我们想要保护某些数据不被外部访问，此时可以使用闭包来实现。
2. **模块化和代码组织**：闭包可以帮助我们创建独立的模块，模块内部的变量和函数被封装在闭包中，这有助于代码的组织和防止全局作用域的污染。
3. **在时间或异步操作中持久保存变量值**：比如我们在使用 setTimeout 或者发起 Ajax 请求的时候，由于 JavaScript 的事件循环特性，我们可能需要使用闭包来保持变量的值。

# 浏览器的事件循环的工作原理

1. 首先，JavaScript 引擎创建了两个任务队列：宏观任务队列（MacroTask）& 微观任务队列（MicroTask）。宏观任务包括：script 标签代码、setTimeout、setInterval 等。微观任务包括：Promise、MutationObserver（浏览器环境）和 process.nextTick（Node.js 环境）等。
2. 当一个宏观任务（MacroTask）正在运行（如一个 script 标签中的脚本），新的宏观任务都会被添加到队列的末尾等待执行。
3. 当一个宏观任务（MacroTask）完成后，引擎会查看微观任务队列（MicroTask Queue）中是否有任务。如果有，它将执行所有的微观任务，直到队列清空。
4. 然后渲染页面（如果有必要的话）。
5. 同步代码执行完之后，浏览器会不停地检查宏观任务队列，新的宏观任务如果满足触发条件（如 setTimeout 到了设定的时间），则将此任务从任务队列中取出，并执行，此过程是循环的，因此被称作事件循环。

# 强缓存和协商缓存是什么？区别有哪些？

> 浏览器在处理类型文件的请求时，为了节约网络资源和加载时间，提高页面速度，会采用各种缓存策略。这种策略可以分为两类：强缓存和协商缓存。

## 强缓存

> 强缓存不会向服务器发送请求，直接从缓存中读取资源。强缓存通过两个 HTTP Header 来控制，分别是 Expires 和 Cache-Control。

- **Expires**：HTTP/1.0 的产物，表示资源的过期时间，是一个绝对的时间点（如：Wed, 22 Oct 2018 08:41:00 GMT）。
- **Cache-Control**：HTTP/1.1 的产物，优先级高于 Expires，含义更丰富。常见的值有：
  - public： 所有内容都将被缓存（客户端和代理服务器都可缓存）。
  - private：所有内容只有客户端可以缓存，代理服务器不能缓存。
  - no-cache：客户端缓存内容，是否使用缓存则需要经过协商缓存来验证。
  - no-store：所有内容都不会被缓存。
  - max-age=xxx：资源被缓存的最大时间。

## 协商缓存

> 协商缓存需要进行对比判断是否可以使用缓存。当强缓存失效后，浏览器在请求头中携带相关的标识，发送到服务器，由服务器根据这些标识进行判断，协商是否可以缓存。主要有两对字段控制，分别是 Last-Modified 和 If-Modified-Since，Etag 和 If-None-Match。

- **Last-Modified 和 If-Modified-Since**：Last-Modified 表示本地文件最后修改日期，浏览器会把这个值和内容一起记录下来。再次向服务器请求时，请求头会包含 If-Modified-Since ，后者的值为 Last-Modified 中的值。若服务器端的资源未改变，HTTP 状态码返回 304，并且 HTTP 响应体内容为空，此时客户端使用本地缓存。
- **Etag 和 If-None-Match**：Etag 是服务端根据当前资源的内容，生成的一个唯一标识，只要资源内容有改动，Etag 就会重新生成。浏览器在下一次加载资源向服务器发送请求时，会将之前保存的 Etag 值放到 If-None-Match 里面一并带给服务器。如果服务器端的标识和请求头中 If-None-Match 里的标识一致，则说明资源未变，直接返回 304 和空的响应体。

> 总而言之，强缓存优先级更高，当强缓存失效后，浏览器会带着相应的 tag 去服务器进行协商缓存，服务器根据 tag 判断是否使用缓存。

## 区别

1. 强缓存不会发送请求到服务器，节省时间且网络流量消耗小。
2. 协商缓存需要发送请求到服务器，虽然多了网络延迟，但是根据服务器返回状况，可能不会消耗网络流量。
3. 优先使用强缓存，即若强缓存有效，无论协商缓存策略如何，都不会使用协商缓存。
