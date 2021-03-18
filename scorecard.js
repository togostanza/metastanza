import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { l as loadData } from './load-data-cc489077.js';
import { a as appendDlButton } from './metastanza_utils-b4d4e68b.js';
import './index-b010e6ef.js';
import './timer-be811b16.js';
import './dsv-cd3740c6.js';

async function scorecard(stanza, params) {
  const dataset = await loadData(params["data-url"], params["data-type"]);
  const width = params["width"];
  const height = params["height"];
  const padding = params["padding"];

  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      scorecards: [
        {
          key: Object.keys(dataset)[0],
          value: Object.values(dataset)[0],
        },
      ],
      width,
      height,
      padding,
    },
  });

  const main = stanza.root.querySelector("main");
  main.setAttribute(
    `style`,
    `width: ${width}px; height: ${height}px; padding: ${padding}px;`
  );

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector(".scorecard-svg"),
    "scorecard",
    stanza
  );

  const menuButton = stanza.root.querySelector("#dl_button");
  const menuList = stanza.root.querySelector("#dl_list");
  switch (params["menu-button-placement"]) {
    case "top-left":
      menuButton.setAttribute("class", "dl-top-left");
      menuList.setAttribute("class", "dl-top-left");
      break;
    case "top-right":
      menuButton.setAttribute("class", "dl-top-right");
      menuList.setAttribute("class", "dl-top-right");
      break;
    case "bottom-left":
      menuButton.setAttribute("class", "dl-bottom-left");
      menuList.setAttribute("class", "dl-bottom-left");
      break;
    case "bottom-right":
      menuButton.setAttribute("class", "dl-bottom-right");
      menuList.setAttribute("class", "dl-bottom-right");
      break;
    case "none":
      menuButton.setAttribute("class", "dl-none");
      menuList.setAttribute("class", "dl-none");
      break;
  }
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
		"stanza:key": "data-url",
		"stanza:example": "http://togogenome.org/sparqlist/api/togogenome_gene_length_nano?tax_id=9606&gene_id=BRCA1",
		"stanza:description": "Source url of your data.",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:example": "json",
		"stanza:description": "Type of your data.",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:example": "230",
		"stanza:description": "Width of your stanza"
	},
	{
		"stanza:key": "height",
		"stanza:example": "200",
		"stanza:description": "Height of your stanza"
	},
	{
		"stanza:key": "padding",
		"stanza:example": "0",
		"stanza:description": "padding of your stanza"
	},
	{
		"stanza:key": "menu-button-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right",
			"none"
		],
		"stanza:example": "top-right",
		"stanza:description": "Placement of the download button.(top-left,top-right,bottom-right,bottom-left,none)"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
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
		"stanza:description": "Font color for key."
	},
	{
		"stanza:key": "--value-font-color",
		"stanza:type": "color",
		"stanza:default": "#4e5059",
		"stanza:description": "Font color for value."
	},
	{
		"stanza:key": "--key-font-size",
		"stanza:type": "text",
		"stanza:default": "16px",
		"stanza:description": "Font size for key."
	},
	{
		"stanza:key": "--value-font-size",
		"stanza:type": "text",
		"stanza:default": "36px",
		"stanza:description": "Font size for value."
	},
	{
		"stanza:key": "--key-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight for key."
	},
	{
		"stanza:key": "--value-font-weight",
		"stanza:type": "text",
		"stanza:default": "600",
		"stanza:description": "Font weight for value."
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

  return "    <svg class=\"scorecard-svg\">\n      <text\n        x=\"50%\"\n        y=\"40\"\n        text-anchor=\"middle\"\n        font-family=\"var(--font-family)\"\n        fill=\"var(--key-font-color)\"\n        font-size=\"var(--key-font-size)\"\n        font-weight=\"var(--key-font-weight)\"\n      >\n        "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"key") : stack1), depth0))
    + "\n      </text>\n      <text\n        x=\"50%\"\n        y=\"80\"\n        text-anchor=\"middle\"\n        font-family=\"var(--font-family)\"\n        fill=\"var(--value-font-color)\"\n        font-size=\"var(--value-font-size)\"\n        font-weight=\"var(--value-font-weight)\"\n      >\n        "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"value") : stack1), depth0))
    + "\n      </text>\n    </svg>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"chart-wrapper\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"scorecards") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":2},"end":{"line":27,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useBlockParams":true}]
];

var css = ".chart-wrapper {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n\nsvg#dl_button {\n  position: absolute;\n}\nsvg#dl_button.dl-top-left {\n  top: 0px;\n  left: 0px;\n}\nsvg#dl_button.dl-top-right {\n  top: 0px;\n  right: 0px;\n}\nsvg#dl_button.dl-bottom-left {\n  bottom: 0px;\n  left: 0px;\n}\nsvg#dl_button.dl-bottom-right {\n  bottom: 0px;\n  right: 0px;\n}\nsvg#dl_button.dl-none {\n  display: none;\n}\nsvg#dl_button .circle_g {\n  cursor: pointer;\n  opacity: 0.5;\n}\nsvg#dl_button .hover {\n  opacity: 1;\n}\n\ndiv#dl_list {\n  width: fit-content;\n  position: absolute;\n  border: solid 1px #444444;\n  background-color: #ffffff;\n  font-size: 12px;\n  font-family: var(--font-family);\n}\ndiv#dl_list.dl-top-left {\n  top: 20px;\n  left: 10px;\n}\ndiv#dl_list.dl-top-right {\n  top: 20px;\n  right: 10px;\n}\ndiv#dl_list.dl-bottom-left {\n  bottom: 20px;\n  left: 10px;\n}\ndiv#dl_list.dl-bottom-right {\n  bottom: 20px;\n  right: 10px;\n}\ndiv#dl_list.dl-none {\n  display: none;\n}\ndiv#dl_list ul {\n  list-style-type: none;\n  margin: 0px;\n  padding: 0px;\n}\ndiv#dl_list ul li {\n  cursor: pointer;\n  padding: 0px 10px 0px 10px;\n}\ndiv#dl_list ul li.hover {\n  background-color: #dddddd;\n}";

defineStanzaElement(scorecard, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=scorecard.js.map
