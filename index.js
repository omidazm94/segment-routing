const utilities = require("./utilities");
const matrices = require("./matrices");
let maxBandwidth = 300;

utilities.initializeNetworkLinksLoad(matrices.graphLayout);
let networkLoad = matrices.networkLoad; // this is load on each link it also can be used to find certain links

utilities.initializeNetworkLinksStatuses(networkLoad, maxBandwidth);
let networkStatus = matrices.networkStatus;

console.log(networkStatus);

Object.keys(matrices.currentTraffic).forEach((flow) => {
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

  console.log(matrices.routingMatrix, "final solution");
  console.log(matrices.candidatePathMatrix, "final solution");
  console.log(matrices.mapPolicyBSIDtoSourceDestination, "final solution");
  console.log(matrices.policyMatrix, "final solution");
  console.log(sol, "final solution");
});
