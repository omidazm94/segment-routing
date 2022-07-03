const matrices = require("./matrices");

/* 
  this method will check :
  if candidate path with input requirements is available, will use it
  otherwise will call dijkstra algo
*/
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
    let candidatePathKey = matrices.policyMatrix[source][destination]
      ? matrices.policyMatrix[source][destination][trafficClass]?.find(
          (cpKey) => matrices.candidatePathMatrix[cpKey].status
        )
      : null;

    let segmentList =
      matrices.candidatePathMatrix[candidatePathKey]?.segmentList;
    let candidatePathNotValid =
      !candidatePathKey ||
      !this.checkLinksOnPathHasProblem({
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

      // if dijkstra finds a path
      if (segmentList) {
        //bacause previous BSID was valid but it's path was not so we have to update with a new BSID
        BSID =
          "BSID" +
          Object.keys(matrices.mapPolicyBSIDtoSourceDestination).length;
        this.updatePolicyMatrix({
          source,
          destination,
          trafficClass,
          candidatePathKey,
        });
        matrices.routingMatrix[flow] = { BSID, CP: candidatePathKey };
        matrices.candidatePathMatrix[candidatePathKey] = {
          ...matrices.candidatePathMatrix[candidatePathKey],
          segmentList,
          status: true,
          metric: matrices.trafficRequirement[trafficClass].criteria,
        };
        matrices.mapPolicyBSIDtoSourceDestination[BSID] = [
          source,
          destination,
          trafficClass,
        ];
        this.updateLinkLoadsOnPath({
          bandwidth: bandwidthReq,
          source,
          segmentList,
        });
        return segmentList;
      }
      return false;
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

    // if dijkstra could find a path
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

      this.updatePolicyMatrix({
        source,
        destination,
        trafficClass,
        candidatePathKey,
      });

      this.updateLinkLoadsOnPath({
        bandwidth: bandwidthReq,
        source,
        segmentList,
      });
      return segmentList;
    } else {
      return false;
    }
  }
};

/*
  if no path could be found with input requirements, then we need rerouting
  first we look for packets or flows that have similar source and destination and different trafficClass
  in these segment lists, we will ? based on req or based on existing flows on this 
*/
exports.rerouting = ({
  flow,
  source,
  destination,
  trafficClass,
  bandwidthReq,
  delayReq,
  maxBandwidth,
}) => {
  //routing matrix {flow : BSID}
  //candidatePath :  {key , {sl , per , metric , status}}
  //policyMatrix :  {source:{destination:{class:[key]}}}
  //mapPolicyToSD :  {BSID : [source, destination, class]}
  //networkStatus : "2-3": { status: true, bandwidth: 89, delay: 4, distance: 52 },
  //networkLoad : "2-3": 50,

  let bestPath;
  let findSimilarSourceDestinations = Object.keys(
    matrices.mapPolicyBSIDtoSourceDestination
  ).filter((BSID) => {
    let pair = matrices.mapPolicyBSIDtoSourceDestination[BSID];
    if (
      pair[0] === source &&
      pair[1] === destination &&
      pair[2] !== trafficClass
    )
      return BSID;
  }); // result = [[source,destination1,c2],[source,destination2,c2]]

  if (findSimilarSourceDestinations?.length > 0) {
    //for each candidate path
    let qualifiedSegmentLists = [];
    findSimilarSourceDestinations.forEach((BSID) => {
      let SD = matrices.mapPolicyBSIDtoSourceDestination[BSID];
      matrices.policyMatrix[SD[0]][SD[1]][SD[2]].forEach((key) => {
        let segmentList = matrices.candidatePathMatrix[key].segmentList;
        if (
          !this.checkLinksOnPathHasProblem({
            bandwidthReq,
            delayReq,
            segmentList,
            source,
          })
        )
          qualifiedSegmentLists.push = {
            BSID,
            CP: key,
            ...matrices.candidatePathMatrix[key],
          };
      });
    });
    // when qualified routes has been found then sort them based on lead flow
  } else {
    // when similar segment list not found
  }
};

/*
  customized dijkstra algo
  this will find segment list based on traffic requirement
*/
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

/*
  based on traffic class will assign weight on links
*/
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

/* 
  will check if link is up
  bandwidth is available
  delay is met
*/
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

/*
  check links on segment list so that they meet our requirement
*/
exports.checkLinksOnPathHasProblem = ({
  source,
  segmentList,
  bandwidthReq,
  delayReq,
}) => {
  [source, ...segmentList].forEach((node, index) => {
    let delayAdded = 0;
    if (index !== segmentList.length) {
      let linkId = node + "-" + segmentList[index];
      if (!Object.keys(matrices.networkLoad).find((key) => key === linkId))
        linkId = segmentList[index] + "-" + node;
      let linkStatus = matrices.networkStatus[linkId];
      let linkLoad = matrices.networkLoad[linkId];
      delayAdded += linkStatus.delay;
      if (
        linkStatus.bandwidth - linkLoad < bandwidthReq ||
        delayAdded < delayReq ||
        linkStatus.status
      )
        return false;
    }
  });
  return true;
};

/*
  after finding segment list, it will update link load
*/
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

/*
  updates policy matrix
*/
exports.updatePolicyMatrix = ({
  source,
  destination,
  trafficClass,
  candidatePathKey,
}) => {
  if (
    matrices.policyMatrix[source] &&
    matrices.policyMatrix[source][destination]
  )
    matrices.policyMatrix[source] = {
      ...matrices.policyMatrix[source],
      [destination]: {
        ...matrices.policyMatrix[source][destination],
        [trafficClass]: matrices.policyMatrix[source][destination][trafficClass]
          ? [
              ...matrices.policyMatrix[source][destination][trafficClass],
              candidatePathKey,
            ]
          : [candidatePathKey],
      },
    };
  else {
    matrices.policyMatrix[source] = {
      ...matrices.policyMatrix[source],
      [destination]: {
        [trafficClass]: [candidatePathKey],
      },
    };
  }
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

/*
  will initialize network links load with random numbers
*/
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

/*
  will initialize network links status with random numbers
  status, bandwidth, delay
*/
exports.initializeNetworkLinksStatuses = (
  networkLoad,
  maxBandwidth = 300,
  min = maxBandwidth / 10
) => {
  Object.keys(networkLoad).forEach((link) => {
    matrices.networkStatus[link] = {
      status: true,
      bandwidth: Math.floor(Math.random() * (maxBandwidth - min + 1) + min),
      delay: Math.floor(
        Math.random() * (maxBandwidth / 10 - min / 100 + 1) + min / 100
      ),
      distance: Math.floor(Math.random() * (maxBandwidth - min + 1) + min),
    };
  });
};
