<template>
  <div class="column">
    <strong>LAYER {{ layer }} </strong>
    <span
      v-for="node in nodes"
      :key="node.id"
      class="node"
      @click="setParent(node.id)"
    >
      {{ node.label }}
      <font-awesome-icon icon="chevron-right" class="icon" />
    </span>
  </div>
</template>
<script>
import { defineComponent } from "vue";

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
  },
  emits: ["setParent"],

  setup(props, context) {
    function setParent(id) {
      context.emit("setParent", [props.layer + 1, id]);
    }
    return {
      setParent,
    };
  },
});
</script>