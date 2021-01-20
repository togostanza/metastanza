<template>
  <table>
    <thead>
      <tr v-if="table_data.head">
        <th v-for="(label, index) in filtered_head_labels" :key="index">
          {{ label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(col, index) in table_data.body" :key="index">
        <td v-for="(datam, index_2) in filtered_head_vars" :key="index_2">
          {{ col[datam].value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, onMounted } from "vue";
import metadata from "./metadata.json";

export default defineComponent({
  props: metadata["stanza:parameter"].map(p => p["stanza:key"]),
  setup(params) {
    //data
    const table_data = ref([])
    const filtered_head_labels = ref([])
    const filtered_head_vars = ref([])

    //methods
    const getData = () => {
      fetch(params.table_data_api)
        .then(response => response.json())
        .then(data => {
          table_data.value = data
          data.head.labels.forEach((label,index) => {
            if(label !== null) {
              filtered_head_labels.value.push(label)
              filtered_head_vars.value.push(data.head.vars[index])
            }
          })
        });
    };

    // mounted
    onMounted(() => {
      getData();
    });

    return {
      table_data,
      filtered_head_labels,
      filtered_head_vars,
      params
    }
  }
});
</script>
