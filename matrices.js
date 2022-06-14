exports.graphLayout = {
  headEnd: ["2", "3", "5"],
  2: ["3", "4", "5", "6", "7"],
  3: ["4", "6"],
  4: ["7"],
  5: ["6"],
  6: ["7"],
  7: [],
};

exports.currentTraffic = {
  f1: { destination: 7, class: "c1" },
  f2: { destination: 4, class: "c2" },
  f3: { destination: 3, class: "c3" },
  f4: { destination: 7, class: "c2" },
  f5: { destination: 4, class: "c1" },
  f6: { destination: 3, class: "c1" },
  f7: { destination: 7, class: "c3" },
  f8: { destination: 7, class: "c2" },
  f9: { destination: 4, class: "c2" },
  f10: { destination: 3, class: "c2" },
};

exports.nextTraffic = {
  f1: { destination: 7, class: "c1" },
  f2: { destination: 4, class: "c2" },
  f3: { destination: 3, class: "c3" },
  f4: { destination: 7, class: "c2" },
  f5: { destination: 4, class: "c1" },
  f6: { destination: 3, class: "c1" },
  f7: { destination: 7, class: "c3" },
  f8: { destination: 7, class: "c2" },
  f9: { destination: 4, class: "c2" },
  f10: { destination: 3, class: "c2" },
};

exports.linkLoad = {};

exports.linkStatus = {};

// p*2
exports.trafficRequirement = [
  { c1: { delay: 10, bandwidth: 10 } }, // delay
  { c2: { delay: 30, bandwidth: 20 } }, // normal
  { c3: { delay: 50, bandwidth: 50 } }, // bandwidth
];

//each flow take what path
exports.routingMatrix = [];
