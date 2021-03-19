import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { e as embed } from './vega-embed.module-8c506186.js';
import { l as loadData } from './load-data-d3554855.js';
import { a as appendDlButton } from './metastanza_utils-6810f372.js';
import './vega.module-9c8b3b23.js';
import './dsv-cd3740c6.js';
import './timer-be811b16.js';
import './index-b010e6ef.js';

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

  const values = await loadData(params["data-url"], params["data-type"]);

  function constructData(chartType) {
    switch (chartType) {
      case "grouped":
        return [
          {
            name: "table",
            values,
          },
        ];
      case "stacked":
        return [
          {
            name: "table",
            values,
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
  console.log("constructData(chartType)",constructData(chartType));
  console.log('chartType',chartType);
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
      title: chartType === "grouped" ?  valueVariable : labelVariable,
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
      title: chartType === "grouped" ?  labelVariable : valueVariable,
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

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector("svg"),
    "barchart",
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
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_multi_data_chart",
		"stanza:description": "Source url of your data.",
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
		"stanza:description": "Type of data.",
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
    return "";
},"useData":true}]
];

var css = "summary {\n  display: none;\n}\n\nsvg#dl_button {\n  position: absolute;\n}\nsvg#dl_button.dl-top-left {\n  top: 20px;\n  left: 40px;\n}\nsvg#dl_button.dl-top-right {\n  top: 20px;\n  right: 40px;\n}\nsvg#dl_button.dl-bottom-left {\n  bottom: 20px;\n  left: 40px;\n}\nsvg#dl_button.dl-bottom-right {\n  bottom: 20px;\n  right: 40px;\n}\nsvg#dl_button.dl-none {\n  display: none;\n}\nsvg#dl_button .circle_g {\n  cursor: pointer;\n  opacity: 0.5;\n}\nsvg#dl_button .hover {\n  opacity: 1;\n}\n\ndiv#dl_list {\n  width: fit-content;\n  position: absolute;\n  border: solid 1px var(--label-color);\n  background-color: #ffffff;\n  font-size: 12px;\n  font-family: var(--font-family);\n}\ndiv#dl_list.dl-top-left {\n  top: 40px;\n  left: 50px;\n}\ndiv#dl_list.dl-top-right {\n  top: 40px;\n  right: 50px;\n}\ndiv#dl_list.dl-bottom-left {\n  bottom: 40px;\n  left: 50px;\n}\ndiv#dl_list.dl-bottom-right {\n  bottom: 40px;\n  right: 50px;\n}\ndiv#dl_list.dl-none {\n  display: none;\n}\ndiv#dl_list ul {\n  list-style-type: none;\n  margin: 0px;\n  padding: 0px;\n}\ndiv#dl_list ul li {\n  cursor: pointer;\n  padding: 0px 10px 0px 10px;\n}\ndiv#dl_list ul li.hover {\n  background-color: #dddddd;\n}";

defineStanzaElement(barchart, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=barchart.js.map
