import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { l as loadData } from './load-data-d3554855.js';
import './index-b010e6ef.js';
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
}

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
		"stanza:description": "Source url of your data.",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:example": "json",
		"stanza:description": "Type of your data.",
		"stanza:required": true
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--text-font-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Font color of text body."
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

  return "    <dt>\n      "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"key") : stack1), depth0))
    + "\n    </dt>\n    <dd>\n      "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n    </dd>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<dl>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"dataset") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":2},"end":{"line":9,"column":11}}})) != null ? stack1 : "")
    + "</dl>";
},"useData":true,"useBlockParams":true}]
];

var css = "main {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}";

defineStanzaElement(hashTable, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=hash-table.js.map
