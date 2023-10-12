// Heap
// Take '?' as ')'
// Keep a min heap of lCost - rCost as the upcoming cost changing ')' to '(' 
// Poll the min from heap when no '(' can match the current ')' and change ')' to '('

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

class Heap { constructor() { this.array = []; } peek() { if (this.array.length === 0) { return null; } return this.array[0]; } poll() { if (this.array.length === 0) { return null; } if (this.array.length === 1) { return this.array.pop(); } const item = this.array[0]; this.array[0] = this.array.pop(); this.heapifyDown(0); return item; } add(item) { this.array.push(item); this.heapifyUp(this.array.length - 1); return this; } isEmpty() { return this.size() == 0; } size() { return this.array.length; } heapifyUp(childIndex) { let parentIndex = Math.floor((childIndex - 1) / 2); while (parentIndex >= 0 && !this.checkInvariant(this.array[parentIndex], this.array[childIndex])) { [this.array[parentIndex], this.array[childIndex]] = [this.array[childIndex], this.array[parentIndex]]; childIndex = parentIndex; parentIndex = Math.floor((parentIndex - 1) / 2); } } heapifyDown(parentIndex) { let childIndex1 = parentIndex * 2 + 1; let childIndex2 = parentIndex * 2 + 2; let nextIndex; while (childIndex1 < this.array.length) { if (childIndex2 < this.array.length && this.checkInvariant(this.array[childIndex2], this.array[childIndex1])) { nextIndex = childIndex2; } else { nextIndex = childIndex1; } if (this.checkInvariant(this.array[parentIndex], this.array[nextIndex])) { break; } [this.array[parentIndex], this.array[nextIndex]] = [this.array[nextIndex], this.array[parentIndex]]; parentIndex = nextIndex; childIndex1 = nextIndex * 2 + 1; childIndex2 = nextIndex * 2 + 2; } } checkInvariant(a, b) { return a[0] <= b[0]; } }

let count = 0;
const readnum = () => input[count++].split(' ').map(a => +a);
const readword = () => input[count++].split(' ');

let [str] = readword();
let arr = [];

for (let ch of str)
  if (ch == '?')
    arr.push(readnum());

let [cost, sequence] = solve(str, arr);

console.log(cost);
if (cost != -1)
  console.log(sequence);

function solve(str, arr) {
  let res = 0, parenArr = [...str], balance = 0, qCnt = 0, h = new Heap();

  for (let i = 0; i < parenArr.length; i++) {
    let ch = parenArr[i];

    if (ch == '?') {
      parenArr[i] = ')';
      let [lCost, rCost] = arr[qCnt];
      qCnt++;
      res += rCost;
      h.add([lCost - rCost, i]);
    }

    if (balance == 0 && parenArr[i] == ')') {
      if (h.isEmpty())
        return [-1];

      let [cost, idx] = h.poll();
      parenArr[idx] = '(';
      balance += 2;
      res += cost;
    }

    balance += ch == '(' ? 1 : -1;
  }

  if (balance != 0)
    return [-1];

  return [res, parenArr.join('')];
}

// time:  O(nlog(n))
// space: O(n)
