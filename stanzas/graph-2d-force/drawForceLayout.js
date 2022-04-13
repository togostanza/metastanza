import * as d3 from "d3";
export default function (
  svg,
  nodes,
  edges,
  {
    width,
    height,
    MARGIN,
    symbols,
    labelsParams,
    tooltipParams,
    highlightAdjEdges,
  }
) {
  const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

  const forceG = svg
    .append("g")
    .attr("id", "forceG")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const gLinks = forceG.append("g").attr("class", "links");
  const gNodes = forceG.append("g").attr("class", "nodes");

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
        .radius((d) => d[symbols.nodeSizeSym])
        .iterations(2)
        .strength(0.9)
    )
    .on("tick", ticked);

  const links = gLinks
    .selectAll("line")
    .data(edges)
    .join("line")
    .style("stroke-width", (d) => d[symbols.edgeWidthSym])
    .style("stroke", (d) => d[symbols.edgeColorSym])
    .attr("class", "link");

  function updateLinks() {
    links
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }
  function updateNodes() {
    nodeGroups.attr("transform", (d) => {
      const r = d[symbols.nodeSizeSym];
      const dx = Math.max(r, Math.min(WIDTH - r, d.x));
      const dy = Math.max(r, Math.min(HEIGHT - r, d.y));
      d.x = dx;
      d.y = dy;
      return `translate(${d.x},${d.y})`;
    });
  }

  function ticked() {
    updateNodes();
    updateLinks();
  }

  const nodeGroups = gNodes
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node-group")
    .attr("transform", (d) => {
      return `translate(${d.x},${d.y})`;
    })
    .call(drag(simulation));

  const nodeCircles = nodeGroups
    .append("circle")
    .attr("class", "node")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => d[symbols.nodeSizeSym])
    .style("fill", (d) => d[symbols.nodeColorSym]);

  if (tooltipParams.show) {
    nodeCircles.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
  }

  if (labelsParams.dataKey !== "" && nodes[0][labelsParams.dataKey]) {
    nodeGroups
      .append("text")
      .attr("dx", labelsParams.margin)
      .attr("class", "label")
      .attr("alignment-baseline", "middle")
      .text((d) => d[labelsParams.dataKey]);
  }

  let isDragging = false;

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      isDragging = true;
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      isDragging = false;
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

  if (highlightAdjEdges) {
    nodeGroups.on("mouseover", function (e, d) {
      if (isDragging) {
        return;
      }
      // highlight current node
      d3.select(this).classed("active", true);
      // fade out all other nodes, highlight a little connected ones
      nodeGroups
        .classed("fadeout", (p) => d !== p)
        .classed("half-active", (p) => {
          return (
            p !== d &&
            d[symbols.edgeSym].some(
              (edge) =>
                edge[symbols.sourceNodeSym] === p ||
                edge[symbols.targetNodeSym] === p
            )
          );
        });

      // fadeout not connected edges, highlight connected ones
      links
        .classed("fadeout", (p) => !d[symbols.edgeSym].includes(p))
        .classed("active", (p) => d[symbols.edgeSym].includes(p));
    });

    nodeGroups.on("mouseleave", function () {
      if (isDragging) {
        return;
      }
      links
        .classed("active", false)
        .classed("fadeout", false)
        .classed("half-active", false);
      nodeGroups
        .classed("active", false)
        .classed("fadeout", false)
        .classed("half-active", false);
    });
  }
}
