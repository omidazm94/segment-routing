const matrices = require("./matrices");
const utilities = require("./utilities");
const dijkstraAlgorithm = require("./dijkstra").dijkstraAlgorithm;

/*
  if no path could be found with input requirements, then we need rerouting
  first we look for packets or flows that have similar source and destination and different trafficClass
  in these segment lists, we will ? based on req or based on existing flows on this 
*/
exports.reRouting = ({
  flow,
  source,
  destination,
  trafficClass,
  bandwidthReq,
  delayReq,
  duration,
  showLogs = true,
  maxBandwidth,
}) => {
  if (showLogs) {
    console.log(
      "***************************" +
        flow +
        "*************************************"
    );
    console.log(matrices.routingMatrix);
    console.log(matrices.networkLoad);
  }

  // im this line we look for other BSIDs whose *class is different*
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

  let reRoutingNeeded = true;

  if (similarSourceDestinations?.length > 0) {
    //for each BSID, we will find segment lists that are usable
    similarSourceDestinations.forEach((BSID) => {
      let SDC = matrices.mapPolicyBSIDtoSourceDestination[BSID]; // source,des,class
      matrices.policyMatrix[SDC[0]][SDC[1]][SDC[2]].forEach((key) => {
        let segmentList = matrices.candidatePathMatrix[key].segmentList;

        //check if segment list is good
        if (showLogs)
          console.log(
            utilities.checkLinksOnPathNotMeetRequirement({
              bandwidthReq,
              delayReq,
              segmentList,
              source,
            }),
            "checkLinksOnPathNotMeetRequirement, line :261"
          );

        if (
          !utilities.checkLinksOnPathNotMeetRequirement({
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
    if (showLogs) console.log(qualifiedBSID_CP, "qualifiedBSID_CP, line:293");
    //for each flow which is directed using this BSID, CP we will reroute them to other directions
    if (qualifiedBSID_CP?.length > 0) {
      for (let i = 0; i < qualifiedBSID_CP.length; i++) {
        let candidatePathCurrentSegmentList = qualifiedBSID_CP[i].segmentList;
        let flows = Object.keys(matrices.routingMatrix).filter(
          (flowId) =>
            matrices.routingMatrix[flowId]["BSID"] ===
              qualifiedBSID_CP[i].BSID &&
            matrices.routingMatrix[flowId]["CP"] === qualifiedBSID_CP[i].CP
        );
        if (showLogs) console.log(flows, "flows , line:319");
        // for each candidate path we first change data on temp variables
        let j = 0;
        let tempNetworkLoad = { ...matrices.networkLoad };
        let tempRoutingMatrix = { ...matrices.routingMatrix };
        let tempCandidatePathMatrix = { ...matrices.candidatePathMatrix };
        let tempMapPolicyBSIDtoSourceDestination = {
          ...matrices.mapPolicyBSIDtoSourceDestination,
        };
        let tempPolicyMatrix = { ...matrices.policyMatrix };

        if (!reRoutingNeeded) break;

        while (reRoutingNeeded && j < flows?.length) {
          // TODO: this has to be for to be stopped
          // flows.forEach((flowId) => {
          // for (let i = 0; i < flows.length; i++) {
          let flowId = flows[j];
          let flowReq = matrices.trafficRequirement[qualifiedBSID_CP[i]?.class];

          if (showLogs) console.log(flowReq, "flowReq, line:332");

          let newSegmentList = dijkstraAlgorithm({
            source,
            destination,
            trafficClass: qualifiedBSID_CP[i]?.class,
            previousSegmentList: candidatePathCurrentSegmentList,
            networkLoad: tempNetworkLoad,
            maxBandwidth,
          });
          if (showLogs) console.log(newSegmentList, "newSegmentList, line:338");
          if (newSegmentList) {
            let newFlowBindingSID =
              "BSID" +
              Object.keys(matrices.mapPolicyBSIDtoSourceDestination).length;
            if (showLogs)
              console.log(newFlowBindingSID, "newFlowBindingSID, line:344");
            let newCP = "cp" + Object.keys(matrices.candidatePathMatrix).length;
            if (showLogs) console.log(newCP, "newCP, line:347");
            // update routing matrix
            tempRoutingMatrix[flowId] = {
              BSID: newFlowBindingSID,
              CP: newCP,
            };
            // delete load on previous links
            utilities.updateLinkLoadsOnPath({
              bandwidth: -flowReq.bandwidth,
              segmentList: candidatePathCurrentSegmentList,
              source,
              networkLoad: tempNetworkLoad,
            });
            // add load on new links
            utilities.updateLinkLoadsOnPath({
              bandwidth: flowReq.bandwidth,
              segmentList: newSegmentList,
              source,
              networkLoad: tempNetworkLoad,
            });
            // add new candidate path
            tempCandidatePathMatrix[newCP] = {
              segmentList: newSegmentList,
              preference: 100,
              metric: qualifiedBSID_CP[i]?.class,
              status: true,
            };
            // update policy matrix and add new candidate path
            utilities.updatePolicyMatrix({
              source,
              destination,
              trafficClass: qualifiedBSID_CP[i]?.class,
              candidatePathKey: newCP,
            });

            // check if there is enough bandwidth now
            let checkIfFlowCanBeRouted = !utilities.checkLinksOnPathHasProblem({
              bandwidthReq,
              delayReq,
              segmentList: candidatePathCurrentSegmentList,
              source,
              networkLoad: tempNetworkLoad,
            });

            if (showLogs) {
              console.log(tempNetworkLoad);
              console.log(
                checkIfFlowCanBeRouted,
                "checkIfFlowCanBeRouted, line:371"
              );
            }

            // if reRouting other flows successfully added required space
            if (checkIfFlowCanBeRouted) {
              let newCP =
                "cp" + Object.keys(matrices.candidatePathMatrix).length;
              // let newFlowBindingSID = qualifiedBSID_CP[i]?.BSID;

              tempRoutingMatrix[flow] = {
                BSID: qualifiedBSID_CP[i].BSID,
                CP: newCP,
              };

              utilities.updateLinkLoadsOnPath({
                bandwidth: bandwidthReq,
                segmentList: qualifiedBSID_CP[i].segmentList,
                source,
                tempNetworkLoad,
              });
              //
              utilities.updatePolicyMatrix({
                source,
                destination,
                trafficClass,
                candidatePathKey: newCP,
              });
              tempCandidatePathMatrix[newCP] = {
                preference: 100,
                segmentList: qualifiedBSID_CP[i].segmentList,
                status: true,
                metric: trafficClass,
              };

              // update original network data
              matrices.networkLoad = { ...tempNetworkLoad };
              matrices.routingMatrix = { ...tempRoutingMatrix };
              matrices.candidatePathMatrix = { ...tempCandidatePathMatrix };
              matrices.mapPolicyBSIDtoSourceDestination = {
                ...tempMapPolicyBSIDtoSourceDestination,
              };
              matrices.policyMatrix = { ...tempPolicyMatrix };

              reRoutingNeeded = false;
            }
          }
          // if we are at the end of flow list and rerouting was not successful we will reset temp data to their original value
          if (j === flows?.length - 1 && reRoutingNeeded) {
            if (showLogs)
              console.log(
                "no result for candidate path: " + qualifiedBSID_CP[i].CP
              );

            tempNetworkLoad = { ...matrices.networkLoad };
            tempRoutingMatrix = { ...matrices.routingMatrix };
            tempCandidatePathMatrix = { ...matrices.candidatePathMatrix };
            tempPolicyMatrix = { ...matrices.policyMatrix };
            tempMapPolicyBSIDtoSourceDestination = {
              ...matrices.mapPolicyBSIDtoSourceDestination,
            };
          }
          j++;
        }
      }
    }
    if (reRoutingNeeded) {
      console.log("go for second solution");
      return reRoutingBasedOnCongestedLinks({
        flow,
        source,
        destination,
        trafficClass,
        bandwidthReq,
        delayReq,
        duration,
        maxBandwidth,
        showLogs: true,
      });
    } else return true; //rerouting was successful
  } else if (reRoutingNeeded) {
    console.log("go for second solution");
    return reRoutingBasedOnCongestedLinks({
      flow,
      source,
      destination,
      trafficClass,
      bandwidthReq,
      delayReq,
      duration,
      maxBandwidth,
      showLogs: true,
    });
  } else {
    // when similar segment list not found
    console.log("congestion occurred");
    return false;
  }
};

const reRoutingBasedOnCongestedLinks = ({
  flow,
  source,
  destination,
  trafficClass,
  bandwidthReq,
  delayReq,
  duration,
  maxBandwidth,
  showLogs = false,
}) => {
  // try {
  let reRoutingNeeded = true;
  let policyCandidatePaths =
    matrices.policyMatrix[source][destination][trafficClass];

  if (policyCandidatePaths?.length > 0) {
    let candidatePathKey = policyCandidatePaths[0];
    let BSID = Object.keys(matrices.mapPolicyBSIDtoSourceDestination).find(
      (bindingSID) => {
        let pair = matrices.mapPolicyBSIDtoSourceDestination[bindingSID];
        return (
          pair[0] === source &&
          pair[1] === destination &&
          pair[2] !== trafficClass
        );
      }
    );
    let segmentList =
      matrices.candidatePathMatrix[candidatePathKey].segmentList;

    let linksThatWillBeCongested = utilities.getCongestedLinks({
      source,
      segmentList,
      bandwidthReq,
    });

    // look for candidate paths that include links that will be congested
    let candidatePathsWithCongestedLinks = Object.keys(
      matrices.candidatePathMatrix
    )
      .filter((cpKey) => {
        if (matrices.candidatePathMatrix[cpKey].metric !== trafficClass) {
          let sl = [source, ...matrices.candidatePathMatrix[cpKey].segmentList];
          let links = [];
          sl.forEach((node, index) => {
            if (index !== sl.length - 1) links.push(node + "-" + sl[index + 1]);
          });
          if (
            linksThatWillBeCongested.every((element) => {
              return links.includes(element);
            })
          )
            return cpKey;
        }
      })
      .sort((a, b) => {
        let flowsRoutedBy1 = Object.values(matrices.routingMatrix).filter(
          (obj) => obj.CP === a
        )?.length;
        let flowsRoutedBy2 = Object.values(matrices.routingMatrix).filter(
          (obj) => obj.CP === b
        )?.length;
        return flowsRoutedBy1 - flowsRoutedBy2;
      });

    for (let i = 0; i < 1; i++) {
      let cpKey = candidatePathsWithCongestedLinks[i];
      let candidatePathMetric = matrices.candidatePathMatrix[cpKey].metric;
      let candidatePathCurrentSegmentList =
        matrices.candidatePathMatrix[cpKey].segmentList;
      let flows = Object.keys(matrices.routingMatrix).filter(
        (flowId) => matrices.routingMatrix[flowId]["CP"] === cpKey
      );
      // for each candidate path we first change data on temp variables
      let j = 0;
      let tempNetworkLoad = { ...matrices.networkLoad };
      let tempRoutingMatrix = { ...matrices.routingMatrix };
      let tempCandidatePathMatrix = { ...matrices.candidatePathMatrix };
      let tempMapPolicyBSIDtoSourceDestination = {
        ...matrices.mapPolicyBSIDtoSourceDestination,
      };
      let tempPolicyMatrix = { ...matrices.policyMatrix };

      if (!reRoutingNeeded) break;

      while (reRoutingNeeded && j < 1) {
        // TODO: this has to be for to be stopped
        // flows.forEach((flowId) => {
        // for (let i = 0; i < flows.length; i++) {
        let flowId = flows[j];
        let flowReq = matrices.trafficRequirement[candidatePathMetric];

        if (showLogs) console.log(flowReq, "flowReq, line:390");

        // delete load on previous links
        utilities.updateLinkLoadsOnPath({
          bandwidth: -flowReq.bandwidth,
          segmentList: candidatePathCurrentSegmentList,
          source,
          networkLoad: tempNetworkLoad,
        });

        let newSegmentList = dijkstraAlgorithm({
          source,
          destination,
          trafficClass: candidatePathMetric,
          previousSegmentList: candidatePathCurrentSegmentList,
          linksThatWillBeCongested,
          networkLoad: tempNetworkLoad,
          maxBandwidth,
          showLogs,
        });

        if (newSegmentList) {
          // this isn't really needed we can use current BSID
          let newFlowBindingSID =
            "BSID" +
            Object.keys(matrices.mapPolicyBSIDtoSourceDestination).length;
          if (showLogs)
            console.log(newFlowBindingSID, "newFlowBindingSID, line:344");
          let newCP = "cp" + Object.keys(matrices.candidatePathMatrix).length;
          if (showLogs) console.log(newCP, "newCP, line:347");
          // update routing matrix
          tempRoutingMatrix[flowId] = {
            BSID: newFlowBindingSID,
            CP: newCP,
          };

          // add load on new links
          utilities.updateLinkLoadsOnPath({
            bandwidth: flowReq.bandwidth,
            segmentList: newSegmentList,
            source,
            networkLoad: tempNetworkLoad,
          });
          // add new candidate path
          tempCandidatePathMatrix[newCP] = {
            segmentList: newSegmentList,
            preference: 100,
            metric: candidatePathMetric,
            status: true,
          };
          // update policy matrix and add new candidate path
          utilities.updatePolicyMatrix({
            source,
            destination,
            trafficClass: candidatePathMetric,
            candidatePathKey: newCP,
          });

          // check if there is enough bandwidth now
          let checkIfFlowCanBeRouted = !utilities.checkLinksOnPathHasProblem({
            bandwidthReq,
            delayReq,
            segmentList,
            source,
            networkLoad: tempNetworkLoad,
          });

          if (showLogs) {
            console.log(tempNetworkLoad);
            console.log(
              checkIfFlowCanBeRouted,
              "checkIfFlowCanBeRouted, line:371"
            );
          }

          // if reRouting other flows successfully added required space
          if (checkIfFlowCanBeRouted) {
            console.log("second solution was successful");
            tempRoutingMatrix[flow] = {
              BSID: BSID,
              CP: cpKey,
            };

            utilities.updateLinkLoadsOnPath({
              bandwidth: bandwidthReq,
              segmentList,
              source,
              tempNetworkLoad,
            });

            // update original network data
            matrices.networkLoad = { ...tempNetworkLoad };
            matrices.routingMatrix = { ...tempRoutingMatrix };
            matrices.candidatePathMatrix = { ...tempCandidatePathMatrix };
            matrices.mapPolicyBSIDtoSourceDestination = {
              ...tempMapPolicyBSIDtoSourceDestination,
            };
            matrices.policyMatrix = { ...tempPolicyMatrix };

            reRoutingNeeded = false;
          }
        } else {
          // delete load on previous links
          utilities.updateLinkLoadsOnPath({
            bandwidth: flowReq.bandwidth,
            segmentList: candidatePathCurrentSegmentList,
            source,
            networkLoad: tempNetworkLoad,
          });
        }
        // if we are at the end of flow list and rerouting was not successful we will reset temp data to their original value
        if (j === flows?.length - 1 && reRoutingNeeded) {
          if (showLogs) console.log("no result for candidate path: " + cpKey);

          tempNetworkLoad = { ...matrices.networkLoad };
          tempRoutingMatrix = { ...matrices.routingMatrix };
          tempCandidatePathMatrix = { ...matrices.candidatePathMatrix };
          tempPolicyMatrix = { ...matrices.policyMatrix };
          tempMapPolicyBSIDtoSourceDestination = {
            ...matrices.mapPolicyBSIDtoSourceDestination,
          };
        }
        j++;
      }
    }

    return reRoutingNeeded;
  } else {
    return false;
  }
};
