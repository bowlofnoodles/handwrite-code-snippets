const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(executor) {
  this.status = PENDING;
  this.value = void 0;
  this.reason = void 0;
  this.onResolvedCallback = [];
  this.onRejectedCallback = [];
  const ctx = this;

  function resolve(value) {
    queueMicrotask(() => {
      if (ctx.status === PENDING) {
        ctx.status = FULFILLED;
        ctx.value = value;
        for (let i = 0; i < ctx.onResolvedCallback.length; i ++) {
          ctx.onResolvedCallback[i](ctx.value);
        }
      }
    });
  }

  function reject(reason) {
    queueMicrotask(() => {
      if (ctx.status === PENDING) {
        ctx.status = REJECTED;
        ctx.reason = reason;
        for (let i = 0; i < ctx.onRejectedCallback.length; i++) {
          ctx.onRejectedCallback[i](ctx.reason);
        }
      }
    });
  }

  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
};

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) return reject(new TypeError('Cycle Chain Detected in promise'));
  if (x instanceof MyPromise) {
    if (x.status === PENDING) {
      x.then(v => resolvePromise(promise, v, resolve, reject), reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  let thenOrThrowCalled = false;
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          function rs(y) {
            if (thenOrThrowCalled) return;
            thenOrThrowCalled = true;
            return resolvePromise(promise, y, resolve, reject);
          },
          function rj(e) {
            if (thenOrThrowCalled) return;
            thenOrThrowCalled = true;
            return reject(e);
          }
        )
      } else {
        resolve(x);
      }
    } catch (err) {
      if (thenOrThrowCalled) return;
      thenOrThrowCalled = true;
      reject(err);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const ctx = this;
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

  if (ctx.status === PENDING) {
    let promise2 = new MyPromise((resolve, reject) => {
      ctx.onResolvedCallback.push(value => {
        try {
          let x = onFulfilled(value);
          resolvePromise(promise2, x, resolve, reject); 
        } catch (err) {
          reject(err);
        }
      });
      ctx.onRejectedCallback.push(reason => {
        try {
          let x = onRejected(reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    });
    return promise2;
  }

  if (ctx.status === FULFILLED) {
    let promise2 = new MyPromise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          let x = onFulfilled(ctx.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      })
    });
    return promise2;
  }

  if (ctx.status === REJECTED) {
    let promise2 = new MyPromise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          let x = onRejected(ctx.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      });
    });
    return promise2;
  }
};

MyPromise.resolve = function(value) {
  return new MyPromise(resolve => {
    resolve(value);
  });
};

MyPromise.reject = function (reason) {
  return new MyPromise((_, reject) => {
    reject(reason);
  });
};

module.exports = MyPromise;

MyPromise.defer = MyPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
