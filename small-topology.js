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
  "seattle-denver": { status: true, bandwidth: 200, delay: 2, distance: 212 },
  "seattle-sunnyvale": {
    status: true,
    bandwidth: 500,
    delay: 40,
    distance: 55,
  },
  "denver-kansasCity": {
    status: true,
    bandwidth: 380,
    delay: 3,
    distance: 60,
  },
  "denver-sunnyvale": {
    status: true,
    bandwidth: 300,
    delay: 50,
    distance: 155,
  },
  "kansasCity-indianapolis": {
    status: true,
    bandwidth: 200,
    delay: 5,
    distance: 191,
  },
  "kansasCity-houston": {
    status: true,
    bandwidth: 300,
    delay: 10,
    distance: 191,
  },
  "indianapolis-chicago": {
    status: true,
    bandwidth: 200,
    delay: 2,
    distance: 187,
  },
  "indianapolis-atlanta": {
    status: true,
    bandwidth: 500,
    delay: 5,
    distance: 187,
  },
  "chicago-newYork": { status: true, bandwidth: 200, delay: 6, distance: 226 },
  "newYork-washington": {
    status: true,
    bandwidth: 200,
    delay: 4,
    distance: 55,
  },
  "sunnyvale-losAngeles": {
    status: true,
    bandwidth: 500,
    delay: 30,
    distance: 112,
  },
  "losAngeles-houston": {
    status: true,
    bandwidth: 500,
    delay: 20,
    distance: 275,
  },
  "houston-atlanta": { status: true, bandwidth: 500, delay: 10, distance: 173 },
  "atlanta-washington": {
    status: true,
    bandwidth: 500,
    delay: 5,
    distance: 239,
  },
};

/* 
    this is flow data for 10 flows
*/
exports.currentTraffic10 = {
  f1: { destination: "newYork", class: "c1", duration: 750 },
  f2: { destination: "newYork", class: "c3", duration: 350 },
  f3: { destination: "washington", class: "c3", duration: 250 },
  f4: { destination: "newYork", class: "c3", duration: 250 },
  f5: { destination: "newYork", class: "c2", duration: 450 },
  f6: { destination: "washington", class: "c2", duration: 250 },
  f7: { destination: "newYork", class: "c2", duration: 550 },
  f8: { destination: "newYork", class: "c1", duration: 250 },
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
