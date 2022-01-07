<template>
  <div class="column">
    <span
      v-for="node in nodes"
      :key="node.id"
      class="node"
      :class="{ '-highlighted': node.id === state.highlightedNode }"
    >
      <input
        type="checkbox"
        :checked="checkedNodes.get(node.id)"
        @input="setCheckedNode(node)"
      />
      <span
        class="content"
        @click="hasChildren(node.children) ? setParent(node.id) : null"
      >
        <span class="label">
          {{ node[keys.label] }} 
          <span v-if="valueObj.show" class="value"> {{node[keys.value] ?? valueObj.fallback}} </span>
        </span>
        <font-awesome-icon
          v-if="hasChildren(node.children)"
          icon="chevron-right"
          class="icon"
        />
      </span>
    </span>
  </div>
</template>
<script>
import { defineComponent, reactive } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
library.add(faChevronRight);
export default defineComponent({
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
  },
  emits: ["setParent", "setCheckedNode"],
  setup(props, context) {
    const state = reactive({
      highlightedNode: null,
    });
    function hasChildren(childrenProp) {
      if (typeof childrenProp === "string") {
        childrenProp = childrenProp
          .split(/,/)
          .map(parseFloat)
          .filter((prop) => !isNaN(prop));
      }
      return childrenProp && childrenProp.length > 0;
    }
    function resetHighlightedNode() {
      state.highlightedNode = null;
    }
    function setCheckedNode(node) {
      context.emit("setCheckedNode", node);
    }
    function setParent(id) {
      state.highlightedNode = id;
      context.emit("setParent", [props.layer + 1, id]);
    }
    return {
      setParent,
      setCheckedNode,
      resetHighlightedNode,
      hasChildren,
      state,
    };
  },
});
</script>
