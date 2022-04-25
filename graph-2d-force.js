import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { s as select } from './index-847f2a80.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { T as ToolTip } from './ToolTip-23bc44c8.js';
import { f as forceSimulation, d as forceManyBody, a as forceCenter, e as forceLink, b as forceCollide } from './manyBody-15224179.js';
import { d as drag } from './drag-c4f62c8c.js';
import { p as prepareGraphData } from './prepareGraphData-e6f24e2e.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import { o as ordinal } from './ordinal-0cb0fa8d.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';
import './extent-14a1e8e9.js';
import './linear-af9e44cc.js';
import './descending-63ef45b8.js';

function drawForceLayout (
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
  const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
  const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

  const forceG = svg
    .append("g")
    .attr("id", "forceG")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const gLinks = forceG.append("g").attr("class", "links");
  const gNodes = forceG.append("g").attr("class", "nodes");

  const simulation = forceSimulation(nodes)
    .force("charge", forceManyBody().strength(-100))
    .force("center", forceCenter(width / 2, height / 2).strength(0.05))
    .force(
      "link",
      forceLink()
        .links(edges)
        .id((d) => d.id)
        .distance(50)
        .strength(0.5)
    )
    .force(
      "collide",
      forceCollide()
        .radius((d) => d[symbols.nodeSizeSym])
        .iterations(2)
        .strength(0.9)
    )
    .on("tick", ticked);

  const links = gLinks
    .selectAll("line")
    .data(edges)
    .join("line")
    .style("stroke-width", (d) => d[symbols.edgeWidthSym])
    .style("stroke", (d) => d[symbols.edgeColorSym])
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
  }

  function ticked() {
    updateNodes();
    updateLinks();
  }

  const nodeGroups = gNodes
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node-group")
    .attr("transform", (d) => {
      return `translate(${d.x},${d.y})`;
    })
    .call(drag$1(simulation));

  const nodeCircles = nodeGroups
    .append("circle")
    .attr("class", "node")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", (d) => d[symbols.nodeSizeSym])
    .style("fill", (d) => d[symbols.nodeColorSym]);

  if (tooltipParams.show) {
    nodeCircles.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
  }

  if (labelsParams.dataKey !== "" && nodes[0][labelsParams.dataKey]) {
    nodeGroups
      .append("text")
      .attr("x", 0)
      .attr("dy", (d) => labelsParams.margin + d[symbols.nodeSizeSym])
      .attr("class", "label")
      .attr("alignment-baseline", "hanging")
      .attr("text-anchor", "middle")
      .text((d) => d[labelsParams.dataKey]);
  }

  let isDragging = false;

  function drag$1(simulation) {
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

    return drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  if (highlightAdjEdges) {
    nodeGroups.on("mouseover", function (e, d) {
      if (isDragging) {
        return;
      }
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
}

class ForceGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "graph-2d-force"),
      downloadPngMenuItem(this, "graph-2d-force"),
      downloadJSONMenuItem(this, "graph-2d-force", this._data),
      downloadCSVMenuItem(this, "graph-2d-force", this._data),
      downloadTSVMenuItem(this, "graph-2d-force", this._data),
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
    const el = this.root.getElementById("graph-2d-force");

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

    drawForceLayout(svg, prepNodes, prepEdges, { ...params, symbols });

    if (tooltipParams.show) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
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
	"@id": "graph-2d-force",
	"stanza:label": "Graph 2D force layout",
	"stanza:definition": "Graph 2D Force Layout MetaStanza",
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
		"stanza:example": 600,
		"stanza:description": "Width in px"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 800,
		"stanza:description": "Height in px"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 20,
		"stanza:description": "Inner padding in px"
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
		"stanza:example": 3,
		"stanza:description": "Node labels offset from node center, in px."
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
		"stanza:key": "--togostanza-edge-opacity",
		"stanza:type": "number",
		"stanza:default": 0.8,
		"stanza:description": "Edge default opacity"
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
    return "<div id=\"graph-2d-force\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=graph-2d-force.js.map
