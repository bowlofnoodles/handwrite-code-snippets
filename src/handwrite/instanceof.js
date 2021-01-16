function instanceOf(target, origin) {
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