import { d as defineStanzaElement } from './stanza-element-d1cc4290.js';
import './timer-be811b16.js';
import { m as metastanza } from './metastanza_utils-3e754189.js';

async function tableBody(stanza, params) {

  stanza.render({
    template: 'stanza.html.hbs'
  });
  
  let formBody = [];
  for (let key in params) {
    if(params[key] && key != "table_data_api") formBody.push(key + "=" + encodeURIComponent(params[key]));
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

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "table_body",
	"stanza:label": "table body for pagination",
	"stanza:definition": "Greeting.",
	"stanza:parameter": [
	{
		"stanza:key": "table_data_api",
		"stanza:example": "https://sparql-support.dbcls.jp/rest/api/metastanza_table_example",
		"stanza:description": "table data api",
		"stanza:required": true
	},
	{
		"stanza:key": "limit",
		"stanza:example": "10",
		"stanza:description": "table page size",
		"stanza:required": true
	},
	{
		"stanza:key": "offset",
		"stanza:example": "0",
		"stanza:description": "page numbere",
		"stanza:required": true
	},
	{
		"stanza:key": "params",
		"stanza:example": "taxonomy='9606'",
		"stanza:description": "parameters for table data api",
		"stanza:required": false
	}
],
	"stanza:usage": "<togostanza-table_body></togostanza-table_body>",
	"stanza:type": "Metastanza",
	"stanza:display": "",
	"stanza:provider": "provider of this stanza",
	"stanza:license": "MIT",
	"stanza:author": "Togostanza",
	"stanza:address": "name@example.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-05-27",
	"stanza:updated": "2020-05-27"
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<style>\n  table {\n      width: 100%;\n  }\n  td {\n      padding: 5px 20px 5px 20px;;\n  }\n  th {\n      border-bottom: solid 2px #000000;\n  }\n</style>\n\n<div id=\"renderDiv\"></div>\n";
},"useData":true}]
];

var css = "";

defineStanzaElement(tableBody, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=table_body.js.map
