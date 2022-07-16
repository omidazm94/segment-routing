const matrices = require("./matrices");

/*
  based on traffic class will assign weight on links
*/
exports.getLinkWeightBasedOnTrafficClass = ({
  linkId,
  linkStatus,
  linkLoad,
  trafficRequirement,
  maxBandwidth,
  showLogs = false,
}) => {
  let status = this.checkLinkLoad({
    linkId,
    linkLoad,
    bandwidthReq: trafficRequirement.bandwidth,
    delayReq: trafficRequirement.delay,
  });
  let availableBandwidth =
    matrices.networkStatus[linkId].bandwidth - matrices.networkLoad[linkId];

  if (showLogs) {
    console.log(linkId, "linkid");
    console.log(status);
    console.log(availableBandwidth);
  }

  if (status.available)
    if (trafficRequirement.criteria === "delay") {
      return matrices.networkStatus[linkId].delay;
      // return trafficRequirement["delay"] + 0.5 * linkStatus.distance;
    } else if (trafficRequirement.criteria === "normal") {
      return (
        matrices.networkStatus[linkId].delay +
        (maxBandwidth - availableBandwidth) +
        linkStatus.distance
      );
    } else if (trafficRequirement.criteria === "bandwidth") {
      return maxBandwidth - availableBandwidth + 0.5 * linkStatus.distance;
    }
  return Infinity;
};

/* 
  will check if link is up
  bandwidth is available
  delay is met
*/
exports.checkLinkLoad = ({ linkId, bandwidthReq, delayReq, linkLoad }) => {
  let linkStatus = matrices.networkStatus[linkId];
  // بررسی بالا بودن لینک
  if (!linkStatus.status) return { available: false, status: "failed" };
  // if available bandwidth is enough or delay requirement has been met or not
  if (
    linkStatus.bandwidth - linkLoad < bandwidthReq ||
    linkStatus.delay > delayReq
  )
    return { available: false, status: "!qos" };
  return { available: true, status: "success" };
};

/*
  check links on segment list so that they meet our requirement
*/
exports.checkLinksOnPathHasProblem = ({
  source,
  segmentList,
  bandwidthReq,
  delayReq,
  networkLoad = matrices.networkLoad,
  networkStatus = matrices.networkStatus,
}) => {
  let delayAdded = 0;
  let violatesQoS = true;
  if (segmentList) {
    [source, ...segmentList].forEach((node, index) => {
      if (index !== segmentList.length) {
        let linkId = node + "-" + segmentList[index];
        if (!Object.keys(networkLoad).find((key) => key === linkId))
          linkId = segmentList[index] + "-" + node;
        let linkStatus = networkStatus[linkId];
        let linkLoad = networkLoad[linkId];
        delayAdded += linkStatus.delay;
        // on last iteration set the flag
        if (
          linkStatus.bandwidth - linkLoad >= bandwidthReq &&
          delayAdded < delayReq &&
          linkStatus.status &&
          index === segmentList.length - 1
        )
          violatesQoS = false;
      }
    });
    return violatesQoS;
  } else return violatesQoS;
};

/*
  this is for rerouting module
  checks if links on the path has enough bandwidth and meet our delay requirement
*/
exports.checkLinksOnPathNotMeetRequirement = ({
  source,
  segmentList,
  bandwidthReq,
  delayReq,
}) => {
  let delayAdded = 0;
  let violatesQoS = true;
  [source, ...segmentList].forEach((node, index) => {
    if (index !== segmentList.length) {
      let linkId = node + "-" + segmentList[index];
      if (!Object.keys(matrices.networkLoad).find((key) => key === linkId))
        linkId = segmentList[index] + "-" + node;
      let linkStatus = matrices.networkStatus[linkId];
      delayAdded += linkStatus.delay;
      if (
        linkStatus.bandwidth >= bandwidthReq &&
        delayAdded < delayReq &&
        linkStatus.status &&
        index === segmentList.length - 1
      )
        violatesQoS = false;
    }
  });
  return violatesQoS;
};

