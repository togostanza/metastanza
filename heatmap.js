import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { T as ToolTip } from './ToolTip-23bc44c8.js';
import { L as Legend } from './Legend-08cf2f79.js';
import { s as select } from './index-847f2a80.js';
import { b as band } from './band-6f9e71db.js';
import { a as axisBottom, b as axisLeft } from './axis-3dba94d9.js';
import { l as linear } from './linear-af9e44cc.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';
import './ordinal-0cb0fa8d.js';
import './range-e15c6861.js';
import './descending-63ef45b8.js';

const tooltipHTML = ({ group, variable, value }) =>
  `<span><strong>${group},${variable}: </strong>${value}</span>`;

class Heatmap extends Stanza {
  css(key) {
    return getComputedStyle(this.element).getPropertyValue(key);
  }
  async render() {
    const root = this.root.querySelector("main");
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
      this.legend = new Legend();
      root.append(this.legend);
    }

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this.draw(root, data);
  }
  async draw(el, dataset) {
    const tickSize = +this.css("--togostanza-tick-size") || 0;
    const xLabelAngle = this.params["x-label-angle"] || 0;
    const yLabelAngle = this.params["y-label-angle"] || 0;

    // set the dimensions and margins of the graph
    const margin = {
      bottom: +this.css("--togostanza-font-size") + tickSize + 10,
      left: +this.css("--togostanza-font-size") + tickSize + 10,
    };
    const width = this.params["width"] - margin.left,
      height = this.params["height"] - margin.bottom;

    // remove svg element whenthis.params updated
    select(el).select("svg").remove();

    const svg = select(el)
      .append("svg")
      .attr("width", width + margin.left)
      .attr("height", height + margin.bottom);

    const graphArea = svg
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.left}, 0 )`);

    const rows = [...new Set(dataset.map((d) => d.group))];
    const columns = [...new Set(dataset.map((d) => d.variable))];

    const x = band().domain(rows).range([0, width]).padding(0.01);

    const xAxisGenerator = axisBottom(x)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    const y = band().range([height, 0]).domain(columns).padding(0.01);
    const yAxisGridGenerator = axisLeft(y)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    graphArea
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(200)
      .call(xAxisGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${xLabelAngle})`);

    graphArea
      .append("g")
      .classed("class", "y-axis")
      .transition()
      .duration(200)
      .call(yAxisGridGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${yLabelAngle})`);

    if (!this.params["show-domains"]) {
      svg.selectAll(".domain").remove();
    }
    if (!this.params["show-tick-lines"]) {
      svg.selectAll(".tick line").remove();
    }

    graphArea.selectAll("text").attr("class", "text");

    const myColor = linear()
      .range([
        this.css("--togostanza-series-0-color"),
        this.css("--togostanza-series-1-color"),
      ])
      .domain([1, 100]);

    graphArea
      .selectAll()
      .data(dataset, function (d) {
        return d.group + ":" + d.variable;
      })
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.group))
      .attr("y", (d) => y(d.variable))
      .attr("data-tooltip-html", true)
      .attr("data-tooltip", (d) => tooltipHTML(d))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", this.css("--togostanza-border-radius"))
      .attr("ry", this.css("--togostanza-border-radius"))
      .style("fill", (d) => myColor(d.value))
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    const values = [...new Set(dataset.map((d) => d.value))];

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    this.legend.setup(
      this.intervals(values, myColor),
      {},
      this.root.querySelector("main")
    );

    function mouseover() {
      select(this).classed("highlighted", true);
    }
    function mouseleave() {
      select(this).classed("highlighted", false);
    }
  }
  // create legend objects based on min and max data values with number of steps as set by user in this.params
  intervals(
    values,
    color,
    steps = this.params["legend-groups"] >= 2 ? this.params["legend-groups"] : 2
  ) {
    const [min, max] = [Math.min(...values), Math.max(...values)];
    return [...Array(steps).keys()].map((i) => {
      const n = Math.round(min + i * ((max - min) / steps));
      return {
        label: n,
        color: color(n),
      };
    });
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Heatmap
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "heatmap",
	"stanza:label": "Heatmap",
	"stanza:definition": "Heatmap stanza",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-08-26",
	"stanza:updated": "2022-02-14",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/heatmap-data.json",
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
		"stanza:example": 450,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 450,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "show-domains",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show domains"
	},
	{
		"stanza:key": "x-label-angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "X label angle (in degree)"
	},
	{
		"stanza:key": "y-label-angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Y label angle (in degree)"
	},
	{
		"stanza:key": "show-tick-lines",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show tick lines"
	},
	{
		"stanza:key": "metastanza-menu-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right",
			"none"
		],
		"stanza:example": "top-right",
		"stanza:description": "Menu button placement"
	},
	{
		"stanza:key": "legend-groups",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "amount of groups for legend"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#EDEDED",
		"stanza:description": "Depth color 1"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Depth color 2"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-font-size",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Font size"
	},
	{
		"stanza:key": "--togostanza-font-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Title font color"
	},
	{
		"stanza:key": "--togostanza-font-weight",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"normal",
			"bold",
			"lighter"
		],
		"stanza:default": "normal",
		"stanza:description": "Title font weight"
	},
	{
		"stanza:key": "--togostanza-border-radius",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Border radius"
	},
	{
		"stanza:key": "--togostanza-tick-size",
		"stanza:type": "number",
		"stanza:default": 2,
		"stanza:description": "Tick length (in pixel)"
	},
	{
		"stanza:key": "--togostanza-hover-border-color",
		"stanza:type": "color",
		"stanza:default": "#FFDF3D",
		"stanza:description": "Hover border color"
	},
	{
		"stanza:key": "--togostanza-domain-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Domain color"
	},
	{
		"stanza:key": "--togostanza-tick-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Tick color"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=heatmap.js.map
