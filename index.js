const utilities = require("./utilities");
const matrices = require("./matrices");
const routing = require("./routing").routing;
const reRouting = require("./reRouting").reRouting;

let maxBandwidth = 300;
let done = false;
let showLogs = true;
let showRoutingLogs = false;
let showReroutingLogs = false;
let flow = "f1";

utilities.initializeNetworkLinksLoad(matrices.graphLayout);
// utilities.initializeNetworkLinksStatuses(networkLoad, maxBandwidth);

Object.keys(matrices.currentTraffic).forEach((flow, index) => {
  let trafficClass = matrices.currentTraffic[flow].class;
  let sol = routing({
    flow,
    source: "headEnd",
    destination: matrices.currentTraffic[flow].destination,
    trafficClass: matrices.currentTraffic[flow].class,
    bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
    delayReq: matrices.trafficRequirement[trafficClass].delay,
    maxBandwidth,
    showLogs: showRoutingLogs,
  });

  console.log(matrices.routingMatrix);
  if (!sol) {
    if (showLogs) {
      console.log(
        "*************************************************************************************"
      );
      console.log("**Rerouting Needed** " + flow);
      console.log(matrices.networkLoad);
      console.log(matrices.trafficRequirement[trafficClass]);
      console.log(
        "*************************************************************************************"
      );
    }
    let rerouteSuccess = reRouting({
      flow,
      source: "headEnd",
      destination: matrices.currentTraffic[flow].destination,
      trafficClass: matrices.currentTraffic[flow].class,
      bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
      delayReq: matrices.trafficRequirement[trafficClass].delay,
      maxBandwidth,
      showLogs: showReroutingLogs,
    });
    console.log(matrices.routingMatrix, "after rerouting");
    console.log(rerouteSuccess, "rerouteSuccess");
  }
  if (index === Object.keys(matrices.currentTraffic).length - 1) done = true;
});

if (done && showLogs) {
  console.log(matrices.graphLayout, "graphLayout");
  console.log(matrices.trafficRequirement, "graphLayout");
  console.log(matrices.networkLoad, "networkLoad");
  console.log(matrices.candidatePathMatrix, "candidatePathMatrix");
  console.log(
    matrices.mapPolicyBSIDtoSourceDestination,
    "mapPolicyBSIDtoSourceDestination"
  );
  console.log(matrices.policyMatrix, "policyMatrix");
  console.log(matrices.routingMatrix, "routingMatrix");
}
