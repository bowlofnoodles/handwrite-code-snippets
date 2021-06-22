function curry(fn, ...args) {
  if (args.length >= fn.length) {
    return fn(...args);
  }
  return (...args2) => curry(fn, ...args, ...args2);
}

function add(a, b, c) {
  return a + b + c;
}

const curryAdd = curry(add, 1);

console.log(curryAdd(1)(100), curryAdd(1, 10));

function addNotEnd(...args) {
  return args.reduce((c, n) => c + n, 0);
}

function curryNotEnd(fn, ...args) {
  // 返回一个函数
  return (...args2) => {
    // 如果不传参数 则执行函数计算结果
    if (args2.length === 0) {
      return fn(...args);
    } else {
      return curryNotEnd(fn, ...args, ...args2);
    }
  };
}

const curryNotEndAdd = curryNotEnd(addNotEnd);

console.log(curryNotEndAdd(1, 2, 3)(2, 4)(4)(10)()); // 26

function curryNotEndAnother(fn, ...args) {
  const x = (...args2) => {
    // 拼接参数，以便toString能够拿到
    args.push(...args2);
    // 如果不传参数 则执行函数计算结果
    return curryNotEndAnother(fn, ...args);
  };
  x.toString = function () {
    return fn(...args);
  };
  return x;
}

const curryNotEndAddAnother = curryNotEndAnother(addNotEnd);

console.log(curryNotEndAddAnother(1, 2, 3)(2, 4)(4)(10) + 10); // 26
