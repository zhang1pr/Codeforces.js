// BFS, Heap
// Use BFS to Detect any cycle and check if the graph is already a cycle
// If no cycle is found, use BFS to find the component end vertices
// Keep a min heap of vertex pairs and connect first min with second min

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);

class Heap { constructor() { this.array = []; } peek() { if (this.array.length === 0) { return null; } return this.array[0]; } poll() { if (this.array.length === 0) { return null; } if (this.array.length === 1) { return this.array.pop(); } const item = this.array[0]; this.array[0] = this.array.pop(); this.heapifyDown(0); return item; } add(item) { this.array.push(item); this.heapifyUp(this.array.length - 1); return this; } isEmpty() { return this.size() == 0; } size() { return this.array.length; } heapifyUp(childIndex) { let parentIndex = Math.floor((childIndex - 1) / 2); while (parentIndex >= 0 && !this.checkInvariant(this.array[parentIndex], this.array[childIndex])) { [this.array[parentIndex], this.array[childIndex]] = [this.array[childIndex], this.array[parentIndex]]; childIndex = parentIndex; parentIndex = Math.floor((parentIndex - 1) / 2); } } heapifyDown(parentIndex) { let childIndex1 = parentIndex * 2 + 1; let childIndex2 = parentIndex * 2 + 2; let nextIndex; while (childIndex1 < this.array.length) { if (childIndex2 < this.array.length && this.checkInvariant(this.array[childIndex2], this.array[childIndex1])) { nextIndex = childIndex2; } else { nextIndex = childIndex1; } if (this.checkInvariant(this.array[parentIndex], this.array[nextIndex])) { break; } [this.array[parentIndex], this.array[nextIndex]] = [this.array[nextIndex], this.array[parentIndex]]; parentIndex = nextIndex; childIndex1 = nextIndex * 2 + 1; childIndex2 = nextIndex * 2 + 2; } } checkInvariant(a, b) { return a[0] <= b[0]; } }

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

function BFS(src, graph, visited) {
  if (graph[src].length == 0)
    return [src, src];

  visited[src] = true;
  let comp = [-1, -1];
  let level = [src];

  while (level.length) {
    let nlevel = [];

    for (let node of level) {
      if (graph[node].length == 1)
        if (comp[0] == -1)
          comp[0] = node;
        else
          comp[1] = node;

      for (let nei of graph[node])
        if (visited[nei] == false) {
          visited[nei] = true;
          level.push(nei);
        }
    }

    level = nlevel;
  }

  return comp.sort((a, b) => a - b);
}

function solve(N, M, arr) {
  let visited = Array(N).fill(false);

  let graph = [...Array(N)].map(() => []);
  for (let [u, v] of arr) {
    u--;
    v--;
    graph[u].push(v);
    graph[v].push(u);
  }

  if (graph.some(edges => edges.length > 2))
    return ['NO'];

  let isCycle = true;
  BFS(0, graph, visited);

  for (let i = 0; i < N && isCycle; i++)
    if (graph[i].length != 2 || visited[i] == false)
      isCycle = false;

  if (isCycle)
    return ['YES', []];

  visited = Array(N).fill(0);
  let vertices = [];

  for (let i = 0; i < N; i++)
    if (visited[i] == 0) {
      let comp = BFS(i, graph, visited);
      if (comp[0] == -1) {
        return ['NO'];
      }

      vertices.push(comp);
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

// time:  O(n * log(n))
// space: O(n)