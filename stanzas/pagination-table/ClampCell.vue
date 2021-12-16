<!-- eslint-disable vue/no-mutating-props */ -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <template v-if="lineClamp">
    <input
      :id="id"
      type="checkbox"
      :name="id"
      class="lineClampOn"
    />
    <label
      v-if="unescape"
      :for="id"
      :style="lineClamp ? `-webkit-line-clamp: ${lineClamp}` : null"
      :class="['label','lineClampOn']"
      v-html="value"
    ></label>
    <label
      v-else
      :for="id"
      :style="lineClamp ? `-webkit-line-clamp: ${lineClamp}` : null"
      :class="['label','lineClampOn']"
    >
      {{ value }}
    </label>
  </template>
  <template v-else>
    <input
      :id="id"
      :value="charClampOn"
      type="checkbox"
      :name="id"
      class="charClampOn"
      @change="$emit('toggleCharClampOn')"
    />
    <label
      v-if="unescape"
      :for="id"
      class="label charClampOn"
      v-html="value"
    ></label>
    <label
      v-else
      :for="id"
      class="label charClampOn"
    >
      {{ charClampOn && value.length > charClamp ? `${value.slice(0, charClamp)}…` : value }}
    </label>
  </template>
</template>

<script>
import { defineComponent } from "vue";

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
  emits: ['toggleCharClampOn']
});
</script>
