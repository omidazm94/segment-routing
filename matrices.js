exports.graphLayout = {
  "head-end": ["2", "3", "5"],
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

// status info of each link. up, bandwidth, delay
exports.networkStatus = {};

// p*2
exports.trafficRequirement = {
  c1: { delay: 10, bandwidth: 10, criteria: "delay" }, // delay
  c2: { delay: 30, bandwidth: 20, criteria: "normal" }, // normal
  c3: { delay: 50, bandwidth: 50, criteria: "bandwidth" }, // bandwidth
};

/*
   each flow take what path. for example flow : BSID
*/
exports.routingMatrix = {};

/*
  this can be used if for each destination two candidate path has been found
  (head-end, destination, color)
  {
    source : {
      destination : candidate-path key
    }
  }
*/
exports.policyMatrix = [];

/* 
  each flow used what candidate path. for example cp1 : status : 'available , path'['a-b' , 'c-d']
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
