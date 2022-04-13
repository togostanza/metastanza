import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import './index-847f2a80.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';

class Scorecard extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
      downloadJSONMenuItem(this, "scorecard", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    const [key, value] = Object.entries(dataset)[0];
    this._data = { [key]: value };

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        scorecards: [
          {
            key,
            value,
          },
        ],
        width,
        height,
        padding,
      },
    });

    const chartWrapper = this.root.querySelector(".chart-wrapper");
    chartWrapper.setAttribute(
      `style`,
      `width: ${width}px; height: ${height}px; padding: ${padding}px`
    );

    const scorecardSvg = this.root.querySelector("#scorecardSvg");
    scorecardSvg.setAttribute(
      "height",
      `${
        Number(css("--togostanza-key-font-size")) +
        Number(css("--togostanza-value-font-size"))
      }`
    );

    const keyElement = this.root.querySelector("#key");
    const valueElement = this.root.querySelector("#value");
    if (this.params["legend"] === "false") {
      keyElement.setAttribute(`style`, `display: none;`);
    }

    keyElement.setAttribute("y", Number(css("--togostanza-key-font-size")));
    keyElement.setAttribute("fill", "var(--togostanza-key-font-color)");
    valueElement.setAttribute(
      "y",
      Number(css("--togostanza-key-font-size")) +
        Number(css("--togostanza-value-font-size"))
    );
    valueElement.setAttribute("fill", "var(--togostanza-value-font-color)");
    keyElement.setAttribute("font-size", css("--togostanza-key-font-size"));
    valueElement.setAttribute("font-size", css("--togostanza-value-font-size"));
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Scorecard
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scorecard",
	"stanza:label": "Scorecard",
	"stanza:definition": "Scorecard MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2020-12-02",
	"stanza:updated": "2020-12-02",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_scorecard?tax_id=9606&gene_id=BRCA1",
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
		"stanza:type": "number",
		"stanza:example": 200,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 70,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 50,
		"stanza:description": "Padding"
	},
	{
		"stanza:key": "legend",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show key name"
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
		"stanza:key": "--togostanza-key-font-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Font color for key"
	},
	{
		"stanza:key": "--togostanza-key-font-size",
		"stanza:type": "number",
		"stanza:default": 16,
		"stanza:description": "Font size for key"
	},
	{
		"stanza:key": "--togostanza-key-font-weight",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Font weight for key"
	},
	{
		"stanza:key": "--togostanza-value-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color for value"
	},
	{
		"stanza:key": "--togostanza-value-font-size",
		"stanza:type": "number",
		"stanza:default": 36,
		"stanza:description": "Font size for value"
	},
	{
		"stanza:key": "--togostanza-value-font-weight",
		"stanza:type": "number",
		"stanza:default": 600,
		"stanza:description": "Font weight for value"
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
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <svg id=\"scorecardSvg\" class=\"scorecard-svg\">\n      <text id=\"text\" x=\"50%\" y=\"50%\" text-anchor=\"middle\">\n        <tspan id=\"key\" x=\"50%\" y=\"16px\" font-size=\"16px\">\n          "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"key") : stack1), depth0))
    + "\n        </tspan>\n        <tspan id=\"value\" x=\"50%\" y=\"48px\" font-size=\"32px\">\n          "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n        </tspan>\n      </text>\n    </svg>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"chart-wrapper\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"scorecards") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":2},"end":{"line":13,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=scorecard.js.map
