import { S as Stanza, d as defineStanzaElement } from './index-28113ace.js';
import { l as loadData } from './load-data-8f706a23.js';

class Text extends Stanza {
  async render() {
    this.importWebFontCSS(
      "https://use.fontawesome.com/releases/v5.6.3/css/all.css"
    );
    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    const textBlob = new Blob([dataset.value], {
      type: "text/plain",
    });

    const textUrl = URL.createObjectURL(textBlob);
    console.log(textUrl);

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        rows: [
          {
            value: dataset.value,
          },
        ],
        textUrl: URL.createObjectURL(textBlob),
      },
    });
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];
    const container = this.root.querySelector(".container");
    const main = this.root.querySelector("main");
    main.setAttribute("style", `padding: ${padding}px;`);
    container.setAttribute(`style`, `width: ${width}px; height: ${height}px;`);

    const menu = this.root.querySelector(".menu");
    switch (this.params["metastanza-menu-placement"]) {
      case "top-left":
        break;
      case "top-right":
        menu.setAttribute("style", "justify-content: flex-end;");
        break;
      case "bottom-left":
        container.setAttribute("style", "flex-direction: column-reverse;");
        break;
      case "bottom-right":
        menu.setAttribute("style", "justify-content: flex-end;");
        container.setAttribute(
          "style",
          "justify-content flex-end; flex-direction: column-reverse;"
        );
        break;
      case "none":
        menu.setAttribute("style", "display: none;");
        break;
    }
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
	},
	{
		"stanza:key": "metastanza-menu-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right",
			"none"
		],
		"stanza:example": "top-right",
		"stanza:description": "Placement of the menu button"
	}
],
	"stanza:about-link-placement": "bottom-right",
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
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<link\n  rel=\"stylesheet\"\n  href=\"https://use.fontawesome.com/releases/v5.1.0/css/all.css\"\n  integrity=\"sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt\"\n  crossorigin=\"anonymous\"\n/>\n\n<div class=\"container\">\n  <div class=\"menu\">\n    <a id=\"metastanzaMenuBtn\" href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"textUrl") || (depth0 != null ? lookupProperty(depth0,"textUrl") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"textUrl","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":10,"column":36},"end":{"line":10,"column":47}}}) : helper)))
    + "\" download=\"text\">\n      <i class=\"fas fa-ellipsis-h\"></i>\n    </a>\n  </div>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":14,"column":2},"end":{"line":24,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=text.js.map
