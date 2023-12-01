// Promise 底层原理
// 1. promise 是一个类，无需考虑兼容性
// 2. promise 有三个状态，成功，失败，等待
// 3. promise 默认执行器立即执行
// 4. promise 的状态一旦发生改变，就不能再次改变
// 5. promise 都有一个 then 方法，then 方法中传递两个参数，一个是成功的回调，一个是失败的回调
// 6. 如果执行函数时发生了异常，也会执行失败逻辑
// 7. 如果 promise 状态是等待，我们需要将成功和失败的回调存放起来，稍后调用resolve和reject时重新执行
// 8. then 方法是可以被调用多次的，当状态是成功时，需要依次将对应的成功方法执行
// 9. then 方法是可以被调用多次的，当状态是失败时，需要依次将对应的失败方法执行
// 10. then 方法返回一个新的 promise 实例（注意，不是原来的那个 promise 实例）
// 11. 如果返回的是一个普通值，直接调用 resolve
// 12. 如果返回的是一个 promise 对象，查看 promise 对象返回的结果
// 13. 如果返回的是一个 promise 对象，状态为成功，调用 resolve
// 14. 如果返回的是一个 promise 对象，状态为失败，调用 reject
// 15. errorCaptured
// 26. finally

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
// 解析以上类Promise的底层实现思想
