import { d as defineStanzaElement } from './stanza-element-c2a08f7a.js';
import { e as embed } from './vega-embed.module-414e3eaf.js';
import './vega.module-f322150d.js';
import './dsv-cd3740c6.js';
import './timer-be811b16.js';

function devVegaliteMosaicChartWithLabels(
  stanza /* , params */
) {
  //let spec = await fetch(params["src-url"]).then((res) => res.json());
  const spec = JSON.parse(`{
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": {
      "url": "https://vega.github.io/vega-lite/data/cars.json"
    },
    "transform": [
      {
        "aggregate": [
          {
            "op": "count",
            "as": "count_*"
          }
        ],
        "groupby": [
          "Origin",
          "Cylinders"
        ]
      },
      {
        "stack": "count_*",
        "groupby": [],
        "as": [
          "stack_count_Origin1",
          "stack_count_Origin2"
        ],
        "offset": "normalize",
        "sort": [
          {
            "field": "Origin",
            "order": "ascending"
          }
        ]
      },
      {
        "window": [
          {
            "op": "min",
            "field": "stack_count_Origin1",
            "as": "x"
          },
          {
            "op": "max",
            "field": "stack_count_Origin2",
            "as": "x2"
          },
          {
            "op": "dense_rank",
            "as": "rank_Cylinders"
          },
          {
            "op": "distinct",
            "field": "Cylinders",
            "as": "distinct_Cylinders"
          }
        ],
        "groupby": [
          "Origin"
        ],
        "frame": [
          null,
          null
        ],
        "sort": [
          {
            "field": "Cylinders",
            "order": "ascending"
          }
        ]
      },
      {
        "window": [
          {
            "op": "dense_rank",
            "as": "rank_Origin"
          }
        ],
        "frame": [
          null,
          null
        ],
        "sort": [
          {
            "field": "Origin",
            "order": "ascending"
          }
        ]
      },
      {
        "stack": "count_*",
        "groupby": [
          "Origin"
        ],
        "as": [
          "y",
          "y2"
        ],
        "offset": "normalize",
        "sort": [
          {
            "field": "Cylinders",
            "order": "ascending"
          }
        ]
      },
      {
        "calculate": "datum.y + (datum.rank_Cylinders - 1) * datum.distinct_Cylinders * 0.01 / 3",
        "as": "ny"
      },
      {
        "calculate": "datum.y2 + (datum.rank_Cylinders - 1) * datum.distinct_Cylinders * 0.01 / 3",
        "as": "ny2"
      },
      {
        "calculate": "datum.x + (datum.rank_Origin - 1) * 0.01",
        "as": "nx"
      },
      {
        "calculate": "datum.x2 + (datum.rank_Origin - 1) * 0.01",
        "as": "nx2"
      },
      {
        "calculate": "(datum.nx+datum.nx2)/2",
        "as": "xc"
      },
      {
        "calculate": "(datum.ny+datum.ny2)/2",
        "as": "yc"
      }
    ],
    "vconcat": [
      {
        "mark": {
          "type": "text",
          "baseline": "middle",
          "align": "center"
        },
        "encoding": {
          "x": {
            "aggregate": "min",
            "field": "xc",
            "title": "Origin",
            "axis": {
              "orient": "top"
            }
          },
          "color": {
            "field": "Origin",
            "legend": null
          },
          "text": {"field": "Origin"}
        }
      },
      {
        "layer": [
          {
            "mark": {
              "type": "rect"
            },
            "encoding": {
              "x": {
                "field": "nx",
                "type": "quantitative",
                "axis": null
              },
              "x2": {"field": "nx2"},
              "y": {
                "field": "ny",
                "type": "quantitative"
              },
              "y2": {"field": "ny2"},
              "color": {
                "field": "Origin",
                "type": "nominal",
                "legend": null
              },
              "opacity": {
                "field": "Cylinders",
                "type": "quantitative",
                "legend": null
              },
              "tooltip": [
                {
                  "field": "Origin",
                  "type": "nominal"
                },
                {
                  "field": "Cylinders",
                  "type": "quantitative"
                }
              ]
            }
          },
          {
            "mark": {
              "type": "text",
              "baseline": "middle"
            },
            "encoding": {
              "x": {
                "field": "xc",
                "type": "quantitative",
                "axis": null
              },
              "y": {
                "field": "yc",
                "type": "quantitative",
                "axis": {
                  "title": "Cylinders"
                }
              },
              "text": {
                "field": "Cylinders",
                "type": "nominal"
              }
            }
          }
        ]
      }
    ],
    "resolve": {
      "scale": {
        "x": "shared"
      }
    },
    "config": {
      "view": {
        "stroke": ""
      },
      "concat": {"spacing": 10},
      "axis": {
        "domain": false,
        "ticks": false,
        "labels": false,
        "grid": false
      }
    }
  }`);

  console.log(spec);

  // 新たにカラースキームを自作したいが、反映されない
  // vega.scheme('basic', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']);

  //カラースキームのセットをパラメータ化して、選択できるようにしたいがvar(--color-scheme)が認識されない・・・
  // spec.encoding.color.scale = {"scheme": "var(--color-scheme)"}
  // spec.encoding.color.scale = {"scheme": "pastel1"}

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  embed(el, spec, opts);
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': devVegaliteMosaicChartWithLabels
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dev-vegalite-mosaic-chart-with-labels",
	"stanza:label": "dev Vegalite mosaic chart with labels",
	"stanza:definition": "vegalite_wrapping_mosaic_chart_with_labels",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-09",
	"stanza:updated": "2020-11-09",
	"stanza:parameter": [
	{
		"stanza:key": "say-to",
		"stanza:example": "world",
		"stanza:description": "who to say hello to",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--greeting-color",
		"stanza:type": "color",
		"stanza:default": "#eb7900",
		"stanza:description": "text color of greeting"
	},
	{
		"stanza:key": "--greeting-align",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "text align of greeting"
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
//# sourceMappingURL=dev-vegalite-mosaic-chart-with-labels.js.map
