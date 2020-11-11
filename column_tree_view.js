import { d as defineStanzaElement } from './stanza-element-d1cc4290.js';

function columnTreeView(stanza, params) {

    let fetchReq = (query, callback, depth) => {
        let options = {
	    method: 'post',
	    mode: 'cors',
	    headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
	    body: 'query=' + encodeURIComponent(query)
	};
        // set timeout of fetch
        let fetch_timeout = function(ms, promise) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    reject(new Error("timeout"));
                }, ms);
                promise.then(resolve, reject);
            })
        };
        try{
            fetch_timeout(120000, fetch(params.endpoint, options)).then(res=>{
                if(res.ok) return res.json()
                else return false;
            }).then(function(json){callback(json, depth);});
        }catch(error){
            console.log(error);
        }
    };

    let sparqlQuery = {
	graph: params.graph || "",
	subclass: params.subclass || "http://www.w3.org/2000/01/rdf-schema#subClassOf", 
	label: params.label || "http://www.w3.org/2000/01/rdf-schema#label"
    };
    if(sparqlQuery.graph) sparqlQuery.graph = " FROM <" + sparqlQuery.graph + ">";
    if(sparqlQuery.subclass.match(/[^\s]\s+[^\s]/)){
	let list = [];
	for(let p of sparqlQuery.subclass.split(/\s+/)){
	    if(p.match(/^http/)) list.push("<" + p + ">");
	}
	sparqlQuery.subclass = "(" + list.join("|") + ")";
    }else {
	sparqlQuery.subclass = "<" + sparqlQuery.subclass + ">";
    }
    
    let firstQuery = "SELECT DISTINCT ?label (SAMPLE (?leafs) AS ?leaf)" + sparqlQuery.graph + " WHERE { <" + params.root + "> <" + sparqlQuery.label + "> ?label . OPTIONAL {?leafs " + sparqlQuery.subclass + " ?root . } }";
    
    let makeQuery = (uri) => {
	return "SELECT DISTINCT ?parent ?child ?label (SAMPLE (?leafs) AS ?leaf)" + sparqlQuery.graph + " WHERE { VALUES ?parent { <" + uri + "> } ?child " + sparqlQuery.subclass + " ?parent . ?child <" + sparqlQuery.label + "> ?label . OPTIONAL {?leafs " + sparqlQuery.subclass + " ?child . } } ORDER BY ?label";
    };

    let searchQueryByBifContains = (string) => {
	let words = string.split(/[^\w]+/);
	let query = "PREFIX bif: <bif:> SELECT DISTINCT ?child ?label_0" + sparqlQuery.graph + " WHERE { VALUES ?root { <" + params.root + "> } ?child " + sparqlQuery.subclass + "* ?root .";
	let i = 0;
	for(let word of words){
	    if(word.match(/\w{4}/)){
		query += " ?child <" + sparqlQuery.label + "> ?label_" + i + " .";
		if(params.search == "2")  query += " ?label_" + i + ' bif:contains "' + word + '" .';
		else if(params.search == "3") query += " ?label_" + i + ' bif:contains "\'' + word + '*\'" .';
		else query += " FILTER( REGEX( ?label_" + i + ", '" + word + "', 'i'))"; // default
		i++;
	    }
	}
	query += " } ORDER BY ?label";
	return query;
    };

    let getParentsQuery = (uri) => {
	return "SELECT DISTINCT ?parent" + sparqlQuery.graph + " WHERE { <" + uri + "> " + sparqlQuery.subclass + "* ?parent . }";
    };

    let cacheData = {};
    let renderHash = false;
    let max = 0;

    let appendElement = (tag, parent) => {
	let element = document.createElement(tag);
	parent.appendChild(element);
	return element;
    };
    
    let renderColumn = (json, depth) => {
	// remove over depth columns
	if(json.results.bindings[0].parent && !cacheData[json.results.bindings[0].parent.value]) cacheData[json.results.bindings[0].parent.value] = json;
	let div = stanza.select("#renderDiv");
	for(let i = depth; i <= max; i++){
	    stanza.root.getElementById("column_" + i).remove();
	}
	max = depth;
	// render new column
	let column = appendElement("div", div);
	let ul = appendElement("ul", column);
	column.classList.add("column");
	column.setAttribute("id", "column_" + depth);
	for(let node of json.results.bindings){
	    let li = appendElement("li", ul);
	    let label_inline_div = appendElement("div", li);
	    let label_div = appendElement("div", label_inline_div);
	    label_div.classList.add("label");
	    label_div.innerHTML = node.label.value;
	    label_inline_div.classList.add("label_inline");
	    if(node.leaf) li.classList.add("clickable");
	    else li.classList.add("clickable_sp");
	    li.onclick = function(){
		for(let child of this.parentNode.childNodes){
		    child.classList.remove("selected");
		}
		this.classList.add("selected");
		stanza.select("#dataInfo").innerHTML = node.label.value + "<br>" + node.child.value;
		if(node.leaf){
		    if(cacheData[node.child.value]) renderColumn(cacheData[node.child.value], depth + 1);
		    else fetchReq(makeQuery(node.child.value), renderColumn, depth + 1);
		}
	    };
	    if(renderHash && renderHash[node.child.value]) li.classList.add("selected");
	}
	column.scrollIntoView();
	if(renderHash) renderNextFromSearch(json, depth + 1);
    };
    
    let renderFirst = (json, depth) => {
	stanza.render({
	    template: "stanza.html.hbs"
	});
	// render first column
	let column = appendElement("div", stanza.select("#renderDiv"));
	let ul = appendElement("ul", column);
	let li = appendElement("li", ul);
	let label_inline_div = appendElement("div", li);
	let label_div = appendElement("div", label_inline_div);
	column.classList.add("column");
	column.setAttribute("id", "column_" + depth);
	label_div.classList.add("label");
	label_div.innerHTML = json.results.bindings[0].label.value;
	label_inline_div.classList.add("label_inline");
	li.appendChild(label_inline_div);
	if(json.results.bindings[0].leaf){
	    li.classList.add("clickable");
	    li.onclick = function(){
		this.classList.add("selected");
		stanza.select("#dataInfo").innerHTML = json.results.bindings[0].label.value + "<br>" + params.root;
		fetchReq(makeQuery(params.root), renderColumn, depth + 1);
	    };
	}
	// add search action
	stanza.select("#pulldown").style.top = stanza.select("#label_keywords").offsetTop + 22 + "px";
	stanza.select("#pulldown").style.left = stanza.select("#label_keywords").offsetLeft + "px";
	stanza.select("#word_search").onclick = function(){ startSearch(); };
	stanza.select("#label_keywords").onkeydown = function(e){ if(e.key == "Enter") startSearch(); };
    };

    let renderStartFromSearch = (json) => {
	renderHash = {};
	for(let node of json.results.bindings){
	    renderHash[node.parent.value] = true;
	}
	if(cacheData[params.root]) renderNextFromSearch(cacheData[params.root], 1);
	else fetchReq(makeQuery(params.root), renderColumn, 1);
    };

    let renderNextFromSearch = (json, depth) => {
	let flag = true;
	for(let node of json.results.bindings){
	    if(renderHash[node.child.value] && node.leaf){
		flag = false;
		if(cacheData[node.child.value]) renderColumn(cacheData[node.child.value], depth);
		else fetchReq(makeQuery(node.child.value), renderColumn, depth);
		break;
	    }
	}
	if(flag){
	    renderHash = false;
	}
    };
    
    let renderSearchResult = (json, ) => {
	clearInterval(searchingTimer);
	stanza.select("#label_keywords").value = searchString;
	searchString = false;
	stanza.select("#pulldown").innerHTML = "";
	let ul = appendElement("ul", stanza.select("#pulldown"));
	if(json.results.bindings[0]){
	    for(let res of json.results.bindings){
		let li = appendElement("li", ul);
		li.innerHTML = res.label_0.value;
		li.onclick = function(){
		    stanza.select("#label_keywords").value = res.label_0.value;
		    stanza.select("#pulldown").style.display = "none";
		    stanza.select("#dataInfo").innerHTML = res.label_0.value + "<br>" + res.child.value;
		    fetchReq(getParentsQuery(res.child.value), renderStartFromSearch, false);
		};
		li.onmouseover = function(){ this.style.backgroundColor = "#cccccc"; };
		li.onmouseout = function(){ this.style.backgroundColor = ""; };
	    }
	}else {
	    let li = appendElement("li", ul);
	    li.innerHTML = "no hit";
	    li.onclick = function(){ stanza.select("#pulldown").style.display = "none"; };
		
	}
	stanza.select("#pulldown").style.display = "block";
    };

    let searchingTimer;
    let searchingIndex = 0;
    let searchString = false;
    let searching = () => {
	searchingIndex = (searchingIndex + 1) % 2;
	if(searchingIndex) stanza.select("#label_keywords").value = searchString + " ...";
	else stanza.select("#label_keywords").value = searchString;
    };

    let startSearch = () => {
	let string = stanza.select("#label_keywords").value;
	if(string.match(/\w{3}/) && !searchString){
	    stanza.select("#pulldown").style.display = "none";
	    searchString = string;
	    searchingTimer = setInterval(searching, 500);
	    fetchReq(searchQueryByBifContains(string), renderSearchResult, false);
	}
    };
    
    fetchReq(firstQuery, renderFirst, 0);
	
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "column_tree_view",
	"stanza:label": "Column tree view",
	"stanza:definition": "Column viewer metastanza for tree and DAG structures.",
	"stanza:parameter": [
	{
		"stanza:key": "endpoint",
		"stanza:example": "https://integbio.jp/rdf/sparql",
		"stanza:description": "endpoint",
		"stanza:required": true
	},
	{
		"stanza:key": "root",
		"stanza:example": "http://identifiers.org/taxonomy/131567",
		"stanza:description": "root node",
		"stanza:required": true
	},
	{
		"stanza:key": "graph",
		"stanza:example": "http://integbio.jp/rdf/ontology/taxonomy",
		"stanza:description": "target graph",
		"stanza:required": false
	},
	{
		"stanza:key": "subclass",
		"stanza:example": "",
		"stanza:description": "target subclass predicate (default: rdfs:subClassOf)",
		"stanza:required": false
	},
	{
		"stanza:key": "label",
		"stanza:example": "",
		"stanza:description": "target label predicate (default: rdfs:label)",
		"stanza:required": false
	},
	{
		"stanza:key": "search",
		"stanza:example": "1",
		"stanza:description": "search method. 1: regex (default), 2: bif:contains(exact), 3: bif:contains(partial).",
		"stanza:required": false
	}
],
	"stanza:style": [
	{
		"stanza:key": "--clickable-color",
		"stanza:type": "color",
		"stanza:default": "#0f6385",
		"stanza:description": "clickable color"
	}
],
	"stanza:usage": "<togostanza-column_tree_view endpoint='https://integbio.jp/rdf/sparql' root='http://identifiers.org/taxonomy/131567'></togostanza-column_tree_view>",
	"stanza:type": "MetaStanza",
	"stanza:display": "",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "TogoStanza",
	"stanza:address": "admin@biohackathon.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-07-21",
	"stanza:updated": "2020-07-21"
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<style>\n  div#renderDiv{\n      overflow-x: auto;\n      white-space: nowrap;\n      border: solid 3px #888888;\n  }\n  div.column {\n      min-width: 300px;\n      max-width: 300px;\n      max-height: 300px;\n      min-height: 300px;\n      display: inline-flex;\n      overflow-y: auto;\n      border: solid 1px #888888;\n      margin-right: -1px;\n  }\n  div.column ul {\n      width: 300px;\n      padding: 0px;\n      margin: 0px;\n  }\n  div.column li {\n      max-width: 300px;\n      padding: 5px 10px 5px 10px;\n      margin: 0px;\n  }\n  li div.label_inline {\n      width: 260px;\n      margin: 0px;\n      padding: 0px;\n      display: inline-block;\n  }\n  li div.label {\n      width: 260px;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      margin: 0px;\n      padding: 0px;\n      display: block;\n  }\n  li.clickable {\n      color: var(--clickable-color);\n      cursor: pointer;\n  }\n  li.clickable_sp {\n      cursor: pointer;\n  }\n  li.clickable::after{\n      content: '';\n      width: 7px;\n      height: 7px;\n      border: 0px;\n      border-top: solid 2px var(--clickable-color);\n      border-right: solid 2px var(--clickable-color);\n      transform: rotate(45deg);\n      position: relative;\n      top: 4px;\n      float: right;\n}\n  li.selected {\n      background-color: #dddddd;\n  }\n  div#header {\n      text-align: right;\n      margin-bottom: 10px;\n  }\n  div#dataInfo {\n      line-height: 20px;\n  }\n  div#pulldown {\n      position: absolute;\n      background-color: #eeeeee;\n      border: solid 1px #888888;\n      display: none;\n      max-height: 300px;\n      overflow-y: auto;\n  }\n  div#pulldown ul {\n      list-style-type: none;\n      margin: 5px 5px 5px 5px;\n      padding: 0px 0px 0px 0px;\n  }\n  div#pulldown li {\n      width: auto;\n      font-size: 14px;\n      cursor: pointer;\n  }\n</style>\n\n<div id=\"header\">\n  <input type=\"text\" size=\"50\" id=\"label_keywords\">\n  <input type=\"button\" id=\"word_search\" value=\"search\">\n</div>\n<div id=\"renderDiv\"></div>\n<div id=\"dataInfo\"></div>\n<div id=\"pulldown\"></div>\n";
},"useData":true}]
];

var css = "";

defineStanzaElement(columnTreeView, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=column_tree_view.js.map
