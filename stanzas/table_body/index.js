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
  thead.appendChild(tr);
  for(let i of order){
    let th = document.createElement("th");
    let label = dataset.head.vars[i];
    if (dataset.head.labels) label = dataset.head.labels[i];
    th.innerHTML = label;
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
