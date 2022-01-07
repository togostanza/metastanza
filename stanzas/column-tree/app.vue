/* eslint-disable vue/no-v-html */
<template>
  <section id="wrapper">
    <div class="search-container" @mouseleave="state.showSuggestions ? toggleSuggestions() : null">
      <input
        v-model="state.searchNode"
        type="text"
        placeholder="Search for keywords..."
        class="search"
        @focus="toggleSuggestionsIfValid"
        @change="toggleSuggestionsIfValid"
      />
      <search-suggestions
        :show-suggestions="state.showSuggestions"
        :search-input="state.searchNode"
        :data="suggestions"
        :keys="state.keys"
        :value-obj="valueObj" 
        @selectNode="selectNode"   
      />
    </div>
    <div class="tree">
      <NodeColumn
        v-for="(column, index) of state.columnData.filter(
          (col) => col?.length > 0
        )"
        :key="index"
        :nodes="column"
        :layer="index"
        :checked-nodes="state.checkedNodes"
        :keys="state.keys"
        :highlighted-node="state.highligthedNodes[index]"
        :value-obj="valueObj"
        @setParent="updatePartialColumnData"
        @setCheckedNode="updateCheckedNodes"
      />
    </div>
  </section>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watchEffect,
  ref,
  computed,
} from "vue";
import loadData from "togostanza-utils/load-data";
import metadata from "./metadata.json";
import NodeColumn from "./NodeColumn.vue";
import SearchSuggestions from "./SearchSuggestions.vue";

function isRootNode(parent) {
  return !parent || isNaN(parent);
}
function isTruthBool(str){
  return str === 'true';
}

// TODO: set path for data objects
export default defineComponent({
  components: { NodeColumn, SearchSuggestions },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  emits: ["resetHighlightedNode"],
  setup(params) {
    params = toRefs(params);
    const layerRefs = ref([]);
    const state = reactive({
      keys:{
      label: params.labelKey.value,
      value: params.valueKey.value,
      },
      fallbackInCaseOfNoValue: params.valueFallback.value,
      showValue: isTruthBool(params.showValue.value),
      showSuggestions: false,
      responseJSON: null,
      columnData: [],
      checkedNodes: new Map(),
      searchNode: "",
      highligthedNodes: [],
    });
    watchEffect(
      async () => {
        state.responseJSON = await loadData(
          params.dataUrl.value,
          params.dataType.value
        )
        state.responseJSON = state.responseJSON.map(node => { return {...node, path: getPath(node)}});
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
    function isSearchHit(node) {
      return node[params.searchKey.value]
        ?.toLowerCase()
        .includes(state.searchNode.toLowerCase());
    }
    const valueObj = computed(() => {
      return {show: state.showValue, fallback: state.fallbackInCaseOfNoValue};
    });
    const isValidSearchNode = computed(() => {
      return state.searchNode.length > 0;
    })
    function selectNode(node) {
      state.highligthedNodes = [];
      state.columnData = [state.responseJSON.filter((obj) => isRootNode(obj.parent)) , ...[...node.path].map((node, index) => {
        return getChildNodes([index + 1, node.id]);
      })];
      state.checkedNodes = new Map([ 
        [node.id, node]
      ]);
      toggleSuggestions();
    }
    function getPath(node) {
      const path = [];
      let parent = {id: node.id, label: node.label};
      while (parent.id) {
        path.push(parent);
        const obj = state.responseJSON.find((obj) => obj.id === parent.id);
        parent = { id: obj?.parent, label: obj?.label };
      }
      return path.reverse();
    }
    function toggleSuggestionsIfValid() {
        if(!isValidSearchNode.value || state.showSuggestions) {return;}
        toggleSuggestions();
    }
    function toggleSuggestions(){
      state.showSuggestions = !state.showSuggestions;
    } 
    const suggestions = computed(() => {
      return state.responseJSON.filter(isSearchHit);
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
      toggleSuggestionsIfValid
    };
  },
});
</script>
