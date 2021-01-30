/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  if (head.next === null) return head;
  let resultHead = head;
  let cur;
  while(head !== null) {
    cur = head.next;
    head.next = resultHead;
    resultHead = head;
    head = cur;
  }
  return resultHead;
};

function ListNode(val) {
  this.val = val;
  this.next = null;
}

const generate = list => {
  let head = new ListNode(list[0]);
  list.reduce((c, n) => {
    c.next = n ? new ListNode(n) : null;
    return c.next;
  }, head);
  return head;
}

const list = generate([1, 2, 3, 4, 5]);
const result = reverseList(list);
console.log(result);
