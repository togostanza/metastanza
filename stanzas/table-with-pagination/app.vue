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
    <transition name="modal">
      <div
        v-if="state.columnShowingTextSearch !== null"
        class="textSearchByColumnWrapper modal"
      >
        <p class="title">
          Search for "{{ state.columnShowingTextSearch.label }}"
        </p>
        <div v-if="state.columnShowingTextSearch.searchType === 'decimal'">
          <Slider
            v-model="state.rangeInputs[state.columnShowingTextSearch.id].value"
            v-bind="{
              min: state.rangeInputs[state.columnShowingTextSearch.id].min,
              max: state.rangeInputs[state.columnShowingTextSearch.id].max,
            }"
          ></Slider>
          <div class="rangeInput">
            <form
              @submit.prevent="
                setRangeFilters(state.columnShowingTextSearch.id)
              "
            >
              <input
                v-model="
                  state.rangeInputs[state.columnShowingTextSearch.id].input[0]
                "
                type="text"
                class="min"
              />
            </form>
            <form
              @submit.prevent="
                setRangeFilters(state.columnShowingTextSearch.id)
              "
            >
              <input
                v-model="
                  state.rangeInputs[state.columnShowingTextSearch.id].input[1]
                "
                type="text"
                class="max"
              />
            </form>
          </div>
        </div>
        <form
          v-else
          class="textSearchWrapper"
          @submit.prevent="
            submitQuery(
              state.columnShowingTextSearch.label,
              state.columnShowingTextSearch.type,
              state.queryInputByColumn
            )
          "
        >
          <input
            v-model="state.queryInputByColumn"
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
            v-if="column.searchType !== 'decimal'"
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
                  <input
                    :id="filter.value"
                    v-model="filter.checked"
                    type="checkbox"
                    name="items"
                  />
                  <label :for="filter.id">{{ filter.value }}</label>
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
  <div ref="paginationWrapper" class="paginationWrapper">
    <div class="serialPagination">
      <div
        :class="['arrowWrapper', { show: state.pagination.currentPage !== 1 }]"
      >
        <span
          class="arrow double left"
          @click="state.pagination.currentPage = 1"
        >
        </span>
        <span class="arrow left" @click="state.pagination.currentPage--"></span>
      </div>

      <ul class="paginationNumList">
        <li
          v-for="page in surroundingPages"
          :key="page"
          :class="[
            'pagination',
            { currentBtn: state.pagination.currentPage === page },
          ]"
          @click="state.pagination.currentPage = page"
        >
          {{ page }}
        </li>
      </ul>

      <div
        :class="[
          'arrowWrapper',
          { show: state.pagination.currentPage !== totalPages },
        ]"
      >
        <span
          class="arrow right"
          @click="state.pagination.currentPage++"
        ></span>
        <span
          class="arrow double right"
          @click="state.pagination.currentPage = totalPages"
        ></span>
      </div>

      <form
        class="pageNumber"
        @submit.prevent="jumpToPage(state.jumpToNumberInput)"
      >
        Page
        <input
          v-model.number="state.jumpToNumberInput"
          type="text"
          class="jumpToNumberInput"
        />
        of {{ totalPages }}
        <button>Go</button>
      </form>
    </div>
    <canvas class="pageSliderRange"></canvas>
    <Slider
      v-model="state.pagination.currentPage"
      v-bind="{ min: 1, max: totalPages }"
      class="pageSlider"
    >
    </Slider>
  </div>
  <div
    v-if="state.columnShowingFilters || state.columnShowingTextSearch"
    :class="['modalBackground', { black: state.columnShowingTextSearch }]"
    @click="closeModal()"
  ></div>
</template>

<script>
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  onUpdated,
  ref,
} from "vue";

import orderBy from "lodash.orderby";
import uniq from "lodash.uniq";
import Slider from "@vueform/slider";

import metadata from "./metadata.json";
import data from "./assets/tableDataWithNumber.json"; // for range filter test

