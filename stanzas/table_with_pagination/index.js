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

function draw(dataset, stanza, element) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  element.appendChild(table);
  table.appendChild(thead);
  table.appendChild(tbody);

  let order = [];
  if (dataset.head.order) {
    for (let i = 0; i < dataset.head.order.length; i++) {
      if (parseInt(dataset.head.order[i]) >= 0) {
        order[parseInt(dataset.head.order[i])] = i;
      }
    }
  } else {
    order = [...Array(dataset.head.vars.length).keys()];
  }

  let tr = document.createElement("tr");
  tr.classList.add("table-fixed");
  thead.appendChild(tr);
  for (const i of order) {
    const th = document.createElement("th");
    const span_filter = document.createElement("span");
    const span_sort = document.createElement("span");
    let label = dataset.head.vars[i];
    if (dataset.head.labels) {
      label = dataset.head.labels[i];
    }
    th.innerHTML = label;
    // th.setAttribute("data-id", dataset.vars[i]);
    span_filter.classList.add("icon", "filter-icon");
    span_sort.setAttribute("data-type", label);
    span_sort.classList.add("icon", "sort-icon");
    span_sort.addEventListener('click', (e)=>{
      console.log(e.path[0].getAttribute('data-type'));
    })
    th.appendChild(span_filter);
    th.appendChild(span_sort);
    tr.appendChild(th);
  }

  for (const row of dataset.body) {
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    for (const j of order) {
      const td = document.createElement("td");
      if (dataset.head.href[j]) {
        const a = document.createElement("a");
        a.setAttribute("href", row[dataset.head.href[j]].value);
        a.innerHTML = row[dataset.head.vars[j]].value;
        td.appendChild(a);
      } else {
        td.innerHTML = row[dataset.head.vars[j]].value;
      }
      tr.appendChild(td);
    }
  }

  // クリックされたカラムがどのカラムかを取得し、ソートにおけるkeyを定義する
  var sort = stanza.select(".sort-icon");
  sort.addEventListener("click", function () {
    console.log("クリックされました1");
    var eventDOM = sort.target.parentNodes;
    console.log(eventDOM);
  });

  // // th要素にdata-id属性を設定し、データとカラムを紐づける
  // let element = document.getElementsByTagName("th")
  // element.dataset.name = dataset.vars[i];

  // bodyの配列内のオブジェクトを、id（クリックされたカラムのdata-id属性）のvalueを基準に並び替えたい
  console.log(dataset.body);
  const sortArray = dataset.body.sort((a,b) => a.id.value - b.id.value);
  console.log(sortArray);

  // console.log(dataset.head.vars);
  // const sortArray = dataset.head.vars.sort((a,b) => a.id - b.id);
  // console.log(sortArray);

// ここからsortのクリックイベント
  var sort = stanza.select(".sort-icon");
  sort.addEventListener("click", function () {
    console.log("クリックされました2");
  });
}

// document.getElementsByClassName("sort-icon").onclick = function(){
//   console.log("クリックされた");
// }
// document.getElementsByClassName("sort-icon").click (function(){
//   console.log("クリックされた");
// })

// var bb = document.getElementsByClassName("sort-icon");
// bb.onclick = function(){
//   console.log("ボタンが押されました");
// }

// window.onload = function(){
//   let bb = document.getElementsByClassName("sort-icon");
//   bb.addEventListener("click", function(){
//     console.log("ボタンが押されました。")
//   });
// };
