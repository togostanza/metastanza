<template>
  <div
    class="tableWrapper"
    :style="`width: ${width}px; height: ${height}px;`"
    @scroll="handleScroll"
  >
    <table v-if="state.allRows">
      <thead ref="thead">
        <tr>
          <th
            v-for="(column, index) in state.columns"
            :id="column.id"
            :key="column.id"
            :class="{ fixed: column.fixed }"
            :style="
              column.fixed
                ? `left: ${index === 0 ? 0 : state.thListWidth[index - 1]}px;`
                : null
            "
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in state.allRows" :key="row.id">
          <td
            v-for="(cell, index) in row"
            :key="cell.column.id"
            :class="[
              cell.column.align,
              { fixed: cell.column.fixed },
              cell.column.class,
            ]"
            :style="
              cell.column.fixed
                ? `left: ${index === 0 ? 0 : state.thListWidth[index - 1]}px;`
                : null
            "
          >
            <span v-if="cell.href">
              <a
                :href="cell.href"
                :target="cell.target ? `_${cell.target}` : '_blank'"
                >{{ cell.value }}</a
              >
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
import {
  defineComponent,
  reactive,
  onMounted,
  onRenderTriggered,
  ref,
} from "vue";

import loadData from "togostanza-utils/load-data";

import metadata from "./metadata.json";

export default defineComponent({
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const state = reactive({
      columns: [],
      allRows: [],

      offset: 0,

      isFetching: false,

      thListWidth: [],
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
        state.columns = JSON.parse(params.columns).map((column, index) => {
          column.fixed = index < params.fixedColumns;
          return column;
        });
      } else if (data.length > 0) {
        const firstRow = data[0];
        state.columns = Object.keys(firstRow).map((key, index) => {
          return {
            id: key,
            label: key,
            fixed: index < params.fixedColumns,
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
              align: column.align,
              class: column.class,
              target: column.target,
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

    const thead = ref(null);
    onRenderTriggered(() => {
      setTimeout(() => {
        const thList = thead.value.children[0].children;
        state.thListWidth = Array.from(thList).map((th) => th.clientWidth);
      }, 0);
    });

    return {
      state,
      handleScroll,
      width: params.width,
      height: params.height,
      padding: params.padding,
      thead,
    };
  },
});
</script>
