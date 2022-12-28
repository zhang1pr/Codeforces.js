// BFS, Heap
// Use BFS to Detect any cycle and check if the graph is already a cycle
// If no cycle is found, use BFS to find the component end vertices
// Keep a min heap of vertex pairs and connect first min with second min

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/[\n\r]+/);
class Heap{constructor(){this.array=[]}peek(){return 0===this.array.length?null:this.array[0]}poll(){if(0===this.array.length)return null;if(1===this.array.length)return this.array.pop();let r=this.array[0];return this.array[0]=this.array.pop(),this.heapifyDown(0),r}add(r){return this.array.push(r),this.heapifyUp(this.array.length-1),this}isEmpty(){return 0==this.size()}size(){return this.array.length}heapifyUp(r){let a=Math.floor((r-1)/2);for(;a>=0&&!this.checkInvariant(this.array[a],this.array[r]);)[this.array[a],this.array[r]]=[this.array[r],this.array[a]],r=a,a=Math.floor((a-1)/2)}heapifyDown(r){let a=2*r+1,t=2*r+2,h;for(;a<this.array.length&&(h=t<this.array.length&&this.checkInvariant(this.array[t],this.array[a])?t:a,!this.checkInvariant(this.array[r],this.array[h]));)[this.array[r],this.array[h]]=[this.array[h],this.array[r]],r=h,a=2*h+1,t=2*h+2}checkInvariant(r,a){return r[0]<=a[0]}}

let count = 0;
const readnum = () => input[count++].trim().split(' ').map(A => +A);
const readword = () => input[count++].trim().split(' ');
 
let [N,M] = readnum();
let arr = [];
for (let i=1;i<=M;i++) 
  arr.push(readnum());
  
let [res, edges] = solve(N,M,arr);
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

  return comp.sort((a,b)=>a-b);
}

function solve(N,M,arr) {
  let visited = Array(N).fill(false);
  
  let graph = [...Array(N)].map(() => []);
  for (let [u,v] of arr) {
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
    return ['YES', []]
  
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
  for (let [u,v] of vertices) 
    heap.add([u+1,v+1]);

  let edges = [];
  while (heap.size() > 1) {
    let [u1,v1] = heap.poll();
    let [u2,v2] = heap.poll();
    edges.push([u1,u2]);

    heap.add([v1,v2].sort((a,b)=>a-b));
  }

  edges.push(heap.poll());
  return ['YES', edges];
}

// time:  O(nlog(n))
// space: O(n)
