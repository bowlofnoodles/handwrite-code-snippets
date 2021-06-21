const stepAdd = async val => {
  const p = val =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(val + 2);
      }, 600);
    });
  const result = await p(val);
  return result;
};

const stepMulti = async val => {
  const p = val =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(val * 2);
      }, 600);
    });
  const result = await p(val);
  return result;
};

const init = async (a, b) => {
  const p = (a, b) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(a + b);
      }, 600);
    });
  const result = await p(a, b);
  return result;
};

const composed = compose(stepAdd, stepMulti, init);
composed(9, 10).then(res => {
  console.log('res', res); // 40 => (9 + 10) * 2 + 2
})

const compose = (...funcs) => (...arg) => funcs.reduceRight((chain, func, i) => {
  if (i === funcs.length - 1) {
    return chain.then(res => {
      // 入口函数可能有多参数，作特殊处理
      return func(...res);
    });
  } else {
    return chain.then(func);
  }
}, Promise.resolve(arg));


// 隔一秒打印数字的另一种做法
const getPromise = val =>
  new Promise(r => {
    setTimeout(() => {
      console.log(val);
      r(val);
    }, 1000);
  });

const getFuncs = arr => arr.map(item => () => getPromise(item));

const main = compose(...getFuncs([1, 2, 3, 4, 5].reverse()));
main();
