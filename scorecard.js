import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { g as getFormatedJson } from './metastanza_utils-f0c71da7.js';
import './compile-b0eab824.js';
import './timer-be811b16.js';
import './vega-event-selector.module-5ae5c063.js';

async function scorecard(stanza, params) {
  const dataset = await getFormatedJson(
    params.api,
  );
  console.log(dataset);
  console.log(Object.values(dataset)[0]);
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      scorecards: [
        {
          key: Object.keys(dataset)[0],
          value: Object.values(dataset)[0],
        }
      ]
    }
  });
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scorecard",
	"stanza:label": "scorecard",
	"stanza:definition": "scorecard for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Image",
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
		"stanza:key": "api",
		"stanza:example": "http://togogenome.org/sparqlist/api/togogenome_gene_length_nano?tax_id=9606&gene_id=BRCA1",
		"stanza:description": "Source url of your data.",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--scorecard-width",
		"stanza:type": "text",
		"stanza:default": "200px",
		"stanza:description": "Width of your stanza"
	},
	{
		"stanza:key": "--scorecard-height",
		"stanza:type": "text",
		"stanza:default": "auto",
		"stanza:description": "Height of your stanza"
	},
	{
		"stanza:key": "--scorecard-padding",
		"stanza:type": "text",
		"stanza:default": "auto",
		"stanza:description": "padding of your stanza"
	},
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Key color"
	},
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family."
	},
	{
		"stanza:key": "--key-font-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Font color of key."
	},
	{
		"stanza:key": "--value-font-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Font color of value."
	},
	{
		"stanza:key": "--key-font-size",
		"stanza:type": "text",
		"stanza:default": "16px",
		"stanza:description": "Font size of key."
	},
	{
		"stanza:key": "--value-font-size",
		"stanza:type": "text",
		"stanza:default": "36px",
		"stanza:description": "Font size of value."
	},
	{
		"stanza:key": "--key-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight of key."
	},
	{
		"stanza:key": "--value-font-weight",
		"stanza:type": "text",
		"stanza:default": "600",
		"stanza:description": "Font weight of value."
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

  return "  <svg width=\"var(--scorecard-width)\" height=\"var(--scorecard-height)\">\n    <text\n      x=\"30\"\n      y=\"30\"\n      font-family= \"var(--font-family)\"\n      fill=\"var(--key-font-color)\"\n      font-size= \"var(--key-font-size)\"\n      font-weight= \"var(--key-font-weight)\"\n    >"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"key") : stack1), depth0))
    + "\n    </text>\n    <text\n      x=\"30\"\n      y=\"70\"\n      font-family= \"var(--font-family)\"\n      fill= \"var(--value-font-color)\"\n      font-size= \"var(--value-font-size)\"\n      font-weight= \"var(--value-font-weight)\"\n      >"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "</text>\n  </svg>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<table>\n  <tbody>\n    <tr>\n      <td>\n        "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"scorecard") || (depth0 != null ? lookupProperty(depth0,"scorecard") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"scorecard","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":21}}}) : helper)))
    + "\n      </td>\n    </tr>\n  </tbody>\n</table>\n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"scorecards") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":11,"column":0},"end":{"line":31,"column":9}}})) != null ? stack1 : "");
},"useData":true,"useBlockParams":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}";

defineStanzaElement(scorecard, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=scorecard.js.map
