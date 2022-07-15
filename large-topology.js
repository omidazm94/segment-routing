exports.AbileneTopology = {
  seattle: ["denver", "sunnyvale"],
  denver: ["kansasCity", "sunnyvale"],
  kansasCity: ["indianapolis", "houston"],
  indianapolis: ["chicago", "atlanta"],
  chicago: ["newYork"],
  newYork: ["washington"],
  sunnyvale: ["losAngeles"],
  losAngeles: ["houston"],
  houston: ["atlanta"],
  atlanta: ["washington"],
  washington: [],
};

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

/* 
      this is flow data for 10 flows
  */
exports.currentTraffic10 = {
  f1: { destination: "newYork", class: "c1", duration: 750 },
  f2: { destination: "newYork", class: "c1", duration: 350 },
  f3: { destination: "washington", class: "c1", duration: 250 },
  f4: { destination: "newYork", class: "c2", duration: 250 },
  f5: { destination: "newYork", class: "c2", duration: 450 },
  f6: { destination: "washington", class: "c2", duration: 250 },
  f7: { destination: "newYork", class: "c2", duration: 550 },
  f8: { destination: "newYork", class: "c3", duration: 250 },
  f9: { destination: "washington", class: "c3", duration: 2000 },
  f10: { destination: "washington", class: "c3", duration: 1000 },
};

exports.nextTraffic10 = {
  f1: { destination: "newYork", class: "c1", duration: 750 },
  f2: { destination: "newYork", class: "c1", duration: 350 },
  f3: { destination: "washington", class: "c1", duration: 250 },
  f4: { destination: "newYork", class: "c2", duration: 250 },
  f5: { destination: "newYork", class: "c2", duration: 450 },
  f6: { destination: "washington", class: "c2", duration: 250 },
  f7: { destination: "newYork", class: "c2", duration: 550 },
  f8: { destination: "newYork", class: "c3", duration: 250 },
  f9: { destination: "washington", class: "c3", duration: 2000 },
  f10: { destination: "washington", class: "c3", duration: 1000 },
};

/* 
      this is flow data for 50 flows
  */
exports.currentTraffic50 = {
  f1: { destination: "newYork", class: "c1", duration: 750 },
  f2: { destination: "newYork", class: "c1", duration: 350 },
  f3: { destination: "washington", class: "c1", duration: 250 },
  f4: { destination: "newYork", class: "c2", duration: 250 },
  f5: { destination: "newYork", class: "c2", duration: 450 },
  f6: { destination: "washington", class: "c2", duration: 250 },
  f7: { destination: "newYork", class: "c2", duration: 550 },
  f8: { destination: "newYork", class: "c3", duration: 250 },
  f9: { destination: "washington", class: "c3", duration: 2000 },
  f10: { destination: "washington", class: "c3", duration: 1000 },
};

exports.nextTraffic50 = {
  f1: { destination: "newYork", class: "c1", duration: 750 },
  f2: { destination: "newYork", class: "c1", duration: 350 },
  f3: { destination: "washington", class: "c1", duration: 250 },
  f4: { destination: "newYork", class: "c2", duration: 250 },
  f5: { destination: "newYork", class: "c2", duration: 450 },
  f6: { destination: "washington", class: "c2", duration: 250 },
  f7: { destination: "newYork", class: "c2", duration: 550 },
  f8: { destination: "newYork", class: "c3", duration: 250 },
  f9: { destination: "washington", class: "c3", duration: 2000 },
  f10: { destination: "washington", class: "c3", duration: 1000 },
};

/* 
      this is flow data for 100 flows
  */
exports.currentTraffic100 = {
  f1: { destination: "newYork", class: "c1", duration: 750 },
  f2: { destination: "newYork", class: "c1", duration: 350 },
  f3: { destination: "washington", class: "c1", duration: 250 },
  f4: { destination: "newYork", class: "c2", duration: 250 },
  f5: { destination: "newYork", class: "c2", duration: 450 },
  f6: { destination: "washington", class: "c2", duration: 250 },
  f7: { destination: "newYork", class: "c2", duration: 550 },
  f8: { destination: "newYork", class: "c3", duration: 250 },
  f9: { destination: "washington", class: "c3", duration: 2000 },
  f10: { destination: "washington", class: "c3", duration: 1000 },
};

exports.nextTraffic100 = {
  f1: { destination: "newYork", class: "c1", duration: 750 },
  f2: { destination: "newYork", class: "c1", duration: 350 },
  f3: { destination: "washington", class: "c1", duration: 250 },
  f4: { destination: "newYork", class: "c2", duration: 250 },
  f5: { destination: "newYork", class: "c2", duration: 450 },
  f6: { destination: "washington", class: "c2", duration: 250 },
  f7: { destination: "newYork", class: "c2", duration: 550 },
  f8: { destination: "newYork", class: "c3", duration: 250 },
  f9: { destination: "washington", class: "c3", duration: 2000 },
  f10: { destination: "washington", class: "c3", duration: 1000 },
};
