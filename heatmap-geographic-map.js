import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { e as embed } from './vega-embed.module-07804790.js';
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

class heatmapGeographicMap extends Stanza {
  async render() {
    const spec = await fetch(
      "https://vega.github.io/vega/examples/annual-precipitation.vg.json"
    ).then((res) => res.json());

    spec.width = this.params["width"]; //metadata.jsにパラメータを定義
    spec.height = this.params["height"];

    spec.data = [
      {
        name: "precipitation",
        url: "https://vega.github.io/vega/data/annual-precip.json", //一時的にVegaのデータを使用
      },
      {
        name: "contours",
        source: "precipitation",
        transform: [
          {
            type: "isocontour",
            thresholds: { signal: "sequence(step, stop, step)" },
          },
        ],
      },
      {
        name: "world",
        url: "https://vega.github.io/vega/data/world-110m.json", //一時的にVegaのデータを使用
        format: { type: "topojson", feature: "countries" },
      },
    ];

    spec.projections = [
      {
        name: "projection",
        type: { signal: "projection" },
        scale: { signal: "scale" },
        rotate: { signal: "[rotate0, rotate1, rotate2]" },
        translate: { signal: "[width/2, height/2]" },
      },
    ];

    (spec.scales = [
      {
        name: "color",
        type: "quantize",
        domain: { signal: "[0, stop]" },
        range: { scheme: "bluepurple", count: { signal: "levels" } },
      },
    ]),
      (spec.marks = [
        {
          type: "shape",
          clip: true,
          from: { data: "world" },
          encode: {
            update: {
              strokeWidth: { value: 1 },
              stroke: { value: "var(--togostanza-map-border-color)" },
              fill: { value: "var(--togostanza-map-color)" },
            },
          },
          transform: [
            {
              type: "geoshape",
              projection: "projection",
            },
          ],
        },
        {
          type: "shape",
          clip: true,
          from: { data: "contours" },
          encode: {
            update: {
              fill: { scale: "color", field: "contour.value" },
              fillOpacity: { signal: "opacity" },
            },
          },
          transform: [
            {
              type: "geoshape",
              field: "datum.contour",
              projection: "projection",
            },
          ],
        },
      ]);

    spec.legends = [
      {
        title: "Annual Precipitation (mm)",
        fill: "color",
        orient: "bottom",
        offset: 5,
        type: "gradient",
        gradientLength: 300,
        gradientThickness: 12,
        titlePadding: 10,
        titleOrient: "left",
        titleAnchor: "end",
        direction: "horizontal",
      },
    ];

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await embed(el, spec, opts);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': heatmapGeographicMap
});

var metadata = {
	"@context": {
},
	"@id": "heatmap-geographic-map",
	"stanza:label": "Heatmap geographic map",
	"stanza:definition": "Heatmap geographic map MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Map",
	"stanza:provider": "",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2021-04-23",
	"stanza:updated": "2021-04-23",
	"stanza:parameter": [
	{
		"stanza:key": "width",
		"stanza:type": "string",
		"stanza:example": "600",
		"stanza:description": "width",
		"stanza:required": false
	},
	{
		"stanza:key": "height",
		"stanza:type": "string",
		"stanza:example": "300",
		"stanza:description": "height",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-map-border-color",
		"stanza:type": "color",
		"stanza:default": "#66CCFF",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-map-color",
		"stanza:type": "color",
		"stanza:default": "#FFFF99",
		"stanza:description": "Map color"
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
//# sourceMappingURL=heatmap-geographic-map.js.map
