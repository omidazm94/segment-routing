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
    delay: 1,
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
    bandwidth: 500,
    delay: 4,
    distance: 55,
  },
  "sunnyvale-losAngeles": {
    status: true,
    bandwidth: 500,
    delay: 2,
    distance: 112,
  },
  "losAngeles-houston": {
    status: true,
    bandwidth: 500,
    delay: 3,
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
  f2: { destination: "newYork", class: "c1", duration: 350 },
  f3: { destination: "newYork", class: "c1", duration: 250 },
  f4: { destination: "newYork", class: "c1", duration: 250 },
  f5: { destination: "newYork", class: "c3", duration: 450 },
  f6: { destination: "washington", class: "c3", duration: 250 },
  f7: { destination: "washington", class: "c3", duration: 550 },
  f8: { destination: "washington", class: "c3", duration: 250 },
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
  f11: { destination: "newYork", class: "c1", duration: 750 },
  f12: { destination: "newYork", class: "c1", duration: 350 },
  f13: { destination: "washington", class: "c1", duration: 250 },
  f14: { destination: "newYork", class: "c2", duration: 250 },
  f15: { destination: "newYork", class: "c2", duration: 450 },
  f16: { destination: "washington", class: "c2", duration: 250 },
  f17: { destination: "newYork", class: "c2", duration: 550 },
  f18: { destination: "newYork", class: "c3", duration: 250 },
  f19: { destination: "washington", class: "c3", duration: 2000 },
  f20: { destination: "washington", class: "c3", duration: 1000 },
  f21: { destination: "newYork", class: "c1", duration: 750 },
  f22: { destination: "newYork", class: "c1", duration: 350 },
  f23: { destination: "washington", class: "c1", duration: 250 },
  f24: { destination: "newYork", class: "c2", duration: 250 },
  f25: { destination: "newYork", class: "c2", duration: 450 },
  f26: { destination: "washington", class: "c2", duration: 250 },
  f27: { destination: "newYork", class: "c2", duration: 550 },
  f28: { destination: "newYork", class: "c3", duration: 250 },
  f29: { destination: "washington", class: "c3", duration: 2000 },
  f30: { destination: "washington", class: "c3", duration: 1000 },
  f31: { destination: "newYork", class: "c1", duration: 750 },
  f32: { destination: "newYork", class: "c1", duration: 350 },
  f33: { destination: "washington", class: "c1", duration: 250 },
  f34: { destination: "newYork", class: "c2", duration: 250 },
  f35: { destination: "newYork", class: "c2", duration: 450 },
  f36: { destination: "washington", class: "c2", duration: 250 },
  f37: { destination: "newYork", class: "c2", duration: 550 },
  f38: { destination: "newYork", class: "c3", duration: 250 },
  f39: { destination: "washington", class: "c3", duration: 2000 },
  f40: { destination: "washington", class: "c3", duration: 1000 },
  f41: { destination: "newYork", class: "c1", duration: 750 },
  f42: { destination: "newYork", class: "c1", duration: 350 },
  f43: { destination: "washington", class: "c1", duration: 250 },
  f44: { destination: "newYork", class: "c2", duration: 250 },
  f45: { destination: "newYork", class: "c2", duration: 450 },
  f46: { destination: "washington", class: "c2", duration: 250 },
  f47: { destination: "newYork", class: "c2", duration: 550 },
  f48: { destination: "newYork", class: "c3", duration: 250 },
  f49: { destination: "washington", class: "c3", duration: 2000 },
  f50: { destination: "washington", class: "c3", duration: 1000 },
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
  f11: { destination: "newYork", class: "c1", duration: 750 },
  f12: { destination: "newYork", class: "c1", duration: 350 },
  f13: { destination: "washington", class: "c1", duration: 250 },
  f14: { destination: "newYork", class: "c2", duration: 250 },
  f15: { destination: "newYork", class: "c2", duration: 450 },
  f16: { destination: "washington", class: "c2", duration: 250 },
  f17: { destination: "newYork", class: "c2", duration: 550 },
  f18: { destination: "newYork", class: "c3", duration: 250 },
  f19: { destination: "washington", class: "c3", duration: 2000 },
  f20: { destination: "washington", class: "c3", duration: 1000 },
  f21: { destination: "newYork", class: "c1", duration: 750 },
  f22: { destination: "newYork", class: "c1", duration: 350 },
  f23: { destination: "washington", class: "c1", duration: 250 },
  f24: { destination: "newYork", class: "c2", duration: 250 },
  f25: { destination: "newYork", class: "c2", duration: 450 },
  f26: { destination: "washington", class: "c2", duration: 250 },
  f27: { destination: "newYork", class: "c2", duration: 550 },
  f28: { destination: "newYork", class: "c3", duration: 250 },
  f29: { destination: "washington", class: "c3", duration: 2000 },
  f30: { destination: "washington", class: "c3", duration: 1000 },
  f31: { destination: "newYork", class: "c1", duration: 750 },
  f32: { destination: "newYork", class: "c1", duration: 350 },
  f33: { destination: "washington", class: "c1", duration: 250 },
  f34: { destination: "newYork", class: "c2", duration: 250 },
  f35: { destination: "newYork", class: "c2", duration: 450 },
  f36: { destination: "washington", class: "c2", duration: 250 },
  f37: { destination: "newYork", class: "c2", duration: 550 },
  f38: { destination: "newYork", class: "c3", duration: 250 },
  f39: { destination: "washington", class: "c3", duration: 2000 },
  f40: { destination: "washington", class: "c3", duration: 1000 },
  f41: { destination: "newYork", class: "c1", duration: 750 },
  f42: { destination: "newYork", class: "c1", duration: 350 },
  f43: { destination: "washington", class: "c1", duration: 250 },
  f44: { destination: "newYork", class: "c2", duration: 250 },
  f45: { destination: "newYork", class: "c2", duration: 450 },
  f46: { destination: "washington", class: "c2", duration: 250 },
  f47: { destination: "newYork", class: "c2", duration: 550 },
  f48: { destination: "newYork", class: "c3", duration: 250 },
  f49: { destination: "washington", class: "c3", duration: 2000 },
  f50: { destination: "washington", class: "c3", duration: 1000 },
};

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
  f11: { destination: "newYork", class: "c1", duration: 750 },
  f12: { destination: "newYork", class: "c1", duration: 350 },
  f13: { destination: "washington", class: "c1", duration: 250 },
  f14: { destination: "newYork", class: "c2", duration: 250 },
  f15: { destination: "newYork", class: "c2", duration: 450 },
  f16: { destination: "washington", class: "c2", duration: 250 },
  f17: { destination: "newYork", class: "c2", duration: 550 },
  f18: { destination: "newYork", class: "c3", duration: 250 },
  f19: { destination: "washington", class: "c3", duration: 2000 },
  f20: { destination: "washington", class: "c3", duration: 1000 },
  f21: { destination: "newYork", class: "c1", duration: 750 },
  f22: { destination: "newYork", class: "c1", duration: 350 },
  f23: { destination: "washington", class: "c1", duration: 250 },
  f24: { destination: "newYork", class: "c2", duration: 250 },
  f25: { destination: "newYork", class: "c2", duration: 450 },
  f26: { destination: "washington", class: "c2", duration: 250 },
  f27: { destination: "newYork", class: "c2", duration: 550 },
  f28: { destination: "newYork", class: "c3", duration: 250 },
  f29: { destination: "washington", class: "c3", duration: 2000 },
  f30: { destination: "washington", class: "c3", duration: 1000 },
  f31: { destination: "newYork", class: "c1", duration: 750 },
  f32: { destination: "newYork", class: "c1", duration: 350 },
  f33: { destination: "washington", class: "c1", duration: 250 },
  f34: { destination: "newYork", class: "c2", duration: 250 },
  f35: { destination: "newYork", class: "c2", duration: 450 },
  f36: { destination: "washington", class: "c2", duration: 250 },
  f37: { destination: "newYork", class: "c2", duration: 550 },
  f38: { destination: "newYork", class: "c3", duration: 250 },
  f39: { destination: "washington", class: "c3", duration: 2000 },
  f40: { destination: "washington", class: "c3", duration: 1000 },
  f41: { destination: "newYork", class: "c1", duration: 750 },
  f42: { destination: "newYork", class: "c1", duration: 350 },
  f43: { destination: "washington", class: "c1", duration: 250 },
  f44: { destination: "newYork", class: "c2", duration: 250 },
  f45: { destination: "newYork", class: "c2", duration: 450 },
  f46: { destination: "washington", class: "c2", duration: 250 },
  f47: { destination: "newYork", class: "c2", duration: 550 },
  f48: { destination: "newYork", class: "c3", duration: 250 },
  f49: { destination: "washington", class: "c3", duration: 2000 },
  f50: { destination: "washington", class: "c3", duration: 1000 },
  f51: { destination: "newYork", class: "c1", duration: 750 },
  f52: { destination: "newYork", class: "c1", duration: 350 },
  f53: { destination: "washington", class: "c1", duration: 250 },
  f54: { destination: "newYork", class: "c2", duration: 250 },
  f55: { destination: "newYork", class: "c2", duration: 450 },
  f56: { destination: "washington", class: "c2", duration: 250 },
  f57: { destination: "newYork", class: "c2", duration: 550 },
  f58: { destination: "newYork", class: "c3", duration: 250 },
  f59: { destination: "washington", class: "c3", duration: 2000 },
  f60: { destination: "washington", class: "c3", duration: 1000 },
  f61: { destination: "newYork", class: "c1", duration: 750 },
  f62: { destination: "newYork", class: "c1", duration: 350 },
  f63: { destination: "washington", class: "c1", duration: 250 },
  f64: { destination: "newYork", class: "c2", duration: 250 },
  f65: { destination: "newYork", class: "c2", duration: 450 },
  f66: { destination: "washington", class: "c2", duration: 250 },
  f67: { destination: "newYork", class: "c2", duration: 550 },
  f68: { destination: "newYork", class: "c3", duration: 250 },
  f69: { destination: "washington", class: "c3", duration: 2000 },
  f70: { destination: "washington", class: "c3", duration: 1000 },
  f71: { destination: "newYork", class: "c1", duration: 750 },
  f72: { destination: "newYork", class: "c1", duration: 350 },
  f73: { destination: "washington", class: "c1", duration: 250 },
  f74: { destination: "newYork", class: "c2", duration: 250 },
  f75: { destination: "newYork", class: "c2", duration: 450 },
  f76: { destination: "washington", class: "c2", duration: 250 },
  f77: { destination: "newYork", class: "c2", duration: 550 },
  f78: { destination: "newYork", class: "c3", duration: 250 },
  f79: { destination: "washington", class: "c3", duration: 2000 },
  f80: { destination: "washington", class: "c3", duration: 1000 },
  f81: { destination: "newYork", class: "c1", duration: 750 },
  f82: { destination: "newYork", class: "c1", duration: 350 },
  f83: { destination: "washington", class: "c1", duration: 250 },
  f84: { destination: "newYork", class: "c2", duration: 250 },
  f85: { destination: "newYork", class: "c2", duration: 450 },
  f86: { destination: "washington", class: "c2", duration: 250 },
  f87: { destination: "newYork", class: "c2", duration: 550 },
  f88: { destination: "newYork", class: "c3", duration: 250 },
  f89: { destination: "washington", class: "c3", duration: 2000 },
  f90: { destination: "washington", class: "c3", duration: 1000 },
  f91: { destination: "newYork", class: "c1", duration: 750 },
  f92: { destination: "newYork", class: "c1", duration: 350 },
  f93: { destination: "washington", class: "c1", duration: 250 },
  f94: { destination: "newYork", class: "c2", duration: 250 },
  f95: { destination: "newYork", class: "c2", duration: 450 },
  f96: { destination: "washington", class: "c2", duration: 250 },
  f97: { destination: "newYork", class: "c2", duration: 550 },
  f98: { destination: "newYork", class: "c3", duration: 250 },
  f99: { destination: "washington", class: "c3", duration: 2000 },
  f100: { destination: "washington", class: "c3", duration: 1000 },
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
  f11: { destination: "newYork", class: "c1", duration: 750 },
  f12: { destination: "newYork", class: "c1", duration: 350 },
  f13: { destination: "washington", class: "c1", duration: 250 },
  f14: { destination: "newYork", class: "c2", duration: 250 },
  f15: { destination: "newYork", class: "c2", duration: 450 },
  f16: { destination: "washington", class: "c2", duration: 250 },
  f17: { destination: "newYork", class: "c2", duration: 550 },
  f18: { destination: "newYork", class: "c3", duration: 250 },
  f19: { destination: "washington", class: "c3", duration: 2000 },
  f20: { destination: "washington", class: "c3", duration: 1000 },
  f21: { destination: "newYork", class: "c1", duration: 750 },
  f22: { destination: "newYork", class: "c1", duration: 350 },
  f23: { destination: "washington", class: "c1", duration: 250 },
  f24: { destination: "newYork", class: "c2", duration: 250 },
  f25: { destination: "newYork", class: "c2", duration: 450 },
  f26: { destination: "washington", class: "c2", duration: 250 },
  f27: { destination: "newYork", class: "c2", duration: 550 },
  f28: { destination: "newYork", class: "c3", duration: 250 },
  f29: { destination: "washington", class: "c3", duration: 2000 },
  f30: { destination: "washington", class: "c3", duration: 1000 },
  f31: { destination: "newYork", class: "c1", duration: 750 },
  f32: { destination: "newYork", class: "c1", duration: 350 },
  f33: { destination: "washington", class: "c1", duration: 250 },
  f34: { destination: "newYork", class: "c2", duration: 250 },
  f35: { destination: "newYork", class: "c2", duration: 450 },
  f36: { destination: "washington", class: "c2", duration: 250 },
  f37: { destination: "newYork", class: "c2", duration: 550 },
  f38: { destination: "newYork", class: "c3", duration: 250 },
  f39: { destination: "washington", class: "c3", duration: 2000 },
  f40: { destination: "washington", class: "c3", duration: 1000 },
  f41: { destination: "newYork", class: "c1", duration: 750 },
  f42: { destination: "newYork", class: "c1", duration: 350 },
  f43: { destination: "washington", class: "c1", duration: 250 },
  f44: { destination: "newYork", class: "c2", duration: 250 },
  f45: { destination: "newYork", class: "c2", duration: 450 },
  f46: { destination: "washington", class: "c2", duration: 250 },
  f47: { destination: "newYork", class: "c2", duration: 550 },
  f48: { destination: "newYork", class: "c3", duration: 250 },
  f49: { destination: "washington", class: "c3", duration: 2000 },
  f50: { destination: "washington", class: "c3", duration: 1000 },
  f51: { destination: "newYork", class: "c1", duration: 750 },
  f52: { destination: "newYork", class: "c1", duration: 350 },
  f53: { destination: "washington", class: "c1", duration: 250 },
  f54: { destination: "newYork", class: "c2", duration: 250 },
  f55: { destination: "newYork", class: "c2", duration: 450 },
  f56: { destination: "washington", class: "c2", duration: 250 },
  f57: { destination: "newYork", class: "c2", duration: 550 },
  f58: { destination: "newYork", class: "c3", duration: 250 },
  f59: { destination: "washington", class: "c3", duration: 2000 },
  f60: { destination: "washington", class: "c3", duration: 1000 },
  f61: { destination: "newYork", class: "c1", duration: 750 },
  f62: { destination: "newYork", class: "c1", duration: 350 },
  f63: { destination: "washington", class: "c1", duration: 250 },
  f64: { destination: "newYork", class: "c2", duration: 250 },
  f65: { destination: "newYork", class: "c2", duration: 450 },
  f66: { destination: "washington", class: "c2", duration: 250 },
  f67: { destination: "newYork", class: "c2", duration: 550 },
  f68: { destination: "newYork", class: "c3", duration: 250 },
  f69: { destination: "washington", class: "c3", duration: 2000 },
  f70: { destination: "washington", class: "c3", duration: 1000 },
  f71: { destination: "newYork", class: "c1", duration: 750 },
  f72: { destination: "newYork", class: "c1", duration: 350 },
  f73: { destination: "washington", class: "c1", duration: 250 },
  f74: { destination: "newYork", class: "c2", duration: 250 },
  f75: { destination: "newYork", class: "c2", duration: 450 },
  f76: { destination: "washington", class: "c2", duration: 250 },
  f77: { destination: "newYork", class: "c2", duration: 550 },
  f78: { destination: "newYork", class: "c3", duration: 250 },
  f79: { destination: "washington", class: "c3", duration: 2000 },
  f80: { destination: "washington", class: "c3", duration: 1000 },
  f81: { destination: "newYork", class: "c1", duration: 750 },
  f82: { destination: "newYork", class: "c1", duration: 350 },
  f83: { destination: "washington", class: "c1", duration: 250 },
  f84: { destination: "newYork", class: "c2", duration: 250 },
  f85: { destination: "newYork", class: "c2", duration: 450 },
  f86: { destination: "washington", class: "c2", duration: 250 },
  f87: { destination: "newYork", class: "c2", duration: 550 },
  f88: { destination: "newYork", class: "c3", duration: 250 },
  f89: { destination: "washington", class: "c3", duration: 2000 },
  f90: { destination: "washington", class: "c3", duration: 1000 },
  f91: { destination: "newYork", class: "c1", duration: 750 },
  f92: { destination: "newYork", class: "c1", duration: 350 },
  f93: { destination: "washington", class: "c1", duration: 250 },
  f94: { destination: "newYork", class: "c2", duration: 250 },
  f95: { destination: "newYork", class: "c2", duration: 450 },
  f96: { destination: "washington", class: "c2", duration: 250 },
  f97: { destination: "newYork", class: "c2", duration: 550 },
  f98: { destination: "newYork", class: "c3", duration: 250 },
  f99: { destination: "washington", class: "c3", duration: 2000 },
  f100: { destination: "washington", class: "c3", duration: 1000 },
};
