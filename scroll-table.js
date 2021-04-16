import { d as defineStanzaElement } from './index-60baf012.js';
import { e as defineComponent, m as reactive, o as onMounted, b as createBlock, h as createVNode, F as Fragment, i as renderList, l as createCommentVNode, d as openBlock, k as toDisplayString, u as createApp } from './runtime-dom.esm-bundler-1a3b1ec7.js';
import { l as loadData } from './load-data-c473ed5e.js';

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scroll-table",
	"stanza:label": "Scroll table",
	"stanza:definition": "Scroll table MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Table",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-12-09",
	"stanza:updated": "2020-12-09",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_table_body?taxonomy=9606",
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
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Height",
		"stanza:required": true
	},
	{
		"stanza:key": "page-size",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Page size",
		"stanza:required": true
	},
	{
		"stanza:key": "columns",
		"stanza:example": "[{\"id\":\"id\",\"label\":\"Accession\",\"link\":\"uniprot\"},{\"id\":\"mnemonic\",\"label\":\"Mnemonic\"},{\"id\":\"name\",\"label\":\"Proteinname\",\"escape\": false},{\"id\":\"mass\",\"label\":\"Mass\"},{\"id\":\"location_name\",\"label\":\"Subcellularlocation\",\"link\":\"location_uniprot\"}]",
		"stanza:description": "Columns' options"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-table-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #EEEEEE",
		"stanza:description": "Table border style"
	},
	{
		"stanza:key": "--togostanza-table-shadow",
		"stanza:type": "text",
		"stanza:default": "1px 1px 3px 1px #EEEEEE",
		"stanza:description": "Table shadow style"
	},
	{
		"stanza:key": "--togostanza-thead-border-bottom",
		"stanza:type": "text",
		"stanza:default": "1px solid #EEEEEE",
		"stanza:description": "Border bottom of table header"
	},
	{
		"stanza:key": "--togostanza-thead-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size of table header"
	},
	{
		"stanza:key": "--togostanza-thead-font-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Font color of table header"
	},
	{
		"stanza:key": "--togostanza-thead-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight of table header"
	},
	{
		"stanza:key": "--togostanza-thead-background-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Background color of table header"
	},
	{
		"stanza:key": "--togostanza-tbody-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #EEEEEE",
		"stanza:description": "Border bottom of tbody"
	},
	{
		"stanza:key": "--togostanza-tbody-font-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Font color of table body"
	},
	{
		"stanza:key": "--togostanza-tbody-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "Font size of table body"
	},
	{
		"stanza:key": "--togostanza-tbody-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font size of table body"
	},
	{
		"stanza:key": "--togostanza-tbody-odd-background-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Background color of table body (odd row)"
	},
	{
		"stanza:key": "--togostanza-tbody-even-background-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Background color of table body (even row)"
	}
]
};

var script = defineComponent({
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const state = reactive({
      columns: [],
      allRows: [],

      offset: 0,

      isFetching: false,
    });

    async function fetchData() {
      state.isFetching = true;
      let urlParams = {
        limit: params.pageSize,
        offset: state.offset,
      };
      urlParams = new URLSearchParams(urlParams);
      const { dataUrl } = params;
      const connectCharacter = new URL(dataUrl) ? "&" : "?";
      const data = await loadData(
        `${dataUrl}${connectCharacter}${urlParams}`,
        params.dataType
      );

      if (params.columns) {
        state.columns = JSON.parse(params.columns);
      } else if (data.length > 0) {
        const firstRow = data[0];
        state.columns = Object.keys(firstRow).map((key) => {
          return {
            id: key,
            label: key,
          };
        });
      } else {
        state.columns = [];
      }

      state.allRows = state.allRows.concat(
        data.map((row) => {
          return state.columns.map((column) => {
            return {
              column,
              value: row[column.id],
              href: column.link ? row[column.link] : null,
              unescape: column.escape === false,
            };
          });
        })
      );

      state.isFetching = false;
    }

    function handleScroll(e) {
      if (
        e.path[0].scrollTop ===
          e.path[0].firstChild.clientHeight - e.path[0].clientHeight &&
        !state.isFetching
      ) {
        state.offset = state.offset + params.pageSize;
        fetchData();
      }
    }

    onMounted(() => {
      fetchData();
    });

    return {
      state,
      handleScroll,
      height: params.height,
      padding: params.padding,
    };
  },
});

const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 2 };
const _hoisted_4 = { key: 0 };
const _hoisted_5 = /*#__PURE__*/createVNode("div", { class: "dotTyping" }, null, -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "tableWrapper",
    style: `height: ${_ctx.height}px;`,
    onScroll: _cache[1] || (_cache[1] = (...args) => (_ctx.handleScroll && _ctx.handleScroll(...args)))
  }, [
    (_ctx.state.allRows)
      ? (openBlock(), createBlock("table", _hoisted_1, [
          createVNode("thead", null, [
            createVNode("tr", null, [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.state.columns, (column) => {
                return (openBlock(), createBlock("th", {
                  key: column.id
                }, toDisplayString(column.label), 1 /* TEXT */))
              }), 128 /* KEYED_FRAGMENT */))
            ])
          ]),
          createVNode("tbody", null, [
            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.state.allRows, (row) => {
              return (openBlock(), createBlock("tr", {
                key: row.id
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(row, (cell) => {
                  return (openBlock(), createBlock("td", {
                    key: cell.column.id
                  }, [
                    (cell.href)
                      ? (openBlock(), createBlock("span", _hoisted_2, [
                          createVNode("a", {
                            href: cell.href,
                            target: "_blank"
                          }, toDisplayString(cell.value), 9 /* TEXT, PROPS */, ["href"])
                        ]))
                      : (cell.unescape)
                        ? (openBlock(), createBlock("span", {
                            key: 1,
                            innerHTML: cell.value
                          }, null, 8 /* PROPS */, ["innerHTML"]))
                        : (openBlock(), createBlock("span", _hoisted_3, toDisplayString(cell.value), 1 /* TEXT */))
                  ]))
                }), 128 /* KEYED_FRAGMENT */))
              ]))
            }), 128 /* KEYED_FRAGMENT */)),
            (_ctx.state.isFetching)
              ? (openBlock(), createBlock("tr", _hoisted_4, [
                  createVNode("td", {
                    colspan: _ctx.state.columns.length,
                    class: "loadingWrapper"
                  }, [
                    _hoisted_5
                  ], 8 /* PROPS */, ["colspan"])
                ]))
              : createCommentVNode("v-if", true)
          ])
        ]))
      : createCommentVNode("v-if", true)
  ], 36 /* STYLE, HYDRATE_EVENTS */))
}

script.render = render;
script.__file = "stanzas/scroll-table/app.vue";

async function scrollTable(stanza, params) {
  const main = stanza.root.querySelector("main");
  createApp(script, params).mount(main);
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': scrollTable
});

var templates = [
  
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=scroll-table.js.map
