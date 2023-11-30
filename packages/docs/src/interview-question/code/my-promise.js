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
function Promise(executor) {
  var self = this;
  self.state = "pending";
  self.value = undefined;
  self.reason = undefined;
  self.onResolvedCallbacks = [];
  self.onRejectedCallbacks = [];
  self.finallyCallbacks = [];

  function resolve(value) {
    if (self.state === "pending") {
      self.state = "fulfilled";
      self.value = value;
      self.onResolvedCallbacks.forEach(function (callback) {
        callback();
      });
      self.finallyCallbacks.forEach(function (callback) {
        callback();
      });
    }
  }

  function reject(reason) {
    if (self.state === "pending") {
      self.state = "rejected";
      self.reason = reason;
      self.onRejectedCallbacks.forEach(function (callback) {
        callback();
      });
      self.finallyCallbacks.forEach(function (callback) {
        callback();
      });
    }
  }

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  var self = this;
  onFulfilled =
    typeof onFulfilled === "function"
      ? onFulfilled
      : function (value) {
          return value;
        };
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : function (reason) {
          throw reason;
        };

  var promise2 = new Promise(function (resolve, reject) {
    function handleFulfilled() {
      setTimeout(function () {
        try {
          var x = onFulfilled(self.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    }

    function handleRejected() {
      setTimeout(function () {
        try {
          var x = onRejected(self.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      }, 0);
    }

    if (self.state === "fulfilled") {
      handleFulfilled();
    } else if (self.state === "rejected") {
      handleRejected();
    } else if (self.state === "pending") {
      self.onResolvedCallbacks.push(handleFulfilled);
      self.onRejectedCallbacks.push(handleRejected);
    }
  });

  return promise2;
};

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.finally = function (onFinally) {
  var self = this;

  return self.then(
    function (value) {
      return Promise.resolve(onFinally()).then(function () {
        return value;
      });
    },
    function (reason) {
      return Promise.resolve(onFinally()).then(function () {
        throw reason;
      });
    }
  );
};

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  if (x && (typeof x === "object" || typeof x === "function")) {
    var called = false;

    try {
      var then = x.then;

      if (typeof then === "function") {
        then.call(
          x,
          function (value) {
            if (called) return;
            called = true;
            resolvePromise(promise, value, resolve, reject);
          },
          function (reason) {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
