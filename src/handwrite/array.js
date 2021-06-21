Array.prototype.reduce = function(cb, init) {
  if (typeof cb !== 'function') throw new TypeError(`${cb} is not a function`);
  const hasInit = arguments.length >= 2;
  if (this.length <= 0) {
    if (!hasInit) {
      throw new TypeError('reduce of empty array with no initial value'); 
    } else {
      return init;
    }
  }
  init = hasInit ? init : this[0];
  for (let i = hasInit ? 0 : 1; i < this.length; i ++) {
    init = cb(init, this[i], i, this);
  }
  return init;
}

Array.prototype.filter = function(cb, thisArg) {
  if (typeof cb !== 'function') throw new TypeError(`${cb} is not a function`);
  return this.reduce((c, n, i) => cb(n, i, this) ? c.concat(n) : c, []);
}

Array.prototype.map = function(cb, thisArg) {
  if (typeof cb !== 'function') throw new TypeError(`${cb} is not a function`);
  return this.reduce((c, n, i) => c.concat(cb.call(thisArg, n, i, this)), []);
}

Array.prototype.find = function(cb, thisArg) {
  if (typeof cb !== 'function') throw new TypeError(`${cb} is not a function`);
  return this.reduce((c, n, i) => (cb.call(thisArg, n, i, this) && c === undefined) ? n : c, undefined);
}

Array.prototype.findIndex = function(cb, thisArg) {
  if (typeof cb !== 'function') throw new TypeError(`${cb} is not a function`);
  return this.reduce((c, n, i) => (cb.call(thisArg, n, i, this) && c === -1) ? i : c, -1);
}

Array.prototype.some = function(cb) {
  if (typeof cb !== 'function') throw new TypeError(`${cb} is not a function`);
  return this.reduce((c, n, i) => cb.call(thisArg, n, i, this) ? true : c, false);
}

Array.prototype.every = function(cb) {
  if (typeof cb !== 'function') throw new TypeError(`${cb} is not a function`);
  return this.reduce((c, n, i) => cb.call(thisArg, n, i, this) && c, true);
}
