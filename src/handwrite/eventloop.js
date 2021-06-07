// async function async1 () {
//   console.log('async1 start')
//   await async2();
//   console.log('async1 end')
// }

function async1() {
  return new Promise(r => {
    console.log('async1 start');
    async2().then(res => {
      console.log('async1 end');
      r();
    });
  });
}

// async function async2 () {
//   console.log('async2')
// }

function async2() {
  return new Promise(r => {
    console.log('async2');
    r();
  });
}

console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0);

async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});

console.log('script end');

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
