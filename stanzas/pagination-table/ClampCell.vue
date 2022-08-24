<!-- eslint-disable vue/no-mutating-props */ -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <span :data-is-clamp="isClamp"></span>
  <template v-if="lineClamp">
    <!-- <input :id="id" type="checkbox" :name="id" class="lineClampOn" /> -->
    <label
      v-if="unescape"
      :style="lineClamp ? `-webkit-line-clamp: ${lineClamp}` : null"
      :class="['label', 'lineClampOn']"
      @click="toggleClamp"
      v-html="value"
    ></label>
    <label
      v-else
      :style="lineClamp ? `-webkit-line-clamp: ${lineClamp}` : null"
      :class="['label', 'lineClampOn']"
      @click="toggleClamp"
    >
      {{ value }}
    </label>
  </template>
  <template v-else>
    <!-- <input
      :id="id"
      :value="charClampOn"
      type="checkbox"
      :name="id"
      class="charClampOn"
      @change="$emit('toggleCharClampOn')"
    /> -->
    <label
      v-if="unescape"
      class="label charClampOn"
      @click="toggleCharClamp"
      v-html="value"
    ></label>
    <label v-else :for="id" class="label charClampOn" @click="toggleCharClamp">
      {{
        charClampOn && value.length > charClamp
          ? `${value.slice(0, charClamp)}…`
          : value
      }}
    </label>
  </template>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      default: null,
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
    charClamp: {
      type: Number,
      default: null,
    },
    charClampOn: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: null,
    },
  },
  emits: ["toggleCharClampOn"],
  setup() {
    const isClamp = ref(true);
    const toggleClamp = () => isClamp.value = !isClamp.value;
    const toggleCharClamp = function() {
      this.$emit('toggleCharClampOn');
      this.toggleClamp();
    }
    return { isClamp, toggleClamp, toggleCharClamp };
  },
});
</script>
