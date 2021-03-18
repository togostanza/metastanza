import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { d as defineComponent, r as reactive, o as onMounted, c as createBlock, a as createCommentVNode, b as openBlock, e as createApp } from './runtime-dom.esm-bundler-cc243c09.js';

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dev-hash-table",
	"stanza:label": "dev hash table",
	"stanza:definition": "Hash Table for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Table",
	"stanza:provider": "penqe",
	"stanza:license": "MIT",
	"stanza:author": "reikahirahara",
	"stanza:address": "reikahirahara@gmail.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-02-19",
	"stanza:updated": "2021-02-19",
	"stanza:parameter": [
	{
		"stanza:key": "table_data_api",
		"stanza:example": "http://sparql-support.dbcls.jp/sparqlist/api/metastanza_table_hash?dataset=DS810_1",
		"stanza:description": "table data api",
		"stanza:required": true
	},
	{
		"stanza:key": "limit",
		"stanza:example": "10",
		"stanza:description": "table page size",
		"stanza:required": true
	},
	{
		"stanza:key": "params",
		"stanza:example": "taxonomy='9606'",
		"stanza:description": "parameters for table data api",
		"stanza:required": false
	},
	{
		"stanza:key": "tableTitle",
		"stanza:example": "Title of this Table",
		"stanza:description": "Title of the table",
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
		"stanza:key": "--tabletitle-display",
		"stanza:type": "text",
		"stanza:default": "flex",
		"stanza:description": "display of table title.(flex, block or none)"
	},
	{
		"stanza:key": "--tabletitle-placement",
		"stanza:type": "text",
		"stanza:default": "center",
		"stanza:description": "table title placement when table title is displayed.(left, right, center)"
	},
	{
		"stanza:key": "--tabletitle-margin",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "margin of table title"
	},
	{
		"stanza:key": "--tabletitle-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "font size of table title"
	},
	{
		"stanza:key": "--tabletitle-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "font color of table title"
	},
	{
		"stanza:key": "--table-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #eee",
		"stanza:description": "style of table border"
	},
	{
		"stanza:key": "--table-shadow",
		"stanza:type": "text",
		"stanza:default": "1px 1px 3px 1px #eee",
		"stanza:description": "style of table shadow"
	},
	{
		"stanza:key": "--ruled-line",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #eee",
		"stanza:description": "style of ruled line"
	},
	{
		"stanza:key": "--searchbox-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "radius of search box"
	},
	{
		"stanza:key": "--searchbox-border-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "border color of search box"
	},
	{
		"stanza:key": "--searchbox-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "color of search box"
	},
	{
		"stanza:key": "--table-height",
		"stanza:type": "text",
		"stanza:default": "400px",
		"stanza:description": "height of table"
	},
	{
		"stanza:key": "--searchbtn-height",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "height of search button"
	},
	{
		"stanza:key": "--searchbtn-width",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "width of search button"
	},
	{
		"stanza:key": "--searchbox-height",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "height of search box"
	},
	{
		"stanza:key": "--searchbox-width",
		"stanza:type": "text",
		"stanza:default": "164px",
		"stanza:description": "width of search box"
	},
	{
		"stanza:key": "--searchbox-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of search box"
	},
	{
		"stanza:key": "--searchbox-font-color",
		"stanza:type": "text",
		"stanza:default": "#707070",
		"stanza:description": "font color of search box"
	},
	{
		"stanza:key": "--searchbox-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of search box"
	},
	{
		"stanza:key": "--searchbtn-border-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "border color of search button"
	},
	{
		"stanza:key": "--searchbtn-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "radius of search button"
	},
	{
		"stanza:key": "--searchbtn-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "color of search button"
	},
	{
		"stanza:key": "--searchbtn-img-width",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "width of search button image"
	},
	{
		"stanza:key": "--searchbtn-img-height",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "height of search button image"
	},
	{
		"stanza:key": "--searchimg-display",
		"stanza:type": "text",
		"stanza:default": "block",
		"stanza:description": "display of search button image"
	},
	{
		"stanza:key": "--searchtext-display",
		"stanza:type": "text",
		"stanza:default": "none",
		"stanza:description": "display of search button text.(dafault: none)"
	},
	{
		"stanza:key": "--searchtext-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "color of search button text"
	},
	{
		"stanza:key": "--searchtext-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of search button text"
	},
	{
		"stanza:key": "--dlbtn-img-width",
		"stanza:type": "text",
		"stanza:default": "13px",
		"stanza:description": "width of download button image"
	},
	{
		"stanza:key": "--dlbtn-img-height",
		"stanza:type": "text",
		"stanza:default": "13px",
		"stanza:description": "height of download button image"
	},
	{
		"stanza:key": "--information-margin",
		"stanza:type": "text",
		"stanza:default": "0px 0px 10px 0px",
		"stanza:description": "margin of information area"
	},
	{
		"stanza:key": "--searchicon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of search icon"
	},
	{
		"stanza:key": "--filtericon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of filter icon"
	},
	{
		"stanza:key": "--sorticon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of sort icon"
	},
	{
		"stanza:key": "--thead-border-color",
		"stanza:type": "text",
		"stanza:default": "#eee",
		"stanza:description": "border color of thead"
	},
	{
		"stanza:key": "--thead-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--tbody-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--thead-font-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "font color of table header"
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
		"stanza:default": "#fff",
		"stanza:description": "background color of table header"
	},
	{
		"stanza:key": "--tbody-font-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "font color of table body"
	},
	{
		"stanza:key": "--tbody-border-right",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border right of table body"
	},
	{
		"stanza:key": "--tbody-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border bottom of table body"
	},
	{
		"stanza:key": "--tbody-border-left",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border left of table body"
	},
	{
		"stanza:key": "--tbody-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--tbody-odd-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--tbody-even-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--showinfo-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "show info placement"
	},
	{
		"stanza:key": "--font-family",
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

var script = defineComponent({
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],

      offset: 0,

      isFetchingData: false,
    });

    async function fetchData() {
      state.isFetchingData = true;
      const res = await fetch(`${params.table_data_api}`);
      // const data = await res.json();
      console.log("res", res);

      // state.responseJSON = data;
      // const { vars, labels, order, href } = data.head;

      // const columns = zip(vars, labels, order, href)
      //   .map(([_var, label, _order, _href]) => {
      //     return {
      //       id: _var,
      //       label,
      //       order: _order,
      //       href: _href,
      //     };
      //   })
      //   .filter((column) => column.label !== null);

      // state.columns = orderBy(columns, ["order"]);

      // state.allRows = state.allRows.concat(
      //   data.body.map((row) => {
      //     return columns.map((column) => {
      //       return {
      //         column,
      //         value: row[column.id].value,
      //         href: column.href ? row[column.href].value : null,
      //       };
      //     });
      //   })
      // );
      // state.isFetchingData = false;
    }

    // function handleScroll(e) {
    //   if (
    //     e.path[0].scrollTop ===
    //       e.path[0].firstChild.clientHeight - e.path[0].clientHeight &&
    //     !state.isFetchingData
    //   ) {
    //     state.offset++;
    //     fetchData();
    //   }
    // }

    onMounted(() => {
      fetchData();
    });

    return {
      state,
      // handleScroll,
    };
  },
});

