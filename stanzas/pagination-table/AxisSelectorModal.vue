<template>
  <transition name="modal">
    <div v-if="active" class="modal" :class="['filterWrapper', 'modal']">
      <div class="filterWindow">
        <p class="filterWindowTitle">{{ label }}</p>
        <form>
          <select @change="$emit('axisSelected', $event.target.value)">
            <option value="">None</option>
            <option value="xaxis">X Axis</option>
            <option value="yaxis">Y Axis</option>
            <option value="zaxis">Z Axis</option>
          </select>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },

  emits: ["axisSelected"],
});
</script>
