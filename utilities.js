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
    (bindingSID) => {
      let policy = matrices.mapPolicyBSIDtoSourceDestination[bindingSID];
      if (
        (policy[0] === source && policy[1] === destination,
        policy[2] === trafficClass)
      )
        return bindingSID;
    }
  );

  if (BSID) {
    // check if there is a valid path on that candidate path
    let candidatePathKey = matrices.policyMatrix[source][destination]?.find(
      (cpKey) => matrices.candidatePathMatrix[cpKey].status
    );
    let segmentList =
      matrices.candidatePathMatrix[candidatePathKey]?.segmentList;
    let candidatePathNotValid =
      !candidatePathKey ||
      !this.checkLinksOnPath({
        bandwidthReq,
        delayReq,
        source,
        segmentList,
      });

    //if candidate path has  enough bandwidth and meets our delay
    if (!candidatePathNotValid) {
      matrices.routingMatrix[flow] = { BSID, CP: candidatePathKey };
      this.updateLinkLoadsOnPath({
        bandwidth: bandwidthReq,
        source,
        segmentList,
      });
      return segmentList;
    } else {
      // if candidate path violates qos requirements
      if (candidatePathKey) {
        matrices.candidatePathMatrix[candidatePathKey] = {
          ...matrices.candidatePathMatrix[candidatePathKey],
          status: false,
        };
      }
      candidatePathKey =
        "cp" + Object.keys(matrices.candidatePathMatrix).length;

      segmentList = this.dijkstraAlgorithm({
        layout: matrices.graphLayout,
        networkStatus: matrices.networkStatus,
        networkLoad: matrices.networkLoad,
        trafficClass,
        destination,
        maxBandwidth,
      });
      if (segmentList) {
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
        matrices.routingMatrix[flow] = { BSID, CP: candidatePathKey };
        matrices.candidatePathMatrix[candidatePathKey] = {
          ...matrices.candidatePathMatrix[candidatePathKey],
          segmentList,
          status: true,
          metric: matrices.trafficRequirement[trafficClass].criteria,
        };
        this.updateLinkLoadsOnPath({
          bandwidth: bandwidthReq,
          source,
          segmentList,
        });
        return segmentList;
      }
      return "could not find a path. you are fucked";
    }
  } else {
    // if tuple source destination and class is new
    candidatePathKey = "cp" + Object.keys(matrices.candidatePathMatrix).length;
    segmentList = this.dijkstraAlgorithm({
      layout: matrices.graphLayout,
      networkStatus: matrices.networkStatus,
      networkLoad: matrices.networkLoad,
      trafficClass,
      destination,
      maxBandwidth,
    });
    // if dijk could find a path
    if (segmentList) {
      BSID =
        "BSID" + Object.keys(matrices.mapPolicyBSIDtoSourceDestination).length;
      matrices.routingMatrix[flow] = { BSID, CP: candidatePathKey };
      matrices.mapPolicyBSIDtoSourceDestination[BSID] = [
        source,
        destination,
        trafficClass,
      ];
      matrices.candidatePathMatrix[candidatePathKey] = {
        segmentList,
        status: true,
        preference: 100,
        metric: matrices.trafficRequirement[trafficClass].criteria,
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
      this.updateLinkLoadsOnPath({
        bandwidth: bandwidthReq,
        source,
        segmentList,
      });
      return segmentList;
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
  destination,
  maxBandwidth, // this is used to reverse the impact of bandwidth
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
  let availableBandwidth =
    matrices.networkStatus[linkId].bandwidth - matrices.networkLoad[linkId];

  if (status.available)
    if (trafficRequirement.criteria === "delay") {
      return matrices.networkStatus[linkId].delay;
      // return trafficRequirement["delay"] + 0.5 * linkStatus.distance;
    } else if (trafficRequirement.criteria === "normal") {
      return (
        matrices.networkStatus[linkId].delay +
        (maxBandwidth - availableBandwidth) +
        linkStatus.distance
      );
    } else if (trafficRequirement.criteria === "bandwidth") {
      return maxBandwidth - availableBandwidth + 0.5 * linkStatus.distance;
    }
  return Infinity;
};

exports.checkLinkLoad = ({ linkId, bandwidthReq, delayReq }) => {
  let linkStatus = matrices.networkStatus[linkId];

  // بررسی بالا بودن لینک
  if (!linkStatus.status) return { available: false, status: "failed" };
  // if available bandwidth is enough or delay requirement has been met or not
  if (
    linkStatus.bandwidth - matrices.networkLoad[linkId] < bandwidthReq ||
    linkStatus.delay > delayReq
  )
    return { available: false, status: "!qos" };
  return { available: true, status: "success" };
};

exports.checkLinksOnPath = ({
  source,
  segmentList,
  bandwidthReq,
  delayReq,
}) => {
  [source, ...segmentList].forEach((node, index) => {
    if (index !== segmentList.length) {
      let linkId = node + "-" + segmentList[index];
      if (!Object.keys(matrices.networkLoad).find((key) => key === linkId))
        linkId = segmentList[index] + "-" + node;
      let linkStatus = matrices.networkStatus[linkId];
      let linkLoad = matrices.networkLoad[linkId];
      if (
        linkStatus.bandwidth - linkLoad < bandwidthReq ||
        linkStatus.delay < delayReq ||
        linkStatus.status
      )
        return false;
    }
  });
  return true;
};

exports.updateLinkLoadsOnPath = ({ source, segmentList, bandwidth }) => {
  [source, ...segmentList].forEach((node, index) => {
    if (index !== segmentList.length) {
      let linkId = node + "-" + segmentList[index];
      if (!Object.keys(matrices.networkLoad).find((key) => key === linkId))
        linkId = segmentList[index] + "-" + node;

      matrices.networkLoad[linkId] +=
        typeof bandwidth === "number" ? bandwidth : 0;
    }
  });
};

//checks if there is a chance to congestion occurrence
exports.monitorLinks = (nextTraffic) => {
  // Object.keys(matrices.linkStatus).forEach((link) => {
  //   if (!link.status) return "failed";
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
      matrices.networkLoad[node + "-" + adj] = 0;
      // Math.floor(
      //   Math.random() * (max - min + 1) + min
      // );
    });
  });
};

exports.initializeNetworkLinksStatuses = (
  networkLoad,
  maxBandwidth = 300,
  min = 100
) => {
  Object.keys(networkLoad).forEach((link) => {
    matrices.networkStatus[link] = {
      status: true,
      bandwidth: Math.floor(Math.random() * (maxBandwidth - min + 1) + min),
      delay: Math.floor(
        Math.random() * (maxBandwidth / 30 - min / 100 + 1) + min / 100
      ),
      distance: Math.floor(Math.random() * (maxBandwidth - min + 1) + min),
    };
  });
};
