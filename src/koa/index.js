// 2.koa compose
const middlewares = [
  async (ctx, next) => {
    console.log(1);
    await next();
    console.log(2);
  },
  async (ctx, next) => {
    console.log(3);
    await next();
    console.log(4);
  },
  async (ctx, next) => {
    console.log(5);
    await next();
    console.log(6);
  },
];

const compose = middlewares => {
  if (!Array.isArray(middlewares)) throw new TypeError('middlewares必须为数组');
  if (middlewares.some(m => typeof m !== 'function')) return new TypeError('中间件必须为函数');
  return function(ctx, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('单个中间件函数中多次调用了next函数'));
      let fn = middlewares[i];
      index = i;
      if (i === middlewares.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
};

compose(middlewares)().then();