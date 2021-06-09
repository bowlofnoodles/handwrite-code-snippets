const thunkify = require('thunkify');
const fs = require('fs');
const path = require('path');
const readFileThunk = thunkify(fs.readFile);

function* thunkGen() {
  const r1 = yield readFileThunk(path.join(__dirname, '../handwrite/promise.js'));
  console.log('r1', r1.toString());
  const r2 = yield readFileThunk(path.join(__dirname, '../handwrite/instanceof.js'));
  console.log('r2', r2.toString());
}

// 一步一步手写
const it2 = thunkGen();
let result2 = it2.next();
result2.value((err, data) => {
  if (err) throw err;
  it2.next(data).value((err, data) => {
    if (err) throw err;
    it2.next(data);
  });
});

function thunkRunGen(gen) {
  const it = gen();
  function next(err, data) {
    if (err) throw err;
    let result = it.next(data);
    if (result.done) return;
    result.value(next);
  }
  next();
}

thunkRunGen(thunkGen);
