import { S as Stanza, b as appendCustomCss, c as defineStanzaElement } from './metastanza_utils-ce242dd6.js';
import { l as loadData } from './load-data-5eebbe71.js';

class Text extends Stanza {
  menu() {
    return [
      {
        type: "item",
        label: "Download Text",
        handler: () => {
          const textBlob = new Blob([this._dataset.value], {
            type: "text/plain",
          });
          const textUrl = URL.createObjectURL(textBlob);
          const link = document.createElement("a");
          document.body.appendChild(link);
          link.href = textUrl;
          link.download = "text.txt";
          link.click();
          document.body.removeChild(link);
        },
      },
    ];
  }

  async render() {
    this._dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        rows: [
          {
            value: this._dataset.value,
          },
        ],
      },
    });

    appendCustomCss(this, this.params["custom-css-url"]);

    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];
    const container = this.root.querySelector(".container");
    const main = this.root.querySelector("main");
    main.setAttribute("style", `padding: ${padding}px;`);
    container.setAttribute(`style`, `width: ${width}px; height: ${height}px;`);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Text
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "text",
	"stanza:label": "Text",
	"stanza:definition": "Text MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Text",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-12-02",
	"stanza:updated": "2020-12-02",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_text?tax_id=9606&gene_id=BRCA1",
		"stanza:description": "Data source URL",
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
		"stanza:key": "width",
		"stanza:type": "text",
		"stanza:example": 800,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "text",
		"stanza:example": "auto",
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "text",
		"stanza:example": "0",
		"stanza:description": "Padding"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-text-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color"
	},
	{
		"stanza:key": "--togostanza-text-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size"
	},
	{
		"stanza:key": "--togostanza-text-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight"
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

  return "    <table>\n      <tbody>\n        <tr>\n          <td>\n            "
    + container.escapeExpression(container.lambda(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n          </td>\n        </tr>\n      </tbody>\n    </table>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<link\n  rel=\"stylesheet\"\n  href=\"https://use.fontawesome.com/releases/v5.1.0/css/all.css\"\n  integrity=\"sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt\"\n  crossorigin=\"anonymous\"\n/>\n\n<div class=\"container\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":9,"column":2},"end":{"line":19,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=text.js.map
