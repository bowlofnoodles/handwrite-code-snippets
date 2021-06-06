function co(gen) {
  const ctx = this;
  const args = Array.prototype.slice.call(arguments, 1);

  return new Promise((resolve, reject) => {
    if (typeof gen === 'function') {
      gen = gen.apply(ctx, args);
    }
    if (!gen || typeof gen.next !== 'function') {
      return resolve(gen);
    }

    next();
    let ret = { done: false };

    function next() {
      
    }

  });
}


co(function* () {
  const result = yield Promise.resolve(true);
  return result;
}).then(res => {
  console.log('result', res);
})