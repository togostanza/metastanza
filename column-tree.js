import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { d as defineComponent, c as createElementBlock, F as Fragment, r as renderList, n as normalizeClass, a as resolveComponent, o as openBlock, b as createBaseVNode, t as toDisplayString, e as createCommentVNode, f as createBlock, w as withDirectives, v as vShow, g as createTextVNode, h as toRefs, i as ref, j as reactive, k as watchEffect, l as computed, m as vModelText, p as createVNode, q as createApp } from './runtime-dom.esm-bundler-15d38398.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { l as library, F as FontAwesomeIcon } from './index.es-f30b9225.js';
import { f as faChevronRight, a as faClipboard } from './index.es-5d65738a.js';
import { f as appendCustomCss } from './index-d2bbc90f.js';
import './index-847f2a80.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "column-tree",
	"stanza:label": "Column tree",
	"stanza:definition": "Column tree MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Tree",
	"stanza:provider": "",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-08-13",
	"stanza:updated": "2021-08-13",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/tree-data.json",
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
		"stanza:key": "show-border-nodes",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": false,
		"stanza:description": "Show border between nodes",
		"stanza:required": false
	},
	{
		"stanza:key": "fixed-width-columns",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Make all columns a fixed width set by [--togostanza-column-width] at the styles section",
		"stanza:required": false
	},
	{
		"stanza:key": "node-content-alignment",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"vertical",
			"horizontal"
		],
		"stanza:example": "horizontal",
		"stanza:description": "Set alignment of node content",
		"stanza:required": false
	},
	{
		"stanza:key": "search-key",
		"stanza:example": "value",
		"stanza:description": "key for data atrribute to search with suggestions. Besides this key, one can also search by path using the id followed by a / E.G.: 1/2/3",
		"stanza:required": false
	},
	{
		"stanza:key": "label-key",
		"stanza:example": "label",
		"stanza:description": "key for data attribute to display as label",
		"stanza:required": false
	},
	{
		"stanza:key": "show-path",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": false,
		"stanza:description": "Show path in suggestions",
		"stanza:required": false
	},
	{
		"stanza:key": "show-path-explanation",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show explanation on how to use id path for searching",
		"stanza:required": false
	},
	{
		"stanza:key": "show-value",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show value set by [value-key] in tree and suggestions",
		"stanza:required": false
	},
	{
		"stanza:key": "value-key",
		"stanza:example": "n",
		"stanza:description": "Key for data attribute to display as value",
		"stanza:required": false
	},
	{
		"stanza:key": "value-fallback",
		"stanza:example": "no data",
		"stanza:description": "Message in case there is no data for data set by [value-key]",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-width",
		"stanza:type": "number",
		"stanza:default": 600,
		"stanza:description": "Width for entire stanza"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color of entire stanza"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-font-size",
		"stanza:type": "number",
		"stanza:default": 14,
		"stanza:description": "Font size used in stanza"
	},
	{
		"stanza:key": "--togostanza-font-color",
		"stanza:type": "color",
		"stanza:default": "#3c3744",
		"stanza:description": "Default text color"
	},
	{
		"stanza:key": "--togostanza-hover-background-color",
		"stanza:type": "color",
		"stanza:default": "#FFFDD1",
		"stanza:description": "Hover color for background when hovering over items"
	},
	{
		"stanza:key": "--togostanza-hover-text-color",
		"stanza:type": "color",
		"stanza:default": "#221727",
		"stanza:description": "Hover color for text when hovering over items"
	},
	{
		"stanza:key": "--togostanza-selected-background-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Background color for selected items"
	},
	{
		"stanza:key": "--togostanza-selected-text-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Text color for selected items"
	},
	{
		"stanza:key": "--togostanza-column-height",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Height for single column"
	},
	{
		"stanza:key": "--togostanza-column-width",
		"stanza:type": "number",
		"stanza:default": 250,
		"stanza:description": "Width for single column"
	},
	{
		"stanza:key": "--togostanza-column-background-color",
		"stanza:type": "color",
		"stanza:default": "#F8F9FA",
		"stanza:description": "Background color for single column"
	},
	{
		"stanza:key": "--togostanza-column-border-color",
		"stanza:type": "color",
		"stanza:default": "#D9D9D9",
		"stanza:description": "Border color for single column"
	},
	{
		"stanza:key": "--togostanza-column-border-radius",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Border radius for single column"
	},
	{
		"stanza:key": "--togostanza-column-gap",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Gap between columns"
	},
	{
		"stanza:key": "--togostanza-column-padding",
		"stanza:type": "number",
		"stanza:default": 6,
		"stanza:description": "Padding for single column"
	},
	{
		"stanza:key": "--togostanza-node-padding-vertical",
		"stanza:type": "number",
		"stanza:default": 6,
		"stanza:description": "Vertical padding for nodes"
	},
	{
		"stanza:key": "--togostanza-node-padding-horizontal",
		"stanza:type": "number",
		"stanza:default": 6,
		"stanza:description": "Horizontal padding for nodes"
	},
	{
		"stanza:key": "--togostanza-node-border-radius",
		"stanza:type": "number",
		"stanza:default": 9,
		"stanza:description": "Border radius of highlighted/selected nodes"
	},
	{
		"stanza:key": "--togostanza-control-border-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Border color"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

library.add(faChevronRight, faClipboard);
var script$2 = defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    layer: {
      type: Number,
      default: 0,
    },
    nodes: {
      type: Array,
      default: () => [],
    },
    children: {
      type: Boolean,
      default: false,
    },
    checkedNodes: {
      type: Map,
      required: true,
    },
    keys: {
      type: Object,
      required: true,
    },
    valueObj: {
      type: Object,
      required: true,
    },
    highlightedNode: {
      type: [Number, String, null],
      default: null,
    },
    showBorderNodes: {
      type: Boolean,
      default: false,
    },
    nodeContentAlignment: {
      type: String,
      default: "horizontal",
    },
    fixedWidthColumns: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["setParent", "setCheckedNode"],
  setup(props, context) {
    function hasChildren(childrenProp) {
      if (typeof childrenProp === "string") {
        childrenProp = childrenProp
          .split(/,/)
          .map(parseFloat)
          .filter((prop) => !isNaN(prop));
      }
      return childrenProp && childrenProp.length > 0;
    }

    function setCheckedNode(node) {
      context.emit("setCheckedNode", node);
    }

    function setParent(id) {
      context.emit("setParent", [props.layer + 1, id]);
    }
    return {
      setParent,
      setCheckedNode,
      hasChildren,
    };
  },
});

