import * as d3 from "d3";
export default function (nodesC, edgesC, params) {
  nodesC = JSON.parse(JSON.stringify(nodesC));
  edgesC = JSON.parse(JSON.stringify(edgesC));

  const {
    color,
    symbols,
    nodeSizeParams,
    nodeColorParams,
    edgeWidthParams,
    edgeColorParams,
  } = params;

  const nodeHash = {};
  nodesC.forEach((node) => {
    nodeHash[node.id] = node;
  });

  // Edges width
  let edgeWidthScale;
  if (
    edgeWidthParams.basedOn === "data key" &&
    edgesC.some(
      (edge) =>
        edge[edgeWidthParams.dataKey] &&
        edgeWidthParams.minWidth &&
        edgeWidthParams.maxWidth
    )
  ) {
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
      parseFloat(edge[edgeWidthParams.dataKey]) || edgeWidthParams.minWidth
    );
    edge[symbols.sourceNodeSym] = nodeHash[edge.source];
    edge[symbols.targetNodeSym] = nodeHash[edge.target];
  });

  // Add adjacent edges to node
  nodesC.forEach((node) => {
    const adjEdges = edgesC.filter((edge) => {
      return (
        edge[symbols.sourceNodeSym] === node ||
        edge[symbols.targetNodeSym] === node
      );
    });
    node[symbols.edgeSym] = adjEdges;
  });

  // Nodes color
  if (
    nodeColorParams.basedOn === "data key" &&
    nodesC.some((d) => d[nodeColorParams.dataKey])
  ) {
    const nodeColorFunc = color();
    // Match hex color
    const regex = /^#(?:[0-9a-f]{3}){1,2}$/i;
    nodesC.forEach((node) => {
      // if data key value is a hex color, use it, else use color ordinal scale provided
      if (regex.test(node[nodeColorParams.dataKey])) {
        node[symbols.nodeColorSym] = node[nodeColorParams.dataKey];
      } else if ("" + node[nodeColorParams.dataKey]) {
        node[symbols.nodeColorSym] = nodeColorFunc(
          node[nodeColorParams.dataKey]
        );
      } else {
        node[symbols.nodeColorSym] = null;
      }
    });
  } else {
    nodesC.forEach((node) => {
      node[symbols.nodeColorSym] = null;
    });
  }
  // ===

  //Edges color
  if (
    edgeColorParams.basedOn === "data key" &&
    edgesC.some((d) => d[edgeColorParams.dataKey])
  ) {
    const edgeColorFunc = color();
    // Match hex color
    const regex = /^#(?:[0-9a-f]{3}){1,2}$/i;
    edgesC.forEach((edge) => {
      // if data key value is a hex color, use it, else use color ordinal scale provided
      if (regex.test(edge[edgeColorParams.dataKey])) {
        edge[symbols.edgeColorSym] = edge[edgeColorParams.dataKey];
      } else if (edge[edgeColorParams.dataKey]) {
        edge[symbols.edgeColorSym] = edgeColorFunc(
          edge[edgeColorParams.dataKey]
        );
      } else {
        edge[symbols.edgeColorSym] = null;
      }
    });
  } else if (edgeColorParams.basedOn.match(/source|target/gi)) {
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
  if (
    nodeSizeParams.basedOn === "data key" &&
    nodesC.some((d) => d[nodeSizeParams.dataKey]) &&
    nodeSizeParams.minSize &&
    nodeSizeParams.maxSize
  ) {
    nodeSizeScale = d3
      .scaleLinear()
      .domain(d3.extent(nodesC, (d) => d[nodeSizeParams.dataKey]))
      .range([nodeSizeParams.minSize, nodeSizeParams.maxSize]);
    nodesC.forEach((node) => {
      node[symbols.nodeSizeSym] = nodeSizeScale(node[nodeSizeParams.dataKey]);
    });
  } else {
    nodesC.forEach((node) => {
      node[symbols.nodeSizeSym] = nodeSizeParams.fixedSize;
    });
  }

  return { prepNodes: nodesC, prepEdges: edgesC };
  // ===
}
