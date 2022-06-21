const matrices = require("./matrices");

exports.getLinkWeightBasedOnTrafficClass = ({
  link,
  linkStatus,
  linkLoad,
  trafficClass,
  trafficRequirement,
  maxBandwidth,
}) => {
  if (linkStatus.up)
    if (trafficRequirement.criteria === "delay") {
      //  ترکیبی از فاصله و تاخیر با نسبت یک به دو
      return trafficRequirement["delay"] + 0.5 * linkStatus.distance;
    } else if (trafficRequirement.criteria === "normal") {
      //  ترکیبی از فاصله و تاخیر و پهنای باند با نسبت یک
      return (
        trafficRequirement["delay"] +
        (maxBandwidth - trafficRequirement["bandwidth"]) +
        linkStatus.distance
      );
    } else if (trafficRequirement.criteria === "bandwidth") {
      //  ترکیبی از فاصله و پهنای باند با نسبت یک به دو
      return (
        maxBandwidth -
        trafficRequirement["bandwidth"] +
        0.5 * linkStatus.distance
      );
    }
  return Infinity;
};

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

exports.dijkstraAlgorithm2 = ({
  layout = {},
  startNode,
  networkStatus,
  networkLoad = {},
  trafficClass,
  maxBandwidth,
}) => {
  const trafficRequirement = matrices.trafficRequirement;
  console.log(trafficRequirement, "trafficRequirement");
  const self = this;
  // var layout = {
  //   'R': ['2'],
  //   '2': ['3','4'],
  let graph = {};
  //convert uni-directional to bi-directional graph
  for (var id in layout) {
    if (!graph[id]) graph[id] = {};
    layout[id].forEach(function (aid) {
      let linkWeight = self.getLinkWeightBasedOnTrafficClass({
        link: id + "-" + aid,
        linkStatus: networkStatus[id + "-" + aid],
        linkLoad: networkLoad[id + "-" + aid],
        trafficClass,
        trafficRequirement: trafficRequirement[trafficClass],
        maxBandwidth,
      });
      graph[id][aid] = linkWeight;
      if (!graph[aid]) graph[aid] = {};
      graph[aid][id] = linkWeight;
    });
  }
  // console.log(graph);

  var solutions = {};
  solutions[startNode] = [];
  solutions[startNode].dist = 0;

  while (true) {
    var parent = null;
    var nearest = null;
    var dist = Infinity;

    //for each existing solution
    //distance is calculated from starting node
    for (var currentNode in solutions) {
      if (!solutions[currentNode]) continue;
      var distanceToCurrentNode = solutions[currentNode].dist;
      var adj = graph[currentNode];
      //for each of its adjacent nodes...
      for (var currentAdj in adj) {
        //without a solution already...
        if (solutions[currentAdj]) continue;
        //choose nearest node with lowest *total* cost
        var distanceFromCurrentAdj = adj[currentAdj] + distanceToCurrentNode;
        if (distanceFromCurrentAdj < dist) {
          //reference parent
          parent = solutions[currentNode];
          nearest = currentAdj;
          dist = distanceFromCurrentAdj;
        }
      }
    }

    //no more solutions
    if (dist === Infinity) {
      break;
    }

    //extend parent's solution path
    solutions[nearest] = parent.concat(nearest);
    //extend parent's cost
    solutions[nearest].dist = dist;
  }

  return solutions;
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

exports.checkLinkLoad = () => {
  Object.keys(matrices.linkStatus).forEach((link) => {
    if (!link.up) return { status: "link-failed", link };
  });
  Object.keys(matrices.linkLoad).forEach((link) => {
    if (matrices.linkLoad[link] > matrices.linkStatus[link].bandwidth)
      return { status: "congestion", link };
  });
};

//checks if there is a chance to congestion occurrence
exports.monitorLinks = (nextTraffic) => {
  let status = this.checkLinkLoad();
  if (status === "link-failed") {
    // reroute by calling dijkstra algorithm
  } else if (status === "congestion") {
    // reroute by calling dijkstra algorithm
  }

  //prediction steps based on next traffix
};

exports.generateNextTraffic = () => {};

exports.initializeNetworkLinksLoad = (graphLayout, max = 5, min = 1) => {
  Object.keys(graphLayout).forEach((node) => {
    graphLayout[node].forEach((adj) => {
      matrices.networkLoad[node + "-" + adj] = Math.floor(
        Math.random() * (max - min + 1) + min
      );
    });
  });
  // Object.keys(this.graphLayout)
  //   .map((node) => {
  //     return this.graphLayout[node].map((adj) => {
  //       return { [node + "-" + adj]: 0 };
  //     });
  //   })
  //   .flat();
};

exports.initializeNetworkLinksStatuses = (networkLoad, max = 50, min = 1) => {
  Object.keys(networkLoad).forEach((link) => {
    matrices.networkStatus[link] = {
      up: true,
      bandwidth: Math.floor(Math.random() * (max - min + 1) + min),
      delay: Math.floor(Math.random() * (max - min + 1) + min),
      distance: Math.floor(Math.random() * (max - min + 1) + min),
    };
  });
};
