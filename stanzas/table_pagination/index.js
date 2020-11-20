import '@/stanzas/table_body'

export default function tablePagination(stanza, params) {

    let page_size_list = [10, 20, 50]
    if(params.page_opt) page_size_list = params.page_opt.split(/,/)
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
    }
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
    }

    let makeSlider = (div) => {
	let canvas = document.createElement("canvas");
	canvas.setAttribute("class", "slider_range");
	div.appendChild(canvas);
	
        let slider = document.createElement("div");
	slider.setAttribute("class", "page_slider_div")
	div.appendChild(slider);
	let slider_bar = document.createElement("div");
	slider_bar.setAttribute("class", "page_slider_bar")
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
	div.onmousemove = (e)=>{
	    if(dragF){
		let width = slider.offsetWidth - knob.offsetWidth;
		let dragX = knobX + e.pageX - startX;
		if(dragX < 0) dragX = 0;
		if(dragX > width) dragX = width;
		let page = Math.ceil(max_page * dragX / width);
		if(page < 1) page = 1;
		
		if(params.top_button){
		    let div = stanza.select("#paginationTop")
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
	div.onmouseup = (e)=>{
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
	    }else{
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
