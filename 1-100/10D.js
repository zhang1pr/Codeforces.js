// 2D DP
// DP[i][j]: the length of the longest common increasing subsequence
//           from 1...i and 1...j with sequence B ending at B[j]
// keep the j of the longest common increasing subsequence with B[j] < A[i]

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].trim().split(' ').map(a => +a);
const readword = () => input[count++].trim().split(' ');

let [N] = readnum();
let A = readnum();
let [M] = readnum();
let B = readnum();
console.log(solve(N, A, M, B));

function solve(N, A, M, B) {
  let len = Math.max(N, M);
  let dp = Array(len).fill(0);
  let pre = Array(len).fill(-1);
  let res = [];

  for (let i = 0; i < N; i++) {
    let lastPos = -1;

    for (let j = 0; j < M; j++) {
      if (A[i] == B[j]) {
        dp[j] = lastPos == -1 ? 1 : dp[lastPos] + 1;
        pre[j] = lastPos;
      }

      if (A[i] > B[j] && (lastPos == -1 || dp[j] > dp[lastPos]))
        lastPos = j;
    }
  }

  let maxLength = -1, endIdx;
  for (let i = 0; i < M; i++)
    if (dp[i] > maxLength) {
      maxLength = dp[i];
      endIdx = i;
    }

  for (let i = maxLength - 1; i >= 0; i--) {
    res.push(B[endIdx]);
    endIdx = pre[endIdx];
  }

  return maxLength + '\n' + res.reverse().join(' ');
}

// time:  O(m * n)
// space: O(max(m, n))