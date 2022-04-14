import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { f as appendCustomCss } from './index-d2bbc90f.js';
import { d as defineComponent, c as createElementBlock, b as createBaseVNode, B as normalizeStyle, t as toDisplayString, F as Fragment, o as openBlock, p as createVNode, e as createCommentVNode, f as createBlock, g as createTextVNode, a as resolveComponent, j as reactive, x as onMounted, i as ref, D as onRenderTriggered, r as renderList, n as normalizeClass, q as createApp } from './runtime-dom.esm-bundler-15d38398.js';
import { l as loadData } from './load-data-03ddc67c.js';
import './index-847f2a80.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';

var script$2 = defineComponent({
  props: {
    id: {
      type: String,
      default: null,
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
  },
});

const _hoisted_1$2 = ["id", "name"];
const _hoisted_2$2 = ["for", "innerHTML"];
const _hoisted_3$2 = ["for"];

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("input", {
      id: _ctx.id,
      type: "checkbox",
      name: _ctx.id
    }, null, 8 /* PROPS */, _hoisted_1$2),
    (_ctx.unescape)
      ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: _ctx.id,
          style: normalizeStyle(`-webkit-line-clamp: ${_ctx.lineClamp}`),
          innerHTML: _ctx.value
        }, null, 12 /* STYLE, PROPS */, _hoisted_2$2))
      : (openBlock(), createElementBlock("label", {
          key: 1,
          for: _ctx.id,
          style: normalizeStyle(`-webkit-line-clamp: ${_ctx.lineClamp}`)
        }, toDisplayString(_ctx.value), 13 /* TEXT, STYLE, PROPS */, _hoisted_3$2))
  ], 64 /* STABLE_FRAGMENT */))
}

script$2.render = render$2;
script$2.__file = "stanzas/scroll-table/LineClampCell.vue";

var script$1 = defineComponent({
  components: {
    LineClampCell: script$2,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    href: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: "_blank",
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
  },
});

const _hoisted_1$1 = ["href", "target"];
const _hoisted_2$1 = ["href", "target", "innerHTML"];
const _hoisted_3$1 = ["href", "target"];

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LineClampCell = resolveComponent("LineClampCell");

  return (openBlock(), createElementBlock(Fragment, null, [
    (_ctx.unescape && _ctx.lineClamp)
      ? (openBlock(), createElementBlock("a", {
          key: 0,
          href: _ctx.href,
          target: _ctx.target
        }, [
          createVNode(_component_LineClampCell, {
            id: _ctx.id,
            "line-clamp": _ctx.lineClamp,
            unescape: _ctx.unescape,
            value: _ctx.value
          }, null, 8 /* PROPS */, ["id", "line-clamp", "unescape", "value"])
        ], 8 /* PROPS */, _hoisted_1$1))
      : createCommentVNode("v-if", true),
    createCommentVNode(" eslint-disable-next-line vue/no-v-html "),
    (_ctx.unescape && !_ctx.lineClamp)
      ? (openBlock(), createElementBlock("a", {
          key: 1,
          href: _ctx.href,
          target: _ctx.target,
          innerHTML: _ctx.value
        }, null, 8 /* PROPS */, _hoisted_2$1))
      : (openBlock(), createElementBlock("a", {
          key: 2,
          href: _ctx.href,
          target: _ctx.target
        }, [
          (_ctx.lineClamp)
            ? (openBlock(), createBlock(_component_LineClampCell, {
                key: 0,
                id: _ctx.id,
                "line-clamp": _ctx.lineClamp,
                value: _ctx.value
              }, null, 8 /* PROPS */, ["id", "line-clamp", "value"]))
            : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                createTextVNode(toDisplayString(_ctx.value), 1 /* TEXT */)
              ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
        ], 8 /* PROPS */, _hoisted_3$1))
  ], 64 /* STABLE_FRAGMENT */))
}

