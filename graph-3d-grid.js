import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { s as select } from './index-847f2a80.js';
import { _ as _3d } from './3d-7f166d8e.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { T as ToolTip } from './ToolTip-23bc44c8.js';
import { p as prepareGraphData, g as get3DEdges, a as getGroupPlanes } from './prepareGraphData-e6f24e2e.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import { d as drag } from './drag-c4f62c8c.js';
import { p as point } from './band-6f9e71db.js';
import { o as ordinal } from './ordinal-0cb0fa8d.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';
import './extent-14a1e8e9.js';
import './linear-af9e44cc.js';
import './descending-63ef45b8.js';
import './range-e15c6861.js';

class GridGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "graph-3d-grid"),
      downloadPngMenuItem(this, "graph-3d-grid"),
      downloadJSONMenuItem(this, "graph-3d-grid", this._data),
      downloadCSVMenuItem(this, "graph-3d-grid", this._data),
      downloadTSVMenuItem(this, "graph-3d-grid", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //data

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    const nodes = values.nodes;
    const edges = values.links;

    const MARGIN = {
      TOP: this.params["padding"],
      BOTTOM: this.params["padding"],
      LEFT: this.params["padding"],
      RIGHT: this.params["padding"],
    };
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    // Setting color scale
    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }
    const color = function () {
      return ordinal().range(togostanzaColors);
    };

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("graph-3d-grid");

    const existingSvg = root.getElementsByTagName("svg")[0];
    if (existingSvg) {
      existingSvg.remove();
    }
    const svg = select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const groupPlaneColorParams = {
      basedOn: this.params["group-plane-color-based-on"],
      // default fixed color by css
    };

    const groupsSortParams = {
      sortBy: this.params["group-planes-sort-by"],
      sortOrder: this.params["group-planes-sort-order"] || "ascending",
    };

    const nodesSortParams = {
      sortBy: this.params["nodes-sort-by"],
      sortOrder: this.params["nodes-sort-order"] || "ascending",
    };

    const nodeSizeParams = {
      basedOn: this.params["node-size-based-on"] || "fixed",
      dataKey: this.params["node-size-data-key"] || "",
      fixedSize: this.params["node-fixed-size"] || 3,
      minSize: this.params["node-min-size"],
      maxSize: this.params["node-max-size"],
    };
    const nodeColorParams = {
      basedOn: this.params["node-color-based-on"] || "fixed",
      dataKey: this.params["node-color-data-key"] || "",
    };

    const edgeWidthParams = {
      basedOn: this.params["edge-width-based-on"] || "fixed",
      dataKey: this.params["edge-width-data-key"] || "",
      fixedWidth: this.params["edge-fixed-width"] || 1,
      minWidth: this.params["edge-min-width"],
      maxWidth: this.params["edge-max-width"],
    };

    const edgeColorParams = {
      basedOn: this.params["edge-color-based-on"] || "fixed",
      dataKey: this.params["edge-color-data-key"] || "",
    };

    const tooltipParams = {
      dataKey: this.params["nodes-tooltip-data-key"],
      show: nodes.some((d) => d[this.params["nodes-tooltip-data-key"]]),
    };

    const highlightAdjEdges = this.params["highlight-adjacent-edges"] || false;
    const highlightGroupPlanes = this.params["highlight-group-planes"] || false;

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      highlightAdjEdges,
      nodeSizeParams,
      nodesSortParams,
      groupsSortParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      tooltipParams,
    };

    const { prepNodes, prepEdges, groupHash, symbols } = prepareGraphData(
      nodes,
      edges,
      params
    );

    const origin = [MARGIN.LEFT + WIDTH / 2, MARGIN.TOP + HEIGHT / 2];
    const scale = 0.75;

    let isDragging = false;

    const key = function (d) {
      return d.id;
    };

    const startAngle = (Math.PI * 8) / 180;

    const svgG = svg
      .call(
        drag().on("drag", dragged).on("start", dragStart).on("end", dragEnd)
      )
      .append("g");

    var mx, my, mouseX, mouseY;

    const point3d = _3d()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      })
      .z(function (d) {
        return d.z;
      })
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    const edge3d = _3d()
      .scale(scale)
      .origin(origin)
      .shape("LINE")

      .rotateY(startAngle)
      .rotateX(-startAngle);

    const plane3d = _3d()
      .shape("PLANE")
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    function processData(data) {
      const planes = svgG.selectAll("path").data(data[2], (d) => d.groupId);

      planes
        .enter()
        .append("path")
        .attr("class", "_3d")
        .classed("group-plane", true)
        .merge(planes)
        .attr("style", (d) => `fill: ${d.color}`)
        .attr("d", plane3d.draw)
        .sort(plane3d.sort);

      planes.exit().remove();
      const linesStrip = svgG
        .selectAll("line")
        .data(data[1], (d) => d.edge[symbols.idSym]);

      linesStrip
        .enter()
        .append("line")
        .attr("class", "_3d")
        .classed("link", true)
        .merge(linesStrip)
        .style("stroke", (d) => d.edge[symbols.edgeColorSym])
        .style("stroke-width", (d) => d.edge[symbols.edgeWidthSym])
        .attr("x1", (d) => d.edge[symbols.sourceNodeSym].projected.x)
        .attr("y1", (d) => d.edge[symbols.sourceNodeSym].projected.y)
        .attr("x2", (d) => d.edge[symbols.targetNodeSym].projected.x)
        .attr("y2", (d) => d.edge[symbols.targetNodeSym].projected.y)
        .sort(edge3d.sort);

      linesStrip.exit().remove();

      const points = svgG.selectAll("circle").data(data[0], key);

      const p = points
        .enter()
        .append("circle")
        .attr("class", "_3d")
        .classed("node", true)
        .merge(points)
        .attr("cx", posPointX)
        .attr("cy", posPointY)
        .attr("r", (d) => d[symbols.nodeSizeSym])
        .style("stroke", (d) => d[symbols.nodeBorderColorSym])
        .style("fill", (d) => d[symbols.nodeColorSym])
        .sort(point3d.sort);

      if (tooltipParams.show) {
        p.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
      }

      points.exit().remove();
    }

    function posPointX(d) {
      return d.projected.x;
    }

    function posPointY(d) {
      return d.projected.y;
    }

    let groupPlanes = [];

    let edgesWithCoords = [];

    function isNumeric(str) {
      if (typeof str !== "string") {
        return false;
      } // we only process strings!
      return (
        !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str))
      ); // ...and ensure strings of whitespace fail
    }

    function init() {
      // Add x,y,z of source and target nodes to 3D edges
      edgesWithCoords = get3DEdges(prepEdges);

      // Laying out nodes=========
      const DEPTH = HEIGHT;

      // Check if group ids is a numbers. (To make group hash, group ids are all converted to strings by doing "" + groupId)
      const ifGroupIdsIsNumber = Object.keys(groupHash).every((groupId) =>
        isNumeric(groupId)
      );

      let modificator;
      if (ifGroupIdsIsNumber) {
        modificator = (str) => parseInt(str);
      } else {
        modificator = (str) => str;
      }

      const yPointScale = point([-DEPTH / 2, DEPTH / 2]).domain(
        Object.keys(groupHash).sort((a, b) => {
          if (modificator(a) > modificator(b)) {
            return groupsSortParams.sortOrder === "ascending" ? 1 : -1;
          }
          if (modificator(a) < modificator(b)) {
            return groupsSortParams.sortOrder === "ascending" ? -1 : 1;
          }
          return 0;
        })
      );

      const offset = WIDTH * 0.1;
      Object.keys(groupHash).forEach((gKey) => {
        let ii = 0;
        let jj = 0;

        const group = groupHash[gKey];
        const gridSize = Math.ceil(Math.sqrt(groupHash[gKey].length));

        const dx = (WIDTH - 2 * offset) / (gridSize - 1);
        const dz = (WIDTH - 2 * offset) / (gridSize - 1);

        group.forEach((node, index) => {
          if (group.length === 1) {
            node.x = 0;
            node.z = 0;
            node.y = yPointScale(gKey);
            return;
          } else if (group.length === 2) {
            node.x = 0 + index * (WIDTH / 3) - WIDTH / 6;
            node.z = 0;
            node.y = yPointScale(gKey);
            jj++;
            return;
          }
          if (jj < gridSize) {
            node.x = offset + jj * dx - WIDTH / 2;
            node.z = offset + ii * dz - WIDTH / 2;
            node.y = yPointScale(gKey);
            jj++;
          } else {
            jj = 0;
            ii++;
            node.x = offset + jj * dx - WIDTH / 2;
            node.z = offset + ii * dz - WIDTH / 2;
            node.y = yPointScale(gKey);
            jj++;
          }
        });
      });

      groupPlanes = getGroupPlanes(groupHash, {
        WIDTH,
        HEIGHT,
        DEPTH,
        color,
        yPointScale,
        groupPlaneColorParams,
      });

      const data = [
        point3d(prepNodes),
        edge3d(edgesWithCoords),
        plane3d(groupPlanes),
      ];

      processData(data);

      const planes = svgG.selectAll("path.group-plane");
      const points = svgG.selectAll("circle.node");
      const links = svgG.selectAll("line.link");

      if (highlightGroupPlanes) {
        addPlanesHighlight(planes, points, links);
      }

      if (highlightAdjEdges) {
        addEdgesHighlight(points, links);
      }
    }

    function dragStart(e) {
      isDragging = true;
      mx = e.x;
      my = e.y;
    }

    function dragged(e) {
      let alpha = 0;
      let beta = 0;

      mouseX = mouseX || 0;
      mouseY = mouseY || 0;
      beta = ((e.x - mx + mouseX) * Math.PI) / 230;
      alpha = (((e.y - my + mouseY) * Math.PI) / 230) * -1;
      const data = [
        point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          prepNodes
        ),
        edge3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          edgesWithCoords
        ),
        plane3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          groupPlanes
        ),
      ];
      processData(data);
    }

    function dragEnd(e) {
      isDragging = false;
      mouseX = e.x - mx + mouseX;
      mouseY = e.y - my + mouseY;
    }

    function addPlanesHighlight(planes, points, links) {
      planes.on("mouseover", function (_e, d) {
        if (isDragging) {
          return;
        }

        const group = d.group;

        const nodesIdsInGroup = group.map((node) => node.id);

        const edgesConnectedToThisGroup = prepEdges.filter((edge) => {
          return (
            nodesIdsInGroup.includes(edge.source) ||
            nodesIdsInGroup.includes(edge.target)
          );
        });

        const sourcesGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[symbols.sourceNodeSym].group
        );
        const targetsGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[symbols.targetNodeSym].group
        );

        const connectedTargetNodes = edgesConnectedToThisGroup.map(
          (edge) => edge.target
        );

        const connectedSourceNodes = edgesConnectedToThisGroup.map(
          (edge) => edge.source
        );

        const allConnectedNodes = [
          ...new Set([...connectedTargetNodes, ...connectedSourceNodes]),
        ];
        const connectedNodes = allConnectedNodes.filter(
          (nodeId) => !nodesIdsInGroup.includes(nodeId)
        );

        const allGroups = [...new Set([...sourcesGroups, ...targetsGroups])];
        const connectedGroups = allGroups.filter(
          (group) => group !== d.groupId
        );

        planes.classed("fadeout", true);
        planes.classed("active", false);
        planes.classed("half-active", false);

        planes
          .filter((p) => {
            return connectedGroups.includes(p.groupId);
          })
          .classed("fadeout", false)
          .classed("half-active", true);

        select(this).classed("active", true).classed("fadeout", false);

        // highlight nodes belonging to this group
        points.classed("fadeout", true);
        points.classed("active", false);
        points.classed("half-active", false);

        points
          .filter((p) => {
            return nodesIdsInGroup.includes(p.id);
          })
          .classed("fadeout", false)
          .classed("active", true);

        points
          .filter((p) => {
            return connectedNodes.includes("" + p.id);
          })
          .classed("fadeout", false)
          .classed("half-active", true);

        // highlight edges that belongs to this group
        links.classed("fadeout", true);

        links
          .filter((p) => {
            return (
              (connectedNodes.includes(p.edge[symbols.sourceNodeSym].id) ||
                connectedNodes.includes(p.edge[symbols.targetNodeSym].id)) &&
              (nodesIdsInGroup.includes(p.edge[symbols.sourceNodeSym].id) ||
                nodesIdsInGroup.includes(p.edge[symbols.targetNodeSym].id))
            );
          })
          .classed("fadeout", false)
          .classed("half-active", true)
          .classed("dashed", true);

        links
          .filter(
            (p) =>
              nodesIdsInGroup.includes(p.edge[symbols.sourceNodeSym].id) &&
              nodesIdsInGroup.includes(p.edge[symbols.targetNodeSym].id)
          )
          .classed("fadeout", false)
          .classed("active", true);
      });

      planes.on("mouseleave", () => {
        if (isDragging) {
          return;
        }
        links.classed("fadeout", false);
        links.classed("active", false);
        links.classed("half-active", false);
        links.classed("dashed", false);
        planes.classed("active", false);
        planes.classed("fadeout", false);
        planes.classed("half-active", false);
        points.classed("fadeout", false);
        points.classed("active", false);
        points.classed("half-active", false);
      });
    }

    function addEdgesHighlight(points, links) {
      points.on("mouseover", function (e, d) {
        if (isDragging) {
          return;
        }

        // fade out all other nodes, highlight a little connected ones
        points.classed("fadeout", true);

        points
          .filter((p) => {
            return (
              p !== d &&
              d[symbols.edgeSym].some(
                (edge) =>
                  edge[symbols.sourceNodeSym] === p ||
                  edge[symbols.targetNodeSym] === p
              )
            );
          })
          .classed("half-active", true)
          .classed("fadeout", false);

        // highlight current node
        select(this).classed("active", true).classed("fadeout", false);
        const edgeIdsOnThisNode = d[symbols.edgeSym].map(
          (edge) => edge[symbols.idSym]
        );

        // fadeout not connected edges, highlight connected ones
        links
          .classed(
            "fadeout",
            (p) => !edgeIdsOnThisNode.includes(p.edge[symbols.idSym])
          )
          .classed("active", (p) =>
            edgeIdsOnThisNode.includes(p.edge[symbols.idSym])
          );
      });

      points.on("mouseleave", function () {
        if (isDragging) {
          return;
        }
        links
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
        points
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
      });
    }

    init();

    if (tooltipParams.show) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': GridGraph
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "graph-3d-grid",
	"stanza:label": "Graph 3D grid layout",
	"stanza:definition": "Graph 3D Grid Layout MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Einishi Tech"
],
	"stanza:created": "2022-03-30",
	"stanza:updated": "2022-03-30",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://gist.githubusercontent.com/abkunal/98d35b9b235312e90f3e43c9f7b6932b/raw/d5589ddd53731ae8eec7abd091320df91cdcf5cd/miserables.json",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 600,
		"stanza:description": "Width in px"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 1000,
		"stanza:description": "Height in px"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 50,
		"stanza:description": "Inner padding in px"
	},
	{
		"stanza:key": "group-planes-sort-by",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Sort group planes by this data key value"
	},
	{
		"stanza:key": "group-planes-sort-order",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"ascending",
			"descending"
		],
		"stanza:example": "ascending",
		"stanza:description": "Group planes sorting order"
	},
	{
		"stanza:key": "nodes-sort-by",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Sort nodes by this data key value"
	},
	{
		"stanza:key": "nodes-sort-order",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"ascending",
			"descending"
		],
		"stanza:example": "ascending",
		"stanza:description": "Nodes sorting order"
	},
	{
		"stanza:key": "node-size-based-on",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"data key",
			"fixed"
		],
		"stanza:example": "fixed",
		"stanza:required": true,
		"stanza:description": "Set size of the node  data key"
	},
	{
		"stanza:key": "node-size-data-key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Set size on the node based on data key"
	},
	{
		"stanza:key": "node-min-size",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Minimum node radius in px"
	},
	{
		"stanza:key": "node-max-size",
		"stanza:type": "number",
		"stanza:example": 6,
		"stanza:description": "Maximum node radius in px"
	},
	{
		"stanza:key": "node-fixed-size",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Fixed node radius in px"
	},
	{
		"stanza:key": "node-color-based-on",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"data key",
			"fixed"
		],
		"stanza:example": "data key",
		"stanza:default": "data key",
		"stanza:description": "Set color of the node  data key"
	},
	{
		"stanza:key": "node-color-data-key",
		"stanza:type": "string",
		"stanza:example": "group",
		"stanza:description": "Set color of the node based on data key"
	},
	{
		"stanza:key": "edge-width-based-on",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"data key",
			"fixed"
		],
		"stanza:example": "fixed",
		"stanza:default": "fixed",
		"stanza:description": "Set edge width  data key"
	},
	{
		"stanza:key": "edge-width-data-key",
		"stanza:type": "string",
		"stanza:example": "value",
		"stanza:description": "Set width of the edge  data key"
	},
	{
		"stanza:key": "edge-min-width",
		"stanza:type": "number",
		"stanza:example": 0.5,
		"stanza:description": "Minimum edge width in px"
	},
	{
		"stanza:key": "edge-max-width",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Maximum edge width in px"
	},
	{
		"stanza:key": "edge-fixed-width",
		"stanza:type": "number",
		"stanza:example": 0.5,
		"stanza:description": "Fixed edge width in px"
	},
	{
		"stanza:key": "edge-color-based-on",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"data key",
			"source color",
			"target color",
			"fixed"
		],
		"stanza:example": "source color",
		"stanza:description": "Set color of the edge based on this"
	},
	{
		"stanza:key": "edge-color-data-key",
		"stanza:type": "string",
		"stanza:example": "value",
		"stanza:description": "Set color of the edge based on this data key"
	},
	{
		"stanza:key": "group-plane-color-based-on",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"data key",
			"fixed"
		],
		"stanza:example": "fixed",
		"stanza:description": "Set color of the group planes based on this data key"
	},
	{
		"stanza:key": "highlight-adjacent-edges",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Highlight adjacent edges on node mouse hover"
	},
	{
		"stanza:key": "highlight-group-planes",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Highlight group planes on mouse hover"
	},
	{
		"stanza:key": "nodes-tooltip-data-key",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Node tooltips data key. If empty, no tooltips will be shown"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#E6BB1A",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-default-node-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Nodes default color"
	},
	{
		"stanza:key": "--togostanza-default-edge-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Egdes default color"
	},
	{
		"stanza:key": "--togostanza-default-plane-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Egdes default color"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Border width"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"graph-3d-grid\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=graph-3d-grid.js.map
