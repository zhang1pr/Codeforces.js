// BIT
// Sort ladies in decreasing beauty and in decreasing compressed intellect rank
// Keep a max BIT of richness for each intellect rank
// Query BIT for max richness of ladies with lower intellect rank
// If any queried lady has more richness, current lady is a probable self-murderer

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].trim().split(' ').map(a => +a);
const readword = () => input[count++].trim().split(' ');

class BinaryIndexedTree { constructor(size) { this.size = size; this.array = Array(this.size + 1).fill(0); } add(position, value) { for (let i = position; i <= this.size; i += (i & -i)) { this.array[i] = Math.max(this.array[i], value); } return this; } query(position) { let max = 0; for (let i = position; i > 0; i -= (i & -i)) { max = Math.max(max, this.array[i]); } return max; } }

let [N] = readnum();
let arr = [];
for (let i = 1; i <= 3; i++)
  arr.push(readnum());
console.log(solve(N, arr));

function solve(N, arr) {
  let rank = 0, ans = 0;
  let ladyArr = Array(N);
  let bit = new BinaryIndexedTree(N);
  let BEAU = 0, INTEL = 1, RICH = 2, INTEL_ID = 3;

  for (let i = 0; i < N; i++)
    ladyArr[i] = Array(4), ladyArr[i][BEAU] = arr[0][i], ladyArr[i][INTEL] = arr[1][i], ladyArr[i][RICH] = arr[2][i];

  ladyArr.sort((a, b) => b[INTEL] - a[INTEL]);

  for (let i = 0; i < N; i++)
    if (i > 0 && ladyArr[i][INTEL] == ladyArr[i - 1][INTEL])
      ladyArr[i][INTEL_ID] = rank;
    else
      ladyArr[i][INTEL_ID] = ++rank;

  ladyArr.sort((a, b) => a[BEAU] == b[BEAU] ? b[INTEL_ID] - a[INTEL_ID] : b[BEAU] - a[BEAU]);

  for (let i = 0; i < N; i++) {
    if (bit.query(ladyArr[i][INTEL_ID] - 1) > ladyArr[i][RICH])
      ans++;

    bit.add(ladyArr[i][INTEL_ID], ladyArr[i][RICH]);
  }

  return ans;
}

// time:  O(n * log(n))
// space: O(n)