exports.graphLayout = {};

// f1: { destination: 4, class: "c1" },
exports.currentTraffic = {};

// traffic on next iteration
exports.nextTraffic = {};

// bandwidth load on each network link
exports.networkLoad = {};

// status info of each link. status, bandwidth, delay
// exports.networkStatus = {};

exports.networkStatus = {};

// p*2
exports.trafficRequirement = {
  c1: { delay: 40, bandwidth: 10, criteria: "delay" }, // delay
  c2: { delay: 150, bandwidth: 40, criteria: "normal" }, // normal
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
