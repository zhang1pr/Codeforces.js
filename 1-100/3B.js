// Two Pointers
// Keep 1 pointer on sorted kayak and the other on sorted catamaran
// Compare 2 kayaks and 1 catamaran and take the larger side

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].split(' ').map(a => +a);
const readword = () => input[count++].split(' ');

let [N, V] = readnum();
let arr = [];
for (let i = 1; i <= N; i++)
  arr.push(readnum());

let [capacity, vehicle] = solve(arr, V);
console.log(capacity);
console.log(vehicle);

function solve(arr, V) {
  let kayak = [], catamaran = [], res = [], capacity = 0;
  for (let i = 0; i < arr.length; i++)
    arr[i].push(i + 1);

  for (let item of arr)
    if (item[0] == 1)
      kayak.push(item);
    else
      catamaran.push(item);

  let f = (a, b) => b[1] - a[1];
  kayak.sort(f);
  catamaran.sort(f);

  let i = 0, j = 0;
  if (V % 2 == 1 && kayak.length > 0) {
    capacity += kayak[0][1];
    res.push(kayak[0][2]);
    i++;
    V--;
  }

  while (V >= 2 && (i < kayak.length - 1 || j < catamaran.length)) {
    V -= 2;
    let kayakWeight = i >= kayak.length - 1 ? -Infinity : kayak[i][1] + kayak[i + 1][1];
    let catamaranWeight = j == catamaran.length ? -Infinity : catamaran[j][1];

    if (kayakWeight <= catamaranWeight) {
      capacity += catamaranWeight;
      res.push(catamaran[j][2]);
      j++;
    } else {
      capacity += kayakWeight;
      res.push(kayak[i][2]);
      res.push(kayak[i + 1][2]);
      i += 2;
    }
  }

  if (V > 0 && i < kayak.length) {
    capacity += kayak[i][1];
    res.push(kayak[i][2]);
  }

  return [capacity, res.join(' ')];
}

// time:  O(nlog(n))
// space: O(n)
