const curry = (fn, ...args) => {
  if (args.length >= fn.length) {
    return fn(...args);
  } else {
    return (...args2) => curry(fn, ...args, ...args2);
  }
}

const add = (a, b, c) => a + b + c;

const curryAdd = curry(add);

curryAdd(1)(2)(3);
curryAdd(1)(2, 3);
curryAdd(1, 2)(3);
curryAdd(1, 2, 3);

const curryAddNotEnd = (...args) => {
  const addSum = (arr, init) => arr.reduce((c, n) => c + n, init);
  let sum = addSum(args, 0);
  // 以不传参数为终止
  const x = (...b) => {if (!b || !b.length) return sum; sum = addSum(b, sum); return x};
  return x;
}

console.log('add', curryAddNotEnd(1, 2, 3)(2, 2, 3)(3)(4, 2, 20, 1234)(5)(6)(7)(8, 10, 2, 8)(9)(10)());