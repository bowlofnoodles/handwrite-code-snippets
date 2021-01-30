const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// npm i -g promises-aplus-tests
// promises-aplus-tests promise.js

function Promise(executor) {
  this.state = 'pending';
  this.value = null;
  this.reason = null;
  this.onFulfilledCallback = [];
  this.onRejectedCallback = [];
  
  const resolve = value => {
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = value;
      this.onFulfilledCallback.forEach(fn => {
        fn();
      });
    }
  }

  const reject = reason => {
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectedCallback.forEach(fn => {
        fn()
      });
    }
  }

  try {
    executor(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  const onFulfilledFunc = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  const onRejectedFunc = typeof onRejected === 'function' ? onRejected : reason => reason;
  switch (this.state) {
    case FULFILLED:
      setTimeout(() => {
        onFulfilledFunc(this.value);
      });
      break;
    case REJECTED:
      setTimeout(() => {
        onRejectedFunc(this.reason);
      });
    case PENDING:
      this.onFulfilledCallback.push(() => {
        setTimeout(() => {
          onFulfilledFunc(this.value);
        });
      });
      this.onRejectedCallback.push(() => {
        setTimeout(() => {
          onRejectedFunc(this.reason);
        })
      });
    default:
      break;
  }
};

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;