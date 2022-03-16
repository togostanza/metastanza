import * as d3 from "d3";

export default function () {
  const nodes = this[Symbol.for("nodes")];
  const edges = this[Symbol.for("edges")];

  const root = this.root.querySelector(":scope > div");
  const width = parseInt(this.params["width"]) || 300;
  const height = parseInt(this.params["height"]) || 200;

  const color = this[Symbol.for("color")];
  const sizeScale = this[Symbol.for("sizeScale")];
  const count = this[Symbol.for("count")];

  const svg = d3
    .select(root)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const gLinks = svg.append("g").attr("class", "links");
  const gNodes = svg.append("g").attr("class", "nodes");

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
    .force(
      "link",
      d3
        .forceLink()
        .links(edges)
        .id((d) => d.id)
        .distance(50)
        .strength(0.5)
    )
    .force(
      "collide",
      d3
        .forceCollide()
        .radius((d) => sizeScale(count[d.id]))
        .iterations(2)
        .strength(0.9)
    )
    .on("tick", ticked);

  const joinedLinks = gLinks
    .selectAll("line")
    .data(edges)
    .join("line")
    .attr("stroke", "gray");

  function updateLinks() {
    joinedLinks
      .attr("x1", (d) => d.sourceNode.x)
      .attr("y1", (d) => d.sourceNode.y)
      .attr("x2", (d) => d.targetNode.x)
      .attr("y2", (d) => d.targetNode.y);
  }
  function updateNodes() {
    joinedNodes.attr("transform", (d) => {
      const r = sizeScale(count[d.id]);
      const dx = Math.max(r, Math.min(width - r, d.x));
      const dy = Math.max(r, Math.min(width - r, d.y));
      d.x = dx;
      d.y = dy;
      return `translate(${dx},${dy})`;
    });
    //joinedNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  function ticked() {
    updateLinks();
    updateNodes();
  }

  const joinedNodes = gNodes
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(drag(simulation));

  joinedNodes
    .append("circle")
    .attr("r", (d) => {
      return sizeScale(count[d.id]);
    })
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("fill", (d) => color(d.id))
    .attr("data-tooltip", (d) => d.id);

  joinedNodes
    .append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function (d) {
      return d.id;
    });

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
}
