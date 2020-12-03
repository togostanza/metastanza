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

    let order = [];
    for (let i = 0;  i < data.head.order.length; i++) {
      if (parseInt(data.head.order[i]) >= 0) {
	order[parseInt(data.head.order[i])] = i;
      }
    }
    
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    for(let i of order){
      let th = document.createElement("th");
      th.innerHTML = data.head.labels[i];
      tr.appendChild(th);
    }
    for(let row of data.body){
      tr = document.createElement("tr");
      tbody.appendChild(tr);
      for(let j of order){
	let td = document.createElement("td");
	if (data.head.href[j]) {
	  let a = document.createElement("a");
	  a.setAttribute("href", row[data.head.href[j]].value);
	  a.innerHTML = row[data.head.vars[j]].value;
	  td.appendChild(a);
	} else {
	  td.innerHTML = row[data.head.vars[j]].value;
	}
	tr.appendChild(td);
      }
    }
  });
}
