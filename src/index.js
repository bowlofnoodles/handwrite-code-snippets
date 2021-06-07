import axios from 'axios';

axios.get('http://127.0.0.1:627').then(res => {
  console.log('res,', res.data);
});

Object.prototype[Symbol.iterator] = function* () {
  const ctx = this;
  const keys = Object.keys(ctx);
  for (let i = 0; i < keys.length; i ++) {
    yield [keys[i], ctx[keys[i]]];
  }
};

const obj = {a: 1, b: 2};

for (let [key, value] of obj) {
  console.log('key', key, 'value', value);
}

// a 1
// b 2

const arr = [1, 2, 3];

arr.reduce((c, n) => {
  return c.then(() => {
    return new Promise(r => {
      setTimeout(() => {
        console.log(n);
        r();
      }, 1000);
    });
  })
}, Promise.resolve())