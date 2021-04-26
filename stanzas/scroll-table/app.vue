<template>
  <div
    class="tableWrapper"
    :style="`height: ${height}px;`"
    @scroll="handleScroll"
  >
    <table v-if="state.allRows">
      <thead>
        <tr>
          <th v-for="column in state.columns" :key="column.id">
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
            <span v-else-if="cell.unescape" v-html="cell.value"></span>
            <span v-else>
              {{ cell.value }}
            </span>
          </td>
        </tr>
        <tr v-if="state.isFetching">
          <td :colspan="state.columns.length" class="loadingWrapper">
            <div class="dotTyping"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";

import loadData from "@/lib/load-data";

import metadata from "./metadata.json";

export default defineComponent({
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const state = reactive({
      columns: [],
      allRows: [],

      offset: 0,

      isFetching: false,
    });

    async function fetchData() {
      state.isFetching = true;
      let urlParams = {
        limit: params.pageSize,
        offset: state.offset,
      };
      urlParams = new URLSearchParams(urlParams);
      const { dataUrl } = params;
      const connectCharacter = new URL(dataUrl) ? "&" : "?";
      const data = await loadData(
        `${dataUrl}${connectCharacter}${urlParams}`,
        params.dataType
      );

      if (params.columns) {
        state.columns = JSON.parse(params.columns);
      } else if (data.length > 0) {
        const firstRow = data[0];
        state.columns = Object.keys(firstRow).map((key) => {
          return {
            id: key,
            label: key,
          };
        });
      } else {
        state.columns = [];
      }

      state.allRows = state.allRows.concat(
        data.map((row) => {
          return state.columns.map((column) => {
            return {
              column,
              value: row[column.id],
              href: column.link ? row[column.link] : null,
              unescape: column.escape === false,
            };
          });
        })
      );

      state.isFetching = false;
    }

    function handleScroll(e) {
      if (
        e.path[0].scrollTop ===
          e.path[0].firstChild.clientHeight - e.path[0].clientHeight &&
        !state.isFetching
      ) {
        state.offset = state.offset + params.pageSize;
        fetchData();
      }
    }

    onMounted(() => {
      fetchData();
    });

    return {
      state,
      handleScroll,
      height: params.height,
      padding: params.padding,
    };
  },
});
</script>