/*
  get links that will be congested if new traffic arrives
*/
exports.getCongestedLinks = ({ source, segmentList, bandwidthReq }) => {
  let congestedLinks = [];
  [source, ...segmentList].forEach((node, index) => {
    if (index !== segmentList.length) {
      let linkId = node + "-" + segmentList[index];
      let linkStatus = matrices.networkStatus[linkId];
      let linkLoad = matrices.networkLoad[linkId];
      if (linkStatus.bandwidth - linkLoad < bandwidthReq)
        congestedLinks.push(linkId);
    }
  });
  return congestedLinks;
};

/*
  after finding segment list, it will update link load
*/
exports.updateLinkLoadsOnPath = ({
  source,
  segmentList,
  bandwidth,
  networkLoad = matrices.networkLoad,
}) => {
  if (segmentList?.length > 0)
    [source, ...segmentList].forEach((node, index) => {
      if (index !== segmentList.length) {
        let linkId = node + "-" + segmentList[index];
        if (!Object.keys(networkLoad).find((key) => key === linkId))
          linkId = segmentList[index] + "-" + node;

        networkLoad[linkId] += typeof bandwidth === "number" ? bandwidth : 0;
      }
    });
};

/*
  updates policy matrix
*/
exports.updatePolicyMatrix = ({
  source,
  destination,
  trafficClass,
  candidatePathKey,
}) => {
  if (
    matrices.policyMatrix[source] &&
    matrices.policyMatrix[source][destination]
  )
    matrices.policyMatrix[source] = {
      ...matrices.policyMatrix[source],
      [destination]: {
        ...matrices.policyMatrix[source][destination],
        [trafficClass]: matrices.policyMatrix[source][destination][trafficClass]
          ? [
              ...matrices.policyMatrix[source][destination][trafficClass],
              candidatePathKey,
            ]
          : [candidatePathKey],
      },
    };
  else {
    matrices.policyMatrix[source] = {
      ...matrices.policyMatrix[source],
      [destination]: {
        [trafficClass]: [candidatePathKey],
      },
    };
  }
};

//checks if there is a chance to congestion occurrence
exports.monitorLinks = (nextTraffic) => {
  // Object.keys(matrices.linkStatus).forEach((link) => {
  //   if (!link.status) return "failed";
  //   if (matrices.networkLoad[link] > matrices.linkStatus[link].bandwidth)
  //     return "congestion";
  // });
  let status = this.checkLinkLoad();
  if (status === "link-failed") {
    // reroute by calling dijkstra algorithm
  } else if (status === "congestion") {
    // reroute by calling dijkstra algorithm
  }

  //prediction steps based on next traffix
};

exports.generateNextTraffic = () => {};

/*
  will initialize network links load with random numbers
*/
exports.initializeNetworkLinksLoad = (graphLayout, max = 10, min = 1) => {
  Object.keys(graphLayout).forEach((node) => {
    graphLayout[node].forEach((adj) => {
      matrices.networkLoad[node + "-" + adj] = 0;
      // Math.floor(
      //   Math.random() * (max - min + 1) + min
      // );
    });
  });
};

/*
  will initialize network links status with random numbers
  status, bandwidth, delay
*/
exports.initializeNetworkLinksStatuses = (
  networkLoad,
  maxBandwidth = 500,
  min = maxBandwidth / 5
) => {
  Object.keys(networkLoad).forEach((link) => {
    matrices.networkStatus[link] = {
      status: true,
      bandwidth: Math.floor(Math.random() * (maxBandwidth - min + 1) + min),
      delay: Math.floor(Math.random() * (min / 10 - min / 100 + 1) + min / 100),
      distance: Math.floor(Math.random() * (maxBandwidth - min + 1) + min),
    };
  });
};
