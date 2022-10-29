// Mono Stack
// Let a max hill be the first and last in the circle and rearrange the middle hills
// Start with N - 1 neighbour pairs to the left
// Keep a min stack of height and count of contiguous hills to the left
// Add the count for pairs on the left (not neighbours) when current hill is larger than previous
// Add the count for pairs on the right to the last hill after all hills are visited

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

let count = 0;
const readnum = () => input[count++].split(' ').map(a => +a);
const readword = () => input[count++].split(' ');

let [N] = readnum();
let arr = readnum();
console.log(solve(N,arr));
 
function solve(N, arr) {
	let ans = N-1, max = 0, maxPos;
	let cnt = [];
	let stack = [];

	for (let i = 0; i < N; i++) {
		if (arr[i] > max) {
			maxPos = i; 
			max = arr[i];
		}
	}

	let narr = [...arr.slice(maxPos+1), ...arr.slice(0, maxPos)];
	
	for (let i = 0; i < N-1; i++) {
		while (stack.length > 0 && stack[stack.length-1] < narr[i]) {
			ans += cnt.pop();
			stack.pop();
		}

		if (stack.length == 0 || stack[stack.length-1] != narr[i]) {
			stack.push(narr[i]);
			cnt.push(0);
		}
		
		ans += cnt[cnt.length-1];
		cnt[cnt.length-1]++;
	}

	while (cnt.length > 1) {
		ans += cnt.pop();
	}

	return ans;
}

// time:  O(n)
// space: O(n)