script$1.render = render$1;
script$1.__file = "stanzas/scroll-table/AnchorCell.vue";

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scroll-table",
	"stanza:label": "Scroll table",
	"stanza:definition": "Scroll table MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2020-12-09",
	"stanza:updated": "2020-12-09",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://togovar-dev.biosciencedbc.jp/sparqlist/api/gene_gwas?ep=https%3A%2F%2Ftogovar-dev.biosciencedbc.jp%2Fsparql&hgnc_id=404",
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
		"stanza:example": "[{\"id\":\"variant_and_risk_allele\",\"label\":\"rs# and risk allele\"},{\"id\":\"raf\",\"label\":\"RAF\"},{\"id\":\"p_value\",\"label\":\"P-Value\",\"type\":\"number\"},{\"id\":\"odds_ratio\",\"label\":\"OR\"},{\"id\":\"ci_text\",\"label\":\"CI\"},{\"id\":\"beta\",\"label\":\"Beta\"},{\"id\":\"mapped_trait\",\"label\":\"Trait(s)\",\"escape\":false},{\"id\":\"pubmed_id\",\"label\":\"PubMed ID\",\"link\":\"pubmed_uri\"},{\"id\":\"study_detail\",\"label\":\"Study details\",\"link\":\"study\"},{\"id\":\"initial_sample_size\",\"label\":\"Discovery sample description\"},{\"id\":\"replication_sample_size\",\"label\":\"Replication sample description\",\"line-clamp\": 3}]",
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
  components: {
    AnchorCell: script$1,
    LineClampCell: script$2,
  },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  setup(params) {
    const state = reactive({
      columns: [],
      allRows: [],
      main: null,
      offset: 0,

      isFetching: false,

      thListWidth: [],
    });

    async function fetchData() {
      state.isFetching = true;
      const urlParams = {
        limit: params.pageSize,
        offset: state.offset,
      };

      const url = new URL(params.dataUrl);
      const searchParams = new URLSearchParams(url.search);

      const rightParams = [];
      searchParams.forEach((param, name) => {
        if (name !== "limit" && name !== "offset") {
          rightParams.push([name, param]);
        }
      });
      rightParams.push(...Object.entries(urlParams));

      const rightsearchParams = new URLSearchParams(rightParams);

      const data = await loadData(
        `${url.origin}${url.pathname}?${rightsearchParams.toString()}`,
        params.dataType,
        params.main
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
              lineClamp: column["line-clamp"],
            };
          });
        })
      );
      state.isFetching = false;
    }

    function handleScroll(e) {
      if (
        e.path[0].scrollTop >
          e.path[0].firstChild.clientHeight - e.path[0].clientHeight - 5 &&
        e.path[0].scrollTop <
          e.path[0].firstChild.clientHeight - e.path[0].clientHeight + 5 &&
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
const _hoisted_5 = { key: 1 };
const _hoisted_6 = ["innerHTML"];
const _hoisted_7 = { key: 3 };
const _hoisted_8 = { key: 0 };
const _hoisted_9 = ["colspan"];
const _hoisted_10 = /*#__PURE__*/createBaseVNode("div", { class: "dotTyping" }, null, -1 /* HOISTED */);
const _hoisted_11 = [
  _hoisted_10
];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_AnchorCell = resolveComponent("AnchorCell");
  const _component_LineClampCell = resolveComponent("LineClampCell");

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
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.state.allRows, (row, row_index) => {
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
                          createVNode(_component_AnchorCell, {
                            id: `${cell.column.id}_${row_index}`,
                            href: cell.href,
                            value: cell.value,
                            target: cell.target ? `_${cell.target}` : '_blank',
                            unescape: cell.unescape,
                            "line-clamp": cell.lineClamp
                          }, null, 8 /* PROPS */, ["id", "href", "value", "target", "unescape", "line-clamp"])
                        ]))
                      : (cell.lineClamp)
                        ? (openBlock(), createElementBlock("span", _hoisted_5, [
                            createVNode(_component_LineClampCell, {
                              id: `${cell.column.id}_${row_index}`,
                              value: cell.value,
                              unescape: cell.unescape,
                              "line-clamp": cell.lineClamp
                            }, null, 8 /* PROPS */, ["id", "value", "unescape", "line-clamp"])
                          ]))
                        : (cell.unescape)
                          ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                              createCommentVNode(" eslint-disable-next-line vue/no-v-html "),
                              createBaseVNode("span", {
                                innerHTML: cell.value
                              }, null, 8 /* PROPS */, _hoisted_6)
                            ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
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
    this._app = createApp(script, { ...this.params, main });
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
