const utilities = require("./utilities");
const matrices = require("./matrices");

utilities.initializeNetworkLinksLoad(matrices.graphLayout);
let networkLoad = matrices.networkLoad; // this is load on each link it also can be used to find certain links

utilities.initializeNetworkLinksStatuses(networkLoad);
let networkStatus = matrices.networkStatus;

console.log(networkLoad);
console.log(networkStatus);

let sol = utilities.dijkstraAlgorithm2({
  layout: matrices.graphLayout,
  startNode: "headEnd",
  networkStatus,
  networkLoad,
  trafficClass: matrices.currentTraffic["f1"].class,
});
console.log(sol, "final solution");
