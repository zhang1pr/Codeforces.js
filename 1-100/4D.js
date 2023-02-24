// Binary Search
// Sort the envelopes in increasing W and decreasing H
// Keep piles of smallest H for length of increasing subsequence
// Binary search and update the first H bigger than or equal to current H

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].split(' ').map(a => +a);
const readword = () => input[count++].split(' ');

let [N, W, H] = readnum();
let arr = [];
for (let i = 1; i <= N; i++)
  arr.push(readnum());

let [len, indices] = solve(N, W, H, arr);
console.log(len);
if (len > 0)
  console.log(indices);

function bisectLeft(x, piles, len) {
  let l = 1, r = len;

  while (l < r) {
    let mid = Math.floor((l + r) / 2);

    if (piles[mid] >= x)
      r = mid;
    else
      l = mid + 1;
  }

  return l;
}

function solve(N, W, H, arr) {
  let piles = Array(N + 1).fill(0);
  let par = Array(N).fill(-1);
  let idx = Array(N).fill(-1);
  let len = 1;

  arr = arr.map((a, id) => [...a, id + 1])
    .filter(([w, h]) => w > W && h > H)
    .sort(([w1, h1], [w2, h2]) => w1 == w2 ? h2 - h1 : w1 - w2);

  if (arr.length == 0)
    return [0];

  piles[len] = arr[0][1];
  idx[len] = 0;

  for (let i = 1; i < arr.length; i++) {
    let pos;

    if (piles[len] < arr[i][1]) {
      len++;
      pos = len;
    } else {
      pos = bisectLeft(arr[i][1], piles, len);
    }

    piles[pos] = arr[i][1];
    idx[pos] = i;

    par[i] = idx[pos - 1];
  }

  let res = [], curIdx = idx[len];
  while (curIdx != -1) {
    res.push(arr[curIdx][2]);
    curIdx = par[curIdx];
  }

  return [len, res.reverse().join(' ')];
}

// time:  O(nlog(n))
// space: O(n)
