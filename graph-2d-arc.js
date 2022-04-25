import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { s as select } from './index-847f2a80.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { T as ToolTip } from './ToolTip-23bc44c8.js';
import { p as prepareGraphData } from './prepareGraphData-e6f24e2e.js';
import { p as point } from './band-6f9e71db.js';
import { l as line$2 } from './line-620615aa.js';
import { c as curveBasis } from './basis-0dde91c7.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import { o as ordinal } from './ordinal-0cb0fa8d.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';
import './extent-14a1e8e9.js';
import './linear-af9e44cc.js';
import './descending-63ef45b8.js';
import './range-e15c6861.js';
import './array-89f97098.js';
import './constant-c49047a5.js';
import './path-a78af922.js';

function drawArcLayout (
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
  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

  const pointScale = point()
    .domain(nodes.map((node) => node.id))
    .range([0, WIDTH]);

  const arcG = svg
    .append("g")
    .attr("id", "arcG")
    .attr("transform", `translate(${MARGIN.LEFT},${height / 2})`);

  const links = arcG
    .selectAll("path")
    .data(edges)
    .enter()
    .append("path")
    .attr("class", "link")
    .style("stroke-width", (d) => d[symbols.edgeWidthSym])
    .style("stroke", (d) => d[symbols.edgeColorSym])
    .attr("d", (d) => arc(d));

  const nodeGroups = arcG
    .selectAll("g")
    .data(nodes)
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

  if (labelsParams.dataKey !== "" && nodes[0][labelsParams.dataKey]) {
    nodeGroups
      .append("text")
      .text((d) => d[labelsParams.dataKey])
      .attr("alignment-baseline", "middle")
      .attr("transform", "rotate(90)")
      .attr("x", (d) => d[symbols.nodeSizeSym] + labelsParams.margin)
      .attr("class", "label");
  }

  if (highlightAdjEdges) {
    nodeGroups.on("mouseover", function (e, d) {
      // highlight current node
      select(this).classed("active", true);
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
    const draw = line$2().curve(curveBasis);
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

class ForceGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "graph-2d-arc"),
      downloadPngMenuItem(this, "graph-2d-arc"),
      downloadJSONMenuItem(this, "graph-2d-arc", this._data),
      downloadCSVMenuItem(this, "graph-2d-arc", this._data),
      downloadTSVMenuItem(this, "graph-2d-arc", this._data),
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

    // Setting color scale
    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }
    const color = function () {
      return ordinal().range(togostanzaColors);
    };

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("graph-2d-arc");

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

    const labelsParams = {
      margin: this.params["labels-margin"],
      dataKey: this.params["labels-data-key"],
    };

    const tooltipParams = {
      dataKey: this.params["nodes-tooltip-data-key"],
      show: nodes.some((d) => d[this.params["nodes-tooltip-data-key"]]),
    };

    const highlightAdjEdges = this.params["highlight-adjacent-edges"] || false;

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      highlightAdjEdges,
      nodesSortParams,
      nodeSizeParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      labelsParams,
      tooltipParams,
    };

    const { prepNodes, prepEdges, symbols } = prepareGraphData(
      nodes,
      edges,
      params
    );

    drawArcLayout(svg, prepNodes, prepEdges, { ...params, symbols });

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ForceGraph
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "graph-2d-arc",
	"stanza:label": "Graph 2D arc layout",
	"stanza:definition": "Graph 2D Arc Layout MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Einishi Tech"
],
	"stanza:created": "2022-03-28",
	"stanza:updated": "2022-03-28",
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
		"stanza:example": 900,
		"stanza:description": "Width in px"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 600,
		"stanza:description": "Height in px"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 50,
		"stanza:description": "Inner padding in px"
	},
	{
		"stanza:key": "nodes-sort-by",
		"stanza:type": "string",
		"stanza:example": "group",
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
		"stanza:example": "",
		"stanza:description": "Set size on the node based on data key"
	},
	{
		"stanza:key": "node-min-size",
		"stanza:type": "number",
		"stanza:example": 4,
		"stanza:description": "Minimum node radius in px"
	},
	{
		"stanza:key": "node-max-size",
		"stanza:type": "number",
		"stanza:example": 12,
		"stanza:description": "Maximum node radius in px"
	},
	{
		"stanza:key": "node-fixed-size",
		"stanza:type": "number",
		"stanza:example": 2,
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
		"stanza:key": "highlight-adjacent-edges",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Highlight adjacent edges on node mouse hover"
	},
	{
		"stanza:key": "labels-data-key",
		"stanza:type": "string",
		"stanza:example": "id",
		"stanza:description": "Node labels data key. If empty, no labels will be shown"
	},
	{
		"stanza:key": "labels-margin",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Node labels offset from node center, in px."
	},
	{
		"stanza:key": "nodes-tooltip-data-key",
		"stanza:type": "string",
		"stanza:default": "id",
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
		"stanza:key": "--togostanza-edge-opacity",
		"stanza:type": "number",
		"stanza:default": 0.8,
		"stanza:description": "Edge opacity"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 7,
		"stanza:description": "Label font size"
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
    return "<div id=\"graph-2d-arc\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=graph-2d-arc.js.map
