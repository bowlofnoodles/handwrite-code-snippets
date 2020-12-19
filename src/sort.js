// 冒泡排序
const bubbleSort = (arr) => {
  for (i = 0; i <= arr.length - 1; i++) {
    for (j = 0; j <= arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
};

// 优化 提前结束循环
const bubbleSort1 = (arr) => {
  for (i = 0; i <= arr.length - 1; i++) {
    let complete = true;
    for (j = 0; j <= arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        complete = false;
      }
    }
    // 如果在单次找某个最大数值中没有发生交换 则认为已经排序完成 可以提前跳出循环了
    // em: [1, 2, 5, 3, 4, 6, 7] 
    // 第一次循环时 找到7为最大的数之后 数组已经是 [1, 2, 3, 4, 5, 6, 7]
    // 进入找第二大的冒泡过程中不存在交换值产生，所以可以直接break了
    if (complete) {
      break;
    }
  }
  return arr;
};

// 时间 on2
// 空间 o1
// 稳定性 稳定

console.log('bubbleSort', bubbleSort([12, 12, 3, 2, -1, 134, 123, 4, 2, 3]));

const selectSort = arr => {
  for (let i = 0; i <= arr.length - 1; i ++) {
    let min = i;
    for (let j = i + 1;  j <= arr.length - 1; j ++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    if (i !== min) {
      let temp = arr[i];
      arr[i] = arr[min]
      arr[min] = temp;
    }
  }
  return arr;
}

console.log('selectSort', selectSort([12, 12, 3, 2, -1, 134, 123, 4, 2, 3]));

const chaSort = arr => {

}

console.log('chaSort', chaSort([12, 12, 3, 2, -1, 134, 123, 4, 2, 3]));
