import { S as Stanza, d as downloadSvgMenuItem, a as downloadPngMenuItem, b as appendCustomCss, c as defineStanzaElement } from './metastanza_utils-ce242dd6.js';
import { e as embed } from './vega-embed.module-8255a7bd.js';
import { l as loadData } from './load-data-5eebbe71.js';

class Linechart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width、height、padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    //data
    const labelVariable = this.params["category"];
    const valueVariable = this.params["value"];
    const groupVariable = this.params["group-by"]
      ? this.params["group-by"]
      : "none";

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    const signals = [
      {
        name: "interpolate",
        value: "linear",
      },
    ];

    const data = [
      {
        name: "table",
        values,
      },
    ];

    //scale
    const scales = [
      {
        name: "x",
        type: "point",
        range: "width",
        domain: { data: "table", field: labelVariable },
      },
      {
        name: "y",
        type: "linear",
        range: "height",
        nice: true,
        zero: true,
        domain: { data: "table", field: valueVariable },
      },
      {
        name: "color",
        type: "ordinal",
        range: [
          "var(--togostanza-series-0-color)",
          "var(--togostanza-series-1-color)",
          "var(--togostanza-series-2-color)",
          "var(--togostanza-series-3-color)",
          "var(--togostanza-series-4-color)",
          "var(--togostanza-series-5-color)",
        ],
        domain: { data: "table", field: groupVariable },
      },
    ];

    //axes
    const axes = [
      {
        scale: "x",
        orient: this.params["xaxis-placement"],
        domainColor: "var(--togostanza-axis-color)",
        domainWidth: css("--togostanza-axis-width"),
        grid: this.params["xgrid"] === "true",
        gridColor: "var(--togostanza-grid-color)",
        gridDash: css("--togostanza-grid-dash-length"),
        gridOpacity: css("--togostanza-grid-opacity"),
        gridWidth: css("--togostanza-grid-width"),
        ticks: this.params["xtick"] === "true",
        // tickCount: params["xtick-count"],
        tickColor: "var(--togostanza-tick-color)",
        tickSize: css("--tick-size"),
        tickWidth: css("--togostanza-tick-width"),
        title:
          this.params["category-title"] === ""
            ? labelVariable
            : this.params["category-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        titlePadding: this.params["xtitle-padding"],
        labelPadding: this.params["xlabel-padding"],
        zindex: 1,
        encode: {
          labels: {
            interactive: true,
            update: {
              angle: { value: this.params["xlabel-angle"] },
              fill: { value: "var(--togostanza-label-font-color)" },
              font: { value: css("--togostanza-font-family") },
              fontSize: { value: css("--togostanza-label-font-size") },
            },
          },
        },
      },
      {
        scale: "y",
        orient: this.params["yaxis-placement"],
        domainColor: "var(--togostanza-axis-color)",
        domainWidth: css("--togostanza-axis-width"),
        grid: this.params["ygrid"] === "true",
        gridColor: "var(--togostanza-grid-color)",
        gridDash: css("--togostanza-grid-dash-length"),
        gridOpacity: css("--togostanza-grid-opacity"),
        gridWidth: css("--togostanza-grid-width"),
        ticks: this.params["ytick"] === "true",
        // tickCount: params["ytick-count"],
        tickColor: "var(--togostanza-tick-color)",
        tickSize: css("--togostanza-tick-length"),
        tickWidth: css("--togostanza-tick-width"),
        title:
          this.params["value-title"] === ""
            ? valueVariable
            : this.params["value-title"],
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
              font: { value: css("--togostanza-font-family") },
              fontSize: { value: css("--togostanza-label-font-size") },
            },
          },
        },
      },
    ];

    // legend
    const legends = [
      {
        fill: "color",
        orient: "right",
        // legendX: width,
        legendY: -5,
        title:
          this.params["legend-title"] === ""
            ? groupVariable
            : this.params["legend-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        labelColor: "var(--togostanza-label-font-color)",
        labelFont: css("--togostanza-font-family"),
        labelFontSize: css("--togostanza-label-font-size"),
        symbolStrokeColor: css("--togostanza-border-color"),
        symbolStrokeWidth: css("--togostanza-border-width"),
        encode: {
          labels: {
            text: { field: "value" },
          },
        },
      },
    ];

    //marks
    const marks = [
      {
        type: "group",
        from: {
          facet: {
            name: "series",
            data: "table",
            groupby: groupVariable,
          },
        },
        marks: [
          {
            type: "line",
            from: { data: "series" },
            encode: {
              enter: {
                x: { scale: "x", field: labelVariable },
                y: { scale: "y", field: valueVariable },
                stroke: { scale: "color", field: groupVariable },
                strokeWidth: {
                  value: css("--togostanza-line-width"),
                },
              },
              update: {
                interpolate: { signal: "interpolate" },
                strokeOpacity: { value: 1 },
                stroke: { scale: "color", field: groupVariable },
              },
            },
          },
        ],
      },
    ];

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      signals,
      data,
      scales,
      axes,
      legends:
        this.params["legend"] === "true" && this.params["group-by"]
          ? legends
          : [],
      marks,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await embed(el, spec, opts);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Linechart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "linechart",
	"stanza:label": "Linechart",
	"stanza:definition": "Linechart MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Text",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-07",
	"stanza:updated": "2020-11-07",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_multi_data_chart",
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
		"stanza:key": "category",
		"stanza:example": "chromosome",
		"stanza:description": "Variable to be assigned as category",
		"stanza:required": true
	},
	{
		"stanza:key": "value",
		"stanza:example": "count",
		"stanza:description": "Variable to be assigned as value",
		"stanza:required": true
	},
	{
		"stanza:key": "group-by",
		"stanza:example": "category",
		"stanza:description": "Variable to be assigned as group",
		"stanza:required": false
	},
	{
		"stanza:key": "category-title",
		"stanza:example": "",
		"stanza:description": "Title for category variable (In case of blank, 'category' variable name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "value-title",
		"stanza:example": "",
		"stanza:description": "Title for value variable (In case of blank, 'value' variable name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "legend-title",
		"stanza:example": "",
		"stanza:description": "Title for group variable, which is used as legend title (In case of blank, 'group' variable name will be assigned)",
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
		"stanza:example": false,
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
		"stanza:default": "#F5DA64",
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
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-line-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Line width"
	},
	{
		"stanza:key": "--togostanza-axis-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
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
		"stanza:default": "#333333",
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
		"stanza:default": 0.1,
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
		"stanza:default": 10,
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
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=linechart.js.map
