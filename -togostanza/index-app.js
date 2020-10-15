import { d as defineComponent, s as script$1, c as createBlock, r as resolveComponent, o as openBlock, w as withCtx, F as Fragment, a as renderList, b as createVNode, t as toDisplayString, e as createCommentVNode, f as createApp } from './Layout-7c163899.js';

var script = defineComponent({
  components: {
    Layout: script$1
  },

  props: ['allMetadata'],

  setup(props) {
    return props;
  }
});

const _hoisted_1 = /*#__PURE__*/createVNode("h1", { class: "display-4" }, "List of Stanzas", -1 /* HOISTED */);
const _hoisted_2 = {
  key: 0,
  class: "list-group mt-3"
};
const _hoisted_3 = {
  key: 0,
  class: "small text-muted text-truncate mt-1 mb-0"
};
const _hoisted_4 = { key: 1 };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Layout = resolveComponent("Layout");

  return (openBlock(), createBlock(_component_Layout, null, {
    default: withCtx(() => [
      _hoisted_1,
      (_ctx.allMetadata.length > 0)
        ? (openBlock(), createBlock("div", _hoisted_2, [
            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.allMetadata, (metadata) => {
              return (openBlock(), createBlock("a", {
                key: metadata['@id'],
                href: `./${metadata['@id']}.html`,
                class: "list-group-item list-group-item-action py-3"
              }, [
                createVNode("div", null, toDisplayString(metadata['stanza:label']), 1 /* TEXT */),
                (metadata['stanza:definition'])
                  ? (openBlock(), createBlock("p", _hoisted_3, toDisplayString(metadata['stanza:definition']), 1 /* TEXT */))
                  : createCommentVNode("v-if", true)
              ], 8 /* PROPS */, ["href"]))
            }), 128 /* KEYED_FRAGMENT */))
          ]))
        : (openBlock(), createBlock("p", _hoisted_4, "No stanzas defined."))
    ]),
    _: 1
  }))
}

script.render = render;
script.__file = "node_modules/togostanza/src/components/Index.vue";

var allMetadata = [{"@context":{"stanza":"http://togostanza.org/resource/stanza#"},"@id":"barchart","stanza:label":"Barchart","stanza:definition":"","stanza:type":"MetaStanza","stanza:context":"Meta","stanza:display":"Chart","stanza:provider":"TogoStanza","stanza:license":"MIT","stanza:author":"TogoStanza","stanza:address":"admin@biohackathon.org","stanza:contributor":[],"stanza:created":"2020-10-15","stanza:updated":"2020-10-15","stanza:parameter":[{"stanza:key":"say-to","stanza:example":"world","stanza:description":"who to say hello to","stanza:required":false}],"stanza:about-link-placement":"bottom-right","stanza:style":[{"stanza:key":"--greeting-color","stanza:type":"color","stanza:default":"#eb7900","stanza:description":"text color of greeting"},{"stanza:key":"--greeting-align","stanza:type":"single-choice","stanza:choice":["left","center","right"],"stanza:default":"center","stanza:description":"text align of greeting"}]}];

createApp(script, {allMetadata}).mount('body');
//# sourceMappingURL=index-app.js.map