const _hoisted_1$2 = ["checked", "onInput"];
const _hoisted_2$2 = ["onClick"];
const _hoisted_3$2 = { class: "title" };
const _hoisted_4$2 = {
  key: 0,
  class: "value"
};

function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_font_awesome_icon = resolveComponent("font-awesome-icon");

  return (openBlock(), createElementBlock("div", {
    class: normalizeClass(["column", { '-fixed': _ctx.fixedWidthColumns }])
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.nodes, (node) => {
      return (openBlock(), createElementBlock("span", {
        key: node.id,
        class: normalizeClass(["node", [
        {
          '-highlighted':
            node.id === _ctx.highlightedNode && _ctx.hasChildren(node.children),
        },
        { '-with-border': _ctx.showBorderNodes },
      ]])
      }, [
        createBaseVNode("input", {
          type: "checkbox",
          checked: _ctx.checkedNodes.get(node.id),
          onInput: $event => (_ctx.setCheckedNode(node))
        }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_1$2),
        createBaseVNode("span", {
          class: normalizeClass(["label", `-${_ctx.nodeContentAlignment}`]),
          onClick: $event => (_ctx.hasChildren(node.children) ? _ctx.setParent(node.id) : null)
        }, [
          createBaseVNode("strong", _hoisted_3$2, toDisplayString(node[_ctx.keys.label]), 1 /* TEXT */),
          (_ctx.valueObj.show)
            ? (openBlock(), createElementBlock("span", _hoisted_4$2, toDisplayString(node[_ctx.keys.value] ?? _ctx.valueObj.fallback), 1 /* TEXT */))
            : createCommentVNode("v-if", true)
        ], 10 /* CLASS, PROPS */, _hoisted_2$2),
        (_ctx.hasChildren(node.children))
          ? (openBlock(), createBlock(_component_font_awesome_icon, {
              key: 0,
              icon: "chevron-right",
              class: "icon"
            }))
          : createCommentVNode("v-if", true)
      ], 2 /* CLASS */))
    }), 128 /* KEYED_FRAGMENT */))
  ], 2 /* CLASS */))
}

