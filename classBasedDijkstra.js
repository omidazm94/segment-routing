const utilities = require("./utilities");
const matrices = require("./matrices");
//Dijkstra algorithm is used to find the shortest distance between two nodes inside a valid weighted graph. Often used in Google Maps, Network Router etc.

//helper class for PriorityQueue
class Node {
  constructor(val, priority) {
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
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      let parentIdx = Math.floor((idx - 1) / 2);
      let parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

//Dijkstra's algorithm only works on a weighted graph.

exports.WeightedGraphClass = class WeightedGraph {
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
  updateLinkWeight(vertex1, vertex2, weight) {
    let v1 = this.adjacencyList[vertex1].find((v) => v.node === vertex2);
    v1.weight = weight;
    let v2 = this.adjacencyList[vertex2].find((v) => v.node === vertex1);
    v2.weight = weight;
  }
  updateLinkWeights({
    graphLayout = matrices.graphLayout,
    trafficClass,
    maxBandwidth,
  }) {
    let self = this;
    for (var id in graphLayout)
      graphLayout[id].forEach(function (aid) {
        let linkWeight = utilities.getLinkWeightBasedOnTrafficClass({
          linkId: id + "-" + aid,
          linkStatus: matrices.networkStatus[id + "-" + aid],
          linkLoad: matrices.networkLoad[id + "-" + aid],
          trafficRequirement: matrices.trafficRequirement[trafficClass],
          maxBandwidth,
        });

        let v1 = self.adjacencyList[id].find((v) => v.node === aid);
        let v2 = self.adjacencyList[aid].find((v) => v.node === id);
        if (v1?.node) {
          v1.weight = linkWeight;
          v2.weight = linkWeight;
        } else {
          self.addEdge(id, aid, linkWeight);
        }
      });
  }
  Dijkstra({ startNode, destination, trafficClass, maxBandwidth = 300 }) {
    this.updateLinkWeights({
      trafficClass,
      maxBandwidth,
    });
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};
    let path = []; //to return at end
    let smallest;
    //build up initial state
    for (let vertex in this.adjacencyList) {
      if (vertex === startNode) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }
    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;
      if (smallest === destination) {
        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbor in this.adjacencyList[smallest]) {
          //find neighboring node
          let nextNode = this.adjacencyList[smallest][neighbor];
          //calculate new distance to neighboring node
          let candidate = distances[smallest] + nextNode.weight;
          let nextNeighbor = nextNode.node;
          if (candidate < distances[nextNeighbor]) {
            //updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;
            //updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest;
            //enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }
    let segmentList = path.concat(smallest).reverse();
    return segmentList?.length > 1 ? segmentList.slice(1) : segmentList;
  }
};

// console.log(graph.adjacencyList);
// console.log(
//   graph.Dijkstra({
//     startNode: "headEnd",
//     destination: "7",
//     trafficClass: matrices.currentTraffic[flow].class,
//     maxBandwidth: 300,
//   })
// );

// let graph = new WeightedGraphClass();
// for (var id in graphLayout) graph.addVertex(id);