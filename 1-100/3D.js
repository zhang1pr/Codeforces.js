// Heap
// Take '?' as ')'
// Keep a min heap of lCost - rCost turning ')' into '(' 
// Poll the min when no '(' can match the current ')' and turn '(' into ')'

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);
class Heap{constructor(){this.array=[]}peek(){return 0===this.array.length?null:this.array[0]}poll(){if(0===this.array.length)return null;if(1===this.array.length)return this.array.pop();let r=this.array[0];return this.array[0]=this.array.pop(),this.heapifyDown(0),r}add(r){return this.array.push(r),this.heapifyUp(this.array.length-1),this}isEmpty(){return 0==this.array.length}heapifyUp(r){let a=Math.floor((r-1)/2);for(;a>=0&&!this.checkInvariant(this.array[a],this.array[r]);)[this.array[a],this.array[r]]=[this.array[r],this.array[a]],r=a,a=Math.floor((a-1)/2)}heapifyDown(r){let a=2*r+1,t=2*r+2,h;for(;a<this.array.length&&(h=t<this.array.length&&this.checkInvariant(this.array[t],this.array[a])?t:a,!this.checkInvariant(this.array[r],this.array[h]));)[this.array[r],this.array[h]]=[this.array[h],this.array[r]],r=h,a=2*h+1,t=2*h+2}checkInvariant(r,a){return r[0]<=a[0]}}

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
  let res = 0, arr = [...str], balance = 0, qCnt = 0, h = new Heap();
  
  for (let i = 0; i < arr.length; i++) {
    let ch = arr[i];
 
    if (ch == '?') {
			arr[i] = ')';
      let [lCost, rCost] = arr[qCnt];
      qCnt++;
			res += rCost;
      h.add([lCost - rCost, i]);
		}

		if (balance == 0 && arr[i] == ')') {
			if (h.isEmpty()) 
        return [-1];

			let [cost, idx] = h.poll();
			arr[idx] = '(';
			balance += 2;
			res += cost;
		}
		
    balance += ch == '(' ? 1 : -1;
  }

  if (balance != 0) 
    return [-1];

  return [res, arr.join('')];
}

// time:  O(nlog(n))
// space: O(n)
