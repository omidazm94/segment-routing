const utilities = require("./utilities");
const matrices = require("./matrices");
const maxBandwidth = 50;

utilities.initializeNetworkLinksLoad(matrices.graphLayout);
let networkLoad = matrices.networkLoad; // this is load on each link it also can be used to find certain links

utilities.initializeNetworkLinksStatuses(networkLoad);
let networkStatus = matrices.networkStatus;

console.log(networkLoad);
console.log(networkStatus);

Object.keys(matrices.currentTraffic).map((flow) => {
  console.log(flow);
  console.log(matrices.currentTraffic[flow].class);
  let trafficClass = matrices.currentTraffic[flow].class;
  let sol = utilities.checkAvailablePath({
    flow,
    destination: 7,
    trafficClass: matrices.currentTraffic[flow].class,
    bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
    delayReq: matrices.trafficRequirement[trafficClass].delay,
    maxBandwidth,
  });

  console.log(sol, "final solution");
});
