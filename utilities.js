const matrices = require("./matrices");
const helper = require("./helper");

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
  showLogs = true,
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
  if (showLogs) {
    console.log(flow, " flow, line: 29");
    console.log(matrices.networkLoad, "networkLoad");
    console.log(source, " source");
    console.log(destination, " destination");
    console.log(trafficClass, " trafficClass");
    console.log(bandwidthReq, " bandwidthReq");
    console.log(delayReq, " delayReq");
  }

  // if tuple source destination and class exists (policy exist)
  if (BSID) {
    if (showLogs) console.log(BSID, "find BSID, line: 42");
    // check if there is a valid path on that candidate path
    let candidatePathKey = matrices.policyMatrix[source][destination]
      ? matrices.policyMatrix[source][destination][trafficClass]?.find(
          (cpKey) => matrices.candidatePathMatrix[cpKey].status
        )
      : null;

    let segmentList =
      matrices.candidatePathMatrix[candidatePathKey]?.segmentList;

    if (showLogs) {
      console.log(segmentList, "segmentList, lined :50");
      console.log(
        this.checkLinksOnPathHasProblem({
          bandwidthReq,
          delayReq,
          source,
          segmentList,
        })
      );
    }
    let candidatePathNotValid = this.checkLinksOnPathHasProblem({
      bandwidthReq,
      delayReq,
      source,
      segmentList,
    });

    //if candidate path has  enough bandwidth and meets our delay
    if (!candidatePathNotValid) {
      if (showLogs)
        console.log(candidatePathNotValid, "candidatePathNotValid, line: 58");
      matrices.routingMatrix[flow] = { BSID, CP: candidatePathKey };
      this.updateLinkLoadsOnPath({
        bandwidth: bandwidthReq,
        source,
        segmentList,
      });
      return segmentList;
    }
    // if candidate path violates qos requirements
    else {
      if (showLogs)
        console.log(candidatePathKey, "old candidatePathKey, line: 71");
      if (candidatePathKey) {
        matrices.candidatePathMatrix[candidatePathKey] = {
          ...matrices.candidatePathMatrix[candidatePathKey],
          status: false,
        };
      }
      candidatePathKey =
        "cp" + Object.keys(matrices.candidatePathMatrix).length;
      if (showLogs)
        console.log(candidatePathKey, "new candidatePathKey, line: 81");

      segmentList = this.dijkstraAlgorithm({
        layout: matrices.graphLayout,
        networkStatus: matrices.networkStatus,
        networkLoad: matrices.networkLoad,
        trafficClass,
        destination,
        maxBandwidth,
      });
      if (showLogs) console.log(segmentList, "segmentList, line: 91");

      // if dijkstra finds a path
      if (segmentList) {
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
        if (showLogs) {
          console.log(matrices.routingMatrix, "routingMatrix, line 118");
          console.log(
            matrices.candidatePathMatrix,
            "candidatePathMatrix, line 121"
          );
          console.log(
            matrices.mapPolicyBSIDtoSourceDestination,
            "mapPolicyBSIDtoSourceDestination, line 125"
          );
        }

        this.updateLinkLoadsOnPath({
          bandwidth: bandwidthReq,
          source,
          segmentList,
        });
        return segmentList;
      }
      return false;
    }
  }
  // if tuple source destination and class is new
  else {
    if (showLogs) console.log("tuple is new, line: 139");

    candidatePathKey = "cp" + Object.keys(matrices.candidatePathMatrix).length;
    segmentList = this.dijkstraAlgorithm({
      layout: matrices.graphLayout,
      networkStatus: matrices.networkStatus,
      networkLoad: matrices.networkLoad,
      trafficClass,
      destination,
      maxBandwidth,
    });
    if (showLogs) console.log(segmentList, "new segmentList, line: 150");
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
      if (showLogs) {
        console.log(matrices.routingMatrix, "routingMatrix, line 168");
        console.log(
          matrices.candidatePathMatrix,
          "candidatePathMatrix, line 171"
        );
        console.log(
          matrices.mapPolicyBSIDtoSourceDestination,
          "mapPolicyBSIDtoSourceDestination, line 175"
        );
      }

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
  showLogs = true,
}) => {
  // im this line we look for other BSIDs whose class is different
  let similarSourceDestinations = Object.keys(
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
  if (showLogs)
    console.log(
      similarSourceDestinations,
      "similarSourceDestinations, line:226"
    );

  // sort based on least flows routed
  similarSourceDestinations?.sort((a, b) => {
    let flowsRoutedBy1 = Object.values(matrices.routingMatrix).filter(
      (obj) => obj.BSID === a
    )?.length;
    let flowsRoutedBy2 = Object.values(matrices.routingMatrix).filter(
      (obj) => obj.BSID === b
    )?.length;
    return flowsRoutedBy1 - flowsRoutedBy2;
  });
  let qualifiedBSID_CP = [];
  if (showLogs)
    console.log(
      similarSourceDestinations,
      "similarSourceDestinations sorted, line:243"
    );

  if (similarSourceDestinations?.length > 0) {
    //for each BSID, we will find segment lists that are usable
    similarSourceDestinations.forEach((BSID) => {
      let SDC = matrices.mapPolicyBSIDtoSourceDestination[BSID]; // source,des,class
      matrices.policyMatrix[SDC[0]][SDC[1]][SDC[2]].forEach((key) => {
        let segmentList = matrices.candidatePathMatrix[key].segmentList;
        //check if segment list is good
        if (showLogs)
          console.log(
            this.checkLinksOnPathNotMeetRequirement({
              bandwidthReq,
              delayReq,
              segmentList,
              source,
            }),
            "checkLinksOnPathNotMeetRequirement, line :261"
          );
        if (
          !this.checkLinksOnPathNotMeetRequirement({
            bandwidthReq,
            delayReq,
            segmentList,
            source,
          })
        ) {
          qualifiedBSID_CP.push({
            BSID,
            CP: key,
            segmentList,
            class: SDC[2],
          });
        }
      });
    });
    if (showLogs) console.log(qualifiedBSID_CP, "qualifiedBSID_CP, line:280");

    //for each flow which is directed using this BSID, CP we will reroute them to other directions
    if (qualifiedBSID_CP?.length > 0) {
      for (let i = 0; i < qualifiedBSID_CP.length; i++) {
        let flows = Object.keys(matrices.routingMatrix).filter(
          (flowId) =>
            matrices.routingMatrix[flowId]["BSID"] === BCP.BSID &&
            matrices.routingMatrix[flowId]["CP"] === BCP.CP
        );
        if (showLogs) console.log(flows, "flows , line:290");
        let j = 0;
        let reRoutingNeeded = true;
        let tempNetworkLoad = { ...matrices.networkLoad };
        let tempRoutingMatrix = { ...matrices.routingMatrix };

        if (!reRoutingNeeded) break;

        while (reRoutingNeeded && j < flows?.length) {
          flows.forEach((flowId) => {
            let flowReq =
              matrices.trafficRequirement[qualifiedBSID_CP[i]?.class];
            let newSegmentList = this.dijkstraAlgorithm({
              destination,
              trafficClass,
            });
            if (showLogs)
              console.log(newSegmentList, "newSegmentList, line:307");
            if (newSegmentList) {
              let newFlowBindingSID = Object.keys(
                matrices.mapPolicyBSIDtoSourceDestination
              ).length;
              if (showLogs)
                console.log(newFlowBindingSID, "newFlowBindingSID, line:313");
              let newCP =
                "cp" + Object.keys(matrices.candidatePathMatrix).length;
              if (showLogs) console.log(newCP, "newCP, line:316");
              tempRoutingMatrix[flowId] = {
                BSID: newFlowBindingSID,
                CP: newCP,
              };
              this.updateLinkLoadsOnPath({
                bandwidth: -flowReq.bandwidth,
                segmentList: newSegmentList,
                source,
                networkLoad: tempNetworkLoad,
              });
              let checkIfFlowCanBeRouted = this.checkLinksOnPathHasProblem({
                bandwidthReq,
                delayReq,
                segmentList: qualifiedBSID_CP[i].segmentList,
                source,
                networkLoad: tempNetworkLoad,
              });
              if (showLogs)
                console.log(
                  checkIfFlowCanBeRouted,
                  "checkIfFlowCanBeRouted, line:337"
                );
              if (!checkIfFlowCanBeRouted) {
                let newCP =
                  "cp" + Object.keys(matrices.candidatePathMatrix).length;
                let newFlowBindingSID = qualifiedBSID_CP[i]?.BSID;
                if (showLogs)
                  console.log(newFlowBindingSID, "newFlowBindingSID, line:344");
                tempRoutingMatrix[flow] = {
                  BSID: newFlowBindingSID,
                  CP: newCP,
                };
                if (showLogs)
                  console.log(tempRoutingMatrix, "tempRoutingMatrix, line:350");
                this.updateLinkLoadsOnPath({
                  bandwidth: bandwidthReq,
                  segmentList: qualifiedBSID_CP[i].segmentList,
                  source,
                  tempNetworkLoad,
                });
                matrices.networkLoad = tempNetworkLoad;
                matrices.routingMatrix = tempRoutingMatrix;
                reRoutingNeeded = false;
              }
            }
            if (j === flows?.length - 1 && !reRoutingNeeded) {
              if (showLogs)
                console.log(
                  j === flows?.length - 1 && !reRoutingNeeded,
                  "j === flows?.length - 1 && !reRoutingNeeded, line:366"
                );
              tempNetworkLoad = { ...matrices.networkLoad };
              tempRoutingMatrix = { ...matrices.routingMatrix };
            }
          });
          j++;
        }
      }
    }
    // qualifiedBSID_CP.forEach((BCP) => {
    //   let flows = matrices.routingMatrix.filter(
    //     (obj) => obj["BSID"] === BCP.BSID && obj["CP"] === BCP.CP
    //   );
    //   let reRoutingNeeded = false;
    //   while (reRoutingNeeded) {
    //     flows

    //   }

    // });
    // }
  } else {
    // when similar segment list not found
    console.log("congestion occurred");
  }
};

/*
  customized dijkstra algo
  this will find segment list based on traffic requirement
*/
exports.dijkstraAlgorithm = ({
  layout = matrices.graphLayout,
  startNode = "headEnd",
  networkStatus = matrices.networkStatus,
  networkLoad = matrices.networkLoad,
  trafficClass,
  destination,
  maxBandwidth = 300, // this is used to reverse the impact of bandwidth
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
  networkLoad = matrices.networkLoad,
  networkStatus = matrices.networkStatus,
}) => {
  let delayAdded = 0;
  let violatesQoS = true;
  if (segmentList) {
    [source, ...segmentList].forEach((node, index) => {
      if (index !== segmentList.length) {
        let linkId = node + "-" + segmentList[index];
        if (!Object.keys(networkLoad).find((key) => key === linkId))
          linkId = segmentList[index] + "-" + node;
        let linkStatus = networkStatus[linkId];
        let linkLoad = networkLoad[linkId];
        delayAdded += linkStatus.delay;
        // on last iteration set the flag
        if (
          linkStatus.bandwidth - linkLoad > bandwidthReq &&
          delayAdded < delayReq &&
          linkStatus.status &&
          index === segmentList.length - 1
        )
          violatesQoS = false;
      }
    });
    return violatesQoS;
  } else return violatesQoS;
};

/*
  this is for rerouting module
  checks if links on the path has enough bandwidth and meet our delay requirement
*/
exports.checkLinksOnPathNotMeetRequirement = ({
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
      delayAdded += linkStatus.delay;
      if (
        linkStatus.bandwidth < bandwidthReq ||
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
exports.updateLinkLoadsOnPath = ({
  source,
  segmentList,
  bandwidth,
  networkLoad = matrices.networkLoad,
}) => {
  if (segmentList?.length > 0)
    [source, ...segmentList].forEach((node, index) => {
      if (index !== segmentList.length) {
        let linkId = node + "-" + segmentList[index];
        if (!Object.keys(networkLoad).find((key) => key === linkId))
          linkId = segmentList[index] + "-" + node;

        networkLoad[linkId] += typeof bandwidth === "number" ? bandwidth : 0;
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
