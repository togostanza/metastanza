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

  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

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
    .style("stroke-width", (d) => d[symbols.edgeWidthSym])
    .style("stroke", (d) => d[symbols.edgeColorSym])
    .attr("d", (d) => arc(d));

  const nodeGroups = arcG
    .selectAll("g")
    .data(nodesC)
    .enter()
    .append("g")
    .attr("class", "node-group")
    .attr("transform", (d) => `translate(${pointScale(d.id)},0)`);

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
      //.attr("text-anchor", "end")
      .attr("transform", "rotate(90)")
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

  function arc(d) {
    const draw = d3.line().curve(d3.curveBasis);
    const sourceX = pointScale(d[symbols.sourceNodeSym].id);
    const targetX = pointScale(d[symbols.targetNodeSym].id);
    const midX = (sourceX + targetX) / 2;
    let midY;
    if (sourceX < targetX) {
      midY = -(height / 12 + (targetX - sourceX) / 3);
    } else {
      midY = -(height / 20 + (sourceX - targetX) / 3);
    }
    return draw([
      [sourceX, 0],
      [midX, midY],
      [targetX, 0],
    ]);
  }
}
