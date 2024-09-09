// Monotonic Queue, Two Pointers
// Keep a sliding window of books, a max queue and a min queue
// Enqueue a book and keep dequeueing until max - min <= K

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].split(' ').map(a => +a);
const readword = () => input[count++].split(' ');

class ListNode { constructor(val, next = null, prev = null) { this.val = val; this.next = next; this.prev = prev; } }
class Deque { constructor() { this.head = null; this.tail = null; } isEmpty() { return this.head == null; } enqueue(val) { const newNode = new ListNode(val, null, this.tail); if (!this.head) { this.head = newNode; this.tail = newNode; } else { this.tail.next = newNode; this.tail = newNode; } return this; } dequeue() { if (!this.head) { return null; } const deletedHead = this.head; if (this.head === this.tail) { this.head = null; this.tail = null; } else { this.head = this.head.next; this.head.prev = null; } return deletedHead.val; } addHead(val) { const newNode = new ListNode(val, this.head, null); if (!this.tail) { this.tail = newNode; this.head = newNode; } else { this.head.prev = newNode; this.head = newNode; } return this; } deleteTail() { if (!this.tail) { return null; } const deletedTail = this.tail; if (this.head === this.tail) { this.head = null; this.tail = null; } else { this.tail = this.tail.prev; this.tail.next = null; } return deletedTail.val; } peekTail() { return this.tail ? this.tail.val : null; } peekHead() { return this.head ? this.head.val : null; } }
class MaxQueue { constructor() { this.deque = new Deque(); } enqueue(val) { let count = 1; while (!this.deque.isEmpty() && val > this.deque.peekTail()[0]) { const item = this.deque.deleteTail(); count += item[1]; } this.deque.enqueue([val, count]); } dequeue() { if (this.deque.isEmpty()) return null; this.deque.peekHead()[1]--; if (this.deque.peekHead()[1] == 0) { this.deque.dequeue(); } } isEmpty() { return this.deque.isEmpty(); } peek() { return !this.deque.isEmpty() ? this.deque.peekHead()[0] : null; } }
class MinQueue { constructor() { this.deque = new Deque(); } enqueue(val) { let count = 1; while (!this.deque.isEmpty() && val < this.deque.peekTail()[0]) { const item = this.deque.deleteTail(); count += item[1]; } this.deque.enqueue([val, count]); } dequeue() { if (this.deque.isEmpty()) return null; this.deque.peekHead()[1]--; if (this.deque.peekHead()[1] == 0) { this.deque.dequeue(); } } isEmpty() { return this.deque.isEmpty(); } peek() { return !this.deque.isEmpty() ? this.deque.peekHead()[0] : null; } }

let [N, K] = readnum();
let arr = readnum();
for (let str of solve(N, K, arr))
  console.log(str);

function solve(N, K, arr) {
  let max = 0, left = 0, period = [];
  let maxQueue = new MaxQueue(), minQueue = new MinQueue();

  for (let right = 0; right < arr.length; right++) {
    minQueue.enqueue(arr[right]);
    maxQueue.enqueue(arr[right]);

    while (maxQueue.peek() - minQueue.peek() > K) {
      minQueue.dequeue();
      maxQueue.dequeue();
      left++;
    }

    let len = right - left + 1;
    let indices = (left + 1) + ' ' + (right + 1);

    if (len == max) {
      period.push(indices);
    } else if (len > max) {
      max = len;
      period = [indices];
    }
  }

  return [max + ' ' + period.length, ...period];
}

// time:  O(n)
// space: O(n)