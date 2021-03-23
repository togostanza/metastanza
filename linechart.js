import { d as defineStanzaElement } from './stanza-element-c2a08f7a.js';
import { e as embed } from './vega-embed.module-414e3eaf.js';
import { l as loadData } from './load-data-a2861a31.js';
import { a as appendDlButton } from './metastanza_utils-0648515a.js';
import './vega.module-f322150d.js';
import './dsv-cd3740c6.js';
import './timer-be811b16.js';
import './index-b2de29ee.js';

async function linechart(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  const vegaJson = await fetch(
    "https://vega.github.io/vega/examples/line-chart.vg.json"
  ).then((res) => res.json());

  //width、height、padding
  const width = params["width"];
  const height = params["height"];
  const padding = params["padding"];

  //data
  const labelVariable = params["category"];
  const valueVariable = params["value"];
  const groupVariable = params["group-by"] ? params["group-by"] : "none";

  const values = await loadData(params["data-url"], params["data-type"]);

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
        "var(--series-0-color)",
        "var(--series-1-color)",
        "var(--series-2-color)",
        "var(--series-3-color)",
        "var(--series-4-color)",
        "var(--series-5-color)",
      ],
      domain: { data: "table", field: groupVariable },
    },
  ];

  //axes
  const axes = [
    {
      scale: "x",
      orient: params["xaxis-placement"],
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash-length"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["xtick"] === "true",
      // tickCount: params["xtick-count"],
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title:
        params["category-title"] === ""
          ? labelVariable
          : params["category-title"],
      titleColor: "var(--title-font-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-font-size"),
      titleFontWeight: css("--title-font-weight"),
      titlePadding: params["xtitle-padding"],
      labelPadding: params["xlabel-padding"],
      zindex: 1,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            fill: { value: "var(--label-font-color)" },
            font: { value: css("--font-family") },
            fontSize: { value: css("--label-font-size") },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-placement"],
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash-length"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["ytick"] === "true",
      // tickCount: params["ytick-count"],
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-length"),
      tickWidth: css("--tick-width"),
      title:
        params["value-title"] === "" ? valueVariable : params["value-title"],
      titleColor: "var(--title-font-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-font-size"),
      titleFontWeight: css("--title-font-weight"),
      titlePadding: params["ytitle-padding"],
      labelPadding: params["ylabel-padding"],
      zindex: 0,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
            fill: { value: "var(--label-font-color)" },
            font: { value: css("--font-family") },
            fontSize: { value: css("--label-font-size") },
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
        params["legend-title"] === "" ? groupVariable : params["legend-title"],
      titleColor: "var(--title-font-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-font-size"),
      titleFontWeight: css("--title-font-weight"),
      labelColor: "var(--label-font-color)",
      labelFont: css("--font-family"),
      labelFontSize: css("--label-font-size"),
      symbolStrokeColor: css("--border-color"),
      symbolStrokeWidth: css("--border-width"),
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
                value: css("--line-width"),
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
    signals: vegaJson.signals,
    data,
    scales,
    axes,
    legends: params["legend"] === "true" && params["group-by"] ? legends : [],
    marks,
  };

  //delete default controller
  for (const signal of vegaJson.signals) {
    delete signal.bind;
  }

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await embed(el, spec, opts);

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector("svg"),
    "piechart",
    stanza
  );

  const menuButton = stanza.root.querySelector("#dl_button");
  const menuList = stanza.root.querySelector("#dl_list");
  switch (params["metastanza-menu-placement"]) {
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

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': linechart
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
		"stanza:description": "Title for category variable (In case of blank, 'category variable' name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "value-title",
		"stanza:example": "",
		"stanza:description": "Title for value variable (In case of blank, 'value variable' name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "legend-title",
		"stanza:example": "",
		"stanza:description": "Title for group variable, which is used as legend title (In case of blank, 'group variable' name will be assigned)",
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
		"stanza:example": "0",
		"stanza:description": "X label angle (in degree)"
	},
	{
		"stanza:key": "ylabel-angle",
		"stanza:example": "0",
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
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--series-3-color",
		"stanza:type": "color",
		"stanza:default": "#f5da64",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--series-4-color",
		"stanza:type": "color",
		"stanza:default": "#f57f5b",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--series-5-color",
		"stanza:type": "color",
		"stanza:default": "#f75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--line-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "Line width"
	},
	{
		"stanza:key": "--axis-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Axis color"
	},
	{
		"stanza:key": "--axis-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "Axis width"
	},
	{
		"stanza:key": "--grid-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Grid color"
	},
	{
		"stanza:key": "--grid-dash-length",
		"stanza:type": "number",
		"stanza:default": "",
		"stanza:description": "Grid dash length (Blank for solid lines)"
	},
	{
		"stanza:key": "--grid-opacity",
		"stanza:type": "number",
		"stanza:default": "0.1",
		"stanza:description": "Grid opacity (0-1)"
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
		"stanza:default": "#4E5059",
		"stanza:description": "Tick color"
	},
	{
		"stanza:key": "--tick-length",
		"stanza:type": "number",
		"stanza:default": "1.5",
		"stanza:description": "Tick length (in pixel)"
	},
	{
		"stanza:key": "--tick-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "Tick width (in pixel)"
	},
	{
		"stanza:key": "--title-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Title font color"
	},
	{
		"stanza:key": "--title-font-size",
		"stanza:type": "number",
		"stanza:default": "10",
		"stanza:description": "Title font size"
	},
	{
		"stanza:key": "--title-font-weight",
		"stanza:type": "number",
		"stanza:default": "400",
		"stanza:description": "Title font weight"
	},
	{
		"stanza:key": "--label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--label-font-size",
		"stanza:type": "number",
		"stanza:default": "10",
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--border-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--border-width",
		"stanza:type": "number",
		"stanza:default": "0.5",
		"stanza:description": "Border width"
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
