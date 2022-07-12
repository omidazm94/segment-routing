"# segment-routing"

this is my final thesis implementation
"QoS-aware Segment Routing Traffic Engineering using IPv6"

it will compute a customized version of dijkstra for routing and it considers traffic class for link weigthts.
it has two module named: routing and rereouting.

routing doing normal traffic engineering and creates policies and candidate paths for usage of similar flows
rerouting is when a flow can't be routed by routing module. it will select some flows and reroute them on other paths so the new flow can be routed on the network

you can run it if you have node.js installed. simply by typing "node ." in terminal
