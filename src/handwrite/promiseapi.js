Promise.myAll = promises => {
  let count = 0;
  const res = [];
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      Promise.resolve(promise)
        .then(data => {
          res[i] = data;
          count++;
          if (count >= promises.length) {
            return resolve(res);
          }
        })
        .catch(err => {
          return reject(err);
        });
    }
  });
};

var promise1 = Promise.resolve(3);
var promise2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});
var promise3 = 42;

Promise.myAll([promise1, promise2, promise3]).then(function (values) {
  console.log('values', values);
});
