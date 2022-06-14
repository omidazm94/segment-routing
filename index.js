const utilities = require("./utilities");
const matrices = require("./matrices");

// let sol = utilities.dijkstraAlgorithmWithConsole(
//   matrices.graphLayout,
//   "headEnd"
// );

utilities.initializeLinkLoad(matrices.graphLayout);
let linkLoad = matrices.linkLoad; // this is load on each link it also can be used to find certain links

utilities.initializeLinkStatus(linkLoad);
let linkStatus = matrices.linkStatus;

// console.log(sol);
console.log(linkLoad);
console.log(linkStatus);
