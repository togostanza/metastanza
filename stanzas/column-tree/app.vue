/* eslint-disable vue/no-v-html */
<template>
  <section id="wrapper">
    <div
      v-for="(column, index) of state.columnData"
      :key="index"
      class="container"
    >
      <NodeColumn
        v-if="column.length > 0"
        :ref="
          (el) => {
            layerRefs[index] = el;
          }
        "
        :nodes="column"
        :layer="index"
        :checked-nodes="state.checkedNodes"
        @setParent="getChildNodes"
        @setCheckedNode="updateCheckedNodes"
      />
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs, watchEffect, ref } from "vue";
import loadData from "togostanza-utils/load-data";
import metadata from "./metadata.json";
import NodeColumn from "./NodeColumn.vue";
function isRootNode(parent) {
  return !parent || isNaN(parent);
}
export default defineComponent({
  components: { NodeColumn },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  emits: ["resetHighlightedNode"],
  setup(params) {
    params = toRefs(params);
    const layerRefs = ref([]);
    const state = reactive({
      responseJSON: null,
      columnData: [],
      checkedNodes: new Map(),
    });
    watchEffect(
      async () => {
        state.responseJSON = null;
        state.responseJSON = await loadData(
          params.dataUrl.value,
          params.dataType.value
        );
        state.checkedNodes = new Map();
      },
      { immediate: true }
    );
    watchEffect(() => {
      const data = state.responseJSON || [];
      state.columnData.push(data.filter((obj) => isRootNode(obj.parent)));
    });
    function updateCheckedNodes(node) {
      const { id, ...obj } = node;
      state.checkedNodes.has(id)
        ? state.checkedNodes.delete(id)
        : state.checkedNodes.set(id, { id, ...obj });
      // TODO: add event handler
      // console.log([...state.checkedNodes.values()]);
    }
    function resetHighlightedNodes() {
      for (const [index, layer] of layerRefs.value.entries()) {
        if (layer && index >= state.columnData.length - 1) {
          layer.resetHighlightedNode();
        }
      }
    }
    function getChildNodes([layer, parentId]) {
      const children = state.responseJSON.filter(
        (node) => node.parent === parentId
      );
      const indexesToRemove = state.columnData.length - layer;
      state.columnData.splice(layer, indexesToRemove, children);
      resetHighlightedNodes();
      return children;
    }
    return {
      state,
      layerRefs,
      updateCheckedNodes,
      getChildNodes,
    };
  },
});
</script>
