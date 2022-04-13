import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { e as embed } from './vega-embed.module-07804790.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import './linear-af9e44cc.js';
import './ordinal-0cb0fa8d.js';
import './descending-63ef45b8.js';
import './dsv-cd3740c6.js';
import './max-2c042256.js';
import './min-4a3f8e4e.js';
import './range-e15c6861.js';
import './arc-49333d16.js';
import './constant-c49047a5.js';
import './path-a78af922.js';
import './array-89f97098.js';
import './line-620615aa.js';
import './basis-0dde91c7.js';
import './sum-44e7480e.js';
import './manyBody-15224179.js';
import './stratify-5205cf04.js';
import './index-beeea236.js';
import './partition-2c1b5971.js';
import './index-847f2a80.js';
import './dsv-cde6fd06.js';

function applyFilter(data, filter) {
  return data.filter((record) =>
    filter.every((filter) => {
      switch (filter.type) {
        case "substring":
          if (filter.target === null) {
            return Object.values(record).some((value) =>
              value.toString().includes(filter.value)
            );
          } else {
            return record[filter.target].toString().includes(filter.value);
          }
        case "lte":
          return record[filter.target] <= filter.value;
        case "gte":
          return record[filter.target] >= filter.value;
        default:
          throw new Error(`unsupported filter type ${filter.type}`);
      }
    })
  );
}

class ScatterPlot extends Stanza {
  constructor() {
    super(...arguments);

    this._filter = [];
  }

