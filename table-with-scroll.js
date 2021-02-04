import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';

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
	"@id": "table-with-scroll",
	"stanza:label": "table with scroll",
	"stanza:definition": "Table with scroll for MetaStanza",
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
		"stanza:key": "table_data_api",
		"stanza:example": "https://sparql-support.dbcls.jp/rest/api/metastanza_table_example",
		"stanza:description": "table data api",
		"stanza:required": true
	},
	{
		"stanza:key": "limit",
		"stanza:example": "100",
		"stanza:description": "table page size",
		"stanza:required": true
	},
	{
		"stanza:key": "offset",
		"stanza:example": "0",
		"stanza:description": "page numbere",
		"stanza:required": true
	},
	{
		"stanza:key": "params",
		"stanza:example": "taxonomy='9606'",
		"stanza:description": "parameters for table data api",
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
		"stanza:default": "#adc1c7",
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
		"stanza:default": "1px solid #ccb9b1",
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
		"stanza:default": "#adc1c7",
		"stanza:description": "font color of table header"
	},
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "font(e.g: serif,san serif,fantasy)"
	},
	{
		"stanza:key": "--thead-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "font weight of table header"
	},
	{
		"stanza:key": "--thead-background-color",
		"stanza:type": "color",
		"stanza:default": "#efeeed",
		"stanza:description": "background color of thead"
	},
	{
		"stanza:key": "--tbody-background-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "background color of tbody"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<style>\n  table {\n      width: 100%;\n  }\n  td {\n      padding: 5px 20px 5px 20px;\n  }\n</style>\n\n<div class=\"container\">\n  <div class=\"infomation\">\n    <form class=\"search-form\" action=\"#\">\n      <input\n        class=\"search-box\"\n        type=\"text\"\n        placeholder=\"Serch for keywords...\"\n      />\n      <button class=\"search-btn\" type=\"submit\">\n        <img\n          src=\"https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/white-search.svg\"\n          alt=\"search\"\n        />\n      </button>\n    </form>\n    <a class=\"dl-btn\" href=\"#\" download=\"#\">\n      <img\n        src=\"https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/gray-download1.svg\"\n        alt=\"\"\n      />\n    </a>\n  </div>\n  <div id=\"renderDiv\"></div>\n</div>";
},"useData":true}]
];

var css = "@charset \"UTF-8\";\n/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  list-style: none;\n  font-family: var(--general-font-family);\n  color: var(--general-font-color);\n  font-size: var(--general-font-size);\n}\n\n.container {\n  width: 800px;\n}\n\n.infomation {\n  width: 100%;\n  height: 25px;\n  display: flex;\n  justify-content: space-between;\n}\n\n.search-form {\n  height: 20px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.search-box {\n  margin-right: 5px;\n  height: 20px;\n  width: 164px;\n  border: 1px solid var(--series-0-color);\n  border-radius: 3px;\n  font-size: 10px;\n  color: #c1c0c0;\n}\n\n::placeholder {\n  color: #eaeaea;\n}\n\n.search-btn {\n  margin-right: 2px;\n  height: 20px;\n  width: 20px;\n  border: 1px solid var(--series-0-color);\n  border-radius: 3px;\n  background-color: var(--series-0-color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.search-btn img {\n  width: 12px;\n  height: 12px;\n  display: block;\n}\n\n.dl-btn img {\n  width: 13px;\n  height: 13px;\n}\n\ntable {\n  width: inherit;\n  text-align: left;\n  border-collapse: collapse;\n  margin: 0;\n  background-color: var(--background-color);\n  box-shadow: none;\n  border: 1px solid #ccb9b1;\n}\n\n.sticky-table > thead > .table-fixed > th {\n  /* 縦スクロール時に固定する */\n  background-color: var(--thead-background-color);\n  position: sticky;\n  top: 0;\n  /* tbody内のセルより手前に表示する */\n  z-index: 1;\n  padding-left: 10px;\n  height: 40px;\n}\n\n.sticky-table-wrapper {\n  overflow: scroll;\n  width: calc(100vw - 40rem);\n  height: 75vh;\n}\n\nthead {\n  font-size: var(--thead-font-size);\n  border-bottom: var(--thead-border-bottom);\n  color: var(--thead-font-color);\n  margin-bottom: 0;\n  padding: 8px 8px 0 8px;\n  border-top: var(--table-outside-border);\n  border-right: var(--table-outside-border);\n  border-left: var(--table-outside-border);\n}\n\n#renderDiv > table > thead > tr > th {\n  color: var(--thead-font-color);\n  font-weight: var(--thead-font-weight);\n}\n\nthead > tr > td {\n  color: var(--series-0-color);\n  width: 150px;\n  padding: 5px 5px 5px 10px;\n  border-bottom: var(--ruled-line);\n  border-collapse: collapse;\n}\nthead > tr > th > .icon {\n  cursor: pointer;\n  content: \"\";\n  display: inline-block;\n  width: 9px;\n  height: 13px;\n  background-repeat: no-repeat;\n  background-position: center 5px;\n  background-size: 8px 8px;\n}\n\n.filtericon {\n  margin-left: 2px;\n  background-image: url(https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/gray-filter.svg);\n}\n\n.sorticon {\n  background-image: url(https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/gray-sort.svg);\n}\n\n.sorticon-des {\n  background-image: url(../../assets/gray-sort-des.svg);\n}\n\n.sorticon-asc {\n  background-image: url(../../assets/gray-sort-asc.svg);\n}\n\ntbody {\n  font-size: var(--tbody-font-size);\n  color: var(--thead-font-color);\n  padding: 0px 8px;\n  overflow-x: scroll;\n  overflow-y: scroll;\n  height: 250px;\n}\n\ntbody tr td:hover {\n  color: var(--emphasized-color);\n}\n\n.stack {\n  border-right: var(--thead-border-bottom);\n}\n\n.show-info {\n  display: flex;\n  justify-content: center;\n}";

defineStanzaElement(tableWithScroll, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=table-with-scroll.js.map
