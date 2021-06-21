const split = str => {
  return str.split('');
};

const reverse = arr => {
  return arr.reverse();
};

const join = arr => {
  return arr.join('');
};

const init = (a, b) => {
  return a + b;
};

// redux的compose
function compose(...funcs) {
  if (funcs.length === 0) return arg => arg;
  if (funcs.length === 1) return funcs[0];
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

// funcs.reduce((a, b) => (...args) => a(b(...args))) ==>
const func = (...args) => join(reverse(split(init(...args))));

const reverseStr = compose(join, reverse, split, init);

console.log('reverseStr', reverseStr('abc', 'def'));
console.log('reverseStr2', func('abc', 'def'));
