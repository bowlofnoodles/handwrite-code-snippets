// 暂时不考虑捕捉报错情况
// 且不考虑入参是Thunk 对象 数组
// 只考虑入参是Promise
// function myCo(gen) {
//   const ctx = this;
//   const args = [].slice.call(arguments, 1);
//   return new Promise((resolve, reject) => {
//     if (typeof gen === 'function') gen = gen.apply(ctx, args);
//     if (!gen || typeof gen.next !== 'function') return resolve(gen);

//     // 暂时假设一定是个promise
//     // 递归迭代next
//     function next(value) {
//       let result = gen.next(value);
//       // 当generator结束时 resolve值
//       if (result.done) return resolve(result.value);
//       // 上个promise得到结果即结束时 再将控制权交还给GeneratorFunction
//       result.value.then(
//         res => {
//           return next(res);
//         },
//         err => {
//           return reject(err);
//         }
//       );
//     }
//     next();
//   });
// }

function myCo(gen) {
  const ctx = this;
  const args = [].slice.call(arguments, 1);
  return new Promise((resolve, reject) => {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    if (!gen || gen.next !== 'function') return resolve(gen);

    function onFulfilled(res) {
      let ret;
      try {
        ret = gen.next(res);
      } catch(err) {
        reject(err);
      }
      next(ret);
    }

    function onRejected(err) {
      let ret;
      try {
        ret = gen.throw(err);
      } catch (err) {
        reject(err);
      }
      next(ret);
    }

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      const value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('入参格式不对'));
    }

    onFulfilled();
  });
};

function isObject(obj) {
  return Object === obj.constructor;
}

function isPromise(obj) {
  return obj instanceof Promise;
}

function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (typeof obj === 'function') return thunkToPromise(this, obj);
  if (Array.isArray(obj)) return arrayToPromise(this, obj);
  if (isObject(obj)) return objectToPromise(this, obj);
  return obj;
}

function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}

function thunkToPromise(fn) {
  const ctx = this;
  return new Promise((resolve, reject) => {
    fn.call(ctx, function(err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) return [].slice.call(arguments, 1);
      resolve(res);
    });
  })
}

function objectToPromise(obj) {
  const promises = [];
  const result = new obj.constructor();
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i ++) {
    const key = keys[i];
    if (isPromise(obj[key])) {
      promises.push(obj[key].then(res => {
        result[key] = res;
      }));
    } else {
      result[key] = obj[key];
    }
  }
  return Promise.all(promises).then(() => {
    return result;
  });
}

module.exports = myCo;