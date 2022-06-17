const utilities = require("./utilities");
const matrices = require("./matrices");

utilities.initializeLinkLoad(matrices.graphLayout2);
// let linkLoad = matrices.linkLoad; // this is load on each link it also can be used to find certain links
let linkLoad = {
  "2-3": 1,
  "2-7": 2,
  "3-5": 1,
  "3-6": 1,
  "4-5": 5,
  "4-6": 5,
  "4-9": 4,
  "5-6": 3,
  "5-8": 1,
  "5-9": 1,
  "6-9": 1,
  "7-8": 1,
  "8-9": 3,
  "headEnd-2": 3,
  "headEnd-4": 2,
  "headEnd-7": 2,
};

utilities.initializeLinkStatus(linkLoad);
let linkStatus = matrices.linkStatus;

console.log(linkLoad);
console.log(linkStatus);

let sol = utilities.dijkstraAlgorithm2(
  matrices.graphLayout2,
  "headEnd",
  linkLoad
);
console.log(sol, "final solution");
