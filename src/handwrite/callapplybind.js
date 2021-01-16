import getLog from '../log/index';

const log = getLog('callapplybind');
Function.prototype.myCall = function(ctx = window, ...args) {
  ctx = ctx || window;
  const fn = Symbol();
  ctx[fn] = this;
  const result = ctx[fn](...args);
  delete ctx[fn];
  return result;
}

Function.prototype.myApply = function(ctx = window, args) {
  ctx = ctx || window;
  const fn = Symbol();
  ctx[fn] = this;
  let result;
  if (Array.isArray(args)) {
    result = ctx[fn](...args);
  } else {
    result = ctx[fn]();
  }
  delete ctx[fn];
  return result;
}

Function.prototype.myBind = function(ctx = window, ...args1) {
  ctx = ctx || window;
  const _this = this;
  return function F(...args2) {
    if (this instanceof F) {
      return new _this(...args1, ...args2);
    }
    const result = _this.call(...args1, ...args2);
    return result;
  }
}

function test(b, c) {
  console.log('a', this.a);
  console.log('b', b);
  console.log('c', c);
}

window.a = 1;
const obj = {a: 2};

const test1 = test.myBind(obj, '1', '3');

log('myCall', test.myCall());
log('myCall', test.myCall(obj));
log('myCall', test.myCall(obj, 'bb', 'cc'));
log('myApply', test.myApply());
log('myApply', test.myApply(obj));
log('myApply', test.myApply(obj, ['bb', 'cc']));
log('myBind', test1('2'));
log('myBind', new test1('2'));