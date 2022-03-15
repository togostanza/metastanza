import * as d3 from "d3";

function arc(d) {
  var draw = d3.line().curve(d3.curveBasis);
  var midX = (d.source.x + d.target.x) / 2;
  var midY = (d.source.x - d.target.x) * 2;
  return draw([
    [d.source.x, 0],
    [midX, midY],
    [d.target.x, 0],
  ]);
}
export default function (nodes, edges) {
  const root = this.root.querySelector(":scope > div");

  const width = parseInt(this.params["width"]) || 300;
  const height = parseInt(this.params["height"]) || 200;

  const color = this[Symbol.for("color")];
  const sizeScale = this[Symbol.for("sizeScale")];
  const count = this[Symbol.for("count")];

  const nodeHash = {};
  nodes.forEach((node, i) => {
    nodeHash[node.id] = node;
    node.x = parseInt(i) * 10;
  });
  edges.forEach((edge) => {
    edge.weight = parseInt(edge.value);
    edge.source = nodeHash[edge.source];
    edge.target = nodeHash[edge.target];
  });

  const svg = d3
    .select(root)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const arcG = svg
    .append("g")
    .attr("id", "arcG")
    .attr("transform", `translate(50,${height / 2})`);

  arcG
    .selectAll("path")
    .data(edges)
    .enter()
    .append("path")
    .attr("class", "arc")
    .style("stroke-width", (d) => d.weight * 0.5)
    .style("stroke", (d) => color(d.source.id))
    .style("stroke-opacity", 0.25)
    .style("fill", "none")
    .attr("d", arc)
    .attr("marker-end", "url(#arrow)");

  arcG
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("fill", (d) => color(d.id))
    .attr("r", (d) => sizeScale(count[d.id]))
    .attr("cx", (d) => d.x);

  svg.selectAll("circle").on("mouseover", nodeOver);
  svg.selectAll("path").on("mouseover", edgeOver);
  svg.selectAll("circle").on("mouseout", nodeOut);
  svg.selectAll("path").on("mouseout", edgeOut);

  function nodeOut() {
    d3.select(this).classed("active", false);
    svg.selectAll("path").classed("active", false);
  }

  function edgeOut() {
    d3.select(this).classed("active", false);
    svg.selectAll("circle").classed("active", false);
  }

  function nodeOver(e, d) {
    svg.selectAll("circle").classed("active", (p) => p === d);
    svg
      .selectAll("path")
      .classed("active", (p) => p.source === d || p.target === d);
  }
  function edgeOver(e, d) {
    svg.selectAll("path").classed("active", (p) => p === d);
    svg
      .selectAll("circle")
      .classed("source", (p) => p === d.source)
      .classed("target", (p) => p === d.target);
  }
}
