import { b as color } from './transform-0e5d4876.js';
import { e as extent } from './extent-14a1e8e9.js';
import { l as linear } from './linear-919165bc.js';

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return unsafeStringify(rnds);
}

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

function prepareGraphData (nodesC, edgesC, params) {
  nodesC = JSON.parse(JSON.stringify(nodesC));
  edgesC = JSON.parse(JSON.stringify(edgesC));

  const {
    color: color$1,
    nodeSizeParams,
    nodeColorParams,
    edgeWidthParams,
    edgeColorParams,
    nodesSortParams,
  } = params;

  if (
    nodesSortParams &&
    nodesC.every((node) => node[nodesSortParams.sortBy] !== undefined)
  ) {
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
    edgeWidthScale = linear()
      .domain(extent(edgesC, (d) => d[edgeWidthParams.dataKey]))
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
    edge[symbols.idSym] = v4();
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
    const nodeColorFunc = color$1().domain(
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
      node[symbols.nodeBorderColorSym] = color(node[symbols.nodeColorSym].trim())
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
    const edgeColorFunc = color$1();
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
    nodeSizeScale = linear()
      .domain(extent(nodesC, (d) => d[nodeSizeParams.dataKey]))
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

const get3DEdges = (edgesC) => {
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
const getGroupPlanes = (groupHash, planeParams) => {
  const groupIds = Object.keys(groupHash);
  const { WIDTH, groupPlaneColorParams } = planeParams;
  const groupColor = planeParams.color().domain(groupIds.sort());

  function getGroupPlane(group) {
    const y = planeParams.yPointScale(group);
    const LU = [-WIDTH / 2, y, -WIDTH / 2];
    const LD = [-WIDTH / 2, y, WIDTH / 2];
    const RD = [WIDTH / 2, y, WIDTH / 2];
    const RU = [WIDTH / 2, y, -WIDTH / 2];
    const groupPlane = [LU, LD, RD, RU];
    groupPlane.group = groupHash[group];
    groupPlane.groupId = group;

    groupPlane.color =
      groupPlaneColorParams.basedOn === "fixed" ? null : groupColor(group);

    return groupPlane;
  }

  return groupIds.map(getGroupPlane);
};

export { getGroupPlanes as a, get3DEdges as g, prepareGraphData as p };
//# sourceMappingURL=prepareGraphData-d8bc622b.js.map
