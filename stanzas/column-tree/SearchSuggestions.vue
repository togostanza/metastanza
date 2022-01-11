<template>
  <ul v-show="showSuggestions" class="suggestions">
    <li v-for="(node, index) of data" :key="index" @click="$emit('selectNode', node)">
      <strong class="label">{{ node[keys.label]}}</strong>
      <span v-if="valueObj.show" class="value"> {{node[keys.value] ?? valueObj.fallback}} </span>
      <span v-if="showPath" class="value"> Path : <ruby v-for="(item, pathIndex) of node.path" :key="pathIndex">
        {{ item.label }}/<rp>(</rp><rt> {{ item.id }}</rt><rp>)</rp>
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
  },
  emits: ["selectNode"],
});
</script>