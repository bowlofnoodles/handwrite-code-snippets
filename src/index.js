// 1. flatten扁平化
const arr = [1, [2], [3, [4]], [5, [6, [7, 8, [9, 10]]]]];

const flatten = arr => arr.reduce(
  (c, n) => Array.isArray(n) ? c.concat(flatten(n)) : c.concat(n),
  []
);

console.log('result', flatten(arr));



// 3.去重
const duplicates = [1, 2, 2, 3, 3, 4, 4, 1, 4, 5, 6, 6, 3, 2];

const unique1 = arr => Array.from(new Set(arr));
const unique2 = arr => arr.reduce((c, n) => c.includes(n) ? c : [...c, n], []);
const unique3 = arr => Array.from(arr.reduce((c, n) => c.set(n, true), new Map()).keys());
// const unique4 = arr => Object.keys(arr.reduce((c, n) => ({...c, [n]: true}), {})); // 会变成字符串

console.log('unique1', unique1(duplicates));
console.log('unique2', unique2(duplicates));
console.log('unique3', unique3(duplicates));
// console.log('unique4', unique4(duplicates));

// 4.参照ramda lodash fromParis用法
const fromPairsTest = [['fred', 30], ['barney', 40]];
const fromPairs = arr => arr.reduce((c, n) => ({...c, [n[0]]: n[1]}), {});

console.log('fromPairs', fromPairs(fromPairsTest));

// 5.参照ramda groupBy 按照给定回调函数对数组分组
const groupBy = (arr, cb) => arr.reduce((c, n, index) => {
  const cbValue = cb(n, index, arr);
  const cbGroup = c[cbValue];
  return {...c, [cbValue]: cbGroup ? [...cbGroup, n] : [n]};
}, {});

console.log('groupBy', groupBy(
  [{name: 'Abby', score: 84}, {name: 'Eddy', score: 58}, {name: 'Jack', score: 69}],
  student => {
    const { score } = student;
    return score < 65 ? 'F' :
      score < 70 ? 'D' :
      score < 80 ? 'C' :
      score < 90 ? 'B' : 'A';
  }
));

const biggestTest = [1, 2, 5, 4, 5, 10, Infinity];

const biggest = arr => arr.reduce((c, n) => c <= n ? n : c, arr[0]);

console.log('biggestTest', biggest(biggestTest));

const curryAdd = (...args) => {
  const addSum = (arr, init) => arr.reduce((c, n) => c + n, init);
  let sum = addSum(args, 0);
  const x = (...b) => {if (!b || !b.length) return sum; sum = addSum(b, sum); return x};
  return x;
}

console.log('add', curryAdd(1, 2, 3)(2, 2, 3)(3)(4, 2, 20, 1234)(5)(6)(7)(8, 10, 2, 8)(9)(10)());


// nums = [2, 7, 11, 15], target = 9
// [0, 1]
const findSumIndex = (nums, target) => {
  const map = {};
  if (Array.isArray(nums)) {
    for (let index = 0; index < nums.length; index++) {
      if (map[target - nums[index]] !== undefined) {
        return [map[target - nums[index]], index];
      } else {
        map[nums[index]] = index
      }
    }
  }
}

console.log('findSumIndex', findSumIndex([2, 7, 11, 15], 9));
