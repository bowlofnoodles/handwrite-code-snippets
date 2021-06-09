const axios = require('axios');
const host = 'http://localhost:627';


// 将异步操作表示的很简洁
function* gen() {
  const index = yield axios.get(host + '/');
  console.log('index', index.data);
  const user = yield axios.get(host + '/user');
  console.log('user', user.data);
};

// 执行流程管理不方便
const it = gen();
let result = it.next();

result.value.then(res => {
  it.next(res.data).value.then(res => {
    it.next(res);
  });
});

function promiseRunGen(gen) {
  const it = gen();
  function next(value) {
    let result = it.next(value);
    if (result.done) return result.value;
    result.value.then(res => {
      next(res);
    });
  }
  next();
}

promiseRunGen(gen);

const path = require('path');
const fs = require('fs');
const util = require('util');

const readFilePromisify = util.promisify(fs.readFile);

function* fileGen() {
  const r1 = yield readFilePromisify(path.join(__dirname, '../handwrite/promise.js'));
  console.log('r1', r1.toString());
  const r2 = yield readFilePromisify(path.join(__dirname, '../handwrite/instanceof.js'));
  console.log('r2', r2.toString());
}

promiseRunGen(fileGen);
