const utilities = require("./utilities");
const matrices = require("./matrices");
let maxBandwidth = 150;
let done = false;
utilities.initializeNetworkLinksLoad(matrices.graphLayout);
let networkLoad = matrices.networkLoad; // this is load on each link it also can be used to find certain links

utilities.initializeNetworkLinksStatuses(networkLoad, maxBandwidth);
let networkStatus = matrices.networkStatus;

console.log(networkStatus);

Object.keys(matrices.currentTraffic).forEach((flow, index) => {
  let trafficClass = matrices.currentTraffic[flow].class;
  let sol = utilities.checkAvailablePath({
    flow,
    source: "headEnd",
    destination: matrices.currentTraffic[flow].destination,
    trafficClass: matrices.currentTraffic[flow].class,
    bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
    delayReq: matrices.trafficRequirement[trafficClass].delay,
    maxBandwidth,
    // cp: index === matrices.currentTraffic.length - 1 ? "" : null,
  });
  if (!sol) {
    console.log(
      "*************************************************************************************"
    );
    console.log("**Rerouting Needed** " + flow);
    console.log(matrices.networkLoad);
    console.log(matrices.trafficRequirement[trafficClass]);
    console.log(
      "*************************************************************************************"
    );
    utilities.rerouting({
      flow,
      source: "headEnd",
      destination: matrices.currentTraffic[flow].destination,
      trafficClass: matrices.currentTraffic[flow].class,
      bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
      delayReq: matrices.trafficRequirement[trafficClass].delay,
      maxBandwidth,
    });
  }

  if (index === Object.keys(matrices.currentTraffic).length - 1) done = true;
});

if (done) {
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
