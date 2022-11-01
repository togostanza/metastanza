import { S as Stanza, s as select, d as defineStanzaElement } from './transform-0e5d4876.js';
import { l as loadData } from './load-data-ad9ea040.js';
import { T as ToolTip } from './ToolTip-2d9a3bec.js';
import { L as Legend } from './Legend-b7b2d437.js';
import { a as getGradationColor } from './ColorGenerator-697f5146.js';
import { b as band } from './band-644ecdd6.js';
import { a as axisBottom, b as axisLeft } from './axis-3dba94d9.js';
import './dsv-ac31b097.js';
import './linear-919165bc.js';
import './ordinal-e772a8c0.js';
import './range-e15c6861.js';

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
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this.draw(root, data);
  }
  async draw(el, dataset) {
    // make colors
    const cellColorMin = this.params["cell-color-range_min"];
    const cellColorMid = this.params["cell-color-range_mid"];
    const cellColorMax = this.params["cell-color-range_max"];
    let cellDomainMin = parseFloat(this.params["cell-color-domain_min"]);
    let cellDomainMid = parseFloat(this.params["cell-color-domain_mid"]);
    let cellDomainMax = parseFloat(this.params["cell-color-domain_max"]);
    const cellColorDataKey = this.params["cell-color-data_key"];
    const values = [...new Set(dataset.map((d) => d[cellColorDataKey]))];

    if (isNaN(parseFloat(cellDomainMin))) {
      cellDomainMin = Math.min(...values);
    }
    if (isNaN(parseFloat(cellDomainMax))) {
      cellDomainMax = Math.max(...values);
    }
    if (isNaN(parseFloat(cellDomainMid))) {
      cellDomainMid = (cellDomainMax + cellDomainMin) / 2;
    }

    const setColor = getGradationColor(
      this,
      [cellColorMin, cellColorMid, cellColorMax],
      [cellDomainMin, cellDomainMid, cellDomainMax]
    );

    const tickSize = +this.css("--togostanza-tick-size") || 0;
    const xLabelAngle = this.params["x-ticks_labels_angle"] || 0;
    const yLabelAngle = this.params["y-ticks_labels_angle"] || 0;
    const borderWidth = +this.css("--togostanza-border-width") || 0;

    // set the dimensions and margins of the graph
    const margin = {
      bottom: +this.css("--togostanza-fonts-font_size_primary") + tickSize + 10,
      left: +this.css("--togostanza-fonts-font_size_primary") + tickSize + 10,
    };
    const width = +this.css("--togostanza-outline-width"),
      height = +this.css("--togostanza-outline-height");

    // remove svg element whenthis.params updated
    select(el).select("svg").remove();
    const titleSpace = 20;
    const axisXTitlePadding = this.params["axis-x-title_padding"];
    const axisYTitlePadding = this.params["axis-y-title_padding"];

    const xDataKey = this.params["axis-x-data_key"];
    const yDataKey = this.params["axis-y-data_key"];

    const svg = select(el)
      .append("svg")
      .attr("width", width + margin.left + titleSpace + axisYTitlePadding)
      .attr("height", height + margin.bottom + titleSpace + axisXTitlePadding);

    const graphArea = svg
      .append("g")
      .attr("class", "chart")
      .attr(
        "transform",
        `translate(${margin.left + titleSpace + axisYTitlePadding}, 0)`
      );

    const rows = [...new Set(dataset.map((d) => d[xDataKey]))];
    const columns = [...new Set(dataset.map((d) => d[yDataKey]))];

    const x = band()
      .domain(
        rows.slice(
          this.params["axis-x-range_min"],
          this.params["axis-x-range_max"]
        )
      )
      .range([0, width - 10]);
    const xAxisGenerator = axisBottom(x)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    const y = band()
      .range([height, 0])
      .domain(
        columns.slice(
          this.params["axis-y-range_min"],
          this.params["axis-y-range_max"]
        )
      );
    const yAxisGridGenerator = axisLeft(y)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    // normalize

    // console.log(values);
    // const normalize = (num) => {
    //   return (
    //     (num - Math.min(...values)) /
    //     (Math.max(...values) - Math.min(...values))
    //   );
    // };

    graphArea
      .selectAll()
      .data(dataset, function (d) {
        return d[xDataKey] + ":" + d[yDataKey];
      })
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[xDataKey]))
      .attr("y", (d) => y(d[yDataKey]))
      .attr("data-tooltip-html", true)
      .attr("data-tooltip", (d) => tooltipHTML(d))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", this.css("--togostanza-border-radius"))
      .attr("ry", this.css("--togostanza-border-radius"))
      .style("fill", (d) => setColor(d[cellColorDataKey]))
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

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
      .attr("class", "y-axis")
      .transition()
      .duration(200)
      .call(yAxisGridGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${yLabelAngle})`);

    if (!this.params["axis-x-hide"]) {
      svg.select(".x-axis path").remove();
    }
    if (!this.params["axis-y-hide"]) {
      svg.select(".y-axis path").remove();
    }
    if (!this.params["axis-x-ticks_hide"]) {
      svg.selectAll(".x-axis .tick line").remove();
    }
    if (!this.params["axis-y-ticks_hide"]) {
      svg.selectAll(".y-axis .tick line").remove();
    }

    const axisXTitle = this.params["axis-x-title"]
      ? this.params["axis-x-title"]
      : xDataKey;
    const axisYTitle = this.params["axis-y-title"]
      ? this.params["axis-y-title"]
      : yDataKey;

    graphArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(${width / 2}, ${height + margin.bottom + axisXTitlePadding})`
      )
      .text(axisXTitle);

    graphArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(-${margin.left + axisYTitlePadding}, ${
          height / 2
        })rotate(-90)`
      )
      .text(axisYTitle);

    graphArea.selectAll("text").attr("class", "text");

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    this.legend.setup(
      this.intervals(values, setColor),
      {},
      this.root.querySelector("main")
    );

    function mouseover() {
      select(this).classed("highlighted", true).raise();
      if (!borderWidth) {
        select(this)
          .classed("highlighted", true)
          .style("stroke-width", "1px")
          .raise();
      }
    }
    function mouseleave() {
      select(this).classed("highlighted", false);
      if (!borderWidth) {
        select(this)
          .classed("highlighted", false)
          .style("stroke-width", "0px");
        graphArea.selectAll(".x-axis").raise();
        graphArea.selectAll(".y-axis").raise();
      }
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
      const n = Math.round(min + i * (Math.abs(max - min) / (steps - 1)));
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
	"stanza:updated": "2022-07-01",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/YukikoNoda/sampleJSON-HeatMap/master/heatmap.json",
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
		"stanza:key": "misc-custom_css_url",
		"stanza:type": "text",
		"stanza:example": "",
		"stanza:description": "custom css to apply"
	},
	{
		"stanza:key": "axis-x-data_key",
		"stanza:type": "text",
		"stanza:example": "group",
		"stanza:description": "What key in data to use",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-y-data_key",
		"stanza:type": "text",
		"stanza:example": "variable",
		"stanza:description": "What key in data to use",
		"stanza:required": true
	},
	{
		"stanza:key": "axis-x-hide",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show x-axis"
	},
	{
		"stanza:key": "axis-y-hide",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show y-axis"
	},
	{
		"stanza:key": "axis-x-title",
		"stanza:type": "text",
		"stanza:description": "X axis title"
	},
	{
		"stanza:key": "axis-y-title",
		"stanza:type": "text",
		"stanza:description": "Y axis title"
	},
	{
		"stanza:key": "axis-x-title_padding",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "X axis title padding"
	},
	{
		"stanza:key": "axis-y-title_padding",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Y axis title padding"
	},
	{
		"stanza:key": "axis-x-ticks_hide",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show axis x tick lines"
	},
	{
		"stanza:key": "axis-y-ticks_hide",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show axis y tick lines"
	},
	{
		"stanza:key": "x-ticks_labels_angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "X ticks labels angle (in degree)"
	},
	{
		"stanza:key": "y-ticks_labels_angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Y ticks labels angle (in degree)"
	},
	{
		"stanza:key": "axis-x-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"log10",
			"ordinal"
		],
		"stanza:example": "ordinal",
		"stanza:description": "X scale"
	},
	{
		"stanza:key": "axis-x-range_min",
		"stanza:type": "number",
		"stanza:description": "Axis range min"
	},
	{
		"stanza:key": "axis-x-range_max",
		"stanza:type": "number",
		"stanza:description": "Axis range max"
	},
	{
		"stanza:key": "axis-x-ticks_interval",
		"stanza:type": "number",
		"stanza:example": 1,
		"stanza:description": "Distance between neighbouring ticks. Ignore if ordinal scale"
	},
	{
		"stanza:key": "axis-x-ticks_interval_units",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"none",
			"ms",
			"s",
			"minute",
			"hour",
			"day",
			"week",
			"month",
			"year",
			"century"
		],
		"stanza:example": "none",
		"stanza:description": "Units of the distance between neighbouring ticks. Ignore if scale is other than time scale"
	},
	{
		"stanza:key": "axis-x-ticks_labels_format",
		"stanza:type": "text",
		"stanza:description": "d3.format string. Ignore if ordinal scale"
	},
	{
		"stanza:key": "axis-y-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"log10",
			"ordinal"
		],
		"stanza:example": "ordinal",
		"stanza:description": "Y scale"
	},
	{
		"stanza:key": "axis-y-range_min",
		"stanza:type": "number",
		"stanza:description": "Axis range min"
	},
	{
		"stanza:key": "axis-y-range_max",
		"stanza:type": "number",
		"stanza:description": "Axis range max"
	},
	{
		"stanza:key": "axis-y-ticks_interval",
		"stanza:type": "number",
		"stanza:example": 1,
		"stanza:description": "Distance between neighbouring ticks. Ignore if ordinal scale"
	},
	{
		"stanza:key": "axis-y-ticks_interval_units",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"none",
			"ms",
			"s",
			"minute",
			"hour",
			"day",
			"week",
			"month",
			"year",
			"century"
		],
		"stanza:example": "none",
		"stanza:description": "Units of the distance between neighbouring ticks. Ignore if scale is other than time scale"
	},
	{
		"stanza:key": "axis-y-ticks_labels_format",
		"stanza:type": "text",
		"stanza:description": "d3.format string. Ignore if ordinal scale"
	},
	{
		"stanza:key": "tooltips-data_key",
		"stanza:type": "text",
		"stanza:description": "Data key to use as tooltip"
	},
	{
		"stanza:key": "legend-show",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Whether show the legend"
	},
	{
		"stanza:key": "legend-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right"
		],
		"stanza:example": "top-right",
		"stanza:description": "Whether show the legend"
	},
	{
		"stanza:key": "legend-title",
		"stanza:type": "text",
		"stanza:description": "Legend title"
	},
	{
		"stanza:key": "legend-groups",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Amount of groups for legend"
	},
	{
		"stanza:key": "cell-color-data_key",
		"stanza:type": "text",
		"stanza:example": "value",
		"stanza:description": "Data key to color the data points"
	},
	{
		"stanza:key": "cell-color-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"linear",
			"log10"
		],
		"stanza:example": "linear",
		"stanza:description": "If value to be mapped to color is a number"
	},
	{
		"stanza:key": "cell-color-range_min",
		"stanza:type": "text",
		"stanza:example": "#6590e6",
		"stanza:description": "Cell color range min"
	},
	{
		"stanza:key": "cell-color-range_mid",
		"stanza:type": "text",
		"stanza:example": "#ffffff",
		"stanza:description": "Cell color range mid"
	},
	{
		"stanza:key": "cell-color-range_max",
		"stanza:type": "text",
		"stanza:example": "#F75976",
		"stanza:description": "Cell color range max"
	},
	{
		"stanza:key": "cell-color-domain_min",
		"stanza:type": "text",
		"stanza:example": -50,
		"stanza:description": "Cell color domain min"
	},
	{
		"stanza:key": "cell-color-domain_mid",
		"stanza:type": "text",
		"stanza:example": 0,
		"stanza:description": "Cell color domain mid"
	},
	{
		"stanza:key": "cell-color-domain_max",
		"stanza:type": "text",
		"stanza:example": 100,
		"stanza:description": "Cell color domain max"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Title font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Font size primary"
	},
	{
		"stanza:key": "--togostanza-outline-width",
		"stanza:type": "number",
		"stanza:default": 450,
		"stanza:description": "outline width"
	},
	{
		"stanza:key": "--togostanza-outline-height",
		"stanza:type": "number",
		"stanza:default": 450,
		"stanza:description": "outline height"
	},
	{
		"stanza:key": "--togostanza-outline-padding",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "outline padding"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "border color"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "border width"
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
	},
	{
		"stanza:key": "--togostanza-theme-series_0_color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Depth color 0"
	},
	{
		"stanza:key": "--togostanza-theme-series_1_color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Depth color 1"
	},
	{
		"stanza:key": "--togostanza-theme-series_2_color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Depth color 2"
	},
	{
		"stanza:key": "--togostanza-theme-series_3_color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Depth color 3"
	},
	{
		"stanza:key": "--togostanza-theme-series_4_color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Depth color 4"
	},
	{
		"stanza:key": "--togostanza-theme-series_5_color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Depth color 5"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "#F8F9FA",
		"stanza:description": "Background color"
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
