<template>
  <div class="tableOption">
    <div class="textSearchWrapper">
      <input type="text" placeholder="Search for keywords..." v-model="textSearchInput" @keydown.enter="SearchByText">
      <button class="searchBtn" type="submit" @click="SearchByText">
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
        <th v-for="(head, index) in filteredHead" :key="index">
          {{ head.label }}
          <span
            :class="[
              'icon',
              'sortIcon',
              sortState.active === head.id ? sortState.order : '',
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
                { lastCol: index === filteredHead.length - 1 },
              ]"
            >
              <ul>
                <li
                  v-for="(content, index2) in filterContents[head.id]"
                  :key="index2"
                >
                  <input
                    :id="content"
                    :value="content"
                    type="checkbox"
                    name="items"
                    v-model="filterState[head.id]"
                  />
                  <label :for="content">{{ content }}</label>
                </li>
              </ul>
              <button class="toggle_all_button select_all" @click="ToggleAllCheckbox(head.id, 'all')">Select All</button>
              <button class="toggle_all_button clear" @click="ToggleAllCheckbox(head.id, 'clear')">Clear</button>
            </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(col, index) in adjustedTableData.body" :key="index">
        <td v-for="(head, index2) in filteredHead" :key="index2">
          <span v-if="col[head.id].href">
            <a :href="col[head.id].href" target="_blank">{{
              col[head.id].value
            }}</a>
          </span>
          <span v-else>
            {{ col[head.id].value }}
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
import metadata from "./metadata.json";

export default defineComponent({
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  setup(params) {
    //data
    const tableData = ref([]);
    const filteredHead = ref([]);
    const sortState = reactive({
      active: "",
      order: "desc",
    });
    const openFilterWindowId = ref('');
    const filterContents = reactive({});
    const filterState = reactive({});
    const textSearchInput = ref('')
    const textSearchInputDone = ref('')
    const pagination = reactive({
        page: 1,
        limit: 5
    });
    const inputPageNumber = ref('')

    //methods
    const GetData = () => {
      fetch(params.table_data_api)
        .then((response) => response.json())
        .then((data) => {
          data.head.href.forEach((datum, index) => {
            if (datum) {
              data.body = data.body.map((bodyDatam) => {
                const hasHrefData = data.head.vars[index];
                bodyDatam[hasHrefData].href = bodyDatam[datum].value;
                return bodyDatam;
              });
            }
          });

          tableData.value = data;

          data.head.labels.forEach((label, index) => {
            if (label !== null) {
              filteredHead.value.push({
                id: data.head.vars[index],
                label: label,
              });
            }
          });

          filteredHead.value.forEach((datum, index) => {
            data.body.forEach((bodyDatam) => {
              if (!filterState[datum.id]) {
                filterState[datum.id] = [bodyDatam[datum.id].value];
                filterContents[datum.id] = [bodyDatam[datum.id].value];
              } else if (
                filterState[datum.id].indexOf(bodyDatam[datum.id].value) === -1
              ) {
                filterState[datum.id].push(bodyDatam[datum.id].value);
                filterContents[datum.id].push(bodyDatam[datum.id].value);
              }
            });
          });
        });
    };

    const SortData = (id) => {
      sortState.active = id;
      sortState.order = sortState.order === "asc" ? "desc" : "asc";
    };

    const ToggleAllCheckbox = (id, mode) => {
      switch(mode) {
        case 'all' :
          filterState.id = [...filterContents.id]
          break;
        case 'clear' :
          filterState.id = []
          break;
      }
    }

    const SearchByText = () => {
      textSearchInputDone.value = textSearchInput.value
    }

    const ChangePageByInput = () => {
      if(Number(inputPageNumber.value) > pagination.lastpage) {
        pagination.page = pagination.lastpage
        inputPageNumber.value = pagination.lastpage
      } else {
        pagination.page = Number(inputPageNumber.value)
      }
    }

    // computed
    const adjustedTableData = computed(() => {
      let adjustedTableData = JSON.parse(JSON.stringify(tableData.value))
      if(adjustedTableData.body) {
        //filter
        adjustedTableData.body = tableData.value.body.filter(bodyDatam => {
          let flag = true
          Object.keys(filterState).forEach(columnName => {
            if(filterState[columnName].indexOf(bodyDatam[columnName].value) === -1) {
              flag = false
            }
          })
          return flag
        })

        //sort
        if(sortState.active !== "") {
          switch (sortState.order) {
            case "desc":
              adjustedTableData.body.sort((a, b) => {
                return a[sortState.active].value.toLowerCase() <
                  b[sortState.active].value.toLowerCase()
                  ? -1
                  : 1;
              });
              break;
            case "asc":
              adjustedTableData.body.sort((b, a) => {
                return a[sortState.active].value.toLowerCase() <
                  b[sortState.active].value.toLowerCase()
                  ? -1
                  : 1;
              });
              break;
          }
        }

        //seach by text
        if(textSearchInputDone.value !== "") {
          adjustedTableData.body = tableData.value.body.filter(bodyDatam => {
            let flag = false
            Object.keys(bodyDatam).forEach(columnName => {
              if(bodyDatam[columnName].value.indexOf(textSearchInputDone.value) !== -1) {
                flag = true
              }
            })
            return flag
          })
        }

        // pagination
        let displayAdjustedTableData = [];
        const start = (pagination.page - 1) * pagination.limit;
        const end = start + pagination.limit;
        pagination.lastpage = Math.ceil(adjustedTableData.body.length / pagination.limit)
        for(let i = start ; i < end ; i++) {
          if(adjustedTableData.body[i]) {
            displayAdjustedTableData.push(adjustedTableData.body[i])
          }
        }
        adjustedTableData.body = displayAdjustedTableData
      }
      return adjustedTableData
    });

    const blob = computed(() => {
      if(tableData.value.body) {
        return URL.createObjectURL(new Blob([JSON.stringify(tableData.value, null, "  ")], {type: "application/json"}));
      }
    })
    // mounted
    onMounted(() => {
      GetData();
    });

    return {
      adjustedTableData,
      filteredHead,
      sortState,
      SortData,
      ToggleAllCheckbox,
      params,
      openFilterWindowId,
      filterContents,
      filterState,
      textSearchInput,
      SearchByText,
      blob,
      pagination,
      inputPageNumber,
      ChangePageByInput
    };
  },
});
</script>
