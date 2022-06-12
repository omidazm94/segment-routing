exports.graphLayout = {
  root: ["2", "3", "5"],
  2: ["3", "4", "5", "6", "7"],
  3: ["4", "6"],
  4: ["7"],
  5: ["6"],
  6: ["7"],
  7: [],
};

exports.currentTraffic = [];

exports.nextTraffic = [];

exports.linkLoad = Object.keys(this.graphLayout).map((key) => {
  return { [key]: 0 };
});

// p*2
exports.trafficRequirement = [
  { c1: { delay: 10, bandwidth: 10 } }, // delay
  { c2: { delay: 30, bandwidth: 20 } }, // normal
  { c3: { delay: 50, bandwidth: 50 } }, // bandwidth
];

exports.linkBandwidth = [];

//each flow take what path
exports.routingMatrix = [];
