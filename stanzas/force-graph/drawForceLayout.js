import * as d3 from "d3";

export default function (svg, nodes, edges) {
  const nodesC = JSON.parse(JSON.stringify(nodes));
  const edgesC = JSON.parse(JSON.stringify(edges));

  const color = this[Symbol.for("color")];
  const sizeScale = this[Symbol.for("sizeScale")];
  const count = this[Symbol.for("count")];

  const width = svg.attr("width");
  const height = svg.attr("height");

  const gLinks = svg.append("g").attr("class", "links");
  const gNodes = svg.append("g").attr("class", "nodes");

  const simulation = d3
    .forceSimulation(nodesC)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
    .force(
      "link",
      d3
        .forceLink()
        .links(edgesC)
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
    .data(edgesC)
    .join("line")
    .attr("stroke", "gray");

  function updateLinks() {
    joinedLinks
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }
  function updateNodes() {
    joinedNodes.attr("transform", (d) => {
      //   const r = sizeScale(count[d.id]);
      //   const dx = Math.max(r, Math.min(width - r, d.x));
      //   const dy = Math.max(r, Math.min(width - r, d.y));
      //   d.x = dx;
      //   d.y = dy;
      return `translate(${d.x},${d.y})`;
    });
    //joinedNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  function ticked() {
    updateNodes();
    updateLinks();
  }

  const joinedNodes = gNodes
    .selectAll("g")
    .data(nodesC)
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
