import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { e as embed } from './vega-embed.module-80d1ecde.js';
import './vega.module-5c1fb2a7.js';
import './timer-be811b16.js';

async function threeVariablesScatterplot(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  // width,hight,padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];

  const xVariable = params["x-variable"];
  const yVariable = params["y-variable"];
  const zVariable = params["z-variable"];

  spec.data = [
    {
      name: "source",
      url: params["your-data"],
      transform: [
        {
          type: "filter",
          expr: `datum['${xVariable}'] != null && datum['${yVariable}'] != null && datum['${zVariable}'] != null`,
        },
      ],
    },
  ];

  //scales
  spec.scales = [
    {
      name: "x",
      type: "linear",
      round: true,
      nice: true,
      zero: true,
      domain: { data: "source", field: xVariable },
      range: "width",
    },
    {
      name: "y",
      type: "linear",
      round: true,
      nice: true,
      zero: true,
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
  spec.axes = [
    {
      scale: "x",
      orient: params["xaxis-orient"],
      domain: true,
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
        "--grid-width"
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
      title: xVariable,
      titleColor: "var(--title-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-weight"
      ),
      titlePadding: Number(
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
      ),
      zindex: 0,
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
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-orient"],
      domain: true,
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
      title: yVariable,
      titleColor: "var(--title-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-weight"
      ),
      titlePadding: Number(
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
      ),
      zindex: 0,
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
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          },
        },
      },
    },
  ];

  // legend
  spec.legends = [
    {
      size: "size",
      format: "s",
      title: zVariable,
      titleColor: "var(--legendtitle-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--legendtitle-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--legendtitle-weight"
      ),
      labelColor: "var(--legendlabel-color)",
      labelFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      labelFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--legendlabel-size"
      ),
      symbolType: params["symbol-shape"],
      symbolFillColor: "var(--series-0-color)",
      symbolStrokeColor: getComputedStyle(stanza.root.host).getPropertyValue(
        "--stroke-color"
      ),
      symbolStrokeWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--stroke-width"
      ),
    },
  ];

  //marks
  spec.marks = [
    {
      name: "marks",
      type: "symbol",
      from: { data: "source" },
      encode: {
        update: {
          x: { scale: "x", field: xVariable },
          y: { scale: "y", field: yVariable },
          shape: { value: params["symbol-shape"] },
          fill: { value: "var(--series-0-color)" },
          size: { scale: "size", field: zVariable },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--stroke-width"
            ),
          },
          opacity: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--opacity"
            ),
          },
        },
        hover: {
          fill: { value: "var(--emphasized-color)" },
          stroke: { value: "var(--hover-stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--hover-stroke-width"
            ),
          },
          opacity: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--hover-opacity"
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
	"@id": "three-variables-scatterplot",
	"stanza:label": "three variables scatterplot",
	"stanza:definition": "Vega wrapped scatterplot for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Graph",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-06",
	"stanza:updated": "2020-11-06",
	"stanza:parameter": [
	{
		"stanza:key": "src-url",
		"stanza:example": "https://vega.github.io/vega/examples/scatter-plot.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "your-data",
		"stanza:example": "https://vega.github.io/vega-lite/data/cars.json",
		"stanza:description": "JSON data url which you want to draw",
		"stanza:required": true
	},
	{
		"stanza:key": "x-variable",
		"stanza:example": "Horsepower",
		"stanza:description": "Key for X-variable."
	},
	{
		"stanza:key": "y-variable",
		"stanza:example": "Miles_per_Gallon",
		"stanza:description": "Key for Y-variable."
	},
	{
		"stanza:key": "z-variable",
		"stanza:example": "Acceleration",
		"stanza:description": "Key for z-variable"
	},
	{
		"stanza:key": "width",
		"stanza:example": "400",
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
		"stanza:example": true,
		"stanza:description": "display of X-grids"
	},
	{
		"stanza:key": "ygrid",
		"stanza:example": true,
		"stanza:description": "display of Y-grids"
	},
	{
		"stanza:key": "xtick",
		"stanza:example": false,
		"stanza:description": "display of X-ticks.(true or false)"
	},
	{
		"stanza:key": "ytick",
		"stanza:example": true,
		"stanza:description": "display of Y-ticks.(true or false)"
	},
	{
		"stanza:key": "xlabel-angle",
		"stanza:example": "0",
		"stanza:description": "angle of X-labels.(in degree)"
	},
	{
		"stanza:key": "ylabel-angle",
		"stanza:example": "0",
		"stanza:description": "angle of Y-labels.(in degree)"
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
		"stanza:key": "symbol-shape",
		"stanza:example": "circle",
		"stanza:description": "Shape of plot.(circle, square, cross, diamond, triangle-up, triangle-down, triangle-right, triangle-left, stroke, arrow, wedge, or triangle)"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Plot colot."
	},
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#FF5C5C",
		"stanza:description": "Emphasized color."
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
		"stanza:key": "--title-size",
		"stanza:type": "number",
		"stanza:default": "12",
		"stanza:description": "font size of titles"
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
		"stanza:default": "#333333",
		"stanza:description": "label color"
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
		"stanza:key": "--legendtitle-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "font color of the legend title"
	},
	{
		"stanza:key": "--legendtitle-size",
		"stanza:type": "number",
		"stanza:default": "12",
		"stanza:description": "Font size of the legend title"
	},
	{
		"stanza:key": "--legendtitle-weight",
		"stanza:type": "number",
		"stanza:default": "400",
		"stanza:description": "Font weight of the legend title"
	},
	{
		"stanza:key": "--legendlabel-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Font color of the legend label"
	},
	{
		"stanza:key": "--legendlabel-size",
		"stanza:type": "number",
		"stanza:default": "10",
		"stanza:description": "Font size of the legend label"
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
		"stanza:default": "0.5",
		"stanza:description": "Stroke width."
	},
	{
		"stanza:key": "--opacity",
		"stanza:type": "text",
		"stanza:default": "0.7",
		"stanza:description": "opacity of each plots"
	},
	{
		"stanza:key": "--hover-stroke-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Stroke color of plot when you hover."
	},
	{
		"stanza:key": "--hover-stroke-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "Stroke width of plot when you hover."
	},
	{
		"stanza:key": "--hover-opacity",
		"stanza:type": "text",
		"stanza:default": "1",
		"stanza:description": "Opacity of each plots when you hover"
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

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}";

defineStanzaElement(threeVariablesScatterplot, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=three-variables-scatterplot.js.map
