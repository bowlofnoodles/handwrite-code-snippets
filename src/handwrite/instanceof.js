// instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
const isObject = target => typeof target === 'object' && target !== 'null';
const isFunction = target => typeof target === 'function';
function instanceOf(target, origin) {
  if (!(isObject || isFunction)) return false;
  if (!target.__proto__) return false;
  while(target.__proto__) {
    const proto = target.__proto__;
    if (proto === origin.prototype) return true;
    target = target.__proto__;
  }
  return false;
};

// 有缺陷 基本类型时有问题
a = 1;
a instanceof Object; // false
instanceOf(a, Object); // true