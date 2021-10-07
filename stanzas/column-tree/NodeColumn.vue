<template>
  <div class="column">
    <span
      v-for="node in nodes"
      :key="node.id"
      :class="node.id === state.selectedNode ? 'node -selected' : 'node'"
    >
      <input type="checkbox" @input="setCheckedNode(node)" />
      <span class="content" @click="node.children ? setParent(node.id) : null">
        {{ node.label }}
        <font-awesome-icon
          v-if="node.children"
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
  },
  emits: ["setParent", "setCheckedNode"],

  setup(props, context) {
    const state = reactive({
      selectedNode: null,
    });
    function resetSelectedNode(totalColumns) {
      if (this.layer >= totalColumns - 1) {
        state.selectedNode = null;
      }
    }
    function selectionClass(id) {
      return id === state.selecedNode ? "node -selected" : "";
    }
    function setCheckedNode(node) {
      context.emit("setCheckedNode", node);
    }
    function setParent(id) {
      state.selectedNode = id;
      context.emit("setParent", [props.layer + 1, id]);
    }
    return {
      setParent,
      setCheckedNode,
      resetSelectedNode,
      state,
      selectionClass,
    };
  },
});
</script>
