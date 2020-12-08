import metastanza from '@/lib/metastanza_utils.js';

export default async function tableBody(stanza, params) {

  stanza.render({
    template: 'stanza.html.hbs'
  });
  
  let formBody = [];
  for (let key in params) {
    if(params[key] && key != "table_data_api") formBody.push(key + "=" + encodeURIComponent(params[key]))
  }

  let api = params.table_data_api;
  let dataset = await metastanza.getFormatedJson(api, stanza.root.querySelector('#renderDiv'), formBody.join("&"));
  if (typeof dataset == "object") draw(dataset, stanza);
}
  
function draw(dataset, stanza) {
  let div = stanza.select("#renderDiv");
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");	
  div.appendChild(table);
  table.appendChild(thead);
  table.appendChild(tbody);
  
  let order = [];
  for (let i = 0;  i < dataset.head.order.length; i++) {
    if (parseInt(dataset.head.order[i]) >= 0) {
      order[parseInt(dataset.head.order[i])] = i;
    }
  }
  
  let tr = document.createElement("tr");
  thead.appendChild(tr);
  for(let i of order){
    let th = document.createElement("th");
    th.innerHTML = dataset.head.labels[i];
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
}
