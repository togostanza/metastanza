import metastanza from '@/lib/metastanza_utils.js';
import { span } from 'vega';

export default async function tableWithPagination(stanza, params) {

  stanza.render({
    template: 'stanza.html.hbs'
  });

  let formBody = [];
  for (let key in params) {
    if(params[key] && key != "table_data_api") formBody.push(key + "=" + encodeURIComponent(params[key]))
  }

  let api = params.table_data_api;
  let element = stanza.root.querySelector('#renderDiv');
  let dataset = await metastanza.getFormatedJson(api, element, formBody.join("&"));
  if (typeof dataset == "object") draw(dataset, stanza, element);
}

function draw(dataset, stanza, element) {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  element.appendChild(table);
  table.appendChild(thead);
  table.appendChild(tbody);

  let order = [];
  if (dataset.head.order) {
    for (let i = 0;  i < dataset.head.order.length; i++) {
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
  for(let i of order){
    let th = document.createElement("th");
    let span_filter = document.createElement("span");
    let span_sort = document.createElement("span");
    let label = dataset.head.vars[i];
    if (dataset.head.labels) label = dataset.head.labels[i];
    th.innerHTML = label;
    span_filter.classList.add("icon", "filter-icon");
    span_sort.setAttribute("data-type", label );
    span_sort.classList.add("icon", "sort-icon");
    th.appendChild(span_filter);
    th.appendChild(span_sort);
    tr.appendChild(th);
  }

  for(let row of dataset.body){
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    for(let j of order){
      let td = document.createElement("td");
      if (dataset.head.href[j]) {
        let a = document.createElement("a");
        a.setAttribute("href", row[dataset.head.href[j]].value);
        a.innerHTML = row[dataset.head.vars[j]].value;
        td.appendChild(a);
      } else {
        td.innerHTML = row[dataset.head.vars[j]].value;
      }
      tr.appendChild(td);
    }
  }

  var sort = stanza.select(".sort-icon");
  sort.addEventListener("click", function () {
    console.log("クリックされました");
  });
    // bb.onclick = function(){
    //   alert("ボタンが押されました。")
    // }
  // setTimeout(function(){
  //   const hoge = document.getElementById('sort-icon-id3');
  //   if(hoge){
  //     hoge.addEventListener("click", function () {
  //       console.log("クリックされました");
  //     });
  //   }
  // },5000)
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