export default defineComponent({
  components: {
    Slider,
  },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  setup(params) {
    const state = reactive({
      responseJSON: null, // for download. may consume extra memory

      columns: [],
      allRows: [],

      query: "",
      queryByColumn: {
        column: null,
        type: null,
        query: "",
      },
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
      queryInputByColumn: "",
      jumpToNumberInput: "",

      rangeInputs: {},

      // knobDrag: false,
      // knobX: 0,
      // startX: 0,
      // knob: false,
      // canvas: false,
      // sliderBarWidth: 0,
    });

    const filteredRows = computed(() => {
      const query = state.query;
      const queryByColumn = state.queryByColumn.query;
      const filtered = state.allRows
        .filter((row) => {
          return query
            ? row.some((cell) => String(cell.value).includes(query))
            : true;
        })
        .filter((row) => {
          return queryByColumn
            ? row.some(
                (cell) =>
                  cell.column.label === state.queryByColumn.column &&
                  cell.value.includes(queryByColumn)
              )
            : true;
        })
        .filter((row) => {
          return Object.keys(state.rangeInputs).length !== 0
            ? row.some((cell) => {
                return (
                  cell.column.searchType === "decimal" &&
                  cell.value >= state.rangeInputs[cell.column.id].value[0] &&
                  cell.value <= state.rangeInputs[cell.column.id].value[1]
                );
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

    const surroundingPages = computed(() => {
      const currentPage = state.pagination.currentPage;

      let start, end;

      if (currentPage <= 3) {
        start = 1;
        end = Math.min(start + 4, totalPages.value);
      } else if (totalPages.value - currentPage <= 3) {
        end = totalPages.value;
        start = Math.max(end - 4, 1);
      } else {
        start = Math.max(currentPage - 2, 1);
        end = Math.min(currentPage + 2, totalPages.value);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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

    const paginationWrapper = ref(null);
    function fillPaginaionRange() {
      const canvas = paginationWrapper.value.getElementsByClassName(
        "pageSliderRange"
      )[0];
      canvas.width = paginationWrapper.value.clientWidth;
      canvas.height = 50;
      if (canvas.getContext) {
        const serialPagination = paginationWrapper.value.getElementsByClassName(
          "paginationNumList"
        )[0];
        const serialPaginationX = serialPagination.offsetLeft;
        const knob = paginationWrapper.value.getElementsByClassName(
          "slider-origin"
        )[0];
        const knobTranslate = knob.style.transform
          .match(/translate\((.+)%,(.+)\)/)[1]
          .split(",")[0];
        const knobX =
          ((1000 + Number(knobTranslate)) / 1000) * canvas.clientWidth;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(
          serialPaginationX - serialPagination.parentNode.offsetLeft,
          0
        );
        ctx.lineTo(
          serialPaginationX - serialPagination.parentNode.offsetLeft + 111,
          0
        );
        ctx.lineTo(knobX, 50);
        ctx.closePath();
        ctx.fillStyle = "#dddddd";
        ctx.fill();
      }
    }

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

    function setRangeFilters(id) {
      state.rangeInputs[id].value[0] = state.rangeInputs[id].input[0];
      state.rangeInputs[id].value[1] = state.rangeInputs[id].input[1];
      state.rangeInputs[id].input = [null, null];
    }

    function setQueryInput() {
      state.query = state.queryInput;
      state.queryInput = "";
    }

    function jumpToPage(num) {
      state.pagination.currentPage = num ? num : 1;
      state.jumpToNumberInput = "";
    }

    function submitQuery(column, type, query) {
      state.queryByColumn.column = column;
      state.queryByColumn.type = type;
      state.queryByColumn.query = query;
    }

    function closeModal() {
      state.columnShowingFilters = null;
      state.columnShowingTextSearch = null;
    }

    function isSearchOn(column) {
      switch (column.searchType) {
        case "decimal":
          if (!state.rangeInputs[column.id]) {
            return false;
          }
          return (
            state.rangeInputs[column.id].value[0] !==
              state.rangeInputs[column.id].min ||
            state.rangeInputs[column.id].value[1] !==
              state.rangeInputs[column.id].max
          );
        default:
          return (
            state.queryByColumn.column === column.label &&
            state.queryByColumn.query !== ""
          );
      }
    }

    async function fetchData() {
      // const res = await fetch(params["table-data-api"]);
      // const data = await res.json();

      state.responseJSON = data;
      const columns = params.columns
        ? JSON.parse(params.columns)
        : Object.keys(data[0]).map((key) => {
            const column = { id: key, label: key };
            if (typeof data[0][key] === "number") {
              column.type = "decimal";
            }
            return column;
          });

      state.columns = columns.map((column) => {
        const filters = uniq(data.map((datam) => datam[column.id]))
          .sort()
          .map((value) => {
            return {
              value,
              checked: true,
            };
          });
        if (column.type === "decimal") {
          const min = Math.min(...filters.map((filter) => filter.value));
          const max = Math.max(...filters.map((filter) => filter.value));
          state.rangeInputs[column.id] = {
            value: [min, max],
            min,
            max,
            input: [null, null],
          };
        }
        return {
          id: column.id,
          label: column.label,
          filters,
          searchType: column.type,
          rowspan: column.rowspan,
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
    onUpdated(fillPaginaionRange);

    return {
      state,
      totalPages,
      rowsInCurrentPage,
      surroundingPages,
      blobUrl,
      paginationWrapper,
      fillPaginaionRange,
      setSorting,
      setFilters,
      setRangeFilters,
      setQueryInput,
      jumpToPage,
      submitQuery,
      closeModal,
      isSearchOn,
    };
  },
});
</script>
