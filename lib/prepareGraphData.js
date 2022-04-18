import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";

const edgeSym = Symbol("nodeAdjEdges");
const groupSym = Symbol("nodeGroup");
const edgeWidthSym = Symbol("edgeWidth");
const sourceNodeSym = Symbol("sourceNode");
const targetNodeSym = Symbol("targetNode");
const nodeSizeSym = Symbol("nodeSize");
const nodeColorSym = Symbol("nodeColor");
const nodeLabelSym = Symbol("nodeLabel");
const nodeBorderColorSym = Symbol("nodeBorderColor");
const edgeColorSym = Symbol("edgeColor");
const idSym = Symbol("id");

const symbols = {
  edgeSym,
  edgeWidthSym,
  sourceNodeSym,
  targetNodeSym,
  nodeSizeSym,
  nodeColorSym,
  groupSym,
  edgeColorSym,
  nodeLabelSym,
  idSym,
  nodeBorderColorSym,
};

export default function (nodesC, edgesC, params) {
  nodesC = JSON.parse(JSON.stringify(nodesC));
  edgesC = JSON.parse(JSON.stringify(edgesC));

  const {
    color,
    nodeSizeParams,
    nodeColorParams,
    edgeWidthParams,
    edgeColorParams,
    nodesSortParams,
  } = params;

  if (nodesC.every((node) => node[nodesSortParams.sortBy] !== undefined)) {
    nodesC.sort((a, b) => {
      if (a[nodesSortParams.sortBy] > b[nodesSortParams.sortBy]) {
        return nodesSortParams.sortOrder === "ascending" ? 1 : -1;
      }
      if (a[nodesSortParams.sortBy] < b[nodesSortParams.sortBy]) {
        return nodesSortParams.sortOrder === "ascending" ? -1 : 1;
      }
      return 0;
    });
  }
  const nodeHash = {};

  const groupHash = {};
  nodesC.forEach((node) => {
    const groupName = "" + node.group;
    groupHash[groupName]
      ? groupHash[groupName].push(node)
      : (groupHash[groupName] = [node]);
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

  edgesC.forEach((edge) => {
    edge[symbols.edgeWidthSym] = edgeWidthScale(
      parseFloat(edge[edgeWidthParams.dataKey]) || edgeWidthParams.minWidth || 1
    );
    edge[symbols.sourceNodeSym] = nodeHash[edge.source];
    edge[symbols.targetNodeSym] = nodeHash[edge.target];
    edge[symbols.idSym] = uuidv4();
  });
  // ===

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
    const nodeColorFunc = color().domain(
      [...new Set(nodesC.map((d) => "" + d[nodeColorParams.dataKey]))].sort()
    );
    // Match hex color
    const regex = /^#(?:[0-9a-f]{3}){1,2}$/i;
    nodesC.forEach((node) => {
      // if data key value is a hex color, use it, else use color ordinal scale provided
      if (regex.test(node[nodeColorParams.dataKey])) {
        node[symbols.nodeColorSym] = node[nodeColorParams.dataKey];
      } else if (typeof node[nodeColorParams.dataKey] !== "undefined") {
        node[symbols.nodeColorSym] = nodeColorFunc(
          "" + node[nodeColorParams.dataKey]
        );
      } else {
        node[symbols.nodeColorSym] = "black";
      }
      node[symbols.nodeBorderColorSym] = d3
        .color(node[symbols.nodeColorSym].trim())
        .darker(3);
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
  } else if (edgeColorParams.basedOn.match(/source|target/i)) {
    const wichColor = edgeColorParams.basedOn.match(/source|target/i)[0];
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
      node[symbols.nodeSizeSym] = nodeSizeParams.fixedSize || 4;
    });
  }

  return { prepNodes: nodesC, prepEdges: edgesC, nodeHash, groupHash, symbols };
  // ===
}

export const get3DEdges = (edgesC) => {
  return edgesC.map((edge) => {
    const toPush = [
      [
        edge[symbols.sourceNodeSym].x,
        edge[symbols.sourceNodeSym].y,
        edge[symbols.sourceNodeSym].z,
      ],
      [
        edge[symbols.targetNodeSym].x,
        edge[symbols.targetNodeSym].y,
        edge[symbols.targetNodeSym].z,
      ],
    ];

    toPush.edge = edge;
    return toPush;
  });
};

/**
 * Returns group planes objects
 * @param {Object} groupHash - groups hash table. {[groupId]: [{node1}, {node2}, ...]}
 * @param {Object} planeParams - plane params. {WIDTH, HEIGHT, DEPTH, color}
 * @returns {Array} group planes objects array
 */
export const getGroupPlanes = (groupHash, planeParams) => {
  const groupIds = Object.keys(groupHash);
  const { WIDTH, HEIGHT, groupPlaneColorParams } = planeParams;
  const groupColor = planeParams.color().domain(groupIds.sort());

  function getGroupPlane(group) {
    const y = planeParams.yPointScale(group);
    const LU = [-WIDTH / 2, y, -HEIGHT / 2];
    const LD = [-WIDTH / 2, y, HEIGHT / 2];
    const RD = [WIDTH / 2, y, HEIGHT / 2];
    const RU = [WIDTH / 2, y, -HEIGHT / 2];
    const groupPlane = [LU, LD, RD, RU];
    groupPlane.group = groupHash[group];
    groupPlane.groupId = group;

    groupPlane.color =
      groupPlaneColorParams.basedOn === "fixed" ? null : groupColor(group);

    return groupPlane;
  }

  return groupIds.map(getGroupPlane);
};
