const arr = [1, 2, 3];

// arr.reduce((c, n) => {
//   return c.then(() => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         console.log(n);
//         resolve();
//       }, 1000);
//     });
//   });
// }, Promise.resolve());

arr.reduce((c, n) => {
  return c.then(
    new Promise(resolve => {
      setTimeout(() => {
        console.log(n);
        resolve();
      }, 2000);
    })
  );
  // setTimeout(() => {
  //   console.log(n);
  // }, 2000);
}, Promise.resolve());