script$2.render = render$2;
script$2.__file = "stanzas/column-tree/NodeColumn.vue";

var script$1 = defineComponent({
  props: {
    showSuggestions: {
      type: Boolean,
      default: false,
    },
    showPath: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    searchInput: {
      type: String,
      required: true,
    },
    keys: {
      type: Object,
      required: true,
    },
    valueObj: {
      type: Object,
      required: true,
    },
    showBorderNodes: {
      type: Boolean,
      default: false,
    },
    nodeContentAlignment: {
      type: String,
      default: "horizontal",
    },
  },
  emits: ["selectNode"],
});

const _hoisted_1$1 = { class: "search-wrapper" };
const _hoisted_2$1 = { class: "suggestions" };
const _hoisted_3$1 = ["onClick"];
const _hoisted_4$1 = { class: "title" };
const _hoisted_5$1 = {
  key: 0,
  class: "value"
};
const _hoisted_6$1 = {
  key: 0,
  class: "value"
};
const _hoisted_7$1 = /*#__PURE__*/createTextVNode(" Path : ");
const _hoisted_8$1 = /*#__PURE__*/createBaseVNode("rp", null, "(", -1 /* HOISTED */);
const _hoisted_9$1 = /*#__PURE__*/createBaseVNode("rp", null, ")", -1 /* HOISTED */);
const _hoisted_10 = {
  key: 0,
  class: "no-results"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("div", _hoisted_1$1, [
    createBaseVNode("ul", _hoisted_2$1, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.data, (node, index) => {
        return (openBlock(), createElementBlock("li", {
          key: index,
          class: normalizeClass({ '-with-border': _ctx.showBorderNodes }),
          onClick: $event => (_ctx.$emit('selectNode', node))
        }, [
          createBaseVNode("span", {
            class: normalizeClass(["label", `-${_ctx.nodeContentAlignment}`])
          }, [
            createBaseVNode("strong", _hoisted_4$1, toDisplayString(node[_ctx.keys.label]), 1 /* TEXT */),
            (_ctx.valueObj.show)
              ? (openBlock(), createElementBlock("span", _hoisted_5$1, toDisplayString(node[_ctx.keys.value] ?? _ctx.valueObj.fallback), 1 /* TEXT */))
              : createCommentVNode("v-if", true)
          ], 2 /* CLASS */),
          (_ctx.showPath)
            ? (openBlock(), createElementBlock("span", _hoisted_6$1, [
                _hoisted_7$1,
                (openBlock(true), createElementBlock(Fragment, null, renderList(node.path, (item, pathIndex) => {
                  return (openBlock(), createElementBlock("ruby", { key: pathIndex }, [
                    createTextVNode(toDisplayString(item.label) + "/", 1 /* TEXT */),
                    _hoisted_8$1,
                    createBaseVNode("rt", null, toDisplayString(item.id), 1 /* TEXT */),
                    _hoisted_9$1
                  ]))
                }), 128 /* KEYED_FRAGMENT */))
              ]))
            : createCommentVNode("v-if", true)
        ], 10 /* CLASS, PROPS */, _hoisted_3$1))
      }), 128 /* KEYED_FRAGMENT */)),
      (_ctx.data.length < 1)
        ? (openBlock(), createElementBlock("li", _hoisted_10, toDisplayString(_ctx.valueObj.fallback), 1 /* TEXT */))
        : createCommentVNode("v-if", true)
    ])
  ], 512 /* NEED_PATCH */)), [
    [vShow, _ctx.showSuggestions]
  ])
}

script$1.render = render$1;
script$1.__file = "stanzas/column-tree/SearchSuggestions.vue";

function isRootNode(parent) {
  return !parent || isNaN(parent);
}
function isTruthBool(str) {
  return str === "true";
}

