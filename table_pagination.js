import { d as defineStanzaElement } from './stanza-element-d1cc4290.js';
import './table_body.js';

function tablePagination(stanza, params) {

    let page_size_list = [10, 20, 50];
    if(params.page_opt) page_size_list = params.page_opt.split(/,/);
    for(let i in page_size_list){ page_size_list[i] = parseInt(page_size_list[i]); }
    let limit = page_size_list[0];
    let offset = 0;
    let max = 0;
    let click_pages = 5;  // max page button (odd integer)
    let show_pages = click_pages;
    let max_page = 0;
    let current_page = 0;
    let knobX = 0;
    let dragF = false;
    let startX = 0;
    let button_display = undefined;
    
    stanza.render({
        template: "stanza.html.hbs"
    });

    let div = stanza.select("#tableBody");
    let table_stanza_name = params.table_stanza.replace(/\/$/, "").split(/\//).pop();
    div.innerHTML = "<togostanza-" + table_stanza_name + " " + params.table_stanza_params + " togostanza-about-link-placement=\"none\"></togostanza-" + table_stanza_name + ">";
    let togostanza = div.getElementsByTagName("togostanza-" + table_stanza_name)[0];
    togostanza.setAttribute("limit", limit);
    togostanza.setAttribute("offset", offset);
    div.appendChild(togostanza);

    let setListStartEnd = (start, end)=>{
	stanza.select("#listStart").innerHTML = start;
	stanza.select("#listEnd").innerHTML = end;
    };
    setListStartEnd(1, page_size_list[0]);

    let select = stanza.select("#pageSizeSelect");
    for(let i in page_size_list){
	let option = document.createElement("option");
	option.innerHTML = page_size_list[i];
	option.setAttribute("value", page_size_list[i]);
	if(i == 0) option.setAttribute("selected", "selected");
	select.appendChild(option);
    }
    select.addEventListener('change', (e)=>{
	limit = parseInt(e.target.value);
	console.log(limit);
	current_page = Math.ceil(offset / limit);
	togostanza.setAttribute("limit", limit);
	togostanza.setAttribute("offset", offset);
	setBothPagination();
    });

    let setBothPagination = () => {
	if(params.top_button) setPagination(stanza.select("#paginationTop"));
	if(params.bottom_button) setPagination(stanza.select("#paginationBottom"));
    };
    
    let setPagination = (div) => {
	if(!button_display) button_display = document.defaultView.getComputedStyle(div.getElementsByClassName("0_button")[0], '').display;
	for(let i = 0; i < click_pages; i++){
	    div.getElementsByClassName(i + "_button")[0].style.display = button_display;
	    if(i != click_pages - 1) div.getElementsByClassName(i + "_button")[0].classList.remove("page_button_right");
	}
	max_page = Math.ceil(max / limit);
	show_pages = click_pages;
	if(click_pages > max_page){
	    for(let i = max_page; i < click_pages; i++){
		div.getElementsByClassName(i + "_button")[0].style.display = "none";
		show_pages -= 1;
	    }
	    div.getElementsByClassName((max_page - 1) + "_button")[0].classList.add("page_button_right");
	}
	let start_page = current_page - Math.floor(click_pages / 2);
	if(start_page < 0) start_page = 0;
	if(start_page + show_pages > max_page) start_page = max_page - show_pages;
	let child = div.getElementsByClassName("page_button");
	for(let i = 0; i < click_pages; i++){
	    child[i + 2].innerHTML = start_page + i + 1;
	    if(start_page + i == current_page) child[i + 2].classList.add("current_button");
	    else child[i + 2].classList.remove("current_button");	
	}
	div.getElementsByClassName("first_button")[0].classList.remove("inactive_button");
	div.getElementsByClassName("prev_button")[0].classList.remove("inactive_button");
	div.getElementsByClassName("last_button")[0].classList.remove("inactive_button");
	div.getElementsByClassName("next_button")[0].classList.remove("inactive_button");
	if(current_page == 0){
	    div.getElementsByClassName("first_button")[0].classList.add("inactive_button");
	    div.getElementsByClassName("prev_button")[0].classList.add("inactive_button");
	}else if(current_page == max_page - 1){
	    div.getElementsByClassName("last_button")[0].classList.add("inactive_button");
	    div.getElementsByClassName("next_button")[0].classList.add("inactive_button");
	}

	if(params.slider){
	    div.style.setProperty("text-align", "center", "important");

	    let slider = div.getElementsByClassName("page_slider_div")[0];
	    let knob_ul = div.getElementsByClassName("page_slider_knob_ul")[0];
	    let knob = div.getElementsByClassName("page_slider_knob")[0];
	    knob.innerHTML = current_page + 1;
	    knobX = Math.round( (current_page + 1) * (slider.offsetWidth - knob.offsetWidth) / max_page );
	    knob_ul.style.transform = "translateX(" + knobX + "px)";
	    setSliderRange(div, knobX);
	}
	
	let bottom = offset + limit;
	if(bottom > max) bottom = max;
	setListStartEnd(offset + 1, bottom);
    };

    let makeSlider = (div) => {
	let canvas = document.createElement("canvas");
	canvas.setAttribute("class", "slider_range");
	div.appendChild(canvas);
	
        let slider = document.createElement("div");
	slider.setAttribute("class", "page_slider_div");
	div.appendChild(slider);
	let slider_bar = document.createElement("div");
	slider_bar.setAttribute("class", "page_slider_bar");
	slider.appendChild(slider_bar);
	let knob_ul = document.createElement("ul");
	knob_ul.setAttribute("class", "page_slider_knob_ul");
	slider.appendChild(knob_ul);
	let knob = document.createElement("li");
	knob.setAttribute("class", "page_slider_knob");
	knob.innerHTML = "1";
	knob_ul.appendChild(knob);
	knob.onmouseover = ()=>{ knob.classList.add("onmouse_button"); };
	knob.onmouseout = ()=>{ knob.classList.remove("onmouse_button"); };
	
	knob_ul.onmousedown = (e)=>{
	    dragF = true;
	    startX = e.pageX;
	};
	window.onmousemove = (e)=>{
	    if(dragF){
		let width = slider.offsetWidth - knob.offsetWidth;
		let dragX = knobX + e.pageX - startX;
		if(dragX < 0) dragX = 0;
		if(dragX > width) dragX = width;
		let page = Math.ceil(max_page * dragX / width);
		if(page < 1) page = 1;
		
		if(params.top_button){
		    let div = stanza.select("#paginationTop");
		    div.getElementsByClassName("page_slider_knob")[0].innerHTML = page;
		    div.getElementsByClassName("page_slider_knob_ul")[0].style.transform = "translateX(" + dragX + "px)";
		    setSliderRange(div, dragX);
		}
		if(params.bottom_button){
		    let div = stanza.select("#paginationBottom");
		    div.getElementsByClassName("page_slider_knob")[0].innerHTML = page;
		    div.getElementsByClassName("page_slider_knob_ul")[0].style.transform = "translateX(" + dragX + "px)";
		    setSliderRange(div, dragX);
		}
	    }
	};
	window.onmouseup = (e)=>{
	    if(dragF){
		knobX += e.pageX - startX;
		current_page = parseInt(knob.innerHTML) - 1;
		offset = limit * current_page;
		if(offset < 0) offset = 0;
		if(offset > max) offset = max - limit;
		togostanza.setAttribute("offset", offset);
		setBothPagination();
		dragF = false;
	    }
	};
    };

    let appendButton = (ul, text, tag) => {
	let li = document.createElement("li");
	li.innerHTML = text;
	li.setAttribute("class", tag + "_button page_button");
	ul.appendChild(li);
	li.addEventListener('click', (e)=>{
	    let text = e.target.innerHTML;
	    let current_offset = offset;
	    if(text == "&lt;&lt;"){
		offset = 0;
		current_page = 0;
	    }else if(text == "&lt;"){
		offset -= limit;
		if(offset < 0) offset = 0;
		current_page -= 1;
		if(current_page < 0) current_page = 0;
	    }else if(text == "&gt;"){
		offset += limit;
		if(offset > max) offset = max - limit;
		current_page += 1;
		if(current_page > max_page) current_page = max_page - 1;
	    }else if(text == "&gt;&gt;"){
		offset = max - (max % limit);
		if(offset == max) offset = max - limit;
		current_page = max_page - 1;
	    }else {
		current_page = parseInt(text) - 1;
		offset = limit * current_page;
		if(offset < 0) offset = 0;
		if(offset > max) offset = max - limit;
	    }
	    if(current_offset != offset){
		togostanza.setAttribute("offset", offset);
		setBothPagination();
	    }
	});
	li.onmouseover = ()=>{ li.classList.add("onmouse_button"); };
	li.onmouseout = ()=>{ li.classList.remove("onmouse_button"); };
	if(tag == 0) li.classList.add("page_button_left");
	if(tag == click_pages - 1) li.classList.add("page_button_right");
    };
    
    let makeButtons = (div) => {
	let ul = document.createElement("ul");
	ul.setAttribute("class", "page_button_ul");
	div.appendChild(ul);
	appendButton(ul, "&lt;&lt;", "first");
	appendButton(ul, "&lt;", "prev");
	for(let i = 0; i < click_pages; i++){ appendButton(ul, i + 1, i); }
	appendButton(ul, "&gt;", "next");
	appendButton(ul, "&gt;&gt;", "last");
    };

    let setSliderRange = (div, knobX) => {
	let slider = div.getElementsByClassName("page_slider_div")[0];
	let knob = div.getElementsByClassName("page_slider_knob")[0];
	let canvas = div.getElementsByClassName("slider_range")[0];
	let canvas_width = slider.offsetWidth;
	canvas.setAttribute("width", canvas_width);
	if(canvas.getContext){
	    let ctx = canvas.getContext('2d');
	    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
	    ctx.beginPath();
	    ctx.moveTo(knobX + knob.offsetWidth - 10, 12);
	    ctx.lineTo(knobX + 10, 10);
	    ctx.lineTo((canvas_width / 2) - (div.getElementsByClassName("1_button")[0].offsetWidth * show_pages / 2), 100);
	    ctx.lineTo((canvas_width / 2) + (div.getElementsByClassName("1_button")[0].offsetWidth * show_pages / 2), 100);
	    ctx.closePath();
	    ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue("--slider-range-color");
	    ctx.fill();
	}
    };
    
    if(params.slider){
	if(params.top_button) makeSlider(stanza.select("#paginationTop"));
	if(params.bottom_button) makeSlider(stanza.select("#paginationBottom"));
    }
    if(params.top_button) makeButtons(stanza.select("#paginationTop"));
    if(params.bottom_button) makeButtons(stanza.select("#paginationBottom"));
    
    // total size
    let options = {
	method: "POST",
	mode:  "cors",
	body: params.params.split(/\s+/).join("&"),
	headers: {
	    "Accept": "application/json",	    
	    'Content-Type': 'application/x-www-form-urlencoded'
	}
    };
    let url = params.table_data_count_api;
    let q = fetch(url, options).then(res => res.json());
    q.then(function(data){
	max = parseInt(data.count);
	max_page = Math.ceil(max / limit);
        stanza.select("#totalSize").innerHTML = max;
	setBothPagination();
    });

}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "table_pagination",
	"stanza:label": "Table pagination metastanza",
	"stanza:definition": "metastanza for table pagination with slider.",
	"stanza:parameter": [
	{
		"stanza:key": "table_data_count_api",
		"stanza:example": "https://sparql-support.dbcls.jp/rest/api/protein_list?count=1",
		"stanza:description": "table row count api",
		"stanza:required": true
	},
	{
		"stanza:key": "table_stanza",
		"stanza:example": "https://sparql-support.dbcls.jp/stanza/table_body/",
		"stanza:description": "table stanza (req. 'limit' and 'offset' parameters)'",
		"stanza:required": true
	},
	{
		"stanza:key": "params",
		"stanza:example": "dataset=DS801_1",
		"stanza:description": "parameters for count api",
		"stanza:required": false
	},
	{
		"stanza:key": "table_stanza_params",
		"stanza:example": "params='dataset=DS801_1' table_data_api='https://sparql-support.dbcls.jp/rest/api/protein_list'",
		"stanza:description": "parameters for table stanza (except 'limit' and 'offset')",
		"stanza:required": false
	},
	{
		"stanza:key": "page_opt",
		"stanza:example": "10,20,50,100",
		"stanza:description": "page size list",
		"stanza:required": false
	},
	{
		"stanza:key": "slider",
		"stanza:example": "1",
		"stanza:description": "slider on/off",
		"stanza:required": false
	},
	{
		"stanza:key": "top_button",
		"stanza:example": "1",
		"stanza:description": "top page button on/off",
		"stanza:required": false
	},
	{
		"stanza:key": "bottom_button",
		"stanza:example": "",
		"stanza:description": "bottom page button on/off",
		"stanza:required": false
	}
],
	"stanza:style": [
	{
		"stanza:key": "--button-bg-color",
		"stanza:type": "color",
		"stanza:default": "#b6c769",
		"stanza:description": "button default background color"
	},
	{
		"stanza:key": "--current-button-bg-color",
		"stanza:type": "color",
		"stanza:default": "#7b8a38",
		"stanza:description": "button active background color"
	},
	{
		"stanza:key": "--button-text-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "button text color"
	},
	{
		"stanza:key": "--button-align",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "page button align (left, center, right), when 'slider' off."
	},
	{
		"stanza:key": "--slider-range-color",
		"stanza:type": "color",
		"stanza:default": "#e0e6ca",
		"stanza:description": "slider range color"
	}
],
	"stanza:usage": "<togostanza-table_pagination></togostanza-table_pagination>",
	"stanza:type": "MetaStanza",
	"stanza:display": "Table",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "TogoStanza",
	"stanza:address": "admin@biohackathon.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-05-27",
	"stanza:updated": "2020-05-27"
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"main\">\n  <div id=\"tableInfo\">\n    <div class=\"float_left\">Showing <span id=\"listStart\"></span>..<span id=\"listEnd\"></span> of <span id=\"totalSize\"> entries</span></div>\n    <div class=\"float_right\">Page size: <select id=\"pageSizeSelect\"></select></div>\n  </div>\n  <div id=\"paginationTop\"></div>\n  <div id=\"tableBody\"></div>\n  <div id=\"paginationBottom\"></div>\n</div>\n";
},"useData":true}]
];

