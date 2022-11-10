// 3D DP
// DP[i][j][k]: the number of hits taken to kill 1...i-2 archers
//   and leave i-1 and i archers with j and k hps left

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].split(' ').map(a => +a);
const readword = () => input[count++].split(' ');
 
let [N,A,B] = readnum();
let arr = readnum();

let [hits, str] = solve(N,A,B,arr);
console.log(hits);
console.log(str);   

function solve(N,A,B,arr) {
  for (let i=0; i<N; i++) 
    arr[i]++;

  let maxHP = Math.max(...arr);
  let dp = [...Array(N+1)].map(
    () => [...Array(maxHP+1)].map(
      () => Array(maxHP+1).fill(Infinity)
    ) 
  );

  let pre = dp.map(a=>a.map(b=>b.slice()));
  let next = dp.map(a=>a.map(b=>b.slice()));

  dp[2][arr[0]][arr[1]] = 0;

  for (let i = 2; i < N; i++) {
    for (let j = 0; j <= arr[i - 2]; j++) {
      for (let k = 0; k <= arr[i - 1]; k++) {
        if (dp[i][j][k] == Infinity) 
          continue;
        
        let min = Math.ceil(j / B);
        let max = Math.max(min, Math.ceil(k / A), Math.ceil(arr[i] / B));
        
        for (let hit = min; hit <= max; hit++) {
          let nj = Math.max(0, k - A * hit);
          let nk = Math.max(0, arr[i] - B * hit);

          if (dp[i + 1][nj][nk] > dp[i][j][k] + hit) {
            dp[i + 1][nj][nk] = dp[i][j][k] + hit;
            pre[i + 1][nj][nk] = j;
            next[i + 1][nj][nk] = k;
          }
        }
      }
    }
  }

  let res = [], j=0, k=0;
  for (let i=N; i>=3; i--) {
    let nj = pre[i][j][k], nk = next[i][j][k];
    let hit = dp[i][j][k] - dp[i - 1][nj][nk];
    j = nj;
    k = nk;

    while (hit > 0) {
      hit--;
      res.push(i-1);
    }
  }

  return [dp[N][0][0], res.reverse().join(' ')];
}

// time:  O(n * maxHP^3)
// space: O(n * maxHP^2)
