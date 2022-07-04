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
  f1: { destination: 4, class: "c1" },
  f2: { destination: 4, class: "c1" },
  f3: { destination: 4, class: "c1" },
  f4: { destination: 7, class: "c2" },
  f5: { destination: 7, class: "c2" },
  f6: { destination: 7, class: "c2" },
  f7: { destination: 7, class: "c2" },
  f8: { destination: 7, class: "c3" },
  f9: { destination: 7, class: "c3" },
  f10: { destination: 7, class: "c3" },
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
  "2-3": { status: true, bandwidth: 126, delay: 5, distance: 212 },
  "2-4": { status: true, bandwidth: 106, delay: 22, distance: 55 },
  "2-5": { status: true, bandwidth: 120, delay: 10, distance: 60 },
  "2-6": { status: true, bandwidth: 123, delay: 1, distance: 155 },
  "3-4": { status: true, bandwidth: 200, delay: 13, distance: 191 },
  "3-6": { status: true, bandwidth: 291, delay: 1, distance: 187 },
  "4-7": { status: true, bandwidth: 238, delay: 27, distance: 226 },
  "5-6": { status: true, bandwidth: 260, delay: 9, distance: 55 },
  "6-7": { status: true, bandwidth: 213, delay: 0, distance: 112 },
  "headEnd-2": { status: true, bandwidth: 39, delay: 0, distance: 275 },
  "headEnd-3": { status: true, bandwidth: 83, delay: 8, distance: 173 },
  "headEnd-5": { status: true, bandwidth: 240, delay: 2, distance: 239 },
};

// p*2
exports.trafficRequirement = {
  c1: { delay: 40, bandwidth: 10, criteria: "delay" }, // delay
  c2: { delay: 150, bandwidth: 20, criteria: "normal" }, // normal
  c3: { delay: 200, bandwidth: 100, criteria: "bandwidth" }, // bandwidth
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
