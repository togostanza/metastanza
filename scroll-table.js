import { S as Stanza, b as appendCustomCss, c as defineStanzaElement } from './index-e0b42b46.js';
import { e as defineComponent, u as reactive, o as onMounted, r as ref, v as onRenderTriggered, g as createElementBlock, i as createBaseVNode, F as Fragment, k as renderList, q as createCommentVNode, A as normalizeStyle, d as openBlock, n as normalizeClass, p as toDisplayString, D as createApp } from './runtime-dom.esm-bundler-7edf55a5.js';
import { l as loadData } from './load-data-0c021b7f.js';

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scroll-table",
	"stanza:label": "Scroll table",
	"stanza:definition": "Scroll table MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
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
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Height",
		"stanza:required": true
	},
	{
		"stanza:key": "fixed-columns",
		"stanza:type": "number",
		"stanza:example": 1,
		"stanza:description": "amount of fixed columns",
		"stanza:required": false
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Padding",
		"stanza:required": false
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
		"stanza:example": "[{\"id\": \"id\",\"label\": \"Accession\",\"link\": \"uniprot\",\"target\": \"self\"},{\"id\": \"mnemonic\",\"label\": \"Mnemonic\",\"class\": \"Mnemonic\"},{\"id\": \"name\",\"label\": \"Proteinname\",\"escape\": false},{\"id\": \"mass\",\"label\": \"Mass\",\"align\": \"right\"},{\"id\": \"location_name\",\"label\": \"Subcellularlocation\",\"link\": \"location_uniprot\"}]",
		"stanza:description": "Columns' options"
	}
],
	"stanza:menu-placement": "bottom-right",
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
		"stanza:default": "#ffffff",
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
		"stanza:default": "#256D80",
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
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color of table body (odd row)"
	},
	{
		"stanza:key": "--togostanza-tbody-even-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color of table body (even row)"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "#F8F9FA",
		"stanza:description": "Background color"
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

      thListWidth: [],
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
        state.columns = JSON.parse(params.columns).map((column, index) => {
          column.fixed = index < params.fixedColumns;
          return column;
        });
      } else if (data.length > 0) {
        const firstRow = data[0];
        state.columns = Object.keys(firstRow).map((key, index) => {
          return {
            id: key,
            label: key,
            fixed: index < params.fixedColumns,
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
              align: column.align,
              class: column.class,
              target: column.target,
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

    const thead = ref(null);
    onRenderTriggered(() => {
      setTimeout(() => {
        const thList = thead.value.children[0].children;
        state.thListWidth = Array.from(thList).map((th) => th.clientWidth);
      }, 0);
    });

    return {
      state,
      handleScroll,
      width: params.width,
      height: params.height,
      padding: params.padding,
      thead,
    };
  },
});

const _hoisted_1 = { key: 0 };
const _hoisted_2 = { ref: "thead" };
const _hoisted_3 = ["id"];
const _hoisted_4 = { key: 0 };
const _hoisted_5 = ["href", "target"];
const _hoisted_6 = ["innerHTML"];
const _hoisted_7 = { key: 2 };
const _hoisted_8 = { key: 0 };
const _hoisted_9 = ["colspan"];
const _hoisted_10 = /*#__PURE__*/createBaseVNode("div", { class: "dotTyping" }, null, -1 /* HOISTED */);
const _hoisted_11 = [
  _hoisted_10
];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", {
    class: "tableWrapper",
    style: normalizeStyle(`width: ${_ctx.width}px; height: ${_ctx.height}px;`),
    onScroll: _cache[0] || (_cache[0] = (...args) => (_ctx.handleScroll && _ctx.handleScroll(...args)))
  }, [
    (_ctx.state.allRows)
      ? (openBlock(), createElementBlock("table", _hoisted_1, [
          createBaseVNode("thead", _hoisted_2, [
            createBaseVNode("tr", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.state.columns, (column, index) => {
                return (openBlock(), createElementBlock("th", {
                  id: column.id,
                  key: column.id,
                  class: normalizeClass({ fixed: column.fixed }),
                  style: normalizeStyle(
              column.fixed
                ? `left: ${index === 0 ? 0 : _ctx.state.thListWidth[index - 1]}px;`
                : null
            )
                }, toDisplayString(column.label), 15 /* TEXT, CLASS, STYLE, PROPS */, _hoisted_3))
              }), 128 /* KEYED_FRAGMENT */))
            ])
          ], 512 /* NEED_PATCH */),
          createBaseVNode("tbody", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.state.allRows, (row) => {
              return (openBlock(), createElementBlock("tr", {
                key: row.id
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(row, (cell, index) => {
                  return (openBlock(), createElementBlock("td", {
                    key: cell.column.id,
                    class: normalizeClass([
              cell.column.align,
              { fixed: cell.column.fixed },
              cell.column.class,
            ]),
                    style: normalizeStyle(
              cell.column.fixed
                ? `left: ${index === 0 ? 0 : _ctx.state.thListWidth[index - 1]}px;`
                : null
            )
                  }, [
                    (cell.href)
                      ? (openBlock(), createElementBlock("span", _hoisted_4, [
                          createBaseVNode("a", {
                            href: cell.href,
                            target: cell.target ? `_${cell.target}` : '_blank'
                          }, toDisplayString(cell.value), 9 /* TEXT, PROPS */, _hoisted_5)
                        ]))
                      : (cell.unescape)
                        ? (openBlock(), createElementBlock("span", {
                            key: 1,
                            innerHTML: cell.value
                          }, null, 8 /* PROPS */, _hoisted_6))
                        : (openBlock(), createElementBlock("span", _hoisted_7, toDisplayString(cell.value), 1 /* TEXT */))
                  ], 6 /* CLASS, STYLE */))
                }), 128 /* KEYED_FRAGMENT */))
              ]))
            }), 128 /* KEYED_FRAGMENT */)),
            (_ctx.state.isFetching)
              ? (openBlock(), createElementBlock("tr", _hoisted_8, [
                  createBaseVNode("td", {
                    colspan: _ctx.state.columns.length,
                    class: "loadingWrapper"
                  }, _hoisted_11, 8 /* PROPS */, _hoisted_9)
                ]))
              : createCommentVNode("v-if", true)
          ])
        ]))
      : createCommentVNode("v-if", true)
  ], 36 /* STYLE, HYDRATE_EVENTS */))
}

script.render = render;
script.__file = "stanzas/scroll-table/app.vue";

class ScrollTable extends Stanza {
  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    main.parentNode.style.padding = this.params["padding"];

    this._app?.unmount();
    this._app = createApp(script, this.params);
    this._app.mount(main);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ScrollTable
});

var templates = [
  
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=scroll-table.js.map