  menu() {
    return [
      downloadSvgMenuItem(this, "scatter-plot"),
      downloadPngMenuItem(this, "scatter-plot"),
      downloadJSONMenuItem(this, "scatter-plot", this._data),
      downloadCSVMenuItem(this, "scatter-plot", this._data),
      downloadTSVMenuItem(this, "scatter-plot", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width,height,padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    const xVariable = this.params["x"];
    const yVariable = this.params["y"];
    const zVariable = this.params["z"] || "none";

    const adjustYBottom = this.params["adjust-y-range"];
    const adjustXLeft = this.params["adjust-x-range"];


    const _data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    const values = applyFilter(_data, this._filter);

    const data = [
      {
        name: "source",
        values,
        transform: [
          {
            type: "filter",
            expr: `datum['${xVariable}'] != null && datum['${yVariable}'] != null`,
          },
        ],
      },
    ];

    const signals = [];

    //scales
    const scales = [
      {
        name: "x",
        type: "linear",
        round: true,
        nice: true,
        zero: !adjustXLeft,
        domain: { data: "source", field: xVariable },
        range: "width",
      },
      {
        name: "y",
        type: "linear",
        round: true,
        nice: true,
        zero: !adjustYBottom,
        domain: { data: "source", field: yVariable },
        range: "height",
      },
      {
        name: "size",
        type: "linear",
        round: true,
        nice: false,
        zero: true,
        domain: { data: "source", field: zVariable },
        range: [4, 361],
      },
    ];

    //axes
    const axes = [
      {
        scale: "x",
        orient: this.params["xaxis-placement"],
        domain: true,
        domainColor: "var(--togostanza-axis-color)",
        domainWidth: css("--togostanza-axis-width"),
        grid: this.params["xgrid"] === "true",
        gridColor: "var(--togostanza-grid-color)",
        gridDash: css("--togostanza-grid-dash-length"),
        gridOpacity: css("--togostanza-grid-opacity"),
        gridWidth: css("--togostanza-grid-width"),
        ticks: this.params["xtick"] === "true",
        tickColor: "var(--togostanza-tick-color)",
        tickSize: css("--togostanza-tick-length"),
        tickWidth: css("--togostanza-tick-width"),
        title:
          this.params["x-title"] === "" ? xVariable : this.params["x-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        titlePadding: this.params["xtitle-padding"],
        labelPadding: this.params["xlabel-padding"],
        zindex: 0,
        encode: {
          labels: {
            interactive: true,
            update: {
              angle: { value: this.params["xlabel-angle"] },
              fill: { value: "var(--togostanza-label-font-color)" },
              font: {
                value: css("--togostanza-font-family"),
              },
              fontSize: {
                value: css("--togostanza-label-font-size"),
              },
            },
          },
        },
      },
      {
        scale: "y",
        orient: this.params["yaxis-placement"],
        domain: true,
        domainColor: "var(--togostanza-axis-color)",
        domainWidth: css("--togostanza-axis-width"),
        grid: this.params["ygrid"] === "true",
        gridColor: "var(--togostanza-grid-color)",
        gridDash: css("--togostanza-grid-dash-length"),
        gridOpacity: css("--togostanza-grid-opacity"),
        gridWidth: css("--togostanza-grid-width"),
        ticks: this.params["ytick"] === "true",
        tickColor: "var(--togostanza-tick-color)",
        tickSize: css("--togostanza-tick-length"),
        tickWidth: css("--togostanza-tick-width"),
        title:
          this.params["y-title"] === "" ? yVariable : this.params["y-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        titlePadding: this.params["ytitle-padding"],
        labelPadding: this.params["ylabel-padding"],
        zindex: 0,
        encode: {
          labels: {
            interactive: true,
            update: {
              angle: { value: this.params["ylabel-angle"] },
              fill: { value: "var(--togostanza-label-font-color)" },
              font: {
                value: css("--togostanza-font-family"),
              },
              fontSize: {
                value: css("--togostanza-label-font-size"),
              },
            },
          },
        },
      },
    ];

    // legend
    const legends = [
      {
        size: "size",
        format: "s",
        title:
          this.params["legend-title"] === ""
            ? zVariable
            : this.params["legend-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        labelColor: "var(--togostanza-label-font-color)",
        labelFont: css("--togostanza-font-family"),
        labelFontSize: css("--togostanza-label-font-size"),
        symbolType: this.params["symbol-shape"],
        symbolFillColor: "var(--togostanza-series-0-color)",
        symbolStrokeColor: css("--togostanza-border-color"),
        symbolStrokeWidth: css("--togostanza-border-width"),
      },
    ];

    //marks
    const marks = [
      {
        name: "marks",
        type: "symbol",
        from: { data: "source" },
        encode: {
          update: {
            x: { scale: "x", field: xVariable },
            y: { scale: "y", field: yVariable },
            shape: { value: this.params["symbol-shape"] },
            fill: { value: "var(--togostanza-series-0-color)" },
            size: { scale: "size", field: zVariable },
            stroke: { value: "var(--togostanza-border-color)" },
            strokeWidth: {
              value: css("--togostanza-border-width"),
            },
            opacity: {
              value: css("--togostanza-opacity"),
            },
          },
        },
      },
    ];

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      data,
      signals,
      scales,
      axes,
      legends:
        zVariable === "none" || this.params["legend"] === "false"
          ? []
          : legends,
      marks,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await embed(el, spec, opts);
  }

  handleEvent(event) {
    if (event.type === "filter") {
      this._filter = event.detail;
      this.render();
    }
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ScatterPlot
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scatterplot",
	"stanza:label": "Scatterplot",
	"stanza:definition": "Scatterplot MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2020-11-06",
	"stanza:updated": "2020-11-06",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_scatterplot.json",
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
		"stanza:key": "x",
		"stanza:example": "density",
		"stanza:description": "Variable for X axis",
		"stanza:required": true
	},
	{
		"stanza:key": "y",
		"stanza:example": "area",
		"stanza:description": "Variable for Y axis",
		"stanza:required": true
	},
	{
		"stanza:key": "z",
		"stanza:example": "population",
		"stanza:description": "Variable for Z axis"
	},
	{
		"stanza:key": "x-title",
		"stanza:example": "",
		"stanza:description": "Title for x variable (In case of blank, 'x' variable name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "y-title",
		"stanza:example": "",
		"stanza:description": "Title for y variable (In case of blank, 'y' variable name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "legend-title",
		"stanza:example": "",
		"stanza:description": "Title for z variable, which is used as legend title (In case of blank, 'z' variable name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 200,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 50,
		"stanza:description": "Padding"
	},
	{
		"stanza:key": "legend",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show legend"
	},
	{
		"stanza:key": "xgrid",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show X grid"
	},
	{
		"stanza:key": "ygrid",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show Y grid"
	},
	{
		"stanza:key": "adjust-x-range",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Adjust X axis range"
	},
	{
		"stanza:key": "adjust-y-range",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Adjust Y axis range"
	},
	{
		"stanza:key": "xtick",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": false,
		"stanza:description": "Show X tick"
	},
	{
		"stanza:key": "ytick",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show Y tick"
	},
	{
		"stanza:key": "xlabel-angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "X label angle (in degree)"
	},
	{
		"stanza:key": "ylabel-angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Y label angle (in degree)"
	},
	{
		"stanza:key": "xlabel-padding",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Padding between X label and tick"
	},
	{
		"stanza:key": "ylabel-padding",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Padding between Y label and tick"
	},
	{
		"stanza:key": "xtitle-padding",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Padding between X title and label"
	},
	{
		"stanza:key": "ytitle-padding",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Padding between Y title and label"
	},
	{
		"stanza:key": "xaxis-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top",
			"bottom"
		],
		"stanza:example": "bottom",
		"stanza:description": "X axis placement"
	},
	{
		"stanza:key": "yaxis-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"right"
		],
		"stanza:example": "left",
		"stanza:description": "Y axis placement"
	},
	{
		"stanza:key": "symbol-shape",
		"stanza:example": "circle",
		"stanza:description": "Plot shape"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Plot color"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-axis-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Axis color"
	},
	{
		"stanza:key": "--togostanza-axis-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Axis width"
	},
	{
		"stanza:key": "--togostanza-grid-color",
		"stanza:type": "color",
		"stanza:default": "#aeb3bf",
		"stanza:description": "Grid color"
	},
	{
		"stanza:key": "--togostanza-grid-dash-length",
		"stanza:type": "number",
		"stanza:default": "",
		"stanza:description": "Grid dash length (Blank for solid lines)"
	},
	{
		"stanza:key": "--togostanza-grid-opacity",
		"stanza:type": "number",
		"stanza:default": 0.5,
		"stanza:description": "Grid opacity (0-1)"
	},
	{
		"stanza:key": "--togostanza-grid-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Grid width"
	},
	{
		"stanza:key": "--togostanza-tick-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Tick color"
	},
	{
		"stanza:key": "--togostanza-tick-length",
		"stanza:type": "number",
		"stanza:default": 1.5,
		"stanza:description": "Tick length (in pixel)"
	},
	{
		"stanza:key": "--togostanza-tick-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Tick width (in pixel)"
	},
	{
		"stanza:key": "--togostanza-title-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Title font color"
	},
	{
		"stanza:key": "--togostanza-title-font-size",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Title font size"
	},
	{
		"stanza:key": "--togostanza-title-font-weight",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Title font weight"
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
		"stanza:default": 10,
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
		"stanza:default": 0.5,
		"stanza:description": "Border width"
	},
	{
		"stanza:key": "--togostanza-opacity",
		"stanza:type": "text",
		"stanza:default": 0.7,
		"stanza:description": "Plot opacity"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
],
	"stanza:incomingEvent": [
	{
		"stanza:key": "filter",
		"stanza:description": "filter conditions changed event"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p class=\"greeting\">\n  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"greeting") || (depth0 != null ? lookupProperty(depth0,"greeting") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"greeting","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":14}}}) : helper)))
    + "\n</p>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=scatterplot.js.map
