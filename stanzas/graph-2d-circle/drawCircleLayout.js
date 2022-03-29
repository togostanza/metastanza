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

  const R = Math.min(WIDTH, HEIGHT) / 2;

  // Laying out nodes ===
  const angleScale = d3
    .scalePoint()
    .domain(nodesC.map((node) => node.id))
    .range([0, 360 - 360 / nodesC.length]);

  nodesC.forEach((node) => {
    node.x = Math.cos((angleScale(node.id) / 180) * Math.PI) * R + WIDTH / 2;
    node.y = Math.sin((angleScale(node.id) / 180) * Math.PI) * R + HEIGHT / 2;
  });

  // =========

  const circleG = svg
    .append("g")
    .attr("id", "circleG")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const links = circleG
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

  const nodeGroups = circleG
    .selectAll("g")
    .data(nodesC)
    .enter()
    .append("g")
    .attr("class", "node-group")
    .attr(
      "transform",
      (d) =>
        `translate(${WIDTH / 2 + R},${HEIGHT / 2}) rotate(${angleScale(d.id)} ${
          -WIDTH / 2
        } 0)`
    );

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
      .attr("text-anchor", (d) => {
        if (angleScale(d.id) > 90 && angleScale(d.id) < 270) {
          return "end";
        }
        return "start";
      })
      .attr("x", (d) => {
        if (angleScale(d.id) > 90 && angleScale(d.id) < 270) {
          return -labelsParams.margin;
        }
        return labelsParams.margin;
      })
      .attr("transform", (d) => {
        if (angleScale(d.id) > 90 && angleScale(d.id) < 270) {
          return "rotate(180)";
        }
        return null;
      })
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
