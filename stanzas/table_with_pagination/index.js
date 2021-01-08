import metastanza from "@/lib/metastanza_utils.js";
import { span } from "vega";
import { filter } from "d3";
import { forEach } from "vega-lite/build/src/encoding";

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
  let dataHead = data.head;
  let dataBody = data.body;

  const searchBox = stanza.root.querySelector("#search_box");
  const prevButton = stanza.root.querySelector("#button_prev");
  const nextButton = stanza.root.querySelector("#button_next");
  const firstButton = stanza.root.querySelector("#button_first");
  const lastButton = stanza.root.querySelector("#button_last");
  const clickPageNumber = stanza.root.querySelectorAll(".clickPageNumber");

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
  console.log(order);

  // データの整形（オリジナルのデータ）
  let adjustedBody = [];
  dataBody.forEach(function (datam) {
    let obj = {};
    order.forEach(function (val) {
      let key = Object.keys(datam)[val];
      obj[key] = datam[key];
    })
    adjustedBody.push(obj);
  })
  console.log(adjustedBody);

  // テーブル表示用のデータ（表示中の内容とsync）
  let displayBody = adjustedBody;
  let tableKey = Object.keys(dataBody[0]); //th・tdに格納されるデータのキーを配列で取得してtableKeyに代入
  let columns_per_row = tableKey.length; //tableKeyで取得したキーの配列の数（＝列の数）を取得してcolumns_per_rowに代入

  const init = function () {
    changePage(1);
    clickPage();
    addEventListeners();
  };

  let addEventListeners = function () {
    searchBox.addEventListener("input", searchTable);
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);
    firstButton.addEventListener("click", firstPage);
    lastButton.addEventListener("click", lastPage);
  };

  // ページを描画する関数（adjustedBodyを描画）
  let drawPage = function () {
    //▼theadの描画
    let thead = stanza.root.querySelector("#theadID");
    thead.innerHTML = "";
    thead.innerHTML = "<tr id='theadRowID'></tr>";

    //▽trおよびthの描画
    // for (let i of order) {
    for (let l = 0; l < order.length; l++) {
      let i = order[l];
      let tr = stanza.root.querySelector("#theadRowID");

      // thを作成
      let th = document.createElement("th");
      let label = dataHead.vars[i];
      if (dataHead.labels) {
        label = dataHead.labels[i];
      }
      th.innerHTML = label;
      th.setAttribute('data-col', l);

      // ソートアイコンを作成
      let span_sort = document.createElement("span");
      span_sort.classList.add("icon", "sorticon", "button_sort");
      span_sort.setAttribute("data-type", dataHead.vars[i]);
      span_sort.setAttribute("data-col", l);
      span_sort.addEventListener("click", sortColumn)

      // フィルターアイコンを作成
      let span_filter = document.createElement("span");
      span_filter.setAttribute("id", "filtericon" + l);
      span_filter.classList.add("icon", "filtericon", "button_filter");
      span_filter.setAttribute("data-type", dataHead.vars[i]);
      span_filter.setAttribute("data-col", l);
      span_filter.addEventListener('click', displayFilter);

      // フィルターウィンドウを格納するulを作成
      let ul_filter = document.createElement("ul");
      ul_filter.classList.add("fiter-window", "-closed");
      ul_filter.setAttribute("data-type", dataHead.vars[i]);
      ul_filter.setAttribute("data-col", l);
      ul_filter.setAttribute("id", "filterul" + l);

      // チェックボックスを作成（「チェックボックス+ラベル」をリストに格納し、ulに格納）
      for (let j = 0; j < displayBody.length; j++) {
        let li = document.createElement("li");
        let input = document.createElement("input");
        input.setAttribute("id", "box" + j);
        input.setAttribute("data-col", l);
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", "items");
        input.setAttribute("value", dataBody[j][dataHead.vars[i]].value);
        input.addEventListener('click', filterColumn);
        let item_label = document.createElement("label");
        input.setAttribute("for", "box" + j);
        item_label.innerText = dataBody[j][dataHead.vars[i]].value;
        ul_filter.appendChild(li);
        li.appendChild(input);
        li.appendChild(item_label);
      }

      // appendする
      th.appendChild(span_sort);
      th.appendChild(span_filter);
      th.appendChild(ul_filter);
      tr.appendChild(th);

      // bodyの描画
      updateBody();
    }
  }

  let updateBody = function () {
    //▼tbodyの描画
    let tbody = stanza.root.querySelector("#tbodyID");
    tbody.innerHTML = "";

    // //▽trおよびtdの描画
    for (let i = (current_page - 1) * records_per_page; i < current_page * records_per_page && i < dataBody.length; i++) {
      let tr = document.createElement("tr");
      for (let j of order) {
        let td = document.createElement("td");
        if (dataHead.href[j]) {
          let a = document.createElement("a");
          a.setAttribute("href", dataBody[i][dataHead.href[j]].value);
          a.innerHTML = displayBody[i][dataHead.vars[j]].value;
          td.appendChild(a);
        } else {
          td.innerHTML = displayBody[i][dataHead.vars[j]].value;
        }
        tbody.appendChild(tr);
        tr.appendChild(td);
      }
    }
  }

  // ページを変更する関数
  let changePage = function (page) {
    current_page = page;
    drawPage();
    //表示中のページ数を表示 
    let page_number = stanza.root.querySelectorAll(".clickPageNumber");
    for (let i = 0; i < page_number.length; i++) {
      if (i == current_page - 1) {
        page_number[i].style.opacity = "1.0";
      } else {
        page_number[i].style.opacity = "0.5";
      }
    }

    // 表示中のデータ数を表示
    const showing_records_number = stanza.root.querySelector("#showing_records_number");
    let firstrecord_per_page = (current_page - 1) * records_per_page + 1;
    let lastrecord_per_page = current_page * records_per_page;
    if (total_records == records_per_page * numPages()) {
      lastrecord_per_page = current_page * records_per_page;
    } else {
      lastrecord_per_page =
        (current_page - 1) * records_per_page + (total_records % records_per_page);
    }
    showing_records_number.innerHTML = "<p>Showing" + firstrecord_per_page + "to" + lastrecord_per_page + "of" + total_records + "entres</p>";
  };

  // カラムをソートする関数
  let sortColumn = function (e) {
    let page = current_page;
    let tbody = stanza.root.querySelector("#tbodyID");
    let span_sorts = stanza.root.querySelectorAll(".button_sort");
    let span_sort = e.path[0];
    console.log(span_sort.className);
    
    let order = "";
    
    // 初期値はasc, クリックされたタグのクラス名を判断して変更する
    if (span_sort.className.indexOf("sorticon-asc") !== -1) {
      order = "des";
    } else {
      order = "asc";
    }

   // // 他のカラムにおけるソートアイコンのクラスをリセット
    for (let i = 0, l = span_sorts.length; l > i; i++) {
      let span_sort = span_sorts[i];
      span_sort.className = "icon sorticon button_sort";
    }

    span_sort.className = `icon sorticon-${order} button_sort`;
    const key = e.path[0].getAttribute("data-type");

    switch (order) {
      case 'des':
        displayBody = adjustedBody.sort((a, b) =>
          a[key].value.toLowerCase() < b[key].value.toLowerCase() ? -1 : 1
        );
        break;
      case 'asc':
        displayBody = adjustedBody.sort((b, a) =>
          a[key].value.toLowerCase() < b[key].value.toLowerCase() ? -1 : 1
        );
        break;
    }

    console.log(displayBody);
    updateBody();
  };

  // フィルターのチェックボックスウィンドウを出現させる関数
  let displayFilter = function (e) {
    let colNum = e.target.getAttribute('data-col')
    let ul_filter = stanza.root.querySelector("#filterul" + colNum);
    ul_filter.className = "filter-window -opened";

    stanza.root.addEventListener("click", function (evt) {
      let targetElement = evt.target; // clicked element
      let span_filter = stanza.root.querySelector("#filtericon" + colNum);
      do {
        if (targetElement == ul_filter || targetElement == span_filter) {
          console.log("Clicked inside");
          return;
        }
        // Go up the DOM
        targetElement = targetElement.parentNode;
      } while (targetElement);
      console.log("clicked outside");
      ul_filter.className = "filter-window -closed";
    });

  }

  // チェックボックスの入力に応じてカラムをフィルターする関数
  let filterColumn = function (e) {
    let filter = e.target.value.toUpperCase();
    let colNum = e.target.getAttribute("data-col");
    let table = stanza.root.querySelector("#listingTable");
    let tr = table.querySelectorAll("tr");

    if (e.target.checked) {
      console.log("チェックされました");
      for (let i = 0; i < tr.length; i++) {
        let td = tr[i].querySelectorAll("td")[colNum];
        if (td) {
          if (td.innerText.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }

  // テーブル全体をフィルターする検索ボックスの関数
  let searchTable = function (e) {
    let searchbox = stanza.root.querySelector("#search_box");
    let filter = searchbox.value.toUpperCase();
    console.log(filter);
    let table = stanza.root.querySelector("#listingTable");
    let tr = table.querySelectorAll("tr");

    for (var i = 0; i < tr.length; i++) {
      let td = tr[i].querySelectorAll("td")[0];

      if (td) {
        if (td.innerText.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  // 以下ページ遷移の関数
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

  let clickPage = function () {
    let pageNumber = stanza.root.querySelector("#page_number");
    pageNumber.addEventListener("click", function (e) {
      if (
        e &&
        e.target.nodeName == "SPAN" &&
        e.target.classList.contains("clickPageNumber")
      ) {
        current_page = e.target.textContent;
        changePage(current_page);
      }
    });
    pageNumber.innerHTML = "";
    for (let i = 1; i < numPages() + 1; i++) {
      pageNumber.innerHTML +=
        "<span class='clickPageNumber'>" + i + "</span>";
    }
  };

  let numPages = function () {
    return Math.ceil(dataBody.length / records_per_page);
  };

  init();

}
