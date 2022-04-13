import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import './index-847f2a80.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';

class HashTable extends Stanza {
  menu() {
    return [
      downloadJSONMenuItem(this, "hashtable", this._data),
      downloadCSVMenuItem(this, "hashtable", this._data),
      downloadTSVMenuItem(this, "hashtable", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const dataset = (
      await loadData(
        this.params["data-url"],
        this.params["data-type"],
        this.root.querySelector("main")
      )
    )[0];
    this._data = [dataset];

    const columns = this.params.columns
      ? JSON.parse(this.params.columns)
      : Object.keys(dataset).map((key) => {
          return { id: key };
        });
    const values = columns.map((column) => {
      const datum_label = Object.keys(dataset).find((datum) => {
        return datum === column.id;
      });
      const label = column.label
        ? column.label
        : this.params["format-key"] === "true"
        ? datum_label.charAt(0).toUpperCase() +
          datum_label.substring(1).replace(/_/g, " ")
        : datum_label;
      const href = column.link ? dataset[column.link] : null;
      return {
        label,
        value: dataset[column.id],
        href,
        unescape: column.escape === false,
      };
    });
    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        values,
      },
    });

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    main.parentNode.style.padding = `${this.params["padding"]}px`;
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': HashTable
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "hash-table",
	"stanza:label": "Hash table",
	"stanza:definition": "Hash table MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
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
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Padding"
	},
	{
		"stanza:key": "columns",
		"stanza:example": "[{\"id\": \"title\"}, {\"id\": \"dataset_uri\", \"label\": \"Dataset ID\", \"link\": \"dataset_uri\"},{\"id\": \"description\"}, {\"id\": \"species\", \"escape\": false}, {\"id\": \"number_of_protein\", \"label\": \"#protein\"}]",
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
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--column-count",
		"stanza:type": "text",
		"stanza:default": "1",
		"stanza:description": "Column's count"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-table-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #EEEEEE",
		"stanza:description": "Table border"
	},
	{
		"stanza:key": "--togostanza-table-shadow",
		"stanza:type": "text",
		"stanza:default": "1px 1px 3px 1px #EEEEEE",
		"stanza:description": "Table shadow"
	},
	{
		"stanza:key": "--table-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color of table"
	},
	{
		"stanza:key": "--togostanza-tbody-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #EEEEEE",
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
		"stanza:key": "--togostanza-key-font-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Font color of key"
	},
	{
		"stanza:key": "--togostanza-key-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size of key"
	},
	{
		"stanza:key": "--togostanza-key-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight of key"
	},
	{
		"stanza:key": "--togostanza-value-font-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Font color of value"
	},
	{
		"stanza:key": "--togostanza-value-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size of value"
	},
	{
		"stanza:key": "--togostanza-value-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight of value"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <dl>\n      <dt>\n        "
    + container.escapeExpression(container.lambda(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"label") : stack1), depth0))
    + "\n      </dt>\n      <dd>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"href") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams),"inverse":container.program(4, data, 0, blockParams),"data":data,"blockParams":blockParams,"loc":{"start":{"line":8,"column":8},"end":{"line":16,"column":15}}})) != null ? stack1 : "")
    + "      </dd>\n    </dl>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <a href=\""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"href") : stack1), depth0))
    + "\" target=\"_blank\">\n            "
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n          </a>\n";
},"4":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"unescape") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams),"inverse":container.program(7, data, 0, blockParams),"data":data,"blockParams":blockParams,"loc":{"start":{"line":12,"column":8},"end":{"line":16,"column":8}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          "
    + ((stack1 = container.lambda(((stack1 = blockParams[2][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0)) != null ? stack1 : "")
    + "\n";
},"7":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          "
    + container.escapeExpression(container.lambda(((stack1 = blockParams[2][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n        ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"container\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"values") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":2},"end":{"line":19,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=hash-table.js.map
