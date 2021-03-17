import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { l as loadData } from './load-data-cc489077.js';
import './index-b010e6ef.js';
import './timer-be811b16.js';
import './dsv-cd3740c6.js';

async function text(stanza, params) {
  const dataset = await loadData(params["data-url"], params["data-type"]);
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      rows: [
        {
          value: dataset.value,
        },
      ],
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

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"rows") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":1,"column":0},"end":{"line":11,"column":9}}})) != null ? stack1 : "");
},"useData":true,"useBlockParams":true}]
];

var css = "summary {\n  display: none;\n}\n\nsvg#dl_button {\n  position: absolute;\n}\nsvg#dl_button.dl-top-left {\n  top: 20px;\n  left: 40px;\n}\nsvg#dl_button.dl-top-right {\n  top: 20px;\n  right: 40px;\n}\nsvg#dl_button.dl-bottom-left {\n  bottom: 20px;\n  left: 40px;\n}\nsvg#dl_button.dl-bottom-right {\n  bottom: 20px;\n  right: 40px;\n}\nsvg#dl_button.dl-none {\n  display: none;\n}\nsvg#dl_button .circle_g {\n  cursor: pointer;\n  opacity: 0.5;\n}\nsvg#dl_button .hover {\n  opacity: 1;\n}\n\ndiv#dl_list {\n  width: fit-content;\n  position: absolute;\n  top: 35px;\n  right: 6px;\n  border: solid 1px var(--label-color);\n  background-color: #ffffff;\n  font-size: 12px;\n  font-family: var(--font-family);\n}\ndiv#dl_list ul {\n  list-style-type: none;\n  margin: 0px;\n  padding: 0px;\n}\ndiv#dl_list ul li {\n  cursor: pointer;\n  padding: 0px 10px 0px 10px;\n}\ndiv#dl_list ul li.hover {\n  background-color: #dddddd;\n}\n\nmain {\n  padding: 1rem 2rem;\n}\n\n* {\n  font-family: var(--font-family);\n  box-sizing: border-box;\n}\n\ntable {\n  display: block;\n  width: var(--text-width);\n  height: var(--text-height);\n  margin: var(--text-padding);\n  border: var(--table-border);\n}\ntable tbody tr td {\n  word-break: break-all;\n  color: var(--text-font-color);\n  font-size: var(--text-font-size);\n  font-weight: var(--text-font-weight);\n}";

defineStanzaElement(text, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=text.js.map
