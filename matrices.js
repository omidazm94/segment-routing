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

// bandwidth load on each network link
exports.networkLoad = {};

// status info of each link. status, bandwidth, delay
// exports.networkStatus = {};
exports.networkStatus = {
  "2-3": { status: true, bandwidth: 249, delay: 2, distance: 258 },
  "2-4": { status: true, bandwidth: 280, delay: 1, distance: 254 },
  "2-5": { status: true, bandwidth: 148, delay: 3, distance: 287 },
  "2-6": { status: true, bandwidth: 197, delay: 7, distance: 296 },
  "2-7": { status: true, bandwidth: 232, delay: 10, distance: 178 },
  "3-4": { status: true, bandwidth: 291, delay: 4, distance: 132 },
  "3-6": { status: true, bandwidth: 210, delay: 8, distance: 243 },
  "4-7": { status: true, bandwidth: 124, delay: 5, distance: 258 },
  "5-6": { status: true, bandwidth: 163, delay: 1, distance: 174 },
  "6-7": { status: true, bandwidth: 264, delay: 9, distance: 229 },
  "headEnd-2": { status: true, bandwidth: 194, delay: 5, distance: 278 },
  "headEnd-3": { status: true, bandwidth: 200, delay: 6, distance: 158 },
  "headEnd-5": { status: true, bandwidth: 177, delay: 2, distance: 132 },
};

// p*2
exports.trafficRequirement = {
  c1: { delay: 70, bandwidth: 10, criteria: "delay" }, // delay
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
