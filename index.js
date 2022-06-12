const utilities = require("./utilities");
const matrices = require("./matrices");

let sol = utilities.djikstraAlgorithm2(matrices.graphLayout, "2");
let linkLoad = matrices.linkLoad;

console.log(sol);
console.log(linkLoad);
