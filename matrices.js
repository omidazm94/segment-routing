exports.graphLayout = {
  headEnd: ["2", "3", "5"],
  2: ["3", "4", "5", "6"],
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
  f10: { destination: 3, class: "c1" },
  f11: { destination: 3, class: "c2" },
  f12: { destination: 3, class: "c1" },
  f13: { destination: 3, class: "c2" },
  f14: { destination: 7, class: "c2" },
  f15: { destination: 3, class: "c2" },
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

// bandwidth load on each network link
exports.networkLoad = {};

// status info of each link. status, bandwidth, delay
// exports.networkStatus = {};

exports.networkStatus = {
  // "2-3": { status: true, bandwidth: 89, delay: 4, distance: 52 },
  // "2-4": { status: true, bandwidth: 19, delay: 2, distance: 98 },
  // "2-5": { status: true, bandwidth: 84, delay: 10, distance: 72 },
  // "2-6": { status: true, bandwidth: 60, delay: 6, distance: 75 },
  // "2-7": { status: true, bandwidth: 24, delay: 2, distance: 33 },
  // "3-4": { status: true, bandwidth: 41, delay: 0, distance: 92 },
  // "3-6": { status: true, bandwidth: 57, delay: 5, distance: 29 },
  // "4-7": { status: true, bandwidth: 79, delay: 4, distance: 100 },
  // "5-6": { status: true, bandwidth: 71, delay: 10, distance: 42 },
  // "6-7": { status: true, bandwidth: 92, delay: 4, distance: 32 },
  // "headEnd-2": { status: true, bandwidth: 97, delay: 9, distance: 25 },
  // "headEnd-3": { status: true, bandwidth: 62, delay: 6, distance: 54 },
  // "headEnd-5": { status: true, bandwidth: 51, delay: 10, distance: 86 },
};

// p*2
exports.trafficRequirement = {
  c1: { delay: 40, bandwidth: 10, criteria: "delay" }, // delay
  c2: { delay: 150, bandwidth: 20, criteria: "normal" }, // normal
  c3: { delay: 200, bandwidth: 50, criteria: "bandwidth" }, // bandwidth
};

/*
   each flow take what path. for example flow : BSID
*/
exports.routingMatrix = {};

/*
  this can be used if for each destination two candidate path has been found
  (headEnd, destination, color)
  {
    source : {
      destination : candidate-path key
    }
  }
*/
exports.policyMatrix = [];

/* 
  each flow used what candidate path. for example cp1 : status : true , segmentList['a-b' , 'c-d']
  (preference, metric, segment list)
  {
    candidate-path key:{
      segmentList:[],
      preference: number,
      metric : class,
      status : boolean
    }
  }
*/
exports.candidatePathMatrix = {};

/*
  map BSID to source and destination
  BSID => [source, destination, class = color]
*/
exports.mapPolicyBSIDtoSourceDestination = {};

exports.colors = {
  c1: "green",
  c2: "blue",
  c3: "red",
};