const _hoisted_1 = { class: "tableWrapper" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", _hoisted_1, [
    createCommentVNode(" <div class=\"tableWrapper\" @scroll=\"handleScroll\"> "),
    createCommentVNode(" <table v-if=\"state.allRows\">\n      <thead>\n        <tr>\n          <th v-for=\"column in state.columns\" :key=\"column.id\">\n            {{ column.label }}\n          </th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr v-for=\"row in state.allRows\" :key=\"row.id\">\n          <td v-for=\"cell in row\" :key=\"cell.column.id\">\n            <span v-if=\"cell.href\">\n              <a :href=\"cell.href\" target=\"_blank\">{{ cell.value }}</a>\n            </span>\n            <span v-else>\n              {{ cell.value }}\n            </span>\n          </td>\n        </tr>\n        <tr v-if=\"state.isFetchingData\">\n          <td :colspan=\"state.columns.length\" class=\"loadingWrapper\">\n            <div class=\"dotTyping\"></div>\n          </td>\n        </tr>\n      </tbody>\n    </table> ")
  ]))
}

script.render = render;
script.__file = "stanzas/dev-hash-table/app.vue";

async function tableWithPagination(stanza, params) {
  const main = stanza.root.querySelector("main");
  createApp(script, params).mount(main);
}

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p class=\"greeting\">\n  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"greeting") || (depth0 != null ? lookupProperty(depth0,"greeting") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"greeting","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":14}}}) : helper)))
    + "\n</p>";
},"useData":true}]
];

