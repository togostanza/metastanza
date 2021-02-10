<template>
  <div class="tableWrapper" @scroll="handleScroll">
    <table v-if="state.allRows">
      <thead>
        <tr>
          <th v-for="(column, i) in state.columns" :key="column.id">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in state.allRows" :key="row.id">
          <td v-for="cell in row" :key="cell.column.id">
            <span v-if="cell.href">
              <a :href="cell.href" target="_blank">{{ cell.value }}</a>
            </span>
            <span v-else>
              {{ cell.value }}
            </span>
          </td>
        </tr>
        <tr v-if="state.isFetchingData">
          <td :colspan="state.columns.length" class="loadingWrapper">
            <div class="dotTyping"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, onMounted } from "vue";

import orderBy from "lodash.orderby";
import uniq from "lodash.uniq";
import zip from "lodash.zip";

import metadata from "./metadata.json";

export default defineComponent({
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],

      offset: 0,

      isFetchingData: false
    });


    async function fetchData() {
      console.log('fetchData')
      state.isFetchingData = true
      const res = await fetch(`${params.table_data_api}&limit=${params.limit}&offset=${state.offset}`);
      const data = await res.json();

      state.responseJSON = data;

      const { vars, labels, order, href } = data.head;

      const columns = zip(vars, labels, order, href)
        .map(([_var, label, _order, _href]) => {
          return {
            id: _var,
            label,
            order: _order,
            href: _href,
          };
        })
        .filter((column) => column.label !== null);

      state.columns = orderBy(columns, ["order"]);

      state.allRows = state.allRows.concat(data.body.map((row) => {
        return columns.map((column) => {
          return {
            column,
            value: row[column.id].value,
            href: column.href ? row[column.href].value : null,
          };
        });
      }));
      state.isFetchingData = false
    }

    function handleScroll(e) {
      if(e.path[0].scrollTop === e.path[0].firstChild.clientHeight - e.path[0].clientHeight && !state.isFetchingData) {
        state.offset++
        fetchData()
      }
    }

    onMounted(() => {
      fetchData()
    }
    );

    return {
      state,
      handleScroll
    };
  },
});
</script>
