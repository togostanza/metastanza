import { d as defineStanzaElement } from './stanza-element-c2a08f7a.js';
import { e as embed } from './vega-embed.module-414e3eaf.js';
import './vega.module-f322150d.js';
import './dsv-cd3740c6.js';
import './timer-be811b16.js';

function devVegaliteStackedAreaChart(stanza /* , params */) {
  //let spec = await fetch(params["src-url"]).then((res) => res.json());
  const spec = JSON.parse(`{
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": 300, "height": 200,
    "data": {"url": "https://vega.github.io/vega-lite/data/unemployment-across-industries.json"},
    "mark": "area",
    "encoding": {
      "x": {
        "timeUnit": "yearmonth", "field": "date",
        "axis": {"format": "%Y"}
      },
      "y": {
        "aggregate": "sum", "field": "count"
      },
      "color": {
        "field": "series",
        "scale": {"scheme": "category20b"}
      }
    }
  }`);

  console.log(spec);

  // 新たにカラースキームを自作したいが、反映されない
  // vega.scheme('basic', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']);

  //カラースキームのセットをパラメータ化して、選択できるようにしたいがvar(--color-scheme)が認識されない・・・
  // spec.encoding.color.scale = {"scheme": "var(--color-scheme)"}
  spec.encoding.color.scale = { scheme: "pastel1" };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  embed(el, spec, opts);
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': devVegaliteStackedAreaChart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dev-vegalite-stacked-area-chart",
	"stanza:label": "dev Vegalite stacked area chart",
	"stanza:definition": "vegalite_wrapping_stacked_area_chart",
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
		"stanza:key": "--color-scheme",
		"stanza:type": "text",
		"stanza:default": "pastel1",
		"stanza:description": "text color of greeting"
	},
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
//# sourceMappingURL=dev-vegalite-stacked-area-chart.js.map
