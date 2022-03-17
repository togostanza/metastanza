import * as d3 from "d3";

export default function (svg, nodes, edges) {
  const nodesC = JSON.parse(JSON.stringify(nodes));
  const edgesC = JSON.parse(JSON.stringify(edges));

  const width = svg.attr("width");
  const height = svg.attr("height");

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

  // Laying out nodes=========
  const marX = 50;
  const marY = 30;

  let ii = 0;
  let jj = 0;

  const gridSize = Math.ceil(Math.sqrt(nodesC.length));

  const dx = (width - 2 * marX) / (gridSize - 1);
  const dy = (height - 2 * marY) / (gridSize - 1);

  // add random noise to pisition to prevent fully overlapping edges

  const rand = () => {
    return 0;
  }; // d3.randomNormal(0, 5);

  nodesC.forEach((node) => {
    if (jj < gridSize) {
      node.x = jj * dx + rand();
      node.y = ii * dy + rand();
      jj++;
    } else {
      jj = 0;
      ii++;
      node.x = jj * dx + rand();
      node.y = ii * dy + rand();
      jj++;
    }
  });
  // =========

  const gridG = svg
    .append("g")
    .attr("id", "gridG")
    .attr("transform", `translate(${marX},${marY})`);

  const links = gridG
    .selectAll("path")
    .data(edgesC)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", (d) => d.weight * 0.5)
    .style("stroke", (d) => color(d.sourceNode.id))
    .style("stroke-opacity", 0.25)
    .style("stroke-linecap", "round")
    .attr("x1", (d) => d.sourceNode.x)
    .attr("y1", (d) => d.sourceNode.y)
    .attr("x2", (d) => d.targetNode.x)
    .attr("y2", (d) => d.targetNode.y);

  const circles = gridG
    .selectAll("circle")
    .data(nodesC)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("fill", (d) => color(d.id))
    .attr("r", (d) => sizeScale(count[d.id]))
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
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
}
