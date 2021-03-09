import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { V as View, p as parse$1 } from './vega.module-9c8b3b23.js';
import './dsv-cd3740c6.js';
import './timer-be811b16.js';

async function devVegaWrap(stanza, params) {
  const spec = await fetch(params["vega-json"]).then((res) => res.json());

  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      title: params.title,
    },
  });

  const conf = {
    range: {
      category: [
        "var(--series-0-color)",
        "var(--series-1-color)",
        "var(--series-2-color)",
        "var(--series-3-color)",
        "var(--series-4-color)",
        "var(--series-5-color)",
      ],
    },
  };

  const view = new View(parse$1(spec, conf), {
    renderer: "svg",
    container: stanza.root.querySelector("#chart"),
    hover: true,
  });

  await view.runAsync();
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dev-vega-wrap",
	"stanza:label": "dev Vega wrap",
	"stanza:definition": "",
	"stanza:type": "Stanza",
	"stanza:context": "Environment",
	"stanza:display": "Text",
	"stanza:provider": "",
	"stanza:license": "MIT",
	"stanza:author": "moriya-dbcls",
	"stanza:address": "",
	"stanza:contributor": [
],
	"stanza:created": "2020-10-27",
	"stanza:updated": "2020-10-27",
	"stanza:parameter": [
	{
		"stanza:key": "vega-json",
		"stanza:example": "https://vega.github.io/vega/examples/stacked-bar-chart.vg.json",
		"stanza:description": "json api",
		"stanza:required": true
	},
	{
		"stanza:key": "title",
		"stanza:example": "Example",
		"stanza:description": "title",
		"stanza:required": true
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

  return "<h1>\n  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":11}}}) : helper)))
    + "\n</h1>\n<div id=\"chart\"></div>";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}";

defineStanzaElement(devVegaWrap, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=dev-vega-wrap.js.map
