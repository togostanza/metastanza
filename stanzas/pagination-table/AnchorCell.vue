<!-- eslint-disable vue/no-v-html -->
<template>
  <a v-if="unescape && lineClamp" :href="href" :target="target">
    <LineClampCell
      :id="id"
      :line-clamp="lineClamp"
      :unescape="unescape"
      :value="value"
    />
  </a>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <a v-if="unescape && !lineClamp" :href="href" :target="target" v-html="value">
  </a>
  <a v-else :href="href" :target="target">
    <template v-if="lineClamp">
      <LineClampCell :id="id" :line-clamp="lineClamp" :value="value" />
    </template>
    <template v-else>
      {{ value }}
    </template>
  </a>
</template>

<script>
import { defineComponent } from "vue";
import LineClampCell from "./LineClampCell.vue";

export default defineComponent({
  components: {
    LineClampCell,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    href: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: "_blank",
    },
    unescape: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: Number,
      default: null,
    },
  },
});
</script>
