<template>
  <div class="tableOption">
    <input
      v-model="state.queryForAllColumns"
      type="text"
      placeholder="Search for keywords..."
      class="textSearchInput"
    />
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
            v-if="column.searchType === 'category'"
            :class="[
              'icon',
              'filterIcon',
              { isShowing: column.isFilterPopupShowing },
              { active: column.filters.some((filter) => !filter.checked) },
            ]"
            @click="column.isFilterPopupShowing = true"
          ></span>
          <span
            :class="[
              'icon',
              'searchIcon',
              { active: column.isSearchConditionGiven },
            ]"
            @click="showModal(column)"
          ></span>
          <div v-if="column.isFilterPopupShowing" class="filterWrapper">
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
              v-if="column.isSearchModalShowing"
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
                  :model-value="column.range"
                  :min="column.minValue"
                  :max="column.maxValue"
                  @update="column.setRange"
                ></Slider>
                <div class="rangeInput">
                  <form @submit.prevent="setRangeFilters(column)">
                    <input
                      v-model.number="column.inputtingRangeMin"
                      type="text"
                      class="min"
                    />
                  </form>
                  <form @submit.prevent="setRangeFilters(column)">
                    <input
                      v-model.number="column.inputtingRangeMax"
                      type="text"
                      class="max"
                    />
                  </form>
                </div>
              </div>
              <input
                v-else
                v-model="column.query"
                type="text"
                placeholder="Search for keywords..."
                name="queryInputByColumn"
                class="textSearchInput"
              />
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
    ref="sliderPagination"
    :current-page="state.pagination.currentPage"
    :total-pages="totalPages"
    @updateCurrentPage="updateCurrentPage"
  />
  <div
    v-if="isPopupOrModalShowing"
    :class="['modalBackground', { black: isModalShowing }]"
    @click="closeModal()"
  ></div>
</template>

<script>
import { defineComponent, reactive, ref, computed, onMounted } from "vue";

import SliderPagination from "./SliderPagination.vue";

import orderBy from "lodash.orderby";
import uniq from "lodash.uniq";
import Slider from "@vueform/slider";

import metadata from "./metadata.json";

export default defineComponent({
  components: {
    Slider,
    SliderPagination,
  },

  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const sliderPagination = ref();

    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],

      queryForAllColumns: "",

      sorting: {
        active: null,
        direction: "desc",
      },

      pagination: {
        currentPage: 1,
        perPage: params.limit,
      },
    });

    const filteredRows = computed(() => {
      const queryForAllColumns = state.queryForAllColumns;
      const filtered = state.allRows.filter((row) => {
        return (
          searchByAllColumns(row, queryForAllColumns) && searchByEachColumn(row)
        );
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
      const { currentPage, perPage } = state.pagination;

      const startIndex = (currentPage - 1) * perPage;
      const endIndex = Number(startIndex) + Number(perPage);

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

    const isModalShowing = computed(() => {
      return state.columns.some(
        ({ isSearchModalShowing }) => isSearchModalShowing
      );
    });

    const isPopupOrModalShowing = computed(() => {
      return (
        state.columns.some(
          ({ isFilterPopupShowing }) => isFilterPopupShowing
        ) || isModalShowing.value
      );
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
      column.rangeMin = column.inputtingRangeMin;
      column.rangeMax = column.inputtingRangeMax;
      column.inputtingRangeMin = null;
      column.inputtingRangeMax = null;
    }

    function showModal(column) {
      column.isSearchModalShowing = true;
    }

    function closeModal() {
      for (const column of state.columns) {
        column.isFilterPopupShowing = null;
        column.isSearchModalShowing = null;
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
          };
        });
      } else {
        columns = [];
      }

      state.columns = columns.map((column) => {
        const values = data.map((obj) => obj[column.id]);
        return createColumnState(column, values);
      });

      state.allRows = data.map((row) => {
        return state.columns.map((column) => {
          return {
            column,
            value: column.parseValue(row[column.id]),
            href: column.href ? row[column.href] : null,
          };
        });
      });
    }

    onMounted(fetchData);
    return {
      sliderPagination,
      state,
      totalPages,
      rowsInCurrentPage,
      blobUrl,
      isModalShowing,
      isPopupOrModalShowing,
      setSorting,
      setFilters,
      setRangeFilters,
      showModal,
      closeModal,
      updateCurrentPage,
    };
  },
});

function createColumnState(columnDef, values) {
  const baseProps = {
    id: columnDef.id,
    label: columnDef.label,
    searchType: columnDef.type,
    rowspan: columnDef.rowspan,
    href: columnDef.link,
  };

  if (columnDef.type === "number") {
    const nums = values.map(Number);
    const minValue = Math.min(...nums);
    const maxValue = Math.max(...nums);
    const rangeMin = ref(minValue);
    const rangeMax = ref(maxValue);
    const range = computed(() => [rangeMin.value, rangeMax.value]);

    const isSearchConditionGiven = computed(() => {
      return minValue !== rangeMin.value || maxValue !== rangeMax.value;
    });

    function setRange([min, max]) {
      rangeMin.value = min;
      rangeMax.value = max;
    }

    return {
      ...baseProps,
      parseValue: Number,
      minValue,
      maxValue,
      rangeMin,
      rangeMax,
      range,
      setRange,
      isSearchConditionGiven,
      inputtingRangeMin: null,
      inputtingRangeMax: null,
      isSearchModalShowing: false,

      isMatch(val) {
        return val > rangeMin.value && val <= rangeMax.value;
      },
    };
  } else {
    const query = ref("");
    const isSearchConditionGiven = computed(() => query.value !== "")

    const filters = columnDef.type === "category" ?
      uniq(values)
        .sort()
        .map((value) => {
          return reactive({
            value,
            checked: true,
          });
        }) : null


    function filter(val) {
      const selected = filters.filter(({ checked }) => checked);
      return selected.some(({ value }) => value === val);
    }

    function search(val) {
      const q = query.value;
      return q ? val.includes(q) : true;
    }

    return {
      ...baseProps,
      parseValue: String,
      query,
      isSearchConditionGiven,
      filters,
      isFilterModalShowing: false,
      isSearchModalShowing: false,

      isMatch(val) {
        return columnDef.type === "category" ? search(val) && filter(val) : search(val);
      },
    };
  }
}

function searchByAllColumns(row, query) {
  if (!query) {
    return true;
  }

  return row.some(({ value }) => String(value).includes(query));
}

function searchByEachColumn(row) {
  return row.every((cell) => {
    return cell.column.isMatch(cell.value);
  });
}
</script>
