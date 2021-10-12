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
import {
  defineComponent,
  reactive,
  onMounted,
  toRefs,
  computed,
  ref,
} from "vue";

// import loadData from "@/lib/load-data";
import metadata from "./metadata.json";
import data from "./assets/tree_sample.json";
import NodeColumn from "./NodeColumn.vue";

export default defineComponent({
  components: { NodeColumn },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  emits: ["resetHighlightedNode"],

  setup(params) {
    const { testBool } = toRefs(params);
    params = toRefs(params);

    const layerRefs = ref([]);

    const state = reactive({
      testBoolFromParam: testBool,
      responseJSON: null,
      columnData: [],
      checkedNodes: new Map(),
    });

    //TODO: set so that data is not null when being executed
    const rootParents = computed(() => {
      return data.filter((obj) => !obj.parent);
    });

    async function fetchData() {
      //   const data = await loadData(params.dataUrl, params.dataType);
      state.responseJSON = data;
      state.columnData.push(data.filter((obj) => !obj.parent));
    }

    function updateCheckedNodes(node) {
      const { id, ...obj } = node;
      state.checkedNodes.has(id)
        ? state.checkedNodes.delete(id)
        : state.checkedNodes.set(id, { id, ...obj });
      // TODO: add event handler
      console.log([...state.checkedNodes.values()]);
    }

    function resetHighlightedNodes() {
      for (const [index, layer] of layerRefs.value.entries()) {
        if (layer && index >= state.columnData.length - 1) {
          layer.resetHighlightedNode();
        }
      }
    }

    function getChildNodes([layer, parentId]) {
      const children = data.filter((node) => node.parent === parentId);
      const indexesToRemove = state.columnData.length - layer;
      state.columnData.splice(layer, indexesToRemove, children);

      resetHighlightedNodes();

      return children;
    }

    onMounted(fetchData);
    return {
      state,
      rootParents,
      layerRefs,
      updateCheckedNodes,
      getChildNodes,
    };
  },
});
</script>
