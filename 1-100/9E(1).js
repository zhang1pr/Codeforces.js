// DFS, Heap
// Use DFS to Detect any cycle and check if the graph is already a cycle
// If no cycle is found, use DFS to find the component end vertices
// Keep a min heap of vertex pairs and connect first min with second min

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);
class Heap { constructor() { this.array = [] } peek() { return 0 === this.array.length ? null : this.array[0] } poll() { if (0 === this.array.length) return null; if (1 === this.array.length) return this.array.pop(); let r = this.array[0]; return this.array[0] = this.array.pop(), this.heapifyDown(0), r } add(r) { return this.array.push(r), this.heapifyUp(this.array.length - 1), this } isEmpty() { return 0 == this.size() } size() { return this.array.length } heapifyUp(r) { let a = Math.floor((r - 1) / 2); for (; a >= 0 && !this.checkInvariant(this.array[a], this.array[r]);) [this.array[a], this.array[r]] = [this.array[r], this.array[a]], r = a, a = Math.floor((a - 1) / 2) } heapifyDown(r) { let a = 2 * r + 1, t = 2 * r + 2, h; for (; a < this.array.length && (h = t < this.array.length && this.checkInvariant(this.array[t], this.array[a]) ? t : a, !this.checkInvariant(this.array[r], this.array[h]));) [this.array[r], this.array[h]] = [this.array[h], this.array[r]], r = h, a = 2 * h + 1, t = 2 * h + 2 } checkInvariant(r, a) { return r[0] <= a[0] } }

let count = 0;
const readnum = () => input[count++].trim().split(' ').map(A => +A);
const readword = () => input[count++].trim().split(' ');

let [N, M] = readnum();
let arr = [];
for (let i = 1; i <= M; i++)
  arr.push(readnum());

let [res, edges] = solve(N, M, arr);
console.log(res);
if (res == 'YES') {
  console.log(edges.length);
  for (let pair of edges)
    console.log(pair.join(' '));
}

function isCycle(graph) {
  let start = 0, node = 0, prev = -1, cnt = 0;

  while (cnt == 0 || start != node) {
    cnt++;

    if (graph[node].length < 2)
      return false;

    let [u, v] = graph[node];
    if (u == prev) {
      prev = node;
      node = v;
    } else {
      prev = node;
      node = u;
    }
  }

  return cnt == graph.length;
}

function hasAnyCycle(graph, visited, node, prev) {
  for (let nei of graph[node]) {
    if (nei == prev)
      continue;

    if (visited[nei])
      return true;

    visited[nei] = true;

    if (hasAnyCycle(graph, visited, nei, node))
      return true;
  }

  return false;
}

function DFS(graph, comp, node, compId) {
  comp[node] = compId;
  for (let nei of graph[node]) {
    if (comp[nei] == -1) {
      DFS(graph, comp, nei, compId);
    }
  }
}

function solve(N, M, arr) {
  let graph = [...Array(N)].map(() => []);

  for (let [u, v] of arr) {
    u--;
    v--;
    graph[u].push(v);
    graph[v].push(u);
  }

  if (graph.some(edges => edges.length > 2))
    return ['NO'];

  let hasCycle = false;
  let visited = Array(N).fill(false);
  for (let i = 0; i < N && !hasCycle; i++)
    if (!visited[i] && hasAnyCycle(graph, visited, i, -1))
      hasCycle = true;

  if (hasCycle)
    return isCycle(graph) ? ['YES', []] : ['NO'];

  let comp = Array(N).fill(-1);
  let compId = 0;
  for (let i = 0; i < N; i++)
    if (comp[i] == -1) {
      DFS(graph, comp, i, compId);
      compId++;
    }

  let vertices = [...Array(compId)].map(() => [-1, -1]);
  for (let node = 0; node < N; node++) {
    let compId = comp[node];

    if (graph[node].length == 0)
      vertices[compId][0] = vertices[compId][1] = node;
    else if (graph[node].length == 1)
      if (vertices[compId][0] == -1)
        vertices[compId][0] = node;
      else
        vertices[compId][1] = node;
  }

  let heap = new Heap();
  for (let [u, v] of vertices)
    heap.add([u + 1, v + 1]);

  let edges = [];
  while (heap.size() > 1) {
    let [u1, v1] = heap.poll();
    let [u2, v2] = heap.poll();
    edges.push([u1, u2]);

    heap.add([v1, v2].sort((a, b) => a - b));
  }

  edges.push(heap.poll());
  return ['YES', edges];
}

// time:  O(nlog(n))
// space: O(n)
