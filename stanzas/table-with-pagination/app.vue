<template>
  <div class="tableOption">
    <form class="textSearchWrapper" @submit.prevent="setQueryInput()">
      <input
        v-model="state.queryInput"
        type="text"
        placeholder="Search for keywords..."
        class="textSearchInput"
      />
      <button class="searchBtn" type="submit">
        <img
          src="https://raw.githubusercontent.com/togostanza/metastanza/master/assets/white-search.svg"
          alt="search"
        />
      </button>
    </form>
    <a class="downloadBtn" :href="blobUrl" download="tableData">
      <img
        src="https://raw.githubusercontent.com/togostanza/metastanza/master/assets/gray-download.svg"
        alt="download"
      />
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
            v-if="column.searchType !== 'number'"
            :class="[
              'icon',
              'filterIcon',
              { isShowing: column === state.columnShowingFilters },
              { active: column.filters.some((filter) => !filter.checked) },
            ]"
            @click="state.columnShowingFilters = column"
          ></span>
          <span
            :class="['icon', 'searchIcon', { active: isSearchOn(column) }]"
            @click="state.columnShowingTextSearch = column"
          ></span>
          <div
            v-if="column === state.columnShowingFilters"
            class="filterWrapper"
          >
            <div
              :class="[
                'filterWindow',
                { lastCol: state.columns.length - 1 === i },
              ]"
            >
              <p class="filterWindowTitle">{{ column.label }}</p>
              <ul>
                <li v-for="filter in column.filters" :key="filter.value">
                  <label :for="filter.id">
                    <input
                      :id="filter.value"
                      v-model="filter.checked"
                      type="checkbox"
                      name="items"
                    />
                    {{ filter.value }}
                  </label>
                </li>
              </ul>
              <div class="toggleAllButton">
                <button class="selectAll" @click="setFilters(column, true)">
                  Select All
                </button>
                <button class="clear" @click="setFilters(column, false)">
                  Clear
                </button>
              </div>
            </div>
          </div>
          <transition name="modal">
            <div
              v-if="column === state.columnShowingTextSearch"
              class="textSearchByColumnWrapper modal"
            >
              <p class="title">
                <template v-if="column.searchType === 'number'">
                  Set {{ column.label }} range
                </template>
                <template v-else> Search for "{{ column.label }}" </template>
              </p>
              <div v-if="column.searchType === 'number'">
                <Slider
                  v-model="column.rangeMinMax"
                  :min="column.minValue"
                  :max="column.maxValue"
                  @change="submitQuery(column)"
                ></Slider>
                <div class="rangeInput">
                  <form @submit.prevent="setRangeFilters(column)">
                    <input
                      v-model="column.inputtingRangeMin"
                      type="text"
                      class="min"
                    />
                  </form>
                  <form @submit.prevent="setRangeFilters(column)">
                    <input
                      v-model="column.inputtingRangeMax"
                      type="text"
                      class="max"
                    />
                  </form>
                </div>
              </div>
              <form
                v-else
                class="textSearchWrapper"
                @submit.prevent="submitQuery(column)"
              >
                <input
                  v-model="column.queryInputByColumn"
                  type="text"
                  placeholder="Search for keywords..."
                  name="queryInputByColumn"
                />
                <button class="searchBtn" type="submit">
                  <img
                    src="https://raw.githubusercontent.com/togostanza/metastanza/master/assets/white-search.svg"
                    alt="search"
                  />
                </button>
              </form>
            </div>
          </transition>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rowsInCurrentPage" :key="row.id">
        <td v-for="cell in row" :key="cell.column.id">
          <span v-if="cell.href">
            <a :href="cell.href" target="_blank">{{ cell.value }}</a>
          </span>
          <span v-else>
            {{ cell.value }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <SliderPagination
    :current-page="state.pagination.currentPage"
    :total-pages="totalPages"
    @updateCurrentPage="updateCurrentPage"
  />
  <div
    v-if="state.columnShowingFilters || state.columnShowingTextSearch"
    :class="['modalBackground', { black: state.columnShowingTextSearch }]"
    @click="closeModal()"
  ></div>
</template>

<script>
import { defineComponent, reactive, computed, onMounted } from "vue";

import SliderPagination from "./SliderPagination.vue";

import orderBy from "lodash.orderby";
import uniq from "lodash.uniq";
import Slider from "@vueform/slider";

import metadata from "./metadata.json";
// import data from "./assets/tableDataWithNumber.json"; // for range filter test

export default defineComponent({
  components: {
    Slider,
    SliderPagination,
  },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  setup(params) {
    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],

      query: "",
      queriesByColumn: [],
      columnShowingFilters: null,
      columnShowingTextSearch: null,

      sorting: {
        active: null,
        direction: "desc",
      },

      pagination: {
        currentPage: 1,
        perPage: params.limit,
      },

      queryInput: "",
      isFiltering: false,
    });

    const filteredRows = computed(() => {
      const query = state.query;
      const queriesByColumn = state.queriesByColumn;
      const filtered = state.allRows
        .filter((row) => {
          return query
            ? row.some((cell) => String(cell.value).includes(query))
            : true;
        })
        .filter((row) => {
          return queriesByColumn.length > 0
            ? row.every((cell) => {
                switch (cell.column.searchType) {
                  case "number": {
                    return (
                      cell.value >= cell.column.rangeMinMax[0] &&
                      cell.value <= cell.column.rangeMinMax[1]
                    );
                  }
                  default: {
                    const query = queriesByColumn.find(
                      (query) => query.id === cell.column.id
                    );
                    return query
                      ? cell.value.includes(query.queryInputByColumn)
                      : true;
                  }
                }
              })
            : true;
        })
        .filter((row) => {
          return row.every((cell) => {
            const valuesForFilter = cell.column.filters
              .filter(({ checked }) => checked)
              .map(({ value }) => value);
            return valuesForFilter.length === 0
              ? false
              : valuesForFilter.includes(cell.value);
          });
        });
      const sortColumn = state.sorting.column;

      if (sortColumn) {
        return orderBy(
          filtered,
          (cells) => {
            const cell = cells.find((cell) => cell.column === sortColumn);
            return cell.value;
          },
          [state.sorting.direction]
        );
      } else {
        return filtered;
      }
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredRows.value.length / state.pagination.perPage);
    });

    const rowsInCurrentPage = computed(() => {
      const startIndex =
        (state.pagination.currentPage - 1) * state.pagination.perPage;
      const endIndex = Number(startIndex) + Number(state.pagination.perPage);
      return filteredRows.value.slice(startIndex, endIndex);
    });

    const blobUrl = computed(() => {
      const json = state.responseJSON;

      if (!json) {
        return null;
      }

      const blob = new Blob([JSON.stringify(json, null, "  ")], {
        type: "application/json",
      });

      return URL.createObjectURL(blob);
    });

    function setSorting(column) {
      state.sorting.column = column;
      state.sorting.direction =
        state.sorting.direction === "asc" ? "desc" : "asc";
    }

    function setFilters(column, checked) {
      for (const filter of column.filters) {
        filter.checked = checked;
      }
    }

    function setRangeFilters(column) {
      column.rangeMinMax[0] = column.inputtingRangeMin;
      column.rangeMinMax[1] = column.inputtingRangeMax;
      column.inputtingRangeMin = null;
      column.inputtingRangeMax = null;
    }

    function setQueryInput() {
      state.query = state.queryInput;
    }

    function submitQuery(column) {
      if (isSearchOn(column)) {
        state.queriesByColumn.push({
          id: column.id,
          searchType: column.searchType,
          queryInputByColumn: column.queryInputByColumn,
          rangeMinMax: column.rangeMinMax,
        });
      } else {
        state.queriesByColumn = state.queriesByColumn.filter(
          (query) => query.id !== column.id
        );
      }
    }

    function closeModal() {
      state.columnShowingFilters = null;
      state.columnShowingTextSearch = null;
    }

    function isSearchOn(column) {
      switch (column.searchType) {
        case "number":
          return (
            column.minValue !== column.rangeMinMax[0] ||
            column.maxValue !== column.rangeMinMax[1]
          );
        default:
          return (
            column.queryInputByColumn !== null
            // state.queriesByColumn.some(query => query === column)
          );
      }
    }

    function updateCurrentPage(currentPage) {
      state.pagination.currentPage = currentPage;
    }

    async function fetchData() {
      const res = await fetch(params["tableDataApi"]);
      const data = await res.json();

      state.responseJSON = data;
      let columns;
      if (params.columns) {
        columns = JSON.parse(params.columns);
      } else if (data.length > 0) {
        const firstRow = data[0];
        columns = Object.keys(firstRow).map((key) => {
          return {
            id: key,
            label: key,
            type: null,
          };
        });
      } else {
        columns = [];
      }
      state.columns = columns.map((column) => {
        const filters = uniq(data.map((datam) => datam[column.id]))
          .sort()
          .map((value) => {
            return {
              value,
              checked: true,
            };
          });
        const filterValues = filters.map((filter) => filter.value);
        const minValue =
          column.type === "number" ? Math.min(...filterValues) : null;
        const maxValue =
          column.type === "number" ? Math.max(...filterValues) : null;

        return {
          id: column.id,
          label: column.label,
          filters,
          searchType: column.type,
          rowspan: column.rowspan,
          minValue,
          maxValue,
          rangeMinMax: [minValue, maxValue],
          inputtingRangeMin: null,
          inputtingRangeMax: null,
          queryInputByColumn: null,
        };
      });

      state.allRows = data.map((row) => {
        return state.columns.map((column) => {
          return {
            value: row[column.id],
            checked: true,
            href: column.link ? row[column.link] : null,
            column,
          };
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
      setRangeFilters,
      setQueryInput,
      submitQuery,
      closeModal,
      isSearchOn,
      updateCurrentPage,
    };
  },
});
</script>
