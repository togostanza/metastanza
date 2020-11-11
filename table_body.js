import { d as defineStanzaElement } from './stanza-element-d1cc4290.js';

function tableBody(stanza, params) {
    let formBody = [];
    for (let key in params) {
	if(params[key] && key != "table_data_api") formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
    let options = {
	method: "POST",
	mode:  "cors",
	body: formBody.join("&"),
	headers: {
	    "Accept": "application/json",	    
	    'Content-Type': 'application/x-www-form-urlencoded'
	}
    };
    console.log(params);
    console.log(options.body);
    let url = params.table_data_api;
    let q = fetch(url, options).then(res => res.json());
    q.then(function(data){
        stanza.render({
            template: "stanza.html.hbs"
        });
        let div = stanza.select("#renderDiv");
	let table = document.createElement("table");
	let thead = document.createElement("thead");
	let tbody = document.createElement("tbody");	
	div.appendChild(table);
	table.appendChild(thead);
	table.appendChild(tbody);
	
	let tr = document.createElement("tr");
	thead.appendChild(tr);
	for(let i in data.head.vars){
	    let th = document.createElement("th");
	    th.innerHTML = data.head.vars[i];
	    tr.appendChild(th);
        }
        for(let i in data.results.bindings){
	    tr = document.createElement("tr");
	    tbody.appendChild(tr);
	    for(let j in data.head.vars){
		let td = document.createElement("td");
		td.innerHTML = data.results.bindings[i][data.head.vars[j]].value;
		tr.appendChild(td);
            }
	}
    });
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
		"stanza:example": "https://sparql-support.dbcls.jp/rest/api/protein_list",
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
		"stanza:example": "dataset='DS801_1'",
		"stanza:description": "parameters for table data api",
		"stanza:required": false
	}
],
	"stanza:usage": "<togostanza-table_body></togostanza-table_body>",
	"stanza:type": "Stanza",
	"stanza:display": "",
	"stanza:provider": "provider of this stanza",
	"stanza:license": "",
	"stanza:author": "author name",
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
