<template>
  <div class="tableOption">
    <form
      class="textSearchWrapper"
      @submit.prevent="state.query = state.queryInput"
    >
      <input
        v-model="state.queryInput"
        type="text"
        placeholder="Search for keywords..."
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
            v-bind="state.rangeInputs[state.columnShowingTextSearch.id]"
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
            id="queryInputByColumn"
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
              { active: column.filters.some(filter => !filter.checked) },
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
                <button @click="setFilters(column, true)">Select All</button>
                <button @click="setFilters(column, false)">Clear</button>
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
  <div class="paginationWrapper">
    <template v-if="state.pagination.currentPage !== 1">
      <span
        class="arrow double left"
        @click="
          state.pagination.currentPage = 1;
          pageSlider.click();
        "
      >
      </span>
      <span
        class="arrow left"
        @click="
          state.pagination.currentPage--;
          pageSlider.click();
        "
      ></span>
    </template>

    <ul>
      <li
        v-for="page in surroundingPages"
        :key="page"
        :class="[
          'pagination',
          { currentBtn: state.pagination.currentPage === page },
        ]"
        @click="
          state.pagination.currentPage = page;
          pageSlider.click();
        "
      >
        {{ page }}
      </li>
    </ul>

    <template v-if="state.pagination.currentPage !== totalPages">
      <span
        class="arrow right"
        @click="
          state.pagination.currentPage++;
          pageSlider.click();
        "
      ></span>
      <span
        class="arrow double right"
        @click="
          state.pagination.currentPage = totalPages;
          pageSlider.click();
        "
      ></span>
    </template>

    <div class="pageNumber">
      Page
      <input
        v-model.number="state.jumpToNumberInput"
        type="text"
        @keydown.enter="jumpToPage(state.jumpToNumberInput)"
      />
      of {{ totalPages }}
    </div>
  </div>
  <div ref="pageSliderWrapper" class="pageSliderWrapper">
    <canvas class="pageSliderRange" height="50"></canvas>
    <div class="pageSlider">
      <div class="pageSliderBar"></div>
      <ul @mousedown="pageSlider.down">
        <li class="pageSliderKnob">1</li>
      </ul>
    </div>
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
    const columns = JSON.parse(params.columns);
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

      knobDrag: false,
      knobX: 0,
      startX: 0,
      knob: false,
      canvas: false,
      sliderBarWidth: 0,
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
    }

    function jumpToPage(num) {
      state.pagination.currentPage = num ? num : 1;
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
      return (
        (state.queryByColumn.column === column.label &&
          state.queryByColumn.query !== "") ||
        (Object.keys(state.rangeInputs).some((id) => id === column.id) &&
          (state.rangeInputs[column.id].value[0] !==
            state.rangeInputs[column.id].min ||
            state.rangeInputs[column.id].value[1] !==
              state.rangeInputs[column.id].max))
      );
    }

    const pageSliderWrapper = ref(null);
    const pageSlider = {
      init: () => {
        const wrapper = pageSliderWrapper.value;
        if (!params.page_slider) {
          wrapper.style.display = "none";
        }
        wrapper.onmousemove = pageSlider.move;
        wrapper.onmouseup = pageSlider.up;
        state.knob = wrapper.getElementsByClassName("pageSliderKnob")[0];
        state.canvas = wrapper.getElementsByTagName("canvas")[0];
        const bar = wrapper.getElementsByClassName("pageSliderBar")[0];
        state.sliderBarWidth = bar.offsetWidth;
        pageSlider.setPage(state.knobX, state.pagination.currentPage);
      },
      down: (e) => {
        state.knobDrag = true;
        state.startX = e.pageX;
      },
      move: (e) => {
        if (state.knobDrag) {
          let dragX = state.knobX + e.pageX - state.startX;
          if (dragX < 0) {
            dragX = 0;
          }
          if (dragX > state.sliderBarWidth) {
            dragX = state.sliderBarWidth;
          }
          let page = Math.ceil(
            (totalPages.value * dragX) / state.sliderBarWidth
          );
          if (page < 1) {
            page = 1;
          }
          pageSlider.setPage(dragX, page);
        }
      },
      up: (e) => {
        if (state.knobDrag) {
          state.knobX += e.pageX - state.startX;
          state.pagination.currentPage = parseInt(state.knob.innerHTML);
          state.knobDrag = false;
        }
      },
      click: () => {
        state.knobX =
          (state.sliderBarWidth / (totalPages.value - 1)) *
          (state.pagination.currentPage - 1);
        pageSlider.setPage(state.knobX, state.pagination.currentPage);
      },
      setPage: (knobX, page) => {
        state.knob.innerHTML = page;
        state.knob.parentNode.style.transform = "translateX(" + knobX + "px)";
        state.canvas.setAttribute("width", state.sliderBarWidth);
        state.canvas.setAttribute("height", 50);
        const pageButton = state.canvas.parentNode.parentNode
          .getElementsByClassName("paginationWrapper")[0]
          .getElementsByTagName("ul")[0];
        if (state.canvas.getContext) {
          const ctx = state.canvas.getContext("2d");
          ctx.clearRect(
            0,
            0,
            state.canvas.offsetWidth,
            state.canvas.offsetHeight
          );
          ctx.beginPath();
          ctx.moveTo(knobX + state.knob.offsetWidth / 2 - 8, 50);
          ctx.lineTo(knobX - state.knob.offsetWidth / 2 + 8, 50);
          ctx.lineTo(
            pageButton.offsetLeft - pageButton.parentNode.offsetLeft - 10,
            0
          );
          ctx.lineTo(
            pageButton.offsetLeft -
              pageButton.parentNode.offsetLeft +
              pageButton.offsetWidth -
              10,
            0
          );
          ctx.closePath();
          ctx.fillStyle = "#dddddd";
          ctx.fill();
        }
      },
    };

    async function fetchData() {
      // const res = await fetch(params["table-data-api"]);
      // const data = await res.json();

      state.responseJSON = data;

      state.columns = columns.map((column) => {
        const filters = uniq(data.map((datam) => datam[column.id])).map(
          (value) => {
            return {
              value,
              checked: true,
            };
          }
        );
        if (column.type === "decimal") {
          const min = Math.min(...filters.map((filter) => filter.value));
          const max = Math.max(...filters.map((filter) => filter.value));
          state.rangeInputs[column.id] = {
            value: [min, max],
            min,
            max,
            input: [min, max],
          };
        }
        return {
          id: column.id,
          label: column.label,
          filters,
          searchType: column.type,
          rowspan: column.rowspan ? true : false,
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
    onUpdated(pageSlider.init);

    return {
      state,
      totalPages,
      rowsInCurrentPage,
      surroundingPages,
      blobUrl,
      setSorting,
      setFilters,
      setRangeFilters,
      jumpToPage,
      submitQuery,
      closeModal,
      isSearchOn,
      pageSliderWrapper,
      pageSlider,
    };
  },
});
</script>
