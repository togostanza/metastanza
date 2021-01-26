<template>
  <div class="tableOption">
    <form class="textSearchWrapper" @submit.prevent="submitQuery(state.queryInput)">
      <input type="text" placeholder="Search for keywords..." v-model="state.queryInput">
      <button class="searchBtn" type="submit">
        <img src="https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/white-search1.svg"
          alt="search">
      </button>
    </form>
    <a class="downloadBtn" :href="blobUrl" download="tableData">
      <img src="https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/grey-download1.svg" alt="download">
    </a>
  </div>
  <table v-if="state.allRows">
    <thead>
      <tr>
        <th v-for="(column, i) in state.columns" :key="column.id">
          {{ column.label }}
          <span
            :class="[
              'icon',
              'sortIcon',
              state.sorting.column === column ? state.sorting.direction : '',
            ]"
            @click="setSorting(column)"
          ></span>
          <span
            class="icon filterIcon"
            @click="state.columnShowingFilters = column"
          ></span>
          <div class="filterWrapper" v-if="column === state.columnShowingFilters">
            <div
              :class="[
                'filterWindow',
                { lastCol: state.columns.length - 1 === i },
              ]"
            >
              <ul>
                <li v-for="filter in column.filters" :key="filter.value">
                  <input
                    :id="filter.value"
                    v-model="filter.checked"
                    type="checkbox"
                    name="items"
                  />
                  <label :for="filter.id">{{ filter.value }}</label>
                </li>
              </ul>
              <button class="toggle_all_button select_all" @click="setFilters(column, true)">Select All</button>
              <button class="toggle_all_button clear" @click="setFilters(column, false)">Clear</button>
            </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rowsInCurrentPage" :key="row.id">
        <td v-for="cell in row">
          <span v-if="cell.href">
            <a :href="cell.href" target="_blank">{{
              cell.value
            }}</a>
          </span>
          <span v-else>
            {{ cell.value }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="paginationWrapper">
    <template v-if="state.pagination.currentPage !== 1">
      <span
        @click="state.pagination.currentPage = 1"
        class="arrow left"
      >
      </span>
      <span
        @click="state.pagination.currentPage--"
        class="singleArrow left"
      ></span>
    </template>

    <template v-if="totalPages <= 5">
      <ul>
        <li
          v-for="index in totalPages"
          :key="index"
          :class="['pagination', {active: state.pagination.currentPage === index}]"
          @click="state.pagination.currentPage = index"
        >{{ index }}</li>
      </ul>
    </template>

    <template v-else>
      <ul v-if="state.pagination.currentPage < 3">
        <li
          v-for="index in 5"
          :key="index"
          :class="['pagination', {active: state.pagination.currentPage === index}]"
          @click="state.pagination.currentPage = index"
        >{{ index }}</li>
      </ul>

      <ul v-if="state.pagination.currentPage >= 3 && state.pagination.currentPage < totalPages - 2">
        <li
          v-for="index in 5"
          :key="index"
          :class="['pagination', {active: state.pagination.currentPage === state.pagination.currentPage + (index - 3)}]"
          @click="state.pagination.currentPage = state.pagination.currentPage + (index - 3)"
        >{{ state.pagination.currentPage + (index - 3)  }}</li>
      </ul>

      <ul v-if="state.pagination.currentPage >= totalPages - 2">
        <li
          v-for="index in 5"
          :key="index"
          :class="['pagination', {active: state.pagination.currentPage === totalPages + (index - 5)}]"
          @click="state.pagination.currentPage = totalPages + (index - 5)"
        >{{ totalPages + (index - 5)  }}</li>
      </ul>
    </template>

    <template v-if="state.pagination.currentPage !== totalPages">
      <span
        @click="state.pagination.currentPage++"
        class="singleArrow right"
      ></span>

      <span
        @click="state.pagination.currentPage = totalPages"
        class="arrow right"
      ></span>
    </template>

    <div class="pageNumber">
      Page
      <input type="text" v-model.number="state.jumpToNumberInput" @keydown.enter=" jumpToPage(state.jumpToNumberInput)">
      of {{totalPages}}
    </div>
  </div>

  <div
    class="modalBackground"
    v-if="state.columnShowingFilters"
    @click="state.columnShowingFilters = null"
  ></div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  onMounted
} from "vue";

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

      query: '',
      columnShowingFilters: null,

      sorting: {
        active: null,
        direction: "desc"
      },

      pagination: {
        currentPage: 1,
        perPage: 5  // TODO take from params
      },

      queryInput: '',
      jumpToNumberInput: ''
    });

    const filteredRows = computed(() => {
      const query = state.query;

      const filtered = state.allRows.filter((row) => {
        return query ? row.some(cell => cell.value.includes(query)) : true;
      }).filter((row) => {
        return row.every((cell) => {
          const valuesForFilter = cell.column.filters.filter(({checked}) => checked).map(({value}) => value);

          return valuesForFilter.length === 0 ? true : valuesForFilter.includes(cell.value);
        });
      });

      const sortColumn = state.sorting.column;

      if (sortColumn) {
        return orderBy(filtered, (cells) => {
          const cell = cells.find(cell => cell.column === sortColumn);

          return cell.value;
        }, [state.sorting.direction]);
      } else {
        return filtered;
      }
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredRows.value.length / state.pagination.perPage);
    });

    const rowsInCurrentPage = computed(() => {
      const startIndex = (state.pagination.currentPage - 1) * state.pagination.perPage;
      const endIndex = startIndex + state.pagination.perPage;

      return filteredRows.value.slice(startIndex, endIndex);
    });

    const blobUrl = computed(() => {
      const json = state.responseJSON;

      if (!json) { return null; }

      const blob = new Blob([JSON.stringify(json, null, '  ')], {type: 'application/json'});

      return URL.createObjectURL(blob);
    });

    function setSorting(column) {
      state.sorting.column = column;
      state.sorting.direction = state.sorting.direction === "asc" ? "desc" : "asc";
    }

    function setFilters(column, checked) {
      for (const filter of column.filters) {
        filter.checked = checked;
      }
    }

    function jumpToPage(num) {
      state.pagination.currentPage = num;
    }

    function submitQuery(query) {
      state.query = query;
    }

    async function fetchData() {
      const res  = await fetch(params.table_data_api);
      const data = await res.json();

      state.responseJSON = data;

      const {vars, labels, order, href} = data.head;

      const columns = zip(vars, labels, order, href).map(([_var, label, _order, _href]) => {
        const values = data.body.map(row => row[_var].value);

        return {
          id:    _var,
          label,
          order: _order,
          href:  _href,

          filters: uniq(values).map((value) => {
            return {
              value,
              checked: false
            }
          })
        }
      }).filter((column) => column.label !== null);

      state.columns = orderBy(columns, ['order']);

      state.allRows = data.body.map((row) => {
        return columns.map((column) => {
          return {
            column,
            value: row[column.id].value,
            href:  column.href ? row[column.href].value : null
          }
        });
      });
    }

    onMounted(fetchData);

    return {
      state,
      totalPages,
      rowsInCurrentPage,
      blobUrl,
      setSorting,
      setFilters,
      jumpToPage,
      submitQuery,
    };
  },
});
</script>
