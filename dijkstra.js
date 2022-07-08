//Dijkstra algorithm is used to find the shortest distance between two nodes inside a valid weighted graph. Often used in Google Maps, Network Router etc.

//helper class for PriorityQueue
class Node {
  constructor(val, priority) {
    console.log(val, priority, "val + priority");
    this.val = val;
    this.priority = priority;
  }
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }
  enqueue(val, priority) {
    let newNode = new Node(val, priority);
    console.log(newNode, "newNode");
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    console.log(idx, "idx");
    const element = this.values[idx];
    console.log(element, "element");
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      console.log(parent, "parent, line:30");
      console.log(
        element.priority >= parent.priority,
        "element.priority >= parent.priority, line:31"
      );
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      console.log(this.values);
      this.values[idx] = parent;
      console.log(parent);
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    console.log(min, "min, line : 45");
    const end = this.values.pop();
    console.log(end, "end, line : 47");
    console.log(this.values.length > 0, "this.values.length > 0");
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    console.log(length, "length, line:58");
    const element = this.values[0];
    console.log(element, "element, line:60");
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;
      console.log(leftChildIdx < length, "leftChildIdx < length, line:66");
      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      console.log(rightChildIdx < length, "rightChildIdx < length, line:73");
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      console.log(swap, "swap line:83");
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      console.log(this.values, " this.values line:87");
      idx = swap;
    }
  }
}

//Dijkstra's algorithm only works on a weighted graph.

class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }
  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }
  Dijkstra(start, finish) {
    const nodes = new PriorityQueue();
    console.log(nodes, " nodes line:108");
    const distances = {};
    const previous = {};
    let path = []; //to return at end
    let smallest;
    //build up initial state
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
      console.log(previous, "previous, line:previous");
    }
    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;
      console.log(smallest, " smallest line:127");
      if (smallest === finish) {
        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        console.log(this.adjacencyList[smallest], " adj[smallest] line:139");
        for (let neighbor in this.adjacencyList[smallest]) {
          //find neighboring node
          let nextNode = this.adjacencyList[smallest][neighbor];
          console.log(nextNode, " nextNode line:143");
          //calculate new distance to neighboring node
          let candidate = distances[smallest] + nextNode.weight;
          console.log(candidate, " candidate line:146");
          let nextNeighbor = nextNode.node;
          console.log(nextNeighbor, " nextNeighbor line:148");
          if (candidate < distances[nextNeighbor]) {
            //updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;
            console.log(distances, " distances line:152");
            //updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest;
            console.log(previous, "previous line:155");
            //enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }
    console.log(smallest, "smallest line:162");
    return path.concat(smallest).reverse();
  }
}

//EXAMPLES=====================================================================

var graph = new WeightedGraph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");
graph.addVertex("F");

graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "E", 3);
graph.addEdge("C", "D", 2);
graph.addEdge("C", "F", 4);
graph.addEdge("D", "E", 3);
graph.addEdge("D", "F", 1);
graph.addEdge("E", "F", 1);

console.log(graph.Dijkstra("A", "E"));
