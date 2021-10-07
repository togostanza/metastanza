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
        ref="layerRef"
        :nodes="column"
        :layer="index"
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
  emits: ["resetSelectedNode"],

  setup(params) {
    const { testBool } = toRefs(params);
    params = toRefs(params);

    const layerRef = ref(null);

    const state = reactive({
      testBoolFromParam: testBool,
      responseJSON: null,
      columnData: [],
      checkedNodes: new Map(),
      layerRef: ref(null),
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
        : state.checkedNodes.set(id, obj);
    }

    function getChildNodes([layer, parentId]) {
      const children = data.filter((node) => node.parent === parentId);
      const indexesToRemove = state.columnData.length - layer;
      state.columnData.splice(layer, indexesToRemove, children);
      layerRef.value.resetSelectedNode(state.columnData.length);

      return children;
    }

    onMounted(fetchData);
    return {
      state,
      rootParents,
      layerRef,
      updateCheckedNodes,
      getChildNodes,
    };
  },
});
</script>
