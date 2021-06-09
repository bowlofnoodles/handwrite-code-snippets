arr = [1, 2, 3];

const sleep = time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const sleepThunk = time => {
  return function (cb) {
    setTimeout(cb, time);
  };
};

async function asyncMain() {
  for (let i = 0; i < arr.length; i++) {
    await sleep(1000);
    console.log(arr[i]);
  }
}

function promiseMain() {
  arr.reduce((c, n) => {
    return c.then(() => {
      return sleep(1000).then(() => {
        console.log(n);
      });
    });
  }, Promise.resolve());
}

function* generatorPromiseMain() {
  for (let i = 0; i < arr.length; i++) {
    yield sleep(1000);
    console.log(arr[i]);
  }
}

function* generatorThunkMain() {
  for (let i = 0; i < arr.length; i++) {
    yield sleepThunk(1000);
    console.log(arr[i]);
  }
}

function runGenPromise(gen) {
  const it = gen();
  function next() {
    let result = it.next();
    if (result.done) return;
    result.value.then(res => {
      next(res);
    });
  }
  next();
}

function runGenThunk(gen) {
  const it = gen();
  function next() {
    let result = it.next();
    if (result.done) return;
    result.value(() => {
      next();
    });
  }
  next();
}

asyncMain(); // async await
promiseMain(); // reduce promise.then
runGenPromise(generatorPromiseMain); // generator + 简单的promise执行器
runGenThunk(generatorThunkMain); // thunk + 简单的thunk执行器
