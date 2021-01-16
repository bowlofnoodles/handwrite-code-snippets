
// 三数之和
const findThreeSum = (arr, target) => {
  const result = [];
  const nums = arr.sort((a, b) => a - b);
  for (let i = 0; i <= nums.length - 1; i ++) {
    if (i && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[left] + nums[right] + nums[i];
      if (sum < target) {
        left ++;
      } else if (sum > target) {
        right --;
      } else {
        result.push([nums[i], nums[left ++], nums[right --]]);
        while (nums[left] === nums[left - 1]) {
          left ++;
        }
        while (nums[right] === nums[right + 1]) {
          right ++;
        }
      }
    }
  }
  return result;
}

console.log('findThreeSum', findThreeSum([-1, 0, 1, 2, -1, -4], 0))

// 反转链表
var reverseList = function (head) {
  let currentNode = null;
  let headNode = head;
  while (head && head.next) {
    currentNode = head.next;
    head.next = currentNode.next;
    currentNode.next = headNode;
    headNode = currentNode;
  }
  return headNode;
};