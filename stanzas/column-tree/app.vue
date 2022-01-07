/* eslint-disable vue/no-v-html */
<template>
  <section id="wrapper">
    <div class="search-container" @mouseleave="state.showSuggestions ? toggleSuggestions() : null">
      <input
        v-model="state.searchTerm"
        type="text"
        placeholder="Search for keywords..."
        class="search"
        @mouseenter="toggleSuggestionsIfValid"
        @focus="toggleSuggestionsIfValid"
      />
      <search-suggestions
        :show-suggestions="state.showSuggestions"
        :search-input="state.searchTerm"
        :data="suggestions"
        :keys="state.keys"
        :value-obj="valueObj" 
        @selectTerm="selectTerm"   
      />
    </div>
    <div class="tree">
      <NodeColumn
        v-for="(column, index) of state.columnData.filter(
          (col) => col.length > 0
        )"
        :key="index"
        :ref="
          (el) => {
            layerRefs[index] = el;
          }
        "
        :nodes="column"
        :layer="index"
        :checked-nodes="state.checkedNodes"
        :keys="state.keys"
        :value-obj="valueObj"
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
      searchTerm: "hi",
    });
    watchEffect(
      async () => {
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
    function test(obj) {
      console.log(obj);
    }
    function isSearchHit(node) {
      return node[params.searchKey.value]
        ?.toLowerCase()
        .includes(state.searchTerm.toLowerCase());
    }
    const valueObj = computed(() => {
      return {show: state.showValue, fallback: state.fallbackInCaseOfNoValue};
    });
    const isValidSearchTerm = computed(() => {
      return state.searchTerm.length > 0;
    })
    function selectTerm(term) {
      console.log(term);
      console.log(getPath(term));
      toggleSuggestions();
    }
    function getPath(node) {
      const path = [];
      let parent = node.parent;
      while (parent) {
        path.push(parent);
        parent = state.responseJSON.find((obj) => obj.id === parent).id;
      }
      return path.reverse();
    }
    function toggleSuggestionsIfValid() {
        if(!isValidSearchTerm.value || state.showSuggestions) {return;}
        toggleSuggestions();
    }
    function toggleSuggestions(){
      state.showSuggestions = !state.showSuggestions;
    } 
    const suggestions = computed(() => {
      return state.responseJSON.filter(isSearchHit);

      // for columndata
      //       const filteredData = (arr, index) => {
      //   return arr.filter(isSearchHit)?.map((node) => {return {...node, layer: index}})
      // }
      // return state.columnData.reduce((a, b, index) => {
      //   return [...filteredData(a, index), ...filteredData(b, index)]
      // })
    });
    return {
      state,
      layerRefs,
      updateCheckedNodes,
      getChildNodes,
      suggestions,
      test,
      valueObj,
      selectTerm,
      toggleSuggestions,
      toggleSuggestionsIfValid
    };
  },
});
</script>
