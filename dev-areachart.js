import { d as defineStanzaElement } from './stanza-element-c2a08f7a.js';
import { e as embed } from './vega-embed.module-414e3eaf.js';
import './vega.module-f322150d.js';
import './dsv-cd3740c6.js';
import './timer-be811b16.js';

async function devAreachart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  // カラースキームを定義しようとしたけれどできない
  // vega.scheme('basic', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']);
  // spec.scales[2].range = {"scheme": "var(--color-scheme)"}
  spec.scales[2].range = [
    "var(--series-0-color)",
    "var(--series-1-color)",
    "var(--series-2-color)",
    "var(--series-3-color)",
    "var(--series-4-color)",
    "var(--series-5-color)",
  ];
  // spec.marks[0].marks[0].encode.enter.strokeWidth.value = "var(--stroke-width)"

  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      title: params.title,
    },
  });

  // const conf = {
  //   range: {
  //     category: ["var(--series-0-color)", "var(--series-1-color)", "var(--series-2-color)", "var(--series-3-color)", "var(--series-4-color)", "var(--series-5-color)"]
  //   }
  // };

  // const view = new Vega.View(Vega.parse(spec, conf), {
  //   renderer: "svg",
  //   container: stanza.root.querySelector("#chart"),
  //   hover: true,
  // });

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await embed(el, spec, opts);
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': devAreachart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dev-areachart",
	"stanza:label": "dev areachart",
	"stanza:definition": "Vega wrapped areachart for MetaStanza",
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
		"stanza:key": "src-url",
		"stanza:example": "https://vega.github.io/vega/examples/stacked-area-chart.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
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
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#a8a8e0",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-1-color",
		"stanza:type": "color",
		"stanza:default": "#a8e0e0",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-2-color",
		"stanza:type": "color",
		"stanza:default": "#a8e0a8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-3-color",
		"stanza:type": "color",
		"stanza:default": "#e0e0a8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-4-color",
		"stanza:type": "color",
		"stanza:default": "#e0a8d3",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-5-color",
		"stanza:type": "color",
		"stanza:default": "#d3a8e0",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--color-scheme",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"accent",
			"category10",
			"category20",
			"category20b",
			"category20c",
			"dark2",
			"paired",
			"pastel1",
			"pastel2"
		],
		"stanza:default": "paired",
		"stanza:description": "colorscheme"
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
//# sourceMappingURL=dev-areachart.js.map
