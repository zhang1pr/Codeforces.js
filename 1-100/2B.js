// 2D DP
// DP[i][j]: the min number of factor (2 or 5) possible on a path from DP[0][0] to DP[i][j]

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].split(' ').map(a => +a);
const readword = () => input[count++].split(' ');

let [N] = readnum();
let arr = [];
for (let i = 1; i <= N; i++)
  arr.push(readnum());

let [num, path] = solve(N, arr);
console.log(num);
console.log(path);

function getFactorCount(num, factor) {
  let cnt=0;

  while (num > 0 && num % factor == 0) {
    num /= factor;
    cnt++;
  }

  return cnt;
}

function solve(N, arr) {
  function getDP(k) {
    const dp = [...Array(N)].map(() => []);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++)
        dp[i][j] = getFactorCount(arr[i][j], k);

    for (let i = 1; i < N; i++) {
      dp[i][0] += dp[i-1][0];
      dp[0][i] += dp[0][i-1];
    }

    for (let i = 1; i < N; i++)
      for (let j = 1; j < N; j++)
        dp[i][j] += Math.min(dp[i-1][j], dp[i][j-1]);
            
    return dp;
  }
 
  let [two, five] = [getDP(2), getDP(5)]
  let mat = two[N-1][N-1] < five[N-1][N-1] ? two : five;
  let res = mat[N-1][N-1];

  if (res > 1)
    for (let i = 1; i < N; i++)
      for (let j = 1; j < N; j++)
        if (arr[i][j] == 0)
          return [1, 'D'.repeat(i) + 'R'.repeat(N-1) + 'D'.repeat(N-1-i)];

  let path = '', i = N-1, j = N-1;
  while (i + j > 0) {
    let iLast = i == 0 ? Infinity : mat[i-1][j];
    let jLast = j == 0 ? Infinity : mat[i][j-1];

    if (iLast < jLast) {
      i--;
      path = 'D' + path;
    } else {
      j--;
      path = 'R' + path;
    }
  }
  
  return [res, path];
}

// time:  O(n^2)
// space: O(n^2)
