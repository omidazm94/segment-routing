const matrices = require("./matrices");

exports.checkAvailablePath = ({
  flow,
  source,
  destination,
  trafficClass,
  bandwidthReq,
  delayReq,
  maxBandwidth,
}) => {
  let BSID = Object.keys(matrices.mapPolicyBSIDtoSourceDestination).find(
    (BindingSID) => {
      let policy = matrices.policyMatrix[BSID];
      if (
        (policy[0] === source && policy[1] === destination,
        policy[2] === trafficClass)
      )
        return BindingSID;
    }
  );
  if (BSID) {
    // check if there is a valid path on that candidate path
    let candidatePathKey = matrices.policyMatrix[source][destination].find(
      (candidatePath) => candidatePath.status
    );
    let candidatePath = matrices.candidatePathMatrix[candidatePathKey];
    let candidatePathNotValid = candidatePath.segmentList.find(
      (linkId) =>
        !this.checkLinkLoad({ linkId, bandwidthReq, delayReq }).available
    );

    //if candidate path has  enough bandwidth and meets our delay
    if (!candidatePathNotValid) {
      matrices.routingMatrix[flow] = { BSID, CP: candidatePathKey };
      return candidatePath.path;
    } else {
      // if candidate path violates qos requirements
      matrices.candidatePathMatrix[candidatePathKey] = {
        ...matrices.candidatePathMatrix[candidatePathKey],
        status: false,
      };
      candidatePathKey =
        "cp" + Object.keys(matrices.candidatePathMatrix).length;
      candidatePath = this.dijkstraAlgorithm({
        layout: matrices.graphLayout,
        networkStatus: matrices.networkStatus,
        networkLoad: matrices.networkLoad,
        trafficClass,
        maxBandwidth,
        destination,
      });
      matrices.routingMatrix[flow] = { BSID, CP: candidatePathKey };
      matrices.candidatePathMatrix[candidatePathKey] = {
        ...matrices.candidatePathMatrix[candidatePathKey],
        segmentlist: candidatePath,
        status: true,
        metric: trafficClass,
      };
      return candidatePath;
    }
  } else {
    // if tuple source destination and class is new
    candidatePathKey = "cp" + Object.keys(matrices.candidatePathMatrix).length;
    candidatePath = this.dijkstraAlgorithm({
      layout: matrices.graphLayout,
      networkStatus: matrices.networkStatus,
      networkLoad: matrices.networkLoad,
      trafficClass,
      maxBandwidth,
      destination,
    });
    // if dijk could find a path
    if (candidatePath) {
      BSID =
        "BSID" + Object.keys(matrices.mapPolicyBSIDtoSourceDestination).length;
      matrices.routingMatrix[flow] = { BSID, CP: candidatePathKey };
      matrices.mapPolicyBSIDtoSourceDestination[BSID] = [
        source,
        destination,
        trafficClass,
      ];
      matrices.candidatePathMatrix[candidatePathKey] = {
        segmentList: candidatePath,
        status: true,
        preference: 100,
        metric: trafficClass,
      };
      if (
        matrices.policyMatrix[source] &&
        matrices.policyMatrix[source][destination]
      )
        matrices.policyMatrix[source] = {
          [destination]: [
            ...matrices.policyMatrix[source][destination],
            candidatePathKey,
          ],
        };
      else {
        matrices.policyMatrix[source] = {
          [destination]: [candidatePathKey],
        };
      }
      return candidatePath;
    } else {
      return "could not find a path. you are fucked";
    }
  }
};

exports.dijkstraAlgorithm = ({
  layout = {},
  startNode = "headEnd",
  networkStatus,
  networkLoad = {},
  trafficClass,
  maxBandwidth,
  destination,
}) => {
  const trafficRequirement = matrices.trafficRequirement;
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
        linkId: id + "-" + aid,
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

  return solutions[destination];
};

exports.getLinkWeightBasedOnTrafficClass = ({
  linkId,
  linkStatus,
  linkLoad,
  trafficRequirement,
  maxBandwidth,
}) => {
  let status = this.checkLinkLoad({
    linkId,
    bandwidthReq: trafficRequirement.bandwidth,
    delayReq: trafficRequirement.delay,
  });
  if (status.available)
    if (trafficRequirement.criteria === "delay") {
      return trafficRequirement["delay"] + 0.5 * linkStatus.distance;
    } else if (trafficRequirement.criteria === "normal") {
      return (
        trafficRequirement["delay"] +
        (maxBandwidth - trafficRequirement["bandwidth"]) +
        linkStatus.distance
      );
    } else if (trafficRequirement.criteria === "bandwidth") {
      return (
        maxBandwidth -
        trafficRequirement["bandwidth"] +
        0.5 * linkStatus.distance
      );
    }
  return Infinity;
};

exports.checkLinkLoad = ({ linkId, bandwidthReq, delayReq }) => {
  let linkStatus = matrices.networkStatus[linkId];

  // بررسی بالا بودن لینک
  if (!linkStatus.up) return { available: false, status: "failed" };
  // if available bandwidth is enough or delay requirement has been met or not
  if (
    linkStatus.bandwidth - matrices.networkLoad[linkId] < bandwidthReq ||
    linkStatus.delay > delayReq
  )
    return { available: false, status: "!qos" };
  return { available: true, status: "success" };
};

//checks if there is a chance to congestion occurrence
exports.monitorLinks = (nextTraffic) => {
  // Object.keys(matrices.linkStatus).forEach((link) => {
  //   if (!link.up) return "failed";
  //   if (matrices.networkLoad[link] > matrices.linkStatus[link].bandwidth)
  //     return "congestion";
  // });
  let status = this.checkLinkLoad();
  if (status === "link-failed") {
    // reroute by calling dijkstra algorithm
  } else if (status === "congestion") {
    // reroute by calling dijkstra algorithm
  }

  //prediction steps based on next traffix
};

exports.generateNextTraffic = () => {};

exports.initializeNetworkLinksLoad = (graphLayout, max = 10, min = 1) => {
  Object.keys(graphLayout).forEach((node) => {
    graphLayout[node].forEach((adj) => {
      matrices.networkLoad[node + "-" + adj] = Math.floor(
        Math.random() * (max - min + 1) + min
      );
    });
  });
};

exports.initializeNetworkLinksStatuses = (networkLoad, max = 50, min = 30) => {
  Object.keys(networkLoad).forEach((link) => {
    matrices.networkStatus[link] = {
      up: true,
      bandwidth: Math.floor(Math.random() * (max - min + 1) + min),
      delay: Math.floor(Math.random() * (max - (min - 20) + 1) + (min - 20)),
      distance: Math.floor(Math.random() * (max - min + 1) + min),
    };
  });
};
