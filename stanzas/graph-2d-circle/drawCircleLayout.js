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
    edgeParams,
  }
) {
  const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

  const R = Math.min(WIDTH, HEIGHT) / 2;

  // Laying out nodes ===
  const angleScale = d3
    .scalePoint()
    .domain(nodes.map((node) => node.id))
    .range([0, 360 - 360 / nodes.length]);

  nodes.forEach((node) => {
    node.x = Math.cos((angleScale(node.id) / 180) * Math.PI) * R + WIDTH / 2;
    node.y = Math.sin((angleScale(node.id) / 180) * Math.PI) * R + HEIGHT / 2;
  });

  // =========

  const circleG = svg
    .append("g")
    .attr("id", "circleG")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  let links;
  let draw;

  if (edgeParams.type === "line") {
    links = circleG
      .selectAll("path")
      .data(edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke-width", (d) => d[symbols.edgeWidthSym])
      .style("stroke", (d) => d[symbols.edgeColorSym])
      .attr("x1", (d) => d[symbols.sourceNodeSym].x)
      .attr("y1", (d) => d[symbols.sourceNodeSym].y)
      .attr("x2", (d) => d[symbols.targetNodeSym].x)
      .attr("y2", (d) => d[symbols.targetNodeSym].y);
  } else if (edgeParams.type === "curve") {
    draw = d3.line().curve(d3.curveBasis);

    links = circleG
      .selectAll("path")
      .data(edges)
      .enter()
      .append("path")
      .attr("class", "link")
      .style("stroke-width", (d) => d[symbols.edgeWidthSym])
      .style("stroke", (d) => d[symbols.edgeColorSym])
      .attr("d", arc);
  }

  function movePoint(pointA, pointB, distance) {
    // Move point a towards point b by distance
    const vector = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
    const length = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    const unitVector = [vector[0] / length, vector[1] / length];
    return [
      pointA[0] + unitVector[0] * distance,
      pointA[1] + unitVector[1] * distance,
    ];
  }

  function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  }

  function arc(d) {
    const sourceX = d[symbols.sourceNodeSym].x;
    const targetX = d[symbols.targetNodeSym].x;
    const sourceY = d[symbols.sourceNodeSym].y;
    const targetY = d[symbols.targetNodeSym].y;
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    const movedPoint = movePoint(
      [midX, midY],
      [WIDTH / 2, HEIGHT / 2],
      (distance([midX, midY], [WIDTH / 2, HEIGHT / 2]) *
        edgeParams.curveStrength *
        1.5) /
        100
    );

    return draw([[sourceX, sourceY], [...movedPoint], [targetX, targetY]]);
  }

  const nodeGroups = circleG
    .selectAll("g")
    .data(nodes)
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

  if (labelsParams.dataKey !== "" && nodes[0][labelsParams.dataKey]) {
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
