import { d as defineStanzaElement } from './stanza-element-c2a08f7a.js';
import { l as loadData } from './load-data-eeb61760.js';
import './index-89a342ec.js';

async function hashTable(stanza, params) {
  let dataset = await loadData(params["data-url"], params["data-type"]);
  dataset = dataset[0];
  const columns = params.columns
    ? JSON.parse(params.columns)
    : Object.keys(dataset).map((key) => {
        return { id: key }
      });
  const values = columns.map((column) => {
    const datam_label = Object.keys(dataset).find(datam => {
      return datam === column.id
    });
    const label = column.label
      ? column.label
      : params["format-key"] === "true"
      ? datam_label.charAt(0).toUpperCase() +
        datam_label.substring(1).replace(/_/g, " ")
      : datam_label;

    return {
      label,
      value: dataset[column.id],
    };
  });
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      values,
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
	"stanza:label": "Hash table",
	"stanza:definition": "Hash table MetaStanza",
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
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_table_hash_formatted?dataset=DS810_1",
		"stanza:description": "Source url of data",
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
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 800,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Padding"
	},
	{
		"stanza:key": "columns",
		"stanza:example": "[{\"id\": \"title\"}, {\"id\": \"dataset_id\", \"label\": \"Dataset ID\"},{\"id\": \"description\"}, {\"id\": \"species\"}, {\"id\": \"number_of_protein\", \"label\": \"#protein\"}]",
		"stanza:description": "Columns' options"
	},
	{
		"stanza:key": "format-key",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Capitalize the acronym and convert underscore to blank"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--column-count",
		"stanza:type": "text",
		"stanza:default": "1",
		"stanza:description": "Column's count"
	},
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
		"stanza:description": "Table border"
	},
	{
		"stanza:key": "--table-shadow",
		"stanza:type": "text",
		"stanza:default": "1px 1px 3px 1px #eee",
		"stanza:description": "Table shadow"
	},
	{
		"stanza:key": "--table-background-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Background color of table"
	},
	{
		"stanza:key": "--tbody-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #eee",
		"stanza:description": "Border bottom of table body"
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
		"stanza:default": "#256D80",
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
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"label") : stack1), depth0))
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
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"values") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":2},"end":{"line":11,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=hash-table.js.map
