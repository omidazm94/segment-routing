const matrices = require("./matrices");
const utilities = require("./utilities");
const dijkstraAlgorithm = require("./dijkstra").dijkstraAlgorithm;

/* 
  this method will check :
  if candidate path with input requirements is available, will use it
  otherwise will call dijkstra algo
*/
exports.routing = ({
  flow,
  source,
  destination,
  trafficClass,
  bandwidthReq,
  delayReq,
  duration,
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
        utilities.checkLinksOnPathHasProblem({
          bandwidthReq,
          delayReq,
          source,
          segmentList,
        })
      );
    }
    let candidatePathNotValid = utilities.checkLinksOnPathHasProblem({
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
      utilities.updateLinkLoadsOnPath({
        bandwidth: bandwidthReq,
        source,
        segmentList,
      });
      // setTimeout(() => {
      //   utilities.updateLinkLoadsOnPath({
      //     bandwidth: -bandwidthReq,
      //     source,
      //     segmentList,
      //   });
      // }, duration);
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

      segmentList = dijkstraAlgorithm({
        source,
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
        utilities.updatePolicyMatrix({
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

        utilities.updateLinkLoadsOnPath({
          bandwidth: bandwidthReq,
          source,
          segmentList,
        });
        // setTimeout(() => {
        //   utilities.updateLinkLoadsOnPath({
        //     bandwidth: -bandwidthReq,
        //     source,
        //     segmentList,
        //   });
        // }, duration);
        return segmentList;
      }
      return false;
    }
  }
  // if tuple source destination and class is new
  else {
    if (showLogs) console.log("tuple is new, line: 139");

    candidatePathKey = "cp" + Object.keys(matrices.candidatePathMatrix).length;
    segmentList = dijkstraAlgorithm({
      source,
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

      utilities.updatePolicyMatrix({
        source,
        destination,
        trafficClass,
        candidatePathKey,
      });

      utilities.updateLinkLoadsOnPath({
        bandwidth: bandwidthReq,
        source,
        segmentList,
      });
      // setTimeout(() => {
      //   utilities.updateLinkLoadsOnPath({
      //     bandwidth: -bandwidthReq,
      //     source,
      //     segmentList,
      //   });
      // }, duration);
      return segmentList;
    } else {
      return false;
    }
  }
};
