import { d as defineStanzaElement } from './stanza-element-40ac9902.js';
import { S as Stanza } from './stanza-7a5318fa.js';
import { e as embed } from './vega-embed.module-2e167ee9.js';
import { l as loadData } from './load-data-0be92417.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as copyHTMLSnippetToClipboardMenuItem, g as appendCustomCss } from './index-1e0b4ea1.js';

class Tree extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "tree"),
      downloadPngMenuItem(this, "tree"),
      downloadJSONMenuItem(this, "tree", this._data),
      downloadCSVMenuItem(this, "tree", this._data),
      downloadTSVMenuItem(this, "tree", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width,height,padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    //data
    const labelVariable = this.params["label"]; //"name"
    const parentVariable = this.params["parent-node"]; //"parent"
    const idVariable = this.params["node"]; //"id-variable"

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = values;

    const signals = [
      {
        name: "labels",
        value: true,
      },
      {
        name: "layout",
        value: "tidy",
      },
      {
        name: "links",
        value: "diagonal",
      },
      {
        name: "separation",
        value: false,
      },
    ];

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
          "var(--togostanza-series-0-color)",
          "var(--togostanza-series-1-color)",
          "var(--togostanza-series-2-color)",
          "var(--togostanza-series-3-color)",
          "var(--togostanza-series-4-color)",
          "var(--togostanza-series-5-color)",
        ],
        domain: { data: "tree", field: "depth" },
        zero: true,
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
            stroke: { value: "var(--togostanza-edge-color)" },
          },
        },
      },
      {
        type: "symbol",
        from: { data: "tree" },
        encode: {
          enter: {
            size: {
              value: css("--togostanza-node-size"),
            },
            stroke: { value: "var(--stroke-color)" },
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            fill: { scale: "color", field: "depth" },
            stroke: { value: "var(--togostanza-border-color)" },
            strokeWidth: { value: css("--togostanza-border-width") },
          },
        },
      },
      {
        type: "text",
        from: { data: "tree" },
        encode: {
          enter: {
            text: {
              field:
                this.params["label"] === ""
                  ? this.params["node"]
                  : labelVariable,
            },
            font: { value: css("--togostanza-font-family") },
            fontSize: { value: css("--togostanza-label-font-size") },
            baseline: { value: "middle" },
          },
          update: {
            x: { field: "x" },
            y: { field: "y" },
            dx: { signal: "datum.children ? -7 : 7" },
            align: { signal: "datum.children ? 'right' : 'left'" },
            opacity: { signal: "labels ? 1 : 0" },
            fill: { value: "var(--togostanza-label-font-color)" },
          },
        },
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
  'default': Tree
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "tree",
	"stanza:label": "Tree",
	"stanza:definition": "Tree MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-26",
	"stanza:updated": "2020-11-26",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://vega.github.io/vega/data/flare.json",
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
		"stanza:key": "parent-node",
		"stanza:example": "parent",
		"stanza:description": "Variable to be assigned as parent node",
		"stanza:required": true
	},
	{
		"stanza:key": "node",
		"stanza:example": "id",
		"stanza:description": "Variable to be assigned as node",
		"stanza:required": true
	},
	{
		"stanza:key": "label",
		"stanza:example": "name",
		"stanza:description": "Variable to be assigned as category",
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
		"stanza:example": 600,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 1600,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Padding"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590E6",
		"stanza:description": "Depth color 1"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3AC9B6",
		"stanza:description": "Depth color 2"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9EDE2F",
		"stanza:description": "Depth color 3"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Depth color 4"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Depth color 5"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Depth color 6"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-node-size",
		"stanza:type": "number",
		"stanza:default": 100,
		"stanza:description": "Node size"
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
		"stanza:default": 11,
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
		"stanza:key": "--togostanza-edge-color",
		"stanza:type": "color",
		"stanza:default": "#AEB3BF",
		"stanza:description": "Edge color"
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
//# sourceMappingURL=tree.js.map
