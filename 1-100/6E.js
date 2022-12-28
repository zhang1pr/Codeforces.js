// Mono Queue, Sliding Window
// Keep a sliding window of books, a max queue and a min queue
// Enqueue a book and keep dequeueing until max - min <= K

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].split(' ').map(a => +a);
const readword = () => input[count++].split(' ');

class Node{constructor(l,s=null,t=null){this.val=l,this.next=s,this.prev=t}}
class Deque{constructor(){this.head=null,this.tail=null}isEmpty(){return null==this.head}enqueue(t){let i=new Node(t,null,this.tail);return this.head?(this.tail.next=i,this.tail=i):(this.head=i,this.tail=i),this}dequeue(){if(!this.head)return null;let t=this.head;return this.head===this.tail?(this.head=null,this.tail=null):(this.head=this.head.next,this.head.prev=null),t.val}addHead(t){let i=new ListNode(t,this.head,null);return this.tail?(this.head.prev=i,this.head=i):(this.tail=i,this.head=i),this}deleteTail(){if(!this.tail)return null;let t=this.tail;return this.head===this.tail?(this.head=null,this.tail=null):(this.tail=this.tail.prev,this.tail.next=null),t.val}peekTail(){return this.tail?this.tail.val:null}peekHead(){return this.head?this.head.val:null}}
class MaxQueue{constructor(){this.deque=new Deque}enqueue(e){let u=1;for(;!this.deque.isEmpty()&&e>this.deque.peekTail()[0];){let t=this.deque.deleteTail();u+=t[1]}this.deque.enqueue([e,u])}dequeue(){if(this.deque.isEmpty())return null;this.deque.peekHead()[1]--,0==this.deque.peekHead()[1]&&this.deque.dequeue()}isEmpty(){return this.deque.isEmpty()}peek(){return this.deque.isEmpty()?0:this.deque.peekHead()[0]}}
class MinQueue{constructor(){this.deque=new Deque}enqueue(e){let u=1;for(;!this.deque.isEmpty()&&e<this.deque.peekTail()[0];){let t=this.deque.deleteTail();u+=t[1]}this.deque.enqueue([e,u])}dequeue(){if(this.deque.isEmpty())return null;this.deque.peekHead()[1]--,0==this.deque.peekHead()[1]&&this.deque.dequeue()}isEmpty(){return this.deque.isEmpty()}peek(){return this.deque.isEmpty()?0:this.deque.peekHead()[0]}}

let [N,K] = readnum();
let arr = readnum();
for (let str of solve(N,K,arr))
  console.log(str);
 
function solve(N,K,arr) {
  let max = 0, left = 0, period = [];
  let maxQueue = new MaxQueue(), minQueue = new MinQueue();

  for (let right = 0; right < arr.length; right++) {
    while (left < right && (arr[right] - minQueue.peek() > K || maxQueue.peek() - arr[right] > K)) {
      minQueue.dequeue();
      maxQueue.dequeue();
      
      left++;
    }

    minQueue.enqueue(arr[right]);
    maxQueue.enqueue(arr[right]);
    
    let len = right - left + 1;
    let indices = (left+1)+' '+(right+1);
    
    if (len == max) {
      period.push(indices);
    } else if (len > max) {
      max = len;
      period = [indices];
    }
  }
 
  return [max+' '+period.length, ...period];
}

// time:  O(n)
// space: O(n)
