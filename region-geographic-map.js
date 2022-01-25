import { d as defineStanzaElement } from './stanza-element-40ac9902.js';
import { S as Stanza } from './stanza-7a5318fa.js';
import { e as embed } from './vega-embed.module-2e167ee9.js';
import { l as loadData } from './load-data-0be92417.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as copyHTMLSnippetToClipboardMenuItem } from './index-1e0b4ea1.js';

const areas = new Map([
  [
    "us",
    {
      name: "map",
      url: "https://vega.github.io/vega/data/us-10m.json",
      format: { type: "topojson", feature: "counties" },
    },
  ],
  [
    "world",
    {
      name: "map",
      url: "https://vega.github.io/vega/data/world-110m.json",
      format: {
        type: "topojson",
        feature: "countries",
      },
    },
  ],
]);
class regionGeographicMap extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "region-geographis-map"),
      downloadPngMenuItem(this, "region-geographis-map"),
      downloadJSONMenuItem(this, "region-geographis-map", this._data),
      downloadCSVMenuItem(this, "region-geographis-map", this._data),
      downloadTSVMenuItem(this, "region-geographis-map", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    const valObj = {
      name: "userData",
      values,
    };

    const transform = [
      {
        type: "lookup",
        from: "userData",
        key: "id",
        fields: ["id"],
        values: [this.params["value-key"]],
      },
    ];

    const obj = areas.get(this.params["area"]);
    obj.transform = transform;
    const data = [valObj, obj];

    const projections = [
      {
        name: "projection",
        type: this.params["area"] === "us" ? "albersUsa" : "mercator",
      },
    ];

    const colorRangeMax = [
      "var(--togostanza-series-0-color)",
      "var(--togostanza-series-1-color)",
      "var(--togostanza-series-2-color)",
      "var(--togostanza-series-3-color)",
      "var(--togostanza-series-4-color)",
      "var(--togostanza-series-5-color)",
      "var(--togostanza-series-6-color)",
      "var(--togostanza-series-7-color)",
    ];

    const colorRange = colorRangeMax.slice(
      0,
      Number(this.params["group-amount"])
    );

    const scales = [
      {
        name: "userColor",
        type: "quantize",
        domain: [0, 0.15],
        range: colorRange,
      },
    ];

    const legends = [
      {
        fill: "userColor",
        orient: this.params["legend-orient"],
        title: this.params["legend-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: "var(--togostanza-font-family)",
        titleFontWeight: "var(--togostanza-title-font-weight)",
        format: this.params["percentage"] ? "0.1%" : "",
      },
    ];

    const marks = [
      {
        type: "shape",
        from: { data: "map" },
        encode: {
          enter: {
            tooltip: {
              signal: this.params["percentage"]
                ? `format(datum.${this.params["value-key"]}, '0.1%')`
                : `datum.${this.params["value-key"]}`,
            },
          },
          hover: {
            fill: { value: "var(--togostanza-hover-color)" },
          },
          update: {
            fill: { scale: "userColor", field: this.params["value-key"] },
            stroke: this.params["border"]
              ? { value: "var(--togostanza-region-border-color)" }
              : "",
          },
        },
        transform: [{ type: "geoshape", projection: "projection" }],
      },
    ];

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width: 1000,
      height: 500,
      data,
      projections,
      scales,
      legends: this.params["legend"] ? legends : [],
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
  'default': regionGeographicMap
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "region-geographic-map",
	"stanza:label": "Region geographic map",
	"stanza:definition": "Region geographic map MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Map",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "MarleenEliza",
	"stanza:address": "https://github.com/MarleenEliza",
	"stanza:contributor": [
],
	"stanza:created": "2021-04-23",
	"stanza:updated": "2021-08-25",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://penqeinc.github.io/metastanza//assets/named_map_world_test.tsv",
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
		"stanza:example": "tsv",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "value-key",
		"stanza:example": "rate",
		"stanza:description": "Value key of data",
		"stanza:required": true
	},
	{
		"stanza:key": "area",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"us",
			"world"
		],
		"stanza:example": "world",
		"stanza:description": "Area of map",
		"stanza:required": true
	},
	{
		"stanza:key": "border",
		"stanza:type": "boolean",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show border between"
	},
	{
		"stanza:key": "legend",
		"stanza:type": "boolean",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show legend"
	},
	{
		"stanza:key": "legend-orient",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right"
		],
		"stanza:example": "top-right",
		"stanza:description": "Legend Placement"
	},
	{
		"stanza:key": "legend-title",
		"stanza:type": "text",
		"stanza:example": "Legend Title",
		"stanza:description": "Legend Title"
	},
	{
		"stanza:key": "group-amount",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8"
		],
		"stanza:example": "5",
		"stanza:description": "Amount of Region groups"
	},
	{
		"stanza:key": "percentage",
		"stanza:type": "boolean",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": "false",
		"stanza:description": "Format data as percentage"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-region-border-color",
		"stanza:type": "color",
		"stanza:default": "black",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-hover-color",
		"stanza:type": "color",
		"stanza:default": "#FB0E0E",
		"stanza:description": "Hover color when hovering over region"
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
		"stanza:key": "--togostanza-title-font-weight",
		"stanza:type": "number",
		"stanza:default": "400",
		"stanza:description": "Font weight of legend title"
	},
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
		"stanza:key": "--togostanza-series-6-color",
		"stanza:type": "color",
		"stanza:default": "#8251DB",
		"stanza:description": "Category color 6"
	},
	{
		"stanza:key": "--togostanza-series-7-color",
		"stanza:type": "color",
		"stanza:default": "#9C6363",
		"stanza:description": "Category color 7"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
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

  return "<p class=\"greeting\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"greeting") || (depth0 != null ? lookupProperty(depth0,"greeting") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"greeting","hash":{},"data":data,"loc":{"start":{"line":1,"column":20},"end":{"line":1,"column":32}}}) : helper)))
    + "</p>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=region-geographic-map.js.map
