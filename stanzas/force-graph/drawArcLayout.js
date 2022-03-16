import * as d3 from "d3";

export default function () {
  const nodes = this[Symbol.for("nodes")];
  const edges = this[Symbol.for("edges")];

  console.log("edges", edges);
  const root = this.root.querySelector(":scope > div");
  const width = parseInt(this.params["width"]) || 300;
  const height = parseInt(this.params["height"]) || 200;

  const color = this[Symbol.for("color")];
  const sizeScale = this[Symbol.for("sizeScale")];
  const count = this[Symbol.for("count")];

  // Laying out nodes=========
  nodes.forEach((node, i) => {
    node.x = parseInt(i) * 10;
  });
  // =========

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
    .style("stroke", (d) => {
      return color(d.sourceNode.id);
    })
    .style("stroke-opacity", 0.25)
    .style("fill", "none")
    .attr("d", (d) => arc(d))
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
      .classed("active", (p) => p.sourceNode === d || p.targetNode === d);
  }
  function edgeOver(e, d) {
    svg.selectAll("path").classed("active", (p) => p === d);
    svg
      .selectAll("circle")
      .classed("source", (p) => p === d.sourceNode)
      .classed("target", (p) => p === d.targetNode);
  }
  function arc(d) {
    const draw = d3.line().curve(d3.curveBasis);
    const midX = (d.sourceNode.x + d.targetNode.x) / 2;
    const midY = (d.sourceNode.x - d.targetNode.x) * 2;
    return draw([
      [d.sourceNode.x, 0],
      [midX, midY],
      [d.targetNode.x, 0],
    ]);
  }
}
