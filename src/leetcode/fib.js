function Fib(n) {
  if (n < 2) return 1;
  return Fib(n - 1) + Fib(n - 2);
}
// 尾递归优化
'use strict'
function Fib(n, n1 = 1, n2 = 1) {
  if (n <= 1) {
    return n2;
  }
  return Fib(n - 1, n2, n1 + n2)
}

function Fib(n) {
  let a = 0; // n - 2
  let b = 1; // n - 1
  let temp;
  while(n > 0) {
    temp = a + b;
    a = b;
    b = temp;
    n--;
  }
  return a;
}