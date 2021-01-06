import metastanza from "@/lib/metastanza_utils.js";

export default async function tableWithPagination(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
  });

  const formBody = [];
  for (const key in params) {
    if (params[key] && key !== "table_data_api") {
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }

  const api = params.table_data_api;
  const element = stanza.root.querySelector("#renderDiv");
  const dataset = await metastanza.getFormatedJson(
    api,
    element,
    formBody.join("&")
  );
  if (typeof dataset === "object") {
    draw(dataset, stanza, element);
  }
}

function draw(data, stanza, element) {
  // responce.json()で受け取った中身を確認
  // 実際にはここでdataの中身を利用して様々な処理をする
  let dataHead = data.head;
  let dataBody = data.body;

  function Pagination() {
    const prevButton = stanza.root.querySelector("#button_prev");
    const nextButton = stanza.root.querySelector("#button_next");
    const firstButton = stanza.root.querySelector("#button_first");
    const lastButton = stanza.root.querySelector("#button_last");
    const clickPageNumber = stanza.root.querySelectorAll(".clickPageNumber");
    const filterButton = stanza.root.querySelector("#mylist");

    let current_page = 1;
    let records_per_page = 5;
    let total_records = dataBody.length;

    //orderを定義（負の値があったときは排除して新たに定義し、それ以外の場合はカラムの数だけorderを定義する）
    let order = [];
    if (dataHead.order) {
      for (let i = 0; i < dataHead.order.length; i++) {
        if (parseInt(dataHead.order[i]) >= 0) {
          order[parseInt(dataHead.order[i])] = i;
        }
      }
    } else {
      order = [...Array(dataHead.vars.length).keys()];
    }

    let tableKey = Object.keys(dataBody[0]); //th・tdに格納されるデータのキーを配列で取得してtableKeyに代入
    let columns_per_row = tableKey.length; //tableKeyで取得したキーの配列の数（＝列の数）を取得してcolumns_per_rowに代入

    this.init = function () {
      changePage(1);
      pageNumbers();
      selectedPage();
      clickPage();
      addEventListeners();
      // filterColumn();
    };

    let addEventListeners = function () {
      prevButton.addEventListener("click", prevPage);
      nextButton.addEventListener("click", nextPage);
      firstButton.addEventListener("click", firstPage);
      lastButton.addEventListener("click", lastPage);
      filterButton.addEventListener("change", filterColumn);
    };

    let selectedPage = function () {
      let page_number = stanza.root.querySelectorAll(".clickPageNumber");
      for (let i = 0; i < page_number.length; i++) {
        if (i == current_page - 1) {
          page_number[i].style.opacity = "1.0";
        } else {
          page_number[i].style.opacity = "0.5";
        }
      }
    };

    let checkButtonOpacity = function () {
      current_page == 1
        ? prevButton.classList.add("opacity")
        : prevButton.classList.remove("opacity");
      current_page == numPages()
        ? nextButton.classList.add("opacity")
        : nextButton.classList.remove("opacity");
    };

    let showingRecordsNumber = function (page) {
      const showing_records_number = stanza.root.querySelector(
        "#showing_records_number"
      );

      let firstrecord_per_page = (page - 1) * records_per_page + 1;
      let lastrecord_per_page = page * records_per_page;

      if (total_records == records_per_page * numPages()) {
        lastrecord_per_page = page * records_per_page;
      } else {
        lastrecord_per_page =
          (page - 1) * records_per_page + (total_records % records_per_page);
      }
      showing_records_number.innerHTML =
        "<p>Showing" +
        firstrecord_per_page +
        "to" +
        lastrecord_per_page +
        "of" +
        total_records +
        "entres</p>";
    };

    let changePage = function (page) {
      if (page < 1) {
        page = 1;
      }
      if (page > numPages() - 1) {
        page = numPages();
      }

      //▼theadの描画
      let thead = stanza.root.querySelector("#theadID");
      thead.innerHTML = "";
      thead.innerHTML = "<tr id='theadRowID'></tr>";
      //▽trおよびthの描画
      for (let i of order) {
        let tr = stanza.root.querySelector("#theadRowID");
        let th = document.createElement("th");
        let span_filter = document.createElement("span");
        let span_sort = document.createElement("span");
        let label = dataHead.vars[i];
        if (dataHead.labels) {
          label = dataHead.labels[i];
        }
        th.innerHTML = label;
        let select = document.createElement("select");
        console.log(select);
        select.classList.add("form-control");
        let moji = "mylist";
        select.setAttribute("id", moji+i);
        let option = document.createElement("option")
        select.appendChild(option);
        for(let j=0; j< dataBody.length; j++){
          select.classList.add("form-control");
          let moji = "mylist";
          select.setAttribute("id", moji+i);
          let option = document.createElement("option")
          option.innerText = dataBody[j][dataHead.vars[i]].value;
          select.appendChild(option);
        }
        span_filter.classList.add("icon", "filtericon");
        span_sort.setAttribute("data-type", dataHead.vars[i]);
        span_sort.classList.add("icon", "sorticon", "button_sort");
        span_sort.addEventListener("click", sortColumn)
        th.appendChild(select);
        th.appendChild(span_filter);
        th.appendChild(span_sort);
        tr.appendChild(th);
      }


      //▼tbodyの描画
      let tbody = stanza.root.querySelector("#tbodyID");
      tbody.innerHTML = "";

      // //▽trおよびtdの描画
      for (
        var i = (page - 1) * records_per_page;
        i < page * records_per_page && i < dataBody.length;
        i++
      ) {
        let tr = document.createElement("tr");
        for (let j of order) {
          let td = document.createElement("td");
          // let tdValue = Object.values(dataBody[i]);
          if (dataHead.href[j]) {
            let a = document.createElement("a");
            a.setAttribute("href", dataBody[i][dataHead.href[j]].value);
            a.innerHTML = dataBody[i][dataHead.vars[j]].value;
            td.appendChild(a);
          } else {
            td.innerHTML = dataBody[i][dataHead.vars[j]].value;
          }
          tbody.appendChild(tr);
          tr.appendChild(td);
          // tdの値を使ってフィルターのドロップダウンに表示させる値を設定する
        }
      }

      checkButtonOpacity();
      selectedPage();
      showingRecordsNumber(current_page);
    };

    let sortColumn = function (e) {
      let page = current_page;
      let tbody = stanza.root.querySelector("#tbodyID");
      // let span_sort = document.getElementsByClassName('button_sort');
      let span_sorts = stanza.root.querySelectorAll(".button_sort");
      let span_sort = e.path[0];
      let offsetY = e.offsetY; // =>要素左上からのy座標
      // 他のカラムにおけるソートアイコンのクラスをリセット
      for (var i = 0, l = span_sorts.length; l > i; i++) {
        let span_sort = span_sorts[i];
        span_sort.className = "icon sorticon button_sort";
      }
      if (offsetY >= 8) {
        // クリックしたカラムにおけるソートアイコンのクラスを適用
        span_sort.className = "icon sorticon-asc button_sort";

        const key = e.path[0].getAttribute("data-type");
        const sortArray = dataBody.sort((a, b) =>
          a[key].value.toLowerCase() < b[key].value.toLowerCase() ? -1 : 1
        );
        tbody.innerHTML = "";
        for (
          var i = (page - 1) * records_per_page;
          i < page * records_per_page && i < sortArray.length;
          i++
        ) {
          let tr = document.createElement("tr");
          for (let j of order) {
            let td = document.createElement("td");
            // let tdValue = Object.values(dataBody[i]);
            if (dataHead.href[j]) {
              let a = document.createElement("a");
              a.setAttribute("href", sortArray[i][dataHead.href[j]].value);
              a.innerHTML = sortArray[i][dataHead.vars[j]].value;
              td.appendChild(a);
            } else {
              td.innerHTML = sortArray[i][dataHead.vars[j]].value;
            }
            tbody.appendChild(tr);
            tr.appendChild(td);
          }
        }
      } else {
        span_sort.className = "icon sorticon-des button_sort";
        const key = e.path[0].getAttribute("data-type");
        const sortArray = dataBody.sort((a, b) =>
          b[key].value.toLowerCase() < a[key].value.toLowerCase() ? -1 : 1
        );
        tbody.innerHTML = "";
        for (
          var i = (page - 1) * records_per_page;
          i < page * records_per_page && i < sortArray.length;
          i++
        ) {
          let tr = document.createElement("tr");
          for (let j of order) {
            let td = document.createElement("td");
            // let tdValue = Object.values(dataBody[i]);
            if (dataHead.href[j]) {
              let a = document.createElement("a");
              a.setAttribute("href", sortArray[i][dataHead.href[j]].value);
              a.innerHTML = sortArray[i][dataHead.vars[j]].value;
              td.appendChild(a);
            } else {
              td.innerHTML = sortArray[i][dataHead.vars[j]].value;
            }
            tbody.appendChild(tr);
            tr.appendChild(td);
          }
        }
      }
    };

    let filterColumn = function() {
      var input = stanza.root.querySelector("#mylist");
      console.log(input);
      console.log(input.value);
      var filter = input.value.toUpperCase();
      var table = stanza.root.querySelector("#listingTable");
      var tr = table.querySelectorAll("tr");
      console.log(tr);
      for (var i = 0; i < tr.length; i++) {
        var td = tr[i].querySelectorAll("td")[0];
        console.log(td);
        if (td) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }       
      }
    }

    let prevPage = function () {
      if (current_page > 1) {
        current_page--;
        changePage(current_page);
      }
    };

    let nextPage = function () {
      if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
      }
    };

    let firstPage = function () {
      if (current_page != 1) {
        current_page = 1;
        changePage(current_page);
      }
    };

    let lastPage = function () {
      if (current_page != numPages()) {
        current_page = numPages();
        changePage(current_page);
      }
    };

    let clickPage = function (e) {
      if (
        e &&
        e.target.nodeName == "SPAN" &&
        e.target.classList.contains("clickPageNumber")
      ) {
        current_page = e.target.textContent;
        changePage(current_page);
      }
    };

    let pageNumbers = function () {
      let pageNumber = stanza.root.querySelector("#page_number");
      pageNumber.addEventListener("click", clickPage);
      pageNumber.innerHTML = "";

      for (let i = 1; i < numPages() + 1; i++) {
        pageNumber.innerHTML +=
          "<span class='clickPageNumber'>" + i + "</span>";
      }
    };

    let numPages = function () {
      return Math.ceil(dataBody.length / records_per_page);
    };
  }
  let pagination = new Pagination();
  pagination.init();

}
