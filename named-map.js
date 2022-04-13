import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { e as embed } from './vega-embed.module-07804790.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem } from './index-d2bbc90f.js';
import './linear-af9e44cc.js';
import './ordinal-0cb0fa8d.js';
import './descending-63ef45b8.js';
import './dsv-cd3740c6.js';
import './max-2c042256.js';
import './min-4a3f8e4e.js';
import './range-e15c6861.js';
import './arc-49333d16.js';
import './constant-c49047a5.js';
import './path-a78af922.js';
import './array-89f97098.js';
import './line-620615aa.js';
import './basis-0dde91c7.js';
import './sum-44e7480e.js';
import './manyBody-15224179.js';
import './stratify-5205cf04.js';
import './index-beeea236.js';
import './partition-2c1b5971.js';
import './index-847f2a80.js';
import './dsv-cde6fd06.js';

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
    const val = values.map((val) => val[this.params["value-key"]]);

    const scales = [
      {
        name: "userColor",
        type: "quantize",
        domain: [Math.min(...val), Math.max(...val)],
        range: colorRange,
      },
    ];

    const legends = [
      {
        fill: "userColor",
        orient: this.params["legend-orient"],
        title: this.params["legend-title"],
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
	"@id": "named-map",
	"stanza:label": "Named map",
	"stanza:definition": "Named map MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Map",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-04-23",
	"stanza:updated": "2021-08-25",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/tsv/named-map-data.tsv",
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
		"stanza:type": "single-choice",
		"stanza:choice": [
			"normal",
			"bold",
			"lighter"
		],
		"stanza:default": "normal",
		"stanza:description": "Title font weight"
	},
	{
		"stanza:key": "--togostanza-title-font-size",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Title font size in pixels"
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
    return "";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=named-map.js.map
