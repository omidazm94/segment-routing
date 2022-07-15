const matrices = require("./matrices");
const helper = require("./helper");
const utilities = require("./utilities");

/*
  customized dijkstra algo
  this will find segment list based on traffic requirement
*/
exports.dijkstraAlgorithm = ({
  layout = matrices.graphLayout,
  source,
  networkStatus = matrices.networkStatus,
  networkLoad = matrices.networkLoad,
  trafficClass,
  destination,
  maxBandwidth = 300, // this is used to reverse the impact of bandwidth
  previousSegmentList = [],
}) => {
  const trafficRequirement = matrices.trafficRequirement;
  // links that has been on the previous segment list and we don't want to go over them again
  let LinksThatNotAllowed = [];
  previousSegmentList.forEach((node, index) => {
    if (index != previousSegmentList.length - 1)
      LinksThatNotAllowed.push(
        previousSegmentList[index] + "-" + previousSegmentList[index + 1]
      );
  });

  // var layout = {
  //   'R': ['2'],
  //   '2': ['3','4'],
  let graph = {};
  //convert uni-directional to bi-directional graph
  for (var id in layout) {
    if (!graph[id]) graph[id] = {};
    layout[id].forEach(function (aid) {
      let linkWeight = 0;
      let linkId = id + "-" + aid;

      if (LinksThatNotAllowed.includes(linkId)) {
        console.log(LinksThatNotAllowed.includes(linkId));
        console.log(LinksThatNotAllowed);
        linkWeight = Infinity;
      } else
        linkWeight = utilities.getLinkWeightBasedOnTrafficClass({
          linkId,
          linkStatus: networkStatus[id + "-" + aid],
          linkLoad: networkLoad[id + "-" + aid],
          trafficRequirement: trafficRequirement[trafficClass],
          maxBandwidth,
        });

      graph[id][aid] = linkWeight;
      if (!graph[aid]) graph[aid] = {};
      graph[aid][id] = linkWeight;
    });
  }

  console.log(graph);
  console.log(layout);
  console.log(source);
  console.log(networkStatus);
  console.log(destination);

  var solutions = {};
  solutions[source] = [];
  solutions[source].dist = 0;

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
        let delayCondition =
          trafficClass === "c1"
            ? distanceFromCurrentAdj < trafficRequirement[trafficClass].delay
            : true;
        if (distanceFromCurrentAdj < dist && delayCondition) {
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

  return solutions[destination];
};
