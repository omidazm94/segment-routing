const utilities = require("./utilities");
const matrices = require("./matrices");
const WeightedGraphClass = require("./dijkstra").WeightedGraphClass;

let maxBandwidth = 300;
let done = false;
let showLogs = false;
utilities.initializeNetworkLinksLoad(matrices.graphLayout);
let networkLoad = matrices.networkLoad; // this is load on each link it also can be used to find certain links
let flow = "f1";
// utilities.initializeNetworkLinksStatuses(networkLoad, maxBandwidth);
let networkStatus = matrices.networkStatus;
let graphLayout = matrices.graphLayout;

let graph = new WeightedGraphClass();
for (var id in graphLayout) graph.addVertex(id);

console.log(graph.adjacencyList);
console.log(
  graph.Dijkstra({
    startNode: "headEnd",
    destination: "7",
    trafficClass: matrices.currentTraffic[flow].class,
    maxBandwidth: 300,
  })
);

// Object.keys(matrices.currentTraffic).forEach((flow, index) => {
let trafficClass = matrices.currentTraffic[flow].class;
let sol = utilities.checkAvailablePath({
  flow,
  source: "headEnd",
  destination: matrices.currentTraffic[flow].destination,
  trafficClass: matrices.currentTraffic[flow].class,
  bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
  delayReq: matrices.trafficRequirement[trafficClass].delay,
  maxBandwidth,
  showLogs,
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
  utilities.rerouting({
    flow,
    source: "headEnd",
    destination: matrices.currentTraffic[flow].destination,
    trafficClass: matrices.currentTraffic[flow].class,
    bandwidthReq: matrices.trafficRequirement[trafficClass].bandwidth,
    delayReq: matrices.trafficRequirement[trafficClass].delay,
    maxBandwidth,
    showLogs,
  });
}

// if (index === Object.keys(matrices.currentTraffic).length - 1) done = true;
// });

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
