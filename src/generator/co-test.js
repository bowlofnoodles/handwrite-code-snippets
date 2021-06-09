const fs = require('fs');
const path = require('path');
const co = require('co');
const thunkify = require('thunkify');
const axios = require('axios');
const myCo = require('./co');

const host = 'http://localhost:627';

function readFilePromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};
function* gen() {
  const r1 = yield readFilePromise(path.join(__dirname, '../handwrite/promise.js'));
  console.log('r1', r1.toString());
  const r2 = yield readFilePromise(path.join(__dirname, '../handwrite/instanceof.js'));
  console.log('r2', r2.toString());
  return 'done';
};


const readFileThunk = thunkify(fs.readFile);

function* thunkGen() {
  const r1 = yield readFileThunk(path.join(__dirname, '../handwrite/promise.js'));
  console.log('r1', r1.toString());
  const r2 = yield readFileThunk(path.join(__dirname, '../handwrite/instanceof.js'));
  console.log('r2', r2.toString());
  return 'done';
};

function* apiGen(userUrl) {
  const user = yield axios.get(host + userUrl);
  console.log('user', user.data);
  const index = yield axios.get(host + '/');
  console.log('index', index.data);
  return 'done';
};

myCo(apiGen, '/user').then(res => {
  console.log('res', res);
});