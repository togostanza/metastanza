import { d as defineStanzaElement } from './stanza-element-d51bbc69.js';
import { l as loadData } from './load-data-61d0d020.js';
import './index-b2de29ee.js';
import './timer-be811b16.js';
import './dsv-cd3740c6.js';

async function hashTable(stanza, params) {
  const dataset = await loadData(params["data-url"], params["data-type"]);
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      dataset: Object.entries(dataset[0]).map((datam) => {
        return {
          key: datam[0],
          value: datam[1],
        };
      }),
    },
  });

  const main = stanza.root.querySelector("main");
  main.setAttribute(
    "style",
    `width: ${params["width"]};
    height: ${params["height"]};
    padding: ${params["padding"]}`
  );
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': hashTable
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "hash-table",
	"stanza:label": "hash table",
	"stanza:definition": "hash table for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Table",
	"stanza:provider": "",
	"stanza:license": "MIT",
	"stanza:author": "reika0717",
	"stanza:address": "hirahara@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-03-18",
	"stanza:updated": "2021-03-18",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "http://sparql-support.dbcls.jp/sparqlist/api/metastanza_table_hash_formatted?dataset=DS810_1",
		"stanza:description": "Source url of data.",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 840,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 410,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 50,
		"stanza:description": "Padding"
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
		"stanza:description": "Type of data",
		"stanza:required": true
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--table-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #eee",
		"stanza:description": "Style of table border"
	},
	{
		"stanza:key": "--table-shadow",
		"stanza:type": "text",
		"stanza:default": "1px 1px 3px 1px #eee",
		"stanza:description": "Style of table shadow"
	},
	{
		"stanza:key": "--ruled-line",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #eee",
		"stanza:description": "Style of ruled line"
	},
	{
		"stanza:key": "--row-padding",
		"stanza:type": "text",
		"stanza:default": "5px",
		"stanza:description": "Padding of row"
	},
	{
		"stanza:key": "--key-width-percentage",
		"stanza:type": "text",
		"stanza:default": "30%",
		"stanza:description": "Percentage of key width"
	},
	{
		"stanza:key": "--key-font-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "Font color of key"
	},
	{
		"stanza:key": "--key-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size of key"
	},
	{
		"stanza:key": "--key-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight of key"
	},
	{
		"stanza:key": "--value-font-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Font color of value"
	},
	{
		"stanza:key": "--value-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size of value"
	},
	{
		"stanza:key": "--value-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight of value"
	},
	{
		"stanza:key": "--odd-background-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "Background color of odd row"
	},
	{
		"stanza:key": "--even-background-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "Background color of even row"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <dl>\n      <dt>\n        "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"key") : stack1), depth0))
    + "\n      </dt>\n      <dd>\n        "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n      </dd>\n    </dl>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"container\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"dataset") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":2},"end":{"line":11,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

defineStanzaElement({stanzaModule, metadata, templates, url: import.meta.url});
//# sourceMappingURL=hash-table.js.map
