import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { e as embed } from './vega-embed.module-8c506186.js';
import { l as loadData } from './load-data-d3554855.js';
import { a as appendDlButton } from './metastanza_utils-6810f372.js';
import './vega.module-9c8b3b23.js';
import './dsv-cd3740c6.js';
import './timer-be811b16.js';
import './index-b010e6ef.js';

async function threeVariablesScatterplot(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  //width,height,padding
  const width = Number(params["width"]);
  const height = Number(params["height"]);
  const padding = Number(params["padding"]);

  const xVariable = params["x-variable"];
  const yVariable = params["y-variable"];
  const zVariable = params["z-variable"];

  const values = await loadData(params["data-url"], params["data-type"]);

  const data = [
    {
      name: "source",
      values,
      transform: [
        {
          type: "filter",
          expr: `datum['${xVariable}'] != null && datum['${yVariable}'] != null && datum['${zVariable}'] != null`,
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
  const axes = [
    {
      scale: "x",
      orient: params["xaxis-orient"],
      domain: true,
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["xtick"] === "true",
      // tickCount: params["xtick-count"],
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title: xVariable,
      titleColor: "var(--title-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-size"),
      titleFontWeight: css("--title-weight"),
      titlePadding: Number(css("--title-padding")),
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
              value: css("--font-family"),
            },
            fontSize: {
              value: css("--label-size"),
            },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-orient"],
      domain: true,
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["ytick"] === "true",
      // tickCount: params["ytick-count"],
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title: yVariable,
      titleColor: "var(--title-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-size"),
      titleFontWeight: css("--title-weight"),
      titlePadding: Number(css("--title-padding")),
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
              value: css("--font-family"),
            },
            fontSize: {
              value: css("--label-size"),
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
      title: zVariable,
      titleColor: "var(--legendtitle-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--legendtitle-size"),
      titleFontWeight: css("--legendtitle-weight"),
      labelColor: "var(--legendlabel-color)",
      labelFont: css("--font-family"),
      labelFontSize: css("--legendlabel-size"),
      symbolType: params["symbol-shape"],
      symbolFillColor: "var(--series-0-color)",
      symbolStrokeColor: css("--stroke-color"),
      symbolStrokeWidth: css("--stroke-width"),
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
          shape: { value: params["symbol-shape"] },
          fill: { value: "var(--series-0-color)" },
          size: { scale: "size", field: zVariable },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: {
            value: css("--stroke-width"),
          },
          opacity: {
            value: css("--opacity"),
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
    legends,
    marks,
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await embed(el, spec, opts);

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector("svg"),
    "threevariable-scatter-plot",
    stanza
  );

  const menuButton = stanza.root.querySelector("#dl_button");
  const menuList = stanza.root.querySelector("#dl_list");
  switch (params["menu-button-placement"]) {
    case "top-left":
      menuButton.setAttribute("class", "dl-top-left");
      menuList.setAttribute("class", "dl-top-left");
      break;
    case "top-right":
      menuButton.setAttribute("class", "dl-top-right");
      menuList.setAttribute("class", "dl-top-right");
      break;
    case "bottom-left":
      menuButton.setAttribute("class", "dl-bottom-left");
      menuList.setAttribute("class", "dl-bottom-left");
      break;
    case "bottom-right":
      menuButton.setAttribute("class", "dl-bottom-right");
      menuList.setAttribute("class", "dl-bottom-right");
      break;
    case "none":
      menuButton.setAttribute("class", "dl-none");
      menuList.setAttribute("class", "dl-none");
      break;
  }
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
		"stanza:key": "data-url",
		"stanza:example": "https://vega.github.io/vega-lite/data/cars.json",
		"stanza:description": "Data url which you want to draw",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:example": "json",
		"stanza:description": "Data type",
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
		"stanza:key": "menu-button-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right",
			"none"
		],
		"stanza:example": "top-right",
		"stanza:description": "Placement of the download button.(top-left,top-right,bottom-right,bottom-left,none)"
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

var css = "summary {\n  display: none;\n}\n\nsvg#dl_button {\n  position: absolute;\n}\nsvg#dl_button.dl-top-left {\n  top: 20px;\n  left: 40px;\n}\nsvg#dl_button.dl-top-right {\n  top: 20px;\n  right: 40px;\n}\nsvg#dl_button.dl-bottom-left {\n  bottom: 20px;\n  left: 40px;\n}\nsvg#dl_button.dl-bottom-right {\n  bottom: 20px;\n  right: 40px;\n}\nsvg#dl_button.dl-none {\n  display: none;\n}\nsvg#dl_button .circle_g {\n  cursor: pointer;\n  opacity: 0.5;\n}\nsvg#dl_button .hover {\n  opacity: 1;\n}\n\ndiv#dl_list {\n  width: fit-content;\n  position: absolute;\n  border: solid 1px var(--label-color);\n  background-color: #ffffff;\n  font-size: 12px;\n  font-family: var(--font-family);\n}\ndiv#dl_list.dl-top-left {\n  top: 40px;\n  left: 50px;\n}\ndiv#dl_list.dl-top-right {\n  top: 40px;\n  right: 50px;\n}\ndiv#dl_list.dl-bottom-left {\n  bottom: 40px;\n  left: 50px;\n}\ndiv#dl_list.dl-bottom-right {\n  bottom: 40px;\n  right: 50px;\n}\ndiv#dl_list.dl-none {\n  display: none;\n}\ndiv#dl_list ul {\n  list-style-type: none;\n  margin: 0px;\n  padding: 0px;\n}\ndiv#dl_list ul li {\n  cursor: pointer;\n  padding: 0px 10px 0px 10px;\n}\ndiv#dl_list ul li.hover {\n  background-color: #dddddd;\n}";

defineStanzaElement(threeVariablesScatterplot, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=three-variables-scatterplot.js.map
