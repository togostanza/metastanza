import metastanza from '@/lib/metastanza_utils.js';

export default async function tableWithScroll(stanza, params) {
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
    let tableWrapper = document.createElement("div");
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    table.classList.add('sticky-table');
    tableWrapper.classList.add('sticky-table-wrapper');
    element.appendChild(tableWrapper);
    tableWrapper.appendChild(table);
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

    var drawBody = function(data) {
      for(let row of data){
        tr = document.createElement("tr");
        tr.classList.add("table-fixed");
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
    };

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
      span_filter.classList.add("icon", "filtericon");
      span_sort.setAttribute("data-type", dataset.head.vars[i] );
      span_sort.classList.add("icon", "sorticon");
      span_sort.addEventListener('click', (e)=>{
        let offsetX = e.offsetX; // =>要素左上からのx座標
        let offsetY = e.offsetY; // =>要素左上からのy座標
        if(offsetY >= 8){
          span_sort.className = "icon sorticon-asc"
          console.log(e.path[0].getAttribute('data-type'));
          const key = e.path[0].getAttribute('data-type');
          const sortArray = dataset.body.sort((a,b) => a[key].value.toLowerCase() < b[key].value.toLowerCase() ? -1 : 1);
          stanza.root.querySelector("tbody").remove();
          let tbody = document.createElement("tbody");
          // drawBody(sortArray);
          for(let row of sortArray){
            tr = document.createElement("tr");
            tr.classList.add("table-fixed");
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
        stanza.root.querySelector("table").appendChild(tbody);
        }else{
          span_sort.className = "icon sorticon-des"
          console.log(e.path[0].getAttribute('data-type'));
          const key = e.path[0].getAttribute('data-type');
          const sortArray = dataset.body.sort((a,b) => b[key].value.toLowerCase() < a[key].value.toLowerCase() ? -1 : 1);
          stanza.root.querySelector("tbody").remove();
          let tbody = document.createElement("tbody");
          // drawBody(sortArray);
          for(let row of sortArray){
            tr = document.createElement("tr");
            tr.classList.add("table-fixed");
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
          stanza.root.querySelector("table").appendChild(tbody);
        }
      })
      th.appendChild(span_filter);
      th.appendChild(span_sort);
      tr.appendChild(th);
    }
    drawBody(dataset.body);
  }
