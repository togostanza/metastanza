import { d as defineStanzaElement } from './index-60baf012.js';
import { e as embed } from './vega-embed.module-6e02496f.js';
import { l as loadData } from './load-data-d021d995.js';
import { a as appendDlButton } from './metastanza_utils-a3ff1297.js';

async function piechart(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  //width,height,padding
  const width = params["width"];
  const height = params["height"];
  const padding = { left: 0, top: 0, right: 150, bottom: 0 };

  //data
  const labelVariable = params["category"];
  const valueVariable = params["value"];

  const values = await loadData(params["data-url"], params["data-type"]);

  const data = [
    {
      name: "table",
      values,
      transform: [
        {
          type: "pie",
          field: valueVariable,
          startAngle: { signal: "startAngle" },
          endAngle: { signal: "endAngle" },
          sort: { signal: "sort" },
        },
      ],
    },
  ];

  const signals = [
    {
      "name": "startAngle", "value": 0,
    },
    {
      "name": "endAngle", "value": 6.29,
    },
    {
      "name": "padAngle", "value": 0,
    },
    {
      "name": "innerRadius", "value": 0,
    },
    {
      "name": "cornerRadius", "value": 0,
    },
    {
      "name": "sort", "value": false,
    }
  ];

  // scales(color scheme)
  const scales = [
    {
      name: "color",
      type: "ordinal",
      domain: { data: "table", field: labelVariable },
      range: [
        "var(--togostanza-series-0-color)",
        "var(--togostanza-series-1-color)",
        "var(--togostanza-series-2-color)",
        "var(--togostanza-series-3-color)",
        "var(--togostanza-series-4-color)",
        "var(--togostanza-series-5-color)",
      ],
    },
  ];

  //legend
  const legends = [
    {
      fill: "color",
      orient: "right",
      legendY: "5",
      title:
        params["legend-title"] === "" ? labelVariable : params["legend-title"],
      titleColor: "var(--togostanza-title-font-color)",
      titleFont: css("--togostanza-font-family"),
      titleFontSize: css("--togostanza-title-font-size"),
      titleFontWeight: css("--togostanza-title-font-weight"),
      labelColor: "var(--togostanza-label-font-color)",
      labelFont: css("--togostanza-font-family"),
      labelFontSize: css("--togostanza-label-font-size"),
      symbolType: params["symbol-shape"],
      symbolStrokeColor: css("--togostanza-border-color"),
      symbolStrokeWidth: css("--togostanza-border-width"),
    },
  ];

  //marks
  const marks = [
    {
      type: "arc",
      from: { data: "table" },
      encode: {
        enter: {
          fill: { scale: "color", field: labelVariable },
          x: { signal: "width / 2" },
          y: { signal: "height / 2" },
        },
        update: {
          startAngle: { field: "startAngle" },
          endAngle: { field: "endAngle" },
          padAngle: { signal: "padAngle" },
          innerRadius: { signal: "innerRadius" },
          outerRadius: { signal: "width / 2" },
          cornerRadius: { signal: "cornerRadius" },
          fill: { scale: "color", field: labelVariable },
          stroke: { value: "var(--togostanza-border-color)" },
          strokeWidth: { value: "var(--togostanza-border-width)" },
        },
      },
    },
  ];

  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width,
    height,
    padding,
    autosize: "none",
    signals,
    data,
    scales,
    legends: params["legend"] === "false" ? [] : legends,
    marks,
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await embed(el, spec, opts);

  const svg = stanza.root.querySelector(".marks");
  svg.style.padding = `${params["padding"]}px`;

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
  'default': piechart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "piechart",
	"stanza:label": "Piechart",
	"stanza:definition": "Piechart MetaStanza",
	"stanza:type": "Stanza",
	"stanza:context": "Environment",
	"stanza:display": "Chart",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "TogoStanza",
	"stanza:address": "admin@biohackathon.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-05",
	"stanza:updated": "2020-11-05",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_chart?chromosome=1",
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
		"stanza:example": "category",
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
		"stanza:key": "legend-title",
		"stanza:example": "",
		"stanza:description": "Title for category variable, which is used as legend title (In case of blank, 'category' variable name will be assigned)",
		"stanza:required": false
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
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 200,
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
		"stanza:example": 0,
		"stanza:description": "Padding"
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
		"stanza:example": "bottom-right",
		"stanza:description": "Menu button placement"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Category color 0"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Category color 1"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Category color 2"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Category color 3"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Category color 4"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Category color 5"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
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
		"stanza:default": "12",
		"stanza:description": "Font size of the legend title"
	},
	{
		"stanza:key": "--togostanza-title-font-weight",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Font weight of legend title"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
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
//# sourceMappingURL=piechart.js.map
