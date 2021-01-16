const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null)

const deepClone = obj => {
  if (obj.constructor === Date) 
  return new Date(obj)       // 日期对象直接返回一个新的日期对象
  if (obj.constructor === RegExp)
  return new RegExp(obj)
  const result = {};
  for (let key in obj) {
    const value = obj[key];
    if (typeof value === 'object') {
      result[key] = deepClone(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

const obj = {a: {b:1}};

const obj1 = deepClone(obj);

obj.a.b = 2;

console.log('obj', obj);
console.log('obj1', obj1);