export default function tableBody(stanza, params) {
    let formBody = []
    for (let key in params) {
	if(params[key] && key != "table_data_api") formBody.push(key + "=" + encodeURIComponent(params[key]))
    }
    let options = {
	method: "POST",
	mode:  "cors",
	body: formBody.join("&"),
	headers: {
	    "Accept": "application/json",	    
	    'Content-Type': 'application/x-www-form-urlencoded'
	}
    }
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
