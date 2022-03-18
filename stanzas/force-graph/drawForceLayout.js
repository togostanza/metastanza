import * as d3 from "d3";

export default function (svg, nodes, edges, params) {
  const nodesC = JSON.parse(JSON.stringify(nodes));
  const edgesC = JSON.parse(JSON.stringify(edges));

  const {
    width,
    height,
    MARGIN,
    color,
    symbols,
    nodeSizeParams,
    nodeColorParams,
    edgeWidthParams,
    edgeColorParams,
    labelsParams,
  } = params;

  const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

  const nodeHash = {};
  nodesC.forEach((node) => {
    nodeHash[node.id] = node;
  });

  // Edges width
  let edgeWidthScale;
  if (edgeWidthParams.basedOn === "dataKey") {
    edgeWidthScale = d3
      .scaleLinear()
      .domain(d3.extent(edgesC, (d) => d[edgeWidthParams.dataKey]))
      .range([edgeWidthParams.minWidth, edgeWidthParams.maxWidth]);
  } else {
    edgeWidthScale = () => edgeWidthParams.fixedWidth;
  }
  // ===

  edgesC.forEach((edge) => {
    edge[symbols.edgeWidthSym] = edgeWidthScale(
      parseFloat(edge[edgeWidthParams.dataKey])
    );
    edge[symbols.sourceNodeSym] = nodeHash[edge.source];
    edge[symbols.targetNodeSym] = nodeHash[edge.target];
  });

  nodesC.forEach((node) => {
    const adjEdges = edgesC.filter((edge) => {
      return (
        edge[symbols.sourceNodeSym] === node ||
        edge[symbols.targetNodeSym] === node
      );
    });
    node[symbols.edgeSym] = adjEdges;
  });

  //Edges color

  if (edgeColorParams.basedOn === "dataKey") {
    // Match hex color
    const regex = /^#(?:[0-9a-f]{3}){1,2}$/i;
    edgesC.forEach((edge) => {
      // if data key value is a hex color, use it, else use color ordinal scale provided
      if (regex.test(edge[edgeColorParams.dataKey])) {
        edge[symbols.edgeColorSym] = edge[edgeColorParams.dataKey];
      } else {
        edge[symbols.edgeColorSym] = color(edge[edgeColorParams.dataKey]);
      }
    });
  } else if (edgeColorParams.basedOn.match(/source|target/gi).length > 0) {
    const wichColor = edgeColorParams.basedOn.match(/source|target/gi)[0];
    edgesC.forEach((edge) => {
      edge[symbols.edgeColorSym] =
        edge[symbols[`${wichColor}NodeSym`]][symbols.nodeColorSym];
    });
  } else {
    edgesC.forEach((edge) => {
      edge[symbols.edgeColorSym] = null;
    });
  }

  // ===

  // Nodes size
  let nodeSizeScale;
  if (nodeSizeParams.basedOn === "dataKey") {
    nodeSizeScale = d3
      .scaleLinear()
      .domain(d3.extent(nodesC, (d) => d[nodeSizeParams.dataKey]))
      .range([nodeSizeParams.minSize, nodeSizeParams.maxSize]);
    nodesC.forEach((node) => {
      node[symbols.nodeSizeSym] = nodeSizeScale(node[nodeSizeParams.dataKey]);
    });
  } else if (nodeSizeParams.basedOn === "edgesNumber") {
    nodeSizeScale = d3
      .scaleLinear()
      .domain([0, d3.max(nodesC, (d) => d[symbols.edgeSym].length)])
      .range([nodeSizeParams.minSize, nodeSizeParams.maxSize]);

    nodesC.forEach((node) => {
      node[symbols.nodeSizeSym] = nodeSizeScale(node[symbols.edgeSym].length);
    });
  } else {
    nodesC.forEach((node) => {
      node[symbols.nodeSizeSym] = nodeSizeParams.fixedSize;
    });
  }
  // ===

  // Nodes color
  if (nodeColorParams.basedOn === "dataKey") {
    // Match hex color
    const regex = /^#(?:[0-9a-f]{3}){1,2}$/i;
    nodesC.forEach((node) => {
      // if data key value is a hex color, use it, else use color ordinal scale provided
      if (regex.test(node[nodeColorParams.dataKey])) {
        node[symbols.nodeColorSym] = node[nodeColorParams.dataKey];
      } else {
        node[symbols.nodeColorSym] = color(node[nodeColorParams.dataKey]);
      }
    });
  } else {
    nodesC.forEach((node) => {
      node[symbols.nodeColorSym] = null;
    });
  }
  // ===

  const forceG = svg
    .append("g")
    .attr("id", "forceG")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const gLinks = forceG.append("g").attr("class", "links");
  const gNodes = forceG.append("g").attr("class", "nodes");

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
        .radius((d) => d[symbols.nodeSizeSym])
        .iterations(2)
        .strength(0.9)
    )
    .on("tick", ticked);

  const links = gLinks
    .selectAll("line")
    .data(edgesC)
    .join("line")
    .style("stroke-width", (d) => d[symbols.edgeWidthSym])
    .style("stroke", (d) => {
      return color(d[symbols.sourceNodeSym].id);
    })
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
    //joinedNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  function ticked() {
    updateNodes();
    updateLinks();
  }

  const nodeGroups = gNodes
    .selectAll("g")
    .data(nodesC)
    .enter()
    .append("g")
    .attr("class", "node-group")
    .attr("transform", (d) => {
      return `translate(${d.x},${d.y})`;
    })
    .call(drag(simulation));

  nodeGroups
    .append("circle")
    .attr("class", "node")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => d[symbols.nodeSizeSym])
    .attr("fill", (d) => d[symbols.nodeColorSym])
    .attr("data-tooltip", (d) => d.id);

  nodeGroups
    .append("text")
    .attr("dx", labelsParams.margin)
    .attr("alignment-baseline", "middle")
    .text((d) => d.id);

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
