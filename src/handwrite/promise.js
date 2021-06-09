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
    return reject(err);
  }
};

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) return reject(new TypeError('Cycle Chain Detected in promise'));
  if (x instanceof MyPromise) {
    if (x.status === PENDING) {
      return x.then(v => resolvePromise(promise, v, resolve, reject), reject);
    } else {
      return x.then(resolve, reject);
    }
  }

  let thenOrThrowCalled = false;

  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          function rs(v) {
            if (thenOrThrowCalled) return;
            thenOrThrowCalled = true;
            return resolvePromise(promise, v, resolve, reject);
          },
          function rj(r) {
            if (thenOrThrowCalled) return;
            thenOrThrowCalled = true;
            return reject(r);
          }
        );
      } else {
        return resolve(x);
      }
    } catch (err) {
      if (thenOrThrowCalled) return;
      thenOrThrowCalled = true;
      return reject(err);
    }
  } else {
    return resolve(x);
  }
};

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};
  const ctx = this;

  if (ctx.status === PENDING) {
    let promise = new MyPromise((resolve, reject) => {
      ctx.onResolvedCallback.push(value => {
        try {
          let x = onFulfilled(value);
          return resolvePromise(promise, x, resolve, reject);
        } catch (err) {
          return reject(err);
        }
        
      });
      ctx.onRejectedCallback.push(reason => {
        try {
          let x = onRejected(reason);
          return resolvePromise(promise, x, resolve, reject);
        } catch (err) {
          return reject(err);
        }
      })
    });
    return promise;
  }

  if (ctx.status === FULFILLED) {
    let promise = new MyPromise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          let x = onFulfilled(ctx.value);
          return resolvePromise(promise, x, resolve, reject);
        } catch (err) {
          return reject(err);
        }
      });
    });
    return promise;
  }

  if (ctx.status === REJECTED) {
    let promise = new MyPromise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          let x = onRejected(ctx.reason);
          return resolvePromise(promise, x, resolve, reject);
        } catch (err) {
          return reject(err);
        }
      });
    });
    return promise;
  }
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

