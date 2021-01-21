import { d as defineStanzaElement } from './stanza-element-5bd032c5.js';

async function tableWithScroll(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      greeting: `Hello, ${params["say-to"]}!`,
    },
  });
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "table_with_scroll",
	"stanza:label": "table with scroll",
	"stanza:definition": "table with scroll for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Table",
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
		"stanza:key": "say-to",
		"stanza:example": "world",
		"stanza:description": "who to say hello to",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--general-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "general font family"
	},
	{
		"stanza:key": "--general-font-color",
		"stanza:type": "color",
		"stanza:default": "#707070",
		"stanza:description": "general font color"
	},
	{
		"stanza:key": "--general-font-size",
		"stanza:type": "number",
		"stanza:default": "12px",
		"stanza:description": "general font size"
	},
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "basic fill color"
	},
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#44b8cc",
		"stanza:description": "emphasized color"
	},
	{
		"stanza:key": "--background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color"
	},
	{
		"stanza:key": "--ruled-line",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #eee",
		"stanza:description": "style of ruled line"
	},
	{
		"stanza:key": "--thead-border-bottom",
		"stanza:type": "text",
		"stanza:default": "1px solid #333",
		"stanza:description": "style of stack line"
	},
	{
		"stanza:key": "--thead-font-size",
		"stanza:type": "number",
		"stanza:default": "12px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--tbody-font-size",
		"stanza:type": "number",
		"stanza:default": "10px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--thead-font-color",
		"stanza:type": "color",
		"stanza:default": "--series-0-color",
		"stanza:description": "font color of table header"
	},
	{
		"stanza:key": "--label-font",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "font(e.g: serif,san serif,fantasy)"
	},
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
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"container\">\n  <div class=\"infomation\">\n    <form class=\"search-form\" action=\"#\">\n      <input\n        class=\"search-box\"\n        type=\"text\"\n        placeholder=\"Serch for keywords...\"\n      />\n      <button class=\"search-btn\" type=\"submit\">\n        <img\n          src=\"https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/white-search1.svg\"\n          alt=\"search\"\n        />\n      </button>\n    </form>\n    <a class=\"dl-btn\" href=\"#\" download=\"#\">\n      <img\n        src=\"https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/grey-download1.svg\"\n        alt=\"\"\n      />\n    </a>\n  </div>\n  <table>\n    <thead>\n      <tr>\n        <td class=\"stack\">\n          Original source\n          <span class=\"icon filter-icon\"></span>\n          <span class=\"icon sort-icon\"></span>\n        </td>\n        <td>\n          Organism name\n          <span class=\"icon filter-icon\"></span>\n          <span class=\"icon sort-icon\"></span>\n        </td>\n        <td>\n          Taxonomy ID\n          <span class=\"icon filter-icon\"></span>\n          <span class=\"icon sort-icon\"></span>\n        </td>\n        <td>\n          Isolation\n          <span class=\"icon filter-icon\"></span>\n          <span class=\"icon sort-icon\"></span>\n        </td>\n        <td>\n          Environments\n          <span class=\"icon filter-icon\"></span>\n          <span class=\"icon sort-icon\"></span>\n        </td>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td class=\"stack\" rowspan=\"2\">\n          NBRC 14436\n        </td>\n        <td>\n          \"Thermoanaerobacter cellulolyticus\" Taya et al.\n        </td>\n        <td>\n          NBRC 14436\n        </td>\n        <td>\n          Hot spring sediments in Nozawa, Japan\n        </td>\n        <td>\n          hot spring,  spring sediment\n        </td>\n      </tr>\n      <tr>\n        <!-- <td class=\"stack\">NBRC 14436</td> -->\n        <td>\n          \"Thermoanaerobacter cellulolyticus\" Taya et al.\n        </td>\n        <td>\n          NBRC 14436\n        </td>\n        <td>\n          Hot spring sediments in Nozawa, Japan\n        </td>\n        <td>\n          hot spring,  spring sediment\n        </td>\n      </tr>\n      <tr>\n        <td class=\"stack\">\n          NBRC 14436\n        </td>\n        <td>\n          \"Thermoanaerobacter cellulolyticus\" Taya et al.\n        </td>\n        <td>\n          NBRC 14436\n        </td>\n        <td>\n          Hot spring sediments in Nozawa, Japan\n        </td>\n        <td>\n          hot spring,  spring sediment\n        </td>\n      </tr>\n      <tr>\n        <td class=\"stack\">\n          NBRC 14436\n        </td>\n        <td>\n          \"Thermoanaerobacter cellulolyticus\" Taya et al.\n        </td>\n        <td>\n          NBRC 14436\n        </td>\n        <td>\n          Hot spring sediments in Nozawa, Japan\n        </td>\n        <td>\n          hot spring,  spring sediment\n        </td>\n      </tr>\n      <tr>\n        <td class=\"stack\">\n          NBRC 14436\n        </td>\n        <td>\n          \"Thermoanaerobacter cellulolyticus\" Taya et al.\n        </td>\n        <td>\n          NBRC 14436\n        </td>\n        <td>\n          Hot spring sediments in Nozawa, Japan\n        </td>\n        <td>\n          hot spring,  spring sediment\n        </td>\n      </tr>\n      <tr>\n        <td class=\"stack\">\n          NBRC 14436\n        </td>\n        <td>\n          \"Thermoanaerobacter cellulolyticus\" Taya et al.\n        </td>\n        <td>\n          NBRC 14436\n        </td>\n        <td>\n          Hot spring sediments in Nozawa, Japan\n        </td>\n        <td>\n          hot spring,  spring sediment\n        </td>\n      </tr>\n      <tr>\n        <td class=\"stack\">\n          NBRC 14436\n        </td>\n        <td>\n          \"Thermoanaerobacter cellulolyticus\" Taya et al.\n        </td>\n        <td>\n          NBRC 14436\n        </td>\n        <td>\n          Hot spring sediments in Nozawa, Japan\n        </td>\n        <td>\n          hot spring,  spring sediment\n        </td>\n      </tr>\n      <tr>\n        <td class=\"stack\">\n          NBRC 14436\n        </td>\n        <td>\n          \"Thermoanaerobacter cellulolyticus\" Taya et al.\n        </td>\n        <td>\n          NBRC 14436\n        </td>\n        <td>\n          Hot spring sediments in Nozawa, Japan\n        </td>\n        <td>\n          hot spring,  spring sediment\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</div>";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  list-style: none;\n  font-family: var(--general-font-family);\n  color: var(--general-font-color);\n  font-size: var(--general-font-size);\n}\n\n.container {\n  width: 800px;\n}\n\n.infomation {\n  width: 100%;\n  height: 47px;\n  display: flex;\n  justify-content: space-between;\n}\n\n.search-form {\n  height: 20px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.search-box {\n  margin-right: 5px;\n  height: 20px;\n  width: 164px;\n  border: 1px solid var(--series-0-color);\n  border-radius: 3px;\n  font-size: 10px;\n  color: #c1c0c0;\n}\n\n::placeholder {\n  color: #eaeaea;\n}\n\n.search-btn {\n  margin-right: 2px;\n  height: 20px;\n  width: 20px;\n  border: 1px solid var(--series-0-color);\n  border-radius: 3px;\n  background-color: var(--series-0-color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.search-btn img {\n  width: 12px;\n  height: 12px;\n  display: block;\n}\n\n.dl-btn img {\n  width: 13px;\n  height: 13px;\n}\n\ntable {\n  width: inherit;\n  text-align: left;\n  border-collapse: collapse;\n  margin: 0;\n  background-color: var(--background-color);\n  box-shadow: 1px 1px 3px 1px #eee;\n}\n\nthead {\n  font-size: var(--thead-font-size);\n  border-bottom: var(--thead-border-bottom);\n  color: var(--thead-font-color);\n  margin-bottom: 0;\n  padding: 8px 8px 0 8px;\n}\n\nthead > tr > td > .icon {\n  cursor: pointer;\n  content: \"\";\n  display: inline-block;\n  width: 9px;\n  height: 13px;\n  background-repeat: no-repeat;\n  background-position: center 5px;\n  background-size: 8px 8px;\n}\n\n.filter-icon {\n  margin-left: 2px;\n  background-image: url(https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/grey-filter2.svg);\n}\n\n.sort-icon {\n  background-image: url(https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/grey-sort2.svg);\n}\n\ntbody {\n  font-size: var(--tbody-font-size);\n  color: var(--thead-font-color);\n  padding: 0px 8px;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  height: 250px;\n}\n\nthead,\ntbody {\n  display: block;\n}\n\ntd {\n  width: 150px;\n  padding: 5px;\n}\n\ntbody td {\n  border-bottom: var(--ruled-line);\n  border-collapse: collapse;\n}\n\ntbody tr td:hover {\n  color: var(--emphasized-color);\n}\n\n.stack {\n  border-right: var(--thead-border-bottom);\n}\n\n.show-info {\n  display: flex;\n  justify-content: center;\n}\n\nsummary {\n  display: none;\n}";

defineStanzaElement(tableWithScroll, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=table_with_scroll.js.map
