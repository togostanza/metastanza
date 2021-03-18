import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { e as embed } from './vega-embed.module-8c506186.js';
import { l as loadData } from './load-data-cc489077.js';
import { a as appendDlButton } from './metastanza_utils-b4d4e68b.js';
import './vega.module-9c8b3b23.js';
import './dsv-cd3740c6.js';
import './timer-be811b16.js';
import './index-b010e6ef.js';

async function tree(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  const vegaJson = await fetch(
    "https://vega.github.io/vega/examples/tree-layout.vg.json"
  ).then((res) => res.json());

  //width,height,padding
  const width = Number(params["width"]);
  const height = Number(params["height"]);
  const padding = Number(params["padding"]);

  //data
  const labelVariable = params["label-variable"]; //"name"
  const parentVariable = params["parent-variable"]; //"parent"
  const idVariable = params["id-variable"]; //"id-variable"

  const values = await loadData(params["data-url"], params["data-type"]);

  const data = [
    {
      name: "tree",
      values,
      transform: [
        {
          type: "stratify",
          key: idVariable,
          parentKey: parentVariable,
        },
        {
          type: "tree",
          method: { signal: "layout" },
          size: [{ signal: "height" }, { signal: "width - 100" }],
          separation: { signal: "separation" },
          as: ["y", "x", "depth", "children"],
        },
      ],
    },
    {
      name: "links",
      source: "tree",
      transform: [
        { type: "treelinks" },
        {
          type: "linkpath",
          orient: "horizontal",
          shape: { signal: "links" },
        },
      ],
    },
  ];

  //scales
  const scales = [
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
      domain: { data: "tree", field: "depth" },
      zero: true,
    },
  ];

  //legend
  const legends = [
    {
      fill: "color",
      title: params["legend-title"],
      titleColor: "var(--legendtitle-color)",
      labelColor: "var(--legendlabel-color)",
      orient: "top-left",
      encode: {
        title: {
          update: {
            font: { value: css("--legend-font") },
            fontSize: { value: css("--legendtitle-size") },
            fontWeight: { value: css("--legendtitle-weight") },
          },
        },
        labels: {
          interactive: true,
          update: {
            font: { value: css("--legend-font") },
            fontSize: { value: css("--legendlabel-size") },
          },
          text: { field: "value" },
        },
        symbols: {
          update: {
            shape: { value: params["symbol-shape"] },
            stroke: { value: "var(--stroke-color)" },
            strokeWidth: { value: css("--stroke-width") },
          },
        },
      },
    },
  ];

  //marks
  const marks = [
    {
      type: "path",
      from: { data: "links" },
      encode: {
        update: {
          path: { field: "path" },
          stroke: { value: "var(--branch-color)" },
        },
      },
    },
    {
      type: "symbol",
      from: { data: "tree" },
      encode: {
        enter: {
          size: {
            value: css("--node-size"),
          },
          stroke: { value: "var(--stroke-color)" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          fill: { scale: "color", field: "depth" },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: { value: css("--stroke-width") },
        },
      },
    },
    {
      type: "text",
      from: { data: "tree" },
      encode: {
        enter: {
          text: { field: labelVariable },
          font: { value: css("--font-family") },
          fontSize: { value: css("--label-size") },
          baseline: { value: "middle" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          dx: { signal: "datum.children ? -7 : 7" },
          align: { signal: "datum.children ? 'right' : 'left'" },
          opacity: { signal: "labels ? 1 : 0" },
          fill: { value: "var(--label-color)" },
        },
      },
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
    legends,
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
	"@id": "tree",
	"stanza:label": "tree",
	"stanza:definition": "Vega wrapped tree for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "tree",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-26",
	"stanza:updated": "2020-11-26",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://vega.github.io/vega/data/flare.json",
		"stanza:description": "Source url of your data.",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:example": "json",
		"stanza:description": "Type of your data.",
		"stanza:required": true
	},
	{
		"stanza:key": "label-variable",
		"stanza:example": "name",
		"stanza:description": "variable to be assigned as label",
		"stanza:required": true
	},
	{
		"stanza:key": "value-variable",
		"stanza:example": "size",
		"stanza:description": "variable to be assigned as value",
		"stanza:required": true
	},
	{
		"stanza:key": "parent-variable",
		"stanza:example": "parent",
		"stanza:description": "variable to be assigned as parent node",
		"stanza:required": true
	},
	{
		"stanza:key": "id-variable",
		"stanza:example": "id",
		"stanza:description": "variable to be assigned as id",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:example": "600",
		"stanza:description": "width of your stanza"
	},
	{
		"stanza:key": "height",
		"stanza:example": "1600",
		"stanza:description": "height of your stanza"
	},
	{
		"stanza:key": "padding",
		"stanza:example": "5",
		"stanza:description": "padding around your stanza"
	},
	{
		"stanza:key": "legend-title",
		"stanza:example": "Title of this legend",
		"stanza:description": "title of legends"
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
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "bar color"
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
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#fa8c84",
		"stanza:description": "Emphasized color when you hover on labels and rects"
	},
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family."
	},
	{
		"stanza:key": "--label-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "text color of each nodes"
	},
	{
		"stanza:key": "--label-size",
		"stanza:type": "number",
		"stanza:default": "11",
		"stanza:description": "font size of the legend label"
	},
	{
		"stanza:key": "--branch-color",
		"stanza:type": "color",
		"stanza:default": "#AEB3BF",
		"stanza:description": "Branch color."
	},
	{
		"stanza:key": "--node-size",
		"stanza:type": "number",
		"stanza:default": "100",
		"stanza:description": "Node size."
	},
	{
		"stanza:key": "--stroke-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "color of stroke"
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
		"stanza:key": "--hover-stroke-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "stroke color of plot when you hover."
	},
	{
		"stanza:key": "--hover-stroke-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "stroke width of plot when you hover."
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

defineStanzaElement(tree, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=tree.js.map
