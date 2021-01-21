import { d as defineStanzaElement } from './stanza-element-5bd032c5.js';
import { e as embed } from './vega-embed.module-00181fa0.js';
import './vega.module-01b84c84.js';
import './timer-be811b16.js';

async function linechart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  spec.data[0].values = [
    { x: 0, y: 28, c: 0 },
    { x: 0, y: 20, c: 1 },
    { x: 0, y: 20, c: 3 },
    { x: 1, y: 43, c: 0 },
    { x: 1, y: 35, c: 1 },
    { x: 1, y: 20, c: 3 },
    { x: 2, y: 81, c: 0 },
    { x: 2, y: 10, c: 1 },
    { x: 2, y: 20, c: 3 },
    { x: 3, y: 19, c: 0 },
    { x: 3, y: 15, c: 1 },
    { x: 3, y: 20, c: 3 },
    { x: 4, y: 52, c: 0 },
    { x: 4, y: 48, c: 1 },
    { x: 4, y: 20, c: 3 },
    { x: 5, y: 24, c: 0 },
    { x: 5, y: 28, c: 1 },
    { x: 5, y: 20, c: 3 },
    { x: 6, y: 87, c: 0 },
    { x: 6, y: 66, c: 1 },
    { x: 6, y: 20, c: 3 },
    { x: 7, y: 17, c: 0 },
    { x: 7, y: 27, c: 1 },
    { x: 7, y: 20, c: 3 },
    { x: 8, y: 68, c: 0 },
    { x: 8, y: 16, c: 1 },
    { x: 8, y: 20, c: 3 },
    { x: 9, y: 49, c: 0 },
    { x: 9, y: 25, c: 1 },
    { x: 9, y: 20, c: 3 },
  ];

  // カラースキームを定義しようとしたけれどできない
  // vega.scheme('basic', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']);
  // spec.scales[2].range = {"scheme": "pastel1"}
  spec.scales[2].range = { scheme: params["color-scheme"] };
  spec.marks[0].marks[0].encode.enter.strokeWidth.value = "var(--stroke-width)";

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await embed(el, spec, opts);
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "linechart",
	"stanza:label": "linechart",
	"stanza:definition": "Vega wrapped linechart for MetaStanza",
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
		"stanza:example": "https://vega.github.io/vega/examples/line-chart.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "title",
		"stanza:example": "Example",
		"stanza:description": "title",
		"stanza:required": true
	},
	{
		"stanza:key": "color-scheme",
		"stanza:example": "pastel2",
		"stanza:description": "pastel2",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"pastel1",
			"pastel2",
			"set1"
		]
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--stroke-width",
		"stanza:type": "number",
		"stanza:default": "2",
		"stanza:description": "Width of stroke"
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

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}\n\nsummary {\n  display: none;\n}";

defineStanzaElement(linechart, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=linechart.js.map
