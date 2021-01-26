<template>
  <div class="tableOption">
    <div class="textSearchWrapper">
      <input type="text" placeholder="Search for keywords...">
      <button class="searchBtn" type="submit">
        <img src="https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/white-search1.svg"
          alt="search">
      </button>
    </div>
    <a class="downloadBtn" :href="blob" download="tableData">
      <img src="https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/grey-download1.svg" alt="download">
    </a>
  </div>
  <table v-if="adjustedTableData">
    <thead>
      <tr>
        <th v-for="(column, i) in state.columns" :key="column.id">
          {{ column.label }}
          <span
            :class="[
              'icon',
              'sortIcon',
              state.sortState.active === head.id ? state.sortState.order : '',
            ]"
            @click="SortData(head.id)"
          ></span>
          <span
            class="icon filterIcon"
            @click="openFilterWindowId = head.id"
          ></span>
          <div class="filterWrapper" v-if="head.id === openFilterWindowId">
            <div
              :class="[
                'filterWindow',
                { lastCol: state.columns.length - 1 === i },
              ]"
            >
              <ul>
                <li v-for="filter in column.filters" :key="filter.id">
                  <input
                    :id="filter.id"
                    :value="filter.checked"
                    type="checkbox"
                    name="items"
                    v-model="filter.checked"
                  />
                  <label :for="filter.id">{{ filter.label }}</label>
                </li>
              </ul>
              <button class="toggle_all_button select_all" @click="ToggleAllCheckbox(head.id, true)">Select All</button>
              <button class="toggle_all_button clear" @click="ToggleAllCheckbox(head.id, false)">Clear</button>
            </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in adjustedTableData" :key="index">
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
    <span
      v-if="pagination.page !== 1"
      @click="pagination.page = 1"
      class="arrow left"
    ></span>
    <span
      v-if="pagination.page !== 1"
      @click="pagination.page--"
      class="singleArrow left"
    ></span>
    <ul v-if="pagination.lastpage <= 5">
      <li
        v-for="index in pagination.lastpage"
        :key="index"
        :class="['pagination', {active: pagination.page === index}]"
        @click="pagination.page = index"
      >{{ index }}</li>
    </ul>
    <ul v-if="pagination.lastpage > 5 && pagination.page < 3">
      <li
        v-for="index in 5"
        :key="index"
        :class="['pagination', {active: pagination.page === index}]"
        @click="pagination.page = index"
      >{{ index }}</li>
    </ul>
    <ul v-if="pagination.lastpage > 5 && pagination.page >= 3 && pagination.page < pagination.lastpage - 2">
      <li
        v-for="index in 5"
        :key="index"
        :class="['pagination', {active: pagination.page === pagination.page + (index - 3)}]"
        @click="pagination.page = pagination.page + (index - 3)"
      >{{ pagination.page + (index - 3)  }}</li>
    </ul>
    <ul v-if="pagination.lastpage > 5 && pagination.page >= pagination.lastpage - 2">
      <li
        v-for="index in 5"
        :key="index"
        :class="['pagination', {active: pagination.page === pagination.lastpage + (index - 5)}]"
        @click="pagination.page = pagination.lastpage + (index - 5)"
      >{{ pagination.lastpage + (index - 5)  }}</li>
    </ul>
    <span
      v-if="pagination.page !== pagination.lastpage"
      @click="pagination.page++"
      class="singleArrow right"
    ></span>
    <span
      v-if="pagination.page !== pagination.lastpage"
      @click="pagination.page = pagination.lastpage"
      class="arrow right"
    ></span>
    <div class="pageNumber">
      Page
      <input type="text" v-model="inputPageNumber" @keydown.enter="ChangePageByInput">
      of {{pagination.lastpage}}
    </div>
  </div>

  <div
    class="modalBackground"
    v-if="openFilterWindowId !== ''"
    @click="openFilterWindowId = ''"
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

import zip from "lodash.zip";

import metadata from "./metadata.json";

export default defineComponent({
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),

  setup(params) {
    const columns = [
      {
        id:    'accession',
        label: 'Accession',
        href:  null,

        filters: [
          {
            id: 'foo',
            value: 'Foo',
            checked: true
          }
        ]
      }
    ];

    const state = reactive({
      columns,
      rows: [],

      sortState: {
        active: null,
        direction: "desc"
      },

      showingFilterSelector: null,
      textSearchInput: '',

      pagination: {
        currentPage: 1,
        perPage: 5  // TODO take from params
      }
    });

    //methods
    const GetData = async () => {
      const res  = await fetch(params.table_data_api);
      const data = await res.json();

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

      state.columns = sortBy(columns, ['order']);

      state.rows = data.body.map((row) => {
        return columns.map(({id, href}) => {
          return {
            value: row[id].value,
            href:  href ? row[href].value : null
          }
        });
      });
    };

    const SortData = (id) => {
      state.sortState.active = id;
      state.sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
    };

    const ToggleAllCheckbox = (columnId, checked) => {
      const column = state.columns.find(({id}) => columnId === id);

      for (const filter of column.filters) {
        filter.checked = checked;
      }
    }

    const totalPages = computed(() => {
      return Math.ceil(adjustedTableData.value.length / state.pagination.perPage);
    });

    const ChangePageByInput = (e) => {
      let n = Number(e.target.value);

      n = Math.max(n, 1);
      n = Matn.min(n, totalPages.value);

      state.pagination.currentPage = n;
    }

    // computed
    const adjustedTableData = computed(() => {
      const query = state.textSearchInput;

      return state.rows.filter((row) => {
        return query ? row.some(cell => cell.value.includes(query)) : true;
      }).filter((row) => {
        return state.columns.some((column, i) => {
          const valuesToFiltered = column.filters.filter(({checked}) => checked).map(({value}) => value);

          return valuesToFiltered.length === 0 ? true : valuesToFiltered.some(v => row[i] === v)
        });
      }).sort((rowX, rowY) => {
        // TODO sorting
        return 1;
      });
    });

    const displayAdjustedTableData = computed(() => {
      const startIndex = (state.pagination.currentPage - 1) * state.pagination.perPage;
      const endIndex = startIndex + state.pagination.perPage;

      return state.rows.slice(startIndex, endIndex);
    });

    const blob = computed(() => {
      // if (tableData.value.body) {
      //   return URL.createObjectURL(new Blob([JSON.stringify(tableData.value, null, "  ")], {type: "application/json"}));
      // }
    });

    // mounted
    onMounted(() => {
      GetData();
    });

    return {
      state,
      adjustedTableData,
      SortData,
      ToggleAllCheckbox,
      blob,
      ChangePageByInput
    };
  },
});
</script>
