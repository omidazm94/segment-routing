const utilities = require("./utilities");
const matrices = require("./matrices");
const sTopology = require("./small-topology");
const lTopolog = require("./large-topology");
const routing = require("./routing").routing;
const reRouting = require("./reRouting").reRouting;

let maxBandwidth = 500;
let done = false;
let showLogs = false;
let showRoutingLogs = false;
let showReroutingLogs = true;
let source = "seattle";
matrices.graphLayout = sTopology.AbileneTopology;
matrices.networkStatus = sTopology.networkStatus;
matrices.currentTraffic = sTopology.currentTraffic10;
matrices.nextTraffic = sTopology.nextTraffic10;
utilities.initializeNetworkLinksLoad(matrices.graphLayout);

Object.keys(matrices.currentTraffic).forEach((flow, index) => {
  let trafficClass = matrices.currentTraffic[flow].class;
  let sol = routing({
    flow,
    source,
    destination: matrices.currentTraffic[flow].destination,
    trafficClass: matrices.currentTraffic[flow].class,
    bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
    delayReq: matrices.trafficRequirement[trafficClass].delay,
    duration: matrices.trafficRequirement[trafficClass].duration,
    maxBandwidth,
    showLogs: showRoutingLogs,
  });

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
      source,
      destination: matrices.currentTraffic[flow].destination,
      trafficClass: matrices.currentTraffic[flow].class,
      bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
      delayReq: matrices.trafficRequirement[trafficClass].delay,
      duration: matrices.trafficRequirement[trafficClass].duration,
      maxBandwidth,
      showLogs: showReroutingLogs,
    });
    console.log(
      "*************************** reroute result:" +
        rerouteSuccess +
        " **********************************"
    );
    console.log(matrices.routingMatrix);
    console.log(matrices.candidatePathMatrix);
    console.log(
      "*************************************************************"
    );
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
