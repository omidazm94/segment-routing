exports.dijkstraAlgorithm1 = (startNode) => {
  let distances = {};

  // Stores the reference to previous nodes
  let prev = {};
  let pq = new PriorityQueue(this.nodes.length * this.nodes.length);

  // Set distances to all nodes to be infinite except startNode
  distances[startNode] = 0;
  pq.enqueue(startNode, 0);
  this.nodes.forEach((node) => {
    if (node !== startNode) distances[node] = Infinity;
    prev[node] = null;
  });

  while (!pq.isEmpty()) {
    let minNode = pq.dequeue();
    let currNode = minNode.data;
    let weight = minNode.priority;
    this.edges[currNode].forEach((neighbor) => {
      let alt = distances[currNode] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        prev[neighbor.node] = currNode;
        pq.enqueue(neighbor.node, distances[neighbor.node]);
      }
    });
  }
  return distances;
};

exports.dijkstraAlgorithmWithConsole = (layout = {}, startNode) => {
  // var layout = {
  //   '1': ['2'],
  //   '2': ['3','4'],
  let graph = {};
  for (var id in layout) {
    if (!graph[id]) graph[id] = {};
    layout[id].forEach(function (aid) {
      graph[id][aid] = 1;
      if (!graph[aid]) graph[aid] = {};
      graph[aid][id] = 1;
    });
  }
  console.log(graph);

  //convert uni-directional to bi-directional graph
  // needs to look like: where: { a: { b: cost of a->b }
  // var graph = {
  //     a: {e:1, b:1, g:3},
  //     b: {a:1, c:1},
  //     c: {b:1, d:1},
  //     d: {c:1, e:1},
  //     e: {d:1, a:1},
  //     f: {g:1, h:1},
  //     g: {a:3, f:1},
  //     h: {f:1}
  // };

  var solutions = {};
  solutions[startNode] = [];
  solutions[startNode].dist = 0;
  console.log(solutions, "solutions");

  while (true) {
    var parent = null;
    var nearest = null;
    var dist = Infinity;

    //for each existing solution
    //distance is calculated from starting node
    for (var currentNode in solutions) {
      if (!solutions[currentNode]) continue;
      var distanceToCurrentNode = solutions[currentNode].dist;
      console.log(distanceToCurrentNode, "ndist");
      var adj = graph[currentNode];
      console.log(adj, "adj of" + currentNode);
      //for each of its adjacent nodes...
      for (var currentAdj in adj) {
        //without a solution already...
        if (solutions[currentAdj]) continue;
        //choose nearest node with lowest *total* cost
        var distanceFromCurrentAdj = adj[currentAdj] + distanceToCurrentNode;
        console.log(distanceFromCurrentAdj, "d");
        if (distanceFromCurrentAdj < dist) {
          //reference parent
          parent = solutions[currentNode];
          console.log(parent, "parent of " + currentNode);
          nearest = currentAdj;
          console.log(nearest, "nearest to" + currentNode);
          dist = distanceFromCurrentAdj;
          console.log(dist, "dist from " + currentNode);
        }
      }
    }

    //no more solutions
    if (dist === Infinity) {
      break;
    }

    //extend parent's solution path
    solutions[nearest] = parent.concat(nearest);
    console.log("solution after loop", solutions);
    //extend parent's cost
    solutions[nearest].dist = dist;
    console.log("solution after loop", solutions);
  }

  return solutions;
};