// TODO: set path for data objects
var script = defineComponent({
  components: { NodeColumn: script$2, SearchSuggestions: script$1 },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  emits: ["resetHighlightedNode"],
  setup(params) {
    params = toRefs(params);
    const layerRefs = ref([]);
    const state = reactive({
      keys: {
        label: params?.labelKey?.value,
        value: params?.valueKey?.value,
      },
      fallbackInCaseOfNoValue: params?.valueFallback.value,
      fixedWidthColumns: isTruthBool(params?.fixedWidthColumns?.value),
      showValue: isTruthBool(params?.showValue?.value),
      showPath: isTruthBool(params?.showPath?.value),
      showPathExplanation: isTruthBool(params?.showPathExplanation?.value),
      showBorderNodes: isTruthBool(params?.showBorderNodes?.value),
      nodeContentAlignment: params?.nodeContentAlignment?.value,
      showSuggestions: false,
      responseJSON: null,
      columnData: [],
      checkedNodes: new Map(),
      searchTerm: "",
      highligthedNodes: [],
    });
    watchEffect(
      async () => {
        state.responseJSON = await loadData(
          params?.dataUrl?.value,
          params?.dataType?.value,
          params?.main
        );
        state.responseJSON = state.responseJSON.map((node) => {
          return { ...node, path: getPath(node) };
        });
        state.checkedNodes = new Map();
      },
      { immediate: true }
    );
    watchEffect(() => {
      const data = state.responseJSON || [];
      state.columnData[0] = data.filter((obj) => isRootNode(obj.parent));
    });
    function updateCheckedNodes(node) {
      const { id, ...obj } = node;
      state.checkedNodes.has(id)
        ? state.checkedNodes.delete(id)
        : state.checkedNodes.set(id, { id, ...obj });
      // TODO: add event handler
      // console.log([...state.checkedNodes.values()]);
    }
    function getChildNodes([layer, parentId]) {
      state.highligthedNodes[layer - 1] = parentId;
      return state.responseJSON.filter((obj) => obj.parent === parentId);
    }
    function updatePartialColumnData([layer, parentId]) {
      const children = getChildNodes([layer, parentId]);
      const indexesToRemove = state.columnData.length - layer;
      state.columnData.splice(layer, indexesToRemove, children);
      return children;
    }
    function isNormalSearchHit(node) {
      return node[params?.searchKey?.value]
        ?.toString()
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase());
    }
    function isPathSearchHit(node) {
      return node.path
        .map((node) => node.id)
        .join("/")
        .toLowerCase()
        .startsWith(state.searchTerm.toLowerCase());
    }
    const valueObj = computed(() => {
      return { show: state.showValue, fallback: state.fallbackInCaseOfNoValue };
    });
    const isValidSearchNode = computed(() => {
      return state.searchTerm.length > 0;
    });
    function selectNode(node) {
      state.highligthedNodes = [];
      state.columnData = [
        state.responseJSON.filter((obj) => isRootNode(obj.parent)),
        ...[...node.path].map((node, index) => {
          return getChildNodes([index + 1, node.id]);
        }),
      ];
      state.checkedNodes = new Map([[node.id, node]]);
      toggleSuggestions();
    }
    function getPath(node) {
      const path = [];
      let parent = { id: node.id, label: node.label };
      while (parent.id) {
        path.push(parent);
        const obj = state.responseJSON.find((obj) => obj.id === parent.id);
        parent = { id: obj?.parent, label: obj?.label };
      }
      return path.reverse();
    }
    function toggleSuggestionsIfValid() {
      if (!isValidSearchNode.value || state.showSuggestions) {
        return;
      }
      toggleSuggestions();
    }
    function toggleSuggestions() {
      state.showSuggestions = !state.showSuggestions;
    }
    const suggestions = computed(() => {
      if (state.searchTerm.includes("/")) {
        return state.responseJSON.filter(isPathSearchHit);
      }
      return state.responseJSON.filter(isNormalSearchHit);
    });
    return {
      isValidSearchNode,
      state,
      layerRefs,
      updateCheckedNodes,
      updatePartialColumnData,
      suggestions,
      valueObj,
      selectNode,
      toggleSuggestions,
      toggleSuggestionsIfValid,
    };
  },
});

