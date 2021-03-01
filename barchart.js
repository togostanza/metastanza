import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { e as embed } from './vega-embed.module-80d1ecde.js';
import './vega.module-5c1fb2a7.js';
import './timer-be811b16.js';

async function barchart(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }
  const chartType = params["chart-type"];

  //width,height,padding
  const width = Number(params["width"]);
  const height = Number(params["height"]);
  const padding = Number(params["padding"]);

  //data
  const labelVariable = params["label-variable"]; //x
  const valueVariable = params["value-variable"]; //y
  const groupVariable = params["group-variable"]; //z

  function constructData(chartType) {
    switch (chartType) {
      case "grouped":
        return [
          {
            name: "table",
            url: params["your-data"],
          },
        ];
      case "stacked":
        return [
          {
            name: "table",
            url: params["your-data"],
            transform: [
              {
                type: "stack",
                field: valueVariable,
                groupby: [labelVariable],
                sort: { field: groupVariable },
              },
            ],
          },
        ];
    }
  }
  console.log(constructData(chartType));

  //axes
  const axes = [
    {
      scale: "xscale",
      orient: params["xaxis-orient"],
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["xtick"] === "true",
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title: labelVariable,
      titleColor: "var(--title-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-size"),
      titleFontWeight: css("--title-weight"),
      titlePadding: Number(css("--title-padding")),
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            dx: { value: params["xlabel-horizonal-offset"] },
            dy: { value: params["xlabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: { value: css("--font-family") },
            fontSize: { value: css("--label-size") },
          },
        },
      },
    },
    {
      scale: "yscale",
      orient: params["yaxis-orient"],
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["ytick"] === "true",
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title: valueVariable,
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
            fontSize: { value: css("--label-size") },
            // limit: 1
          },
        },
      },
    },
  ];

  // legend
  const legends = [
    {
      fill: "color",
      orient: "none",
      legendX: width + 40,
      legendY: "0",
      title: groupVariable,
      titleColor: "var(--legendtitle-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--legendtitle-size"),
      titleFontWeight: css("--legendtitle-weight"),
      labelColor: "var(--legendlabel-color)",
      labelFont: css("--font-family"),
      labelFontSize: css("--legendlabel-size"),
      symbolStrokeColor: css("--stroke-color"),
      symbolStrokeWidth: css("--stroke-width"),
    },
  ];

  const colorScale = {
    name: "color",
    type: "ordinal",
    domain: { data: "table", field: groupVariable },
    range: [
      "var(--series-0-color)",
      "var(--series-1-color)",
      "var(--series-2-color)",
      "var(--series-3-color)",
      "var(--series-4-color)",
      "var(--series-5-color)",
    ],
  };

  function constructScale(chartType) {
    switch (chartType) {
      case "grouped":
        return [
          colorScale,
          {
            name: "xscale",
            type: "linear",
            domain: { data: "table", field: valueVariable },
            range: "width",
          },
          {
            name: "yscale",
            type: "band",
            domain: { data: "table", field: labelVariable },
            range: "height",
            padding: 0.2,
            paddingInner: params["padding-inner"],
            paddingOuter: params["padding-outer"],
          },
        ];
      case "stacked":
        return [
          colorScale,
          ,
          {
            name: "xscale",
            type: "band",
            range: "width",
            domain: { data: "table", field: labelVariable },
            paddingInner: params["padding-inner"],
            paddingOuter: params["padding-outer"],
          },
          {
            name: "yscale",
            type: "linear",
            range: "height",
            nice: true,
            zero: true,
            domain: { data: "table", field: "y1" },
          },
        ];
    }
  }

  function constructMark(chartType) {
    switch (chartType) {
      case "grouped":
        return [
          {
            type: "group",
            from: {
              facet: {
                data: "table",
                name: "facet",
                groupby: labelVariable,
              },
            },
            encode: {
              enter: {
                y: { scale: "yscale", field: labelVariable },
              },
            },
            signals: [{ name: "height", update: "bandwidth('yscale')" }],
            scales: [
              {
                name: "pos",
                type: "band",
                range: "height",
                domain: { data: "facet", field: groupVariable },
              },
            ],
            marks: [
              {
                name: "bars",
                from: { data: "facet" },
                type: "rect",
                encode: {
                  enter: {
                    y: { scale: "pos", field: groupVariable },
                    height: { scale: "pos", band: 1 },
                    x: { scale: "xscale", field: valueVariable },
                    x2: { scale: "xscale", value: 0 },
                    fill: { scale: "color", field: groupVariable },
                    stroke: { value: "var(--stroke-color)" },
                    strokeWidth: { value: css("--stroke-width") },
                  },
                },
              },
            ],
          },
        ];
      case "stacked":
        return [
          {
            type: "group",
            from: { data: "table" },
            encode: {
              enter: {
                x: { scale: "xscale", field: labelVariable },
                width: { scale: "xscale", band: params["bar-width"] },
                y: { scale: "yscale", field: "y0" },
                y2: { scale: "yscale", field: "y1" },
                fill: { scale: "color", field: groupVariable },
                stroke: { value: "var(--stroke-color)" },
                strokeWidth: { value: css("--stroke-width") },
              },
            },
          },
        ];
    }
  }

  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width,
    height,
    padding,
    data: constructData(chartType),
    scales: constructScale(chartType),
    axes,
    legends,
    marks: constructMark(chartType),
  };

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
		"stanza:key": "chart-type",
		"stanza:example": "grouped",
		"stanza:description": "Type of your barchart.(stacked, grouped)",
		"stanza:required": true
	},
	{
		"stanza:key": "your-data",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_multi_data_chart",
		"stanza:description": "Source url of your data.",
		"stanza:required": true
	},
	{
		"stanza:key": "label-variable",
		"stanza:example": "chromosome",
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
		"stanza:key": "group-variable",
		"stanza:example": "category",
		"stanza:description": "variable to be assigned as an identifier of a group.(If you will not use this variable, this parapeter should be set as none)",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:example": "400",
		"stanza:description": "Width of your stanza"
	},
	{
		"stanza:key": "height",
		"stanza:example": "300",
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
		"stanza:example": "0",
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
		"stanza:key": "--series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-3-color",
		"stanza:type": "color",
		"stanza:default": "#f5da64",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-4-color",
		"stanza:type": "color",
		"stanza:default": "#f57f5b",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-5-color",
		"stanza:type": "color",
		"stanza:default": "#f75976",
		"stanza:description": "bar color"
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
		"stanza:key": "--legendtitle-size",
		"stanza:type": "number",
		"stanza:default": "12",
		"stanza:description": "font size of the legend title"
	},
	{
		"stanza:key": "--legendtitle-weight",
		"stanza:type": "number",
		"stanza:default": "400",
		"stanza:description": "font weight of the legend title"
	},
	{
		"stanza:key": "--legendtitle-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "font color of the legend title"
	},
	{
		"stanza:key": "--legendlabel-size",
		"stanza:type": "number",
		"stanza:default": "10",
		"stanza:description": "font size of the legend label"
	},
	{
		"stanza:key": "--legendlabel-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "font color of the legend label"
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
