<template>
  <ul v-show="showSuggestions" class="suggestions">
    <li v-for="(node, index) of data" :key="index" @click="$emit('selectNode', node)">
      <span class="label">{{ node[keys.label]}}</span>
      <span v-if="valueObj.show" class="value"> {{node[keys.value] ?? valueObj.fallback}} </span>
      <span class="path"> Path : <ruby v-for="(item, pathIndex) of node.path" :key="pathIndex">
        {{ item.label }} / <rp>(</rp><rt> {{ item.id }}</rt><rp>)</rp>
      </ruby>
      </span>
    </li>
    <li v-if="data.length < 1" class="no-results">
      {{ valueObj.fallback }}
    </li>
  </ul>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    showSuggestions: {
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
  },
  emits: ["selectNode"],
  setup(){
  function labelPath(path){
    return path.map(node => node.label).join('/');
  }
  function idPath(path){
    return path.map(node => node.id).join('/');
  }
  return {
    labelPath,
    idPath,
  }
  }
});
</script>