const _hoisted_1 = { id: "wrapper" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = /*#__PURE__*/createTextVNode("*When searching by path please use the ");
const _hoisted_4 = /*#__PURE__*/createBaseVNode("em", null, "id", -1 /* HOISTED */);
const _hoisted_5 = /*#__PURE__*/createTextVNode(" followed by a ");
const _hoisted_6 = /*#__PURE__*/createBaseVNode("em", null, "/", -1 /* HOISTED */);
const _hoisted_7 = /*#__PURE__*/createTextVNode(". E.G.: 1/2/3");
const _hoisted_8 = [
  _hoisted_3,
  _hoisted_4,
  _hoisted_5,
  _hoisted_6,
  _hoisted_7
];
const _hoisted_9 = { id: "tree" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_search_suggestions = resolveComponent("search-suggestions");
  const _component_NodeColumn = resolveComponent("NodeColumn");

  return (openBlock(), createElementBlock("section", _hoisted_1, [
    createBaseVNode("div", {
      class: "search-container",
      onMouseleave: _cache[3] || (_cache[3] = $event => (_ctx.state.showSuggestions ? _ctx.toggleSuggestions() : null))
    }, [
      withDirectives(createBaseVNode("input", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.state.searchTerm) = $event)),
        type: "text",
        placeholder: "Search for keywords or path*",
        class: "search",
        onFocus: _cache[1] || (_cache[1] = (...args) => (_ctx.toggleSuggestionsIfValid && _ctx.toggleSuggestionsIfValid(...args))),
        onInput: _cache[2] || (_cache[2] = (...args) => (_ctx.toggleSuggestionsIfValid && _ctx.toggleSuggestionsIfValid(...args)))
      }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */), [
        [vModelText, _ctx.state.searchTerm]
      ]),
      (_ctx.state.showPathExplanation)
        ? (openBlock(), createElementBlock("small", _hoisted_2, _hoisted_8))
        : createCommentVNode("v-if", true),
      createVNode(_component_search_suggestions, {
        "show-suggestions": _ctx.state.showSuggestions,
        "show-path": _ctx.state.showPath,
        "search-input": _ctx.state.searchTerm,
        data: _ctx.suggestions,
        keys: _ctx.state.keys,
        "value-obj": _ctx.valueObj,
        "show-border-nodes": _ctx.state.showBorderNodes,
        "node-content-alignment": _ctx.state.nodeContentAlignment,
        onSelectNode: _ctx.selectNode
      }, null, 8 /* PROPS */, ["show-suggestions", "show-path", "search-input", "data", "keys", "value-obj", "show-border-nodes", "node-content-alignment", "onSelectNode"])
    ], 32 /* HYDRATE_EVENTS */),
    createBaseVNode("div", _hoisted_9, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.state.columnData.filter(
          (col) => col?.length > 0
        ), (column, index) => {
        return (openBlock(), createBlock(_component_NodeColumn, {
          key: index,
          nodes: column,
          layer: index,
          "checked-nodes": _ctx.state.checkedNodes,
          keys: _ctx.state.keys,
          "highlighted-node": _ctx.state.highligthedNodes[index],
          "value-obj": _ctx.valueObj,
          "show-border-nodes": _ctx.state.showBorderNodes,
          "node-content-alignment": _ctx.state.nodeContentAlignment,
          "fixed-width-columns": _ctx.state.fixedWidthColumns,
          onSetParent: _ctx.updatePartialColumnData,
          onSetCheckedNode: _ctx.updateCheckedNodes
        }, null, 8 /* PROPS */, ["nodes", "layer", "checked-nodes", "keys", "highlighted-node", "value-obj", "show-border-nodes", "node-content-alignment", "fixed-width-columns", "onSetParent", "onSetCheckedNode"]))
      }), 128 /* KEYED_FRAGMENT */))
    ])
  ]))
}

script.render = render;
script.__file = "stanzas/column-tree/app.vue";

class ColumnTree extends Stanza {
  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";

    this._app?.unmount();
    this._app = createApp(script, { ...this.params, main });
    this._app.mount(main);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ColumnTree
});

var templates = [
  
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=column-tree.js.map