var css = "main {\n  padding: 1rem 2rem;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  list-style: none;\n  color: var(--general-font-color);\n  font-family: var(--general-font-family);\n  font-size: var(--general-font-size);\n}\n\n#renderDiv {\n  width: 100%;\n}\n\n.container {\n  width: 100%;\n  max-width: 800px;\n}\n\n.tableWrapper {\n  height: var(--table-height);\n  overflow: auto;\n}\n.tableWrapper > table {\n  width: 100%;\n  text-align: left;\n  border-collapse: collapse;\n  margin: 0;\n  background-color: var(--background-color);\n  border-right: var(--table-border);\n  border-bottom: var(--table-border);\n  border-left: var(--table-border);\n  box-shadow: var(--table-shadow);\n}\n.tableWrapper > table > thead {\n  background-color: var(--thead-background-color);\n  font-size: var(--thead-font-size);\n  color: var(--thead-font-color);\n  margin-bottom: 0;\n}\n.tableWrapper > table > thead > tr > th {\n  color: var(--thead-font-color);\n  font-weight: var(--thead-font-weight);\n  padding: 10px;\n  position: sticky;\n  top: -1px;\n  background: #ffffff;\n}\n.tableWrapper > table > thead > tr > th:after {\n  content: \"\";\n  width: 100%;\n  height: 1px;\n  background-color: var(--thead-border-color);\n  position: absolute;\n  left: 0;\n  bottom: 0;\n}\n.tableWrapper > table > thead > tr > th:first-child {\n  background-color: var(--thead-background-color);\n  padding-left: 20px;\n  padding-right: 20px;\n}\n.tableWrapper > table > tbody {\n  font-size: var(--tbody-font-size);\n  color: var(--tbody-font-color);\n  background-color: var(--tbody-background-color);\n  border-right: var(--tbody-border-right);\n  border-bottom: var(--tbody-border-bottom);\n  border-left: var(--tbody-border-left);\n}\n.tableWrapper > table > tbody > tr:nth-child(odd) {\n  background-color: var(--tbody-odd-background-color);\n}\n.tableWrapper > table > tbody > tr:nth-child(even) {\n  background-color: var(--tbody-even-background-color);\n}\n.tableWrapper > table > tbody > tr > td {\n  border-bottom: var(--ruled-line);\n  border-collapse: collapse;\n  padding: 10px;\n}\n.tableWrapper > table > tbody > tr > td:first-child {\n  padding-left: 20px;\n}\n.tableWrapper > table > tbody > tr > td:last-child {\n  padding-right: 20px;\n}\n.tableWrapper > table > tbody > tr > td.loadingWrapper {\n  text-align: center;\n}\n.tableWrapper > table > tbody > tr:last-of-type > td {\n  border-bottom: none;\n}\n\n.dotTyping {\n  position: relative;\n  left: -9999px;\n  display: inline-block;\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background-color: var(--thead-font-color);\n  box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  animation: dot-typing 1.5s infinite linear;\n}\n\n@keyframes dot-typing {\n  0% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  16.667% {\n    box-shadow: 9991.5px -5px 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  33.333% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  50% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px -5px 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  66.667% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n  83.333% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px -5px 0 0 var(--thead-font-color);\n  }\n  100% {\n    box-shadow: 9991.5px 0 0 0 var(--thead-font-color), 9999px 0 0 0 var(--thead-font-color), 10006.5px 0 0 0 var(--thead-font-color);\n  }\n}";

defineStanzaElement(tableWithPagination, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=dev-hash-table.js.map
