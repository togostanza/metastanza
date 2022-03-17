import * as d3 from "d3";

export default function (svg, nodes, edges) {
  const nodesC = JSON.parse(JSON.stringify(nodes));
  const edgesC = JSON.parse(JSON.stringify(edges));

  const MARGIN = {
    TOP: 10,
    BOTTOM: 10,
    LEFT: 10,
    RIGHT: 10,
  };
  const height = svg.attr("height");
  const width = svg.attr("width");

  // const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

  const color = this[Symbol.for("color")];
  const sizeScale = this[Symbol.for("sizeScale")];
  const count = this[Symbol.for("count")];
  const edgeSym = Symbol.for("nodeAdjEdges");

  const nodeHash = {};
  nodesC.forEach((node) => {
    nodeHash[node.id] = node;
  });

  edgesC.forEach((edge) => {
    edge.weight = parseInt(edge.value);
    edge.sourceNode = nodeHash[edge.source];
    edge.targetNode = nodeHash[edge.target];
  });

  nodesC.forEach((node) => {
    const adjEdges = edgesC.filter((edge) => {
      return edge.sourceNode === node || edge.targetNode === node;
    });
    node[edgeSym] = adjEdges;
  });

  const pointScale = d3
    .scalePoint()
    .domain(nodesC.map((node) => node.id))
    .range([0, WIDTH]);

  const arcG = svg
    .append("g")
    .attr("id", "arcG")
    .attr("transform", `translate(${MARGIN.LEFT},${height / 2})`);

  const links = arcG
    .selectAll("path")
    .data(edgesC)
    .enter()
    .append("path")
    .attr("class", "link")
    .style("stroke-width", (d) => d.weight * 0.5)
    .style("stroke", (d) => {
      return color(d.sourceNode.id);
    })
    .style("stroke-opacity", 0.25)
    .style("fill", "none")
    .attr("d", (d) => arc(d))
    .attr("marker-end", "url(#arrow)");

  const circles = arcG
    .selectAll("circle")
    .data(nodesC)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("fill", (d) => color(d.id))
    .attr("r", (d) => sizeScale(count[d.id]))
    .attr("cx", (d) => pointScale(d.id))
    .attr("data-tooltip", (d) => d.id);

  circles.on("mouseover", function (e, d) {
    // highlight current node
    d3.select(this).classed("active", true);

    // fade out all other nodes, highlight a little connected ones
    circles
      .classed("fadeout", (p) => d !== p)
      .classed("half-active", (p) => {
        return (
          p !== d &&
          d[edgeSym].some(
            (edge) => edge.sourceNode === p || edge.targetNode === p
          )
        );
      });

    // fadeout not connected edges, highlight connected ones
    links
      .classed("fadeout", (p) => !d[edgeSym].includes(p))
      .classed("active", (p) => d[edgeSym].includes(p));
  });

  circles.on("mouseleave", function () {
    circles
      .classed("active", false)
      .classed("fadeout", false)
      .classed("half-active", false);
    links
      .classed("active", false)
      .classed("fadeout", false)
      .classed("half-active", false);
  });

  function arc(d) {
    const draw = d3.line().curve(d3.curveBasis);
    const sourceX = pointScale(d.sourceNode.id);
    const targetX = pointScale(d.targetNode.id);
    console.log(sourceX - targetX);
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceX - targetX) / 3;
    return draw([
      [sourceX, 0],
      [midX, midY],
      [targetX, 0],
    ]);
  }
}
