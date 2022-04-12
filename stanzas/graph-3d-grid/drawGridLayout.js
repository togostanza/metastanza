import * as d3 from "d3";
import prepareGraphData from "./prepareGraphData";
export default function (svg, nodes, edges, params) {
  const nodesC = JSON.parse(JSON.stringify(nodes));
  const edgesC = JSON.parse(JSON.stringify(edges));

  prepareGraphData(nodesC, edgesC, params);
  const {
    width,
    height,
    MARGIN,
    symbols,
    labelsParams,
    tooltipParams,
    highlightAdjEdges,
  } = params;

  const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

  // Laying out nodes=========

  let ii = 0;
  let jj = 0;

  const gridSize = Math.ceil(Math.sqrt(nodesC.length));

  const dx = WIDTH / (gridSize - 1);
  const dy = HEIGHT / (gridSize - 1);

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
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const links = gridG
    .selectAll("path")
    .data(edgesC)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke-width", (d) => d[symbols.edgeWidthSym])
    .style("stroke", (d) => d[symbols.edgeColorSym])
    .attr("x1", (d) => d[symbols.sourceNodeSym].x)
    .attr("y1", (d) => d[symbols.sourceNodeSym].y)
    .attr("x2", (d) => d[symbols.targetNodeSym].x)
    .attr("y2", (d) => d[symbols.targetNodeSym].y);

  const nodeGroups = gridG
    .selectAll("g")
    .data(nodesC)
    .enter()
    .append("g")
    .attr("class", "node-group")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  const nodeCircles = nodeGroups
    .append("circle")
    .attr("class", "node")
    .style("fill", (d) => d[symbols.nodeColorSym])
    .attr("r", (d) => d[symbols.nodeSizeSym]);

  if (tooltipParams.show) {
    nodeCircles.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
  }

  if (labelsParams.dataKey !== "" && nodesC[0][labelsParams.dataKey]) {
    nodeGroups
      .append("text")
      .text((d) => d[labelsParams.dataKey])
      .attr("alignment-baseline", "middle")
      .attr("x", labelsParams.margin)
      .attr("class", "label");
  }

  if (highlightAdjEdges) {
    nodeGroups.on("mouseover", function (e, d) {
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
