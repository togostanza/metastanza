<template>
  <h1>{{msg}}</h1>
  <p>{{params.table_data_api}}</p>
</template>

<script>
import { defineComponent } from "vue";
import metadata from "./metadata.json";

export default defineComponent({
  props: metadata["stanza:parameter"].map(p => p["stanza:key"]),

  setup(params) {
    return {
      msg: "Hello World!",
      params
    }
  }
});
</script>