var css = "div.main {\n  font-family: \"Arial\", san-serif;\n}\n\ndiv#paginationTop, div#paginationBottom {\n  text-align: var(--button-align);\n  clear: both;\n  position: relative;\n}\n\ndiv.page_slider_div {\n  width: 100%;\n  height: 20px;\n  margin: 10px 0px 20px 0px;\n  text-align: left;\n}\n\ndiv.page_slider_bar {\n  width: calc(100% - 40px);\n  margin-left: 20px;\n  background-color: #bbbbbb;\n  /* slider bar color */\n  height: 4px;\n  position: relative;\n  top: 8px;\n}\n\nul.page_button_ul {\n  display: inline-block;\n  padding: 0px 20px 0px 20px;\n}\n\nul.page_slider_knob_ul {\n  margin: 0px;\n  display: inline-block;\n  padding: 0px;\n  position: relative;\n  top: -4px;\n}\n\nli.page_slider_knob, li.page_button {\n  background-color: var(--button-bg-color);\n  /* button default bg color */\n  color: var(--button-text-color);\n  /* button default font color */\n  text-align: center;\n  height: 20px;\n  padding-left: 14px;\n  padding-right: 14px;\n  list-style: none;\n  cursor: pointer;\n  user-select: none;\n  display: table-cell;\n  vertical-align: middle;\n  transform: translateX(0px);\n  /* for z-index conflict of slider range object */\n}\n\nli.current_button, li.onmouse_button {\n  background-color: var(--current-button-bg-color);\n  /* button active bg color */\n}\n\nli.inactive_button {\n  background-color: #cccccc;\n  /* button inactive bg color */\n}\n\nli.current_button, li.page_slider_knob, li.inactive_button {\n  cursor: default;\n}\n\nli.page_slider_knob {\n  border-radius: 10px;\n}\n\nli.prev_button {\n  transform: translateX(-10px);\n  border-radius: 10px;\n}\n\nli.next_button {\n  transform: translateX(10px);\n  border-radius: 10px;\n}\n\nli.first_button {\n  transform: translateX(-20px);\n  border-radius: 10px;\n}\n\nli.last_button {\n  transform: translateX(20px);\n  border-radius: 10px;\n}\n\nli.page_button_left {\n  padding-left: 24px;\n  border-radius: 10px 0px 0px 10px;\n}\n\nli.page_button_right {\n  padding-right: 24px;\n  border-radius: 0px 10px 10px 0px;\n}\n\ndiv.float_left {\n  float: left;\n}\n\ndiv.float_right {\n  float: right;\n}\n\ncanvas.slider_range {\n  width: 100%;\n  height: 100px;\n  position: absolute;\n  left: 0px;\n}";

defineStanzaElement(tablePagination, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=table_pagination.js.map
