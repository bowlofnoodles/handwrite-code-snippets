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

// 柯理化 返回一个函数
// myCo.wrap(fn)返回的函数 就很像一个async函数实现的效果了 虽然他们里边有一些实现细节的差异
myCo.wrap = function (fn) {
  // 为了过测试用例should expose the underlying generator function:
  createPromise.__generatorFunction__ = fn;
  return createPromise;
  function createPromise() {
    return myCo.call(this, fn.apply(this, arguments));
  }
};

function myCo(gen) {
  const ctx = this;
  const args = [].slice.call(arguments, 1);
  return new Promise((resolve, reject) => {
    // 是个GeneratorFunction 调用生成Generator
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    // 如果入参不是Generator 就直接resolve
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    function onFulfilled(res) {
      let ret;
      try {
        // 迭代next
        ret = gen.next(res);
      } catch (err) {
        reject(err);
      }
      next(ret);
    }

    function onRejected(err) {
      let ret;
      try {
        // gen.throw 抛异常 让GeneratorFunction中可以捕获yield+关键字的异常 而不是整个promise reject
        ret = gen.throw(err);
      } catch (err) {
        reject(err);
      }
      // 抛异常reject之后，GeneratorFunction的逻辑能够接着走下去，这里跟async await不同，async await抛了异常，整个promise就直接reject了
      next(ret);
    }

    // 迭代 generator
    function next(ret) {
      // done为true的时候 就resolve
      if (ret.done) return resolve(ret.value);
      // 将yield后面的值尝试转化为promise，转化和支持的类型看toPromise
      const value = toPromise.call(ctx, ret.value);
      // 等待转化为的promise状态改变再迭代Generator
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      // 否则抛异常并支持迭代器继续走下去
      return onRejected(
        new TypeError(
          'You may only yield a function, promise, generator, array, or object, ' +
            'but the following object was passed: "' +
            String(ret.value) +
            '"'
        )
      );
    }

    // 让迭代器运行起来
    onFulfilled();
  });
}

function isObject(obj) {
  // 是不是一个对象，数组等就不行
  return Object === obj.constructor;
}

function isPromise(obj) {
  // 判断是不是个Promise
  return obj instanceof Promise;
}

function isGenerator(obj) {
  // 检测是不是一个Generator
  return typeof obj.next === 'function' && typeof obj.throw === 'function';
}

function isGeneratorFunction(obj) {
  const constructor = obj.constructor;
  if (!constructor) return false;
  // 构造器函数是GenerationFunction
  if (constructor.name === 'GeneratorFunction' || constructor.displayName === 'GeneratorFunction') return true;
  return isGenerator(constructor.prototype);
}

function toPromise(obj) {
  // 如果为falsey值，直接返回，如果是入参调用后面co会抛入参格式异常的错误
  if (!obj) return obj;
  // 如果是promise就不做操作直接返回了
  if (isPromise(obj)) return obj;
  // 如果是Generator或者是GeneratorFunction 则调用myCo返回一个promise
  if (isGenerator(obj) || isGeneratorFunction(obj)) return myCo.call(this, obj);
  // 如果是普通的函数，则调用thunkToPromise，其实就是在thunk的callback中包一层promise
  if (typeof obj === 'function') return thunkToPromise.call(this, obj);

  /**题外话：其实如果没有对象和数组的处理也无伤大雅关系，属于核心功能外的锦上添花了
   * 外界自己yield Promise.all([])自己处理
   **/
  // 数组情况 支持处理部分元素是promise部分不是 内部逻辑主要还是调用Promise.all
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  // 对象情况 支持处理部分key是promise部分不是 内部逻辑主要还是调用Promise.all
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}

function arrayToPromise(obj) {
  // 调用promise.all等待全部promsie 注意数组元素可能不一定是promise，所以要调用toPromsie，Array.prototype.map的第二个参数可以绑定this
  return Promise.all(obj.map(toPromise, this));
}

function thunkToPromise(fn) {
  const ctx = this;
  // 在thunk的callback中包一层promise;
  return new Promise((resolve, reject) => {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      // 当arguments长度大于2，也就是除了err，res有多个值，则把这多个值重新赋值给resolved的value => res
      if (arguments.length > 2) res = [].slice.call(arguments, 1);
      return resolve(res);
    });
  });
}

function objectToPromise(obj) {
  const promises = [];
  const result = new obj.constructor();
  // const result = new Object();
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const promise = toPromise.call(this, obj[key]);
    // 如果是promise
    if (promise && isPromise(promise)) {
      // 这行去掉 会通不过测试用例 should preserve key order:
      // {a: something, b: something, c: something} 希望输出也是这个key值顺序
      // 跟Object.keys()的输出顺序 相关 无伤大雅的东西 可以了解 https://segmentfault.com/a/1190000018306931
      result[key] = undefined;
      // 则push进promsies数组
      promises.push(
        promise.then(res => {
          // 在promise状态改变的时候设置相对应的结果值
          result[key] = res;
        })
      );
    } else {
      // 否则直接保留原有值
      result[key] = obj[key];
    }
  }
  // 等全部的promise都resolved之后result也已经拿到和更新了结果值的时候，就直接resolve传递给result
  return Promise.all(promises).then(() => {
    return result;
  });
}

module.exports = myCo;
