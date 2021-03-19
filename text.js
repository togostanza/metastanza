import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { l as loadData } from './load-data-d3554855.js';
import './index-b010e6ef.js';
import './timer-be811b16.js';
import './dsv-cd3740c6.js';

async function text(stanza, params) {
  const dataset = await loadData(params["data-url"], params["data-type"]);

  console.log(dataset.value);
  const textBlob = new Blob([dataset.value], {
    type: "text/plain",
  });

  const textUrl = URL.createObjectURL(textBlob);
  console.log(textUrl);

  stanza.render({
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
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "text",
	"stanza:label": "text",
	"stanza:definition": "text for MetaStanza",
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
		"stanza:example": "http://togogenome.org/sparqlist/api/togogenome_nucleotide_sequence",
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
		"stanza:key": "--greeting-align",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "text align of greeting"
	},
	{
		"stanza:key": "--text-width",
		"stanza:type": "text",
		"stanza:default": "800px",
		"stanza:description": "Width of your stanza"
	},
	{
		"stanza:key": "--text-height",
		"stanza:type": "text",
		"stanza:default": "auto",
		"stanza:description": "Height of your stanza"
	},
	{
		"stanza:key": "--text-padding",
		"stanza:type": "text",
		"stanza:default": "0 auto",
		"stanza:description": "Padding of your stanza"
	},
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family."
	},
	{
		"stanza:key": "--text-font-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Font color of text body."
	},
	{
		"stanza:key": "--text-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size of text body."
	},
	{
		"stanza:key": "--text-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight of text body"
	},
	{
		"stanza:key": "--table-border",
		"stanza:type": "text",
		"stanza:default": "0px solid #eeeeee",
		"stanza:description": "Border style of text stanza"
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

  return "  <table>\n    <tbody>\n      <tr>\n        <td>\n          "
    + container.escapeExpression(container.lambda(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n        </td>\n      </tr>\n    </tbody>\n  </table>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<link\n  rel=\"stylesheet\"\n  href=\"https://use.fontawesome.com/releases/v5.1.0/css/all.css\"\n  integrity=\"sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt\"\n  crossorigin=\"anonymous\"\n/>\n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":12,"column":0},"end":{"line":22,"column":9}}})) != null ? stack1 : "");
},"useData":true,"useBlockParams":true}]
];

var css = "main {\n  padding: 1rem 2rem;\n}\n\n* {\n  font-family: var(--font-family);\n  box-sizing: border-box;\n}\n\ntable {\n  display: block;\n  width: var(--text-width);\n  height: var(--text-height);\n  margin: var(--text-padding);\n  border: var(--table-border);\n}\ntable tbody tr td {\n  word-break: break-all;\n  color: var(--text-font-color);\n  font-size: var(--text-font-size);\n  font-weight: var(--text-font-weight);\n}";

defineStanzaElement(text, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=text.js.map
