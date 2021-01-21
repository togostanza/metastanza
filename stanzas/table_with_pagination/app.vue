<template>
  <table>
    <thead>
      <tr v-if="adjustedTableData.head">
        <th v-for="(head, index) in filteredHead" :key="index">
          {{ head.label }}
          <span
            :class="['icon', 'sortIcon', sortState.active === head.id ? sortState.order : '']"
            @click="SortData(head.id)"
            ></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(col, index) in adjustedTableData.body" :key="index">
        <td v-for="(head, index2) in filteredHead" :key="index2">
          {{ col[head.id].value }}
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
    const tableData = ref([])
    const adjustedTableData = ref([])
    const filteredHead = ref([])
    const sortState = reactive({
      active: '',
      order: 'desc',
    })

    //methods
    const GetData = () => {
      fetch(params.table_data_api)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          tableData.value = data
          adjustedTableData.value = data
          data.head.labels.forEach((label,index) => {
            if(label !== null) {
              filteredHead.value.push({
                id: data.head.vars[index],
                label: label
              })
            }
          })
        });
    };

    const SortData = (id) => {
      sortState.active = id
      sortState.order = sortState.order === 'asc' ? 'desc' : 'asc'
      switch (sortState.order) {
        case "desc":
          tableData.value.body.sort((a, b) => {
            return a[sortState.active].value.toLowerCase() <
              b[sortState.active].value.toLowerCase()
              ? -1
              : 1;
          });
          break;
        case "asc":
          tableData.value.body.sort((b, a) => {
            return a[sortState.active].value.toLowerCase() <
              b[sortState.active].value.toLowerCase()
              ? -1
              : 1;
          });
          break;
      }
    }

    // mounted
    onMounted(() => {
      GetData();
    });

    return {
      adjustedTableData,
      filteredHead,
      sortState,
      SortData,
      params
    }
  }
});
</script>
