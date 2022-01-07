<template>
  <ul v-show="showSuggestions" class="suggestions">
    <li v-for="(node, index) of data" :key="index" @click="$emit('selectTerm', node)">
      {{ node[keys.label]}}
      <span v-if="valueObj.show" class="value"> {{node[keys.value] ?? valueObj.fallback}} </span>
    </li>
    <li v-if="data.length < 1" class="no-results">
      {{ valueObj.fallback }}
    </li>
    <!-- <li v-if="suggestions.length < 1" class="-disabled">
      <SearchBarSuggestionItem :data-search-type="searchType" />
    </li>
    <li
      v-for="(item, index) in suggestions"
      v-else
      :key="index"
      @click="$emit('selectTerm', convertTagToCondition(item))"
    >
      <SearchBarSuggestionItem
        :data-search-type="searchType"
        v-bind="item.display"
        :search-input="searchInput"
      /> -->
    <!-- </li> -->
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
  emits: ["selectTerm", "exit"],
});
</script>