import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import './index-802c870c.js';
import { e as embed } from './vega-embed.module-529d62fa.js';
import './timer-b826f0a9.js';
import './vega.module-1945ca45.js';

// import { stratify } from "d3";

async function barchart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  //height,width,padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];
  // spec.padding = getComputedStyle(stanza.root.host).getPropertyValue("--padding");

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];

  spec.data = [
    {
      name: "table",
      url: params["your-data"],
    },
  ];

  //scales
  spec.scales = [
    {
      name: "xscale",
      type: "band",
      range: "width",
      domain: { data: "table", field: labelVariable },
      padding: 0.05,
      paddingInner: params["padding-inner"],
      paddingOuter: params["padding-outer"],
      round: true,
    },
    {
      name: "yscale",
      range: "height",
      domain: { data: "table", field: valueVariable },
      // nice: true,
    },
  ];

  //axes
  spec.axes = [
    {
      scale: "xscale",
      orient: params["xaxis-orient"],
      domainColor: "var(--axis-color)",
      domainWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--axis-width"
      ),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-weight"
      ),
      ticks: params["xtick"] === "true",
      // tickCount: params["xtick-count"],
      tickColor: "var(--tick-color)",
      tickSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-size"
      ),
      tickWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-width"
      ),
      title: labelVariable,
      titleColor: "var(--title-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-width"
      ),
      titlePadding: Number(
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
      ),
      zindex: 1,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            dx: { value: params["xlabel-horizonal-offset"] },
            dy: { value: params["xlabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--font-family"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-size"
              ),
            },
            // limit: 1
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          },
        },
      },
    },
    {
      scale: "yscale",
      orient: params["yaxis-orient"],
      domainColor: "var(--axis-color)",
      domainWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--axis-width"
      ),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      ticks: params["ytick"] === "true",
      // tickCount: params["ytick-count"],
      tickColor: "var(--tick-color)",
      tickSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-size"
      ),
      tickWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-width"
      ),
      title: valueVariable,
      titleColor: "var(--title-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-width"
      ),
      titlePadding: Number(
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
      ),
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
            dx: { value: params["ylabel-horizonal-offset"] },
            dy: { value: params["ylabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--font-family"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-size"
              ),
            },
            // limit: 1
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          },
        },
      },
    },
  ];

  //marks
  spec.marks = [
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        enter: {
          x: { scale: "xscale", field: labelVariable },
          width: { scale: "xscale", band: params["bar-width"] },
          y: { scale: "yscale", field: valueVariable },
          y2: { scale: "yscale", value: 0 },
        },
        update: {
          fill: { value: "var(--series-0-color)" },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--stroke-width"
            ),
          },
        },
        hover: {
          fill: { value: "var(--emphasized-color)" },
        },
      },
    },
    {
      type: "text",
      encode: {
        enter: {
          align: { value: "center" },
          baseline: { value: "bottom" },
          fill: { value: "var(--emphasized-color)" },
          font: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--font-family"
            ),
          },
        },
      },
    },
  ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await embed(el, spec, opts);
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "barchart",
	"stanza:label": "barchart",
	"stanza:definition": "Vega wrapped barchart for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c_nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-06",
	"stanza:updated": "2020-11-06",
	"stanza:parameter": [
	{
		"stanza:key": "src-url",
		"stanza:example": "https://vega.github.io/vega/examples/bar-chart.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "your-data",
		"stanza:example": "http://togostanza.org/sparqlist/api/metastanza_chart?chromosome=1",
		"stanza:description": "Source url of your data.",
		"stanza:required": true
	},
	{
		"stanza:key": "label-variable",
		"stanza:example": "category",
		"stanza:description": "Variable to be assigned as label.",
		"stanza:required": true
	},
	{
		"stanza:key": "value-variable",
		"stanza:example": "count",
		"stanza:description": "Variable to be assigned as value.",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:example": "200",
		"stanza:description": "Width of your stanza"
	},
	{
		"stanza:key": "height",
		"stanza:example": "200",
		"stanza:description": "Height of your stanza"
	},
	{
		"stanza:key": "padding",
		"stanza:example": "50",
		"stanza:description": "Padding around your stanza"
	},
	{
		"stanza:key": "padding-inner",
		"stanza:example": "0.1",
		"stanza:description": "Padding between each bars. This mast be in the range[0,1]"
	},
	{
		"stanza:key": "padding-outer",
		"stanza:example": "0.4",
		"stanza:description": "Padding outside of bar group. This mast be in the range[0,1]"
	},
	{
		"stanza:key": "xaxis-orient",
		"stanza:example": "bottom",
		"stanza:description": "Orient of X-axis.(top or bottom)"
	},
	{
		"stanza:key": "yaxis-orient",
		"stanza:example": "left",
		"stanza:description": "Orient of Y-axis.(left or right)"
	},
	{
		"stanza:key": "xgrid",
		"stanza:example": false,
		"stanza:description": "Display of X-grids.(true or false)"
	},
	{
		"stanza:key": "ygrid",
		"stanza:example": true,
		"stanza:description": "Display of Y-grids.(true or false)"
	},
	{
		"stanza:key": "xtick",
		"stanza:example": false,
		"stanza:description": "Display of X-ticks.(true or false)"
	},
	{
		"stanza:key": "ytick",
		"stanza:example": true,
		"stanza:description": "Display of Y-ticks.(true or false)"
	},
	{
		"stanza:key": "xtick-count",
		"stanza:example": "nice",
		"stanza:description": "Count of Y-ticks for quantitative scales. Acceptable data-types are Number, Stirng, and Object."
	},
	{
		"stanza:key": "ytick-count",
		"stanza:example": "nice",
		"stanza:description": "Count of Y-ticks for quantitative scales. Acceptable data-types are Number, Stirng, and Object."
	},
	{
		"stanza:key": "xlabel-angle",
		"stanza:example": "-45",
		"stanza:description": "Angle of X-labels.(in degree)"
	},
	{
		"stanza:key": "ylabel-angle",
		"stanza:example": "0",
		"stanza:description": "Angle of Y-labels.(in degree)"
	},
	{
		"stanza:key": "xlabel-horizonal-offset",
		"stanza:default": "60",
		"stanza:description": "Horizonal offset of xlabels."
	},
	{
		"stanza:key": "xlabel-vertical-offset",
		"stanza:default": "0",
		"stanza:description": "Vertical offset of xlabels."
	},
	{
		"stanza:key": "ylabel-horizonal-offset",
		"stanza:default": "5",
		"stanza:description": "Horizonal offset of ylabels."
	},
	{
		"stanza:key": "ylabel-vertical-offset",
		"stanza:default": "5",
		"stanza:description": "Vertical offset of ylabels."
	},
	{
		"stanza:key": "bar-width",
		"stanza:example": "0.8",
		"stanza:description": "Bar width.[0-1]"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Bar color"
	},
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#FA8C84",
		"stanza:description": "Emphasized color when you hover on labels and rects"
	},
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family."
	},
	{
		"stanza:key": "--axis-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Axis color."
	},
	{
		"stanza:key": "--axis-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "Axis width."
	},
	{
		"stanza:key": "--grid-color",
		"stanza:type": "color",
		"stanza:default": "#aeb3bf",
		"stanza:description": "Grid color"
	},
	{
		"stanza:key": "--grid-dash",
		"stanza:type": "number",
		"stanza:default": "",
		"stanza:description": "Grid stroke dash.  Blank for solid lines."
	},
	{
		"stanza:key": "--grid-opacity",
		"stanza:type": "number",
		"stanza:default": "0.5",
		"stanza:description": "Grid opacity.[0-1]"
	},
	{
		"stanza:key": "--grid-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "Grid width"
	},
	{
		"stanza:key": "--tick-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Tick color"
	},
	{
		"stanza:key": "--tick-size",
		"stanza:type": "number",
		"stanza:default": "1.5",
		"stanza:description": "Tick length in pixel."
	},
	{
		"stanza:key": "--tick-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "Tick width in pixel."
	},
	{
		"stanza:key": "--title-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Font color of titles."
	},
	{
		"stanza:key": "--title-size",
		"stanza:type": "number",
		"stanza:default": "12",
		"stanza:description": "Font size of titles."
	},
	{
		"stanza:key": "--title-weight",
		"stanza:type": "number",
		"stanza:default": "400",
		"stanza:description": "Font weight of titles."
	},
	{
		"stanza:key": "--title-padding",
		"stanza:type": "number",
		"stanza:default": "10",
		"stanza:description": "Padding between axis labels and title."
	},
	{
		"stanza:key": "--label-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Label color."
	},
	{
		"stanza:key": "--label-size",
		"stanza:type": "number",
		"stanza:default": "10",
		"stanza:description": "Font size of labels."
	},
	{
		"stanza:key": "--stroke-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Stroke color."
	},
	{
		"stanza:key": "--stroke-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "Stroke width."
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

  return "<head>\n</head>\n\n<p class=\"greeting\">\n  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"greeting") || (depth0 != null ? lookupProperty(depth0,"greeting") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"greeting","hash":{},"data":data,"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":14}}}) : helper)))
    + "\n</p>\n\n<p class=\"table-title\">\n  Title of this Table\n</p>";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}\n\nsummary {\n  display: none;\n}";

defineStanzaElement(barchart, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=barchart.js.map
