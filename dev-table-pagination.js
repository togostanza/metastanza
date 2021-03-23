import { d as defineStanzaElement } from './stanza-element-c2a08f7a.js';
import './dev-table-body.js';
import './metastanza_utils-0648515a.js';
import './index-b2de29ee.js';
import './timer-be811b16.js';

function tablePagination(stanza, params) {
  let page_size_list = [10, 20, 50];
  if (params.page_opt) {
    page_size_list = params.page_opt.split(/,/);
  }
  for (const i in page_size_list) {
    page_size_list[i] = parseInt(page_size_list[i]);
  }
  let limit = page_size_list[0];
  let offset = 0;
  let max = 0;
  const click_pages = 5; // max page button (odd integer)
  let show_pages = click_pages;
  let max_page = 0;
  let current_page = 0;
  let knobX = 0;
  let dragF = false;
  let startX = 0;
  let button_display = undefined;

  stanza.render({
    template: "stanza.html.hbs",
  });

  const div = stanza.select("#tableBody");
  const table_stanza_name = params.table_stanza
    .replace(/\/$/, "")
    .split(/\//)
    .pop();
  div.innerHTML =
    "<togostanza-" +
    table_stanza_name +
    " " +
    params.table_stanza_params +
    ' togostanza-about-link-placement="none"></togostanza-' +
    table_stanza_name +
    ">";
  const togostanza = div.getElementsByTagName(
    "togostanza-" + table_stanza_name
  )[0];
  togostanza.setAttribute("limit", limit);
  togostanza.setAttribute("offset", offset);
  div.appendChild(togostanza);

  const setListStartEnd = (start, end) => {
    stanza.select("#listStart").innerHTML = start;
    stanza.select("#listEnd").innerHTML = end;
  };
  setListStartEnd(1, page_size_list[0]);

  const select = stanza.select("#pageSizeSelect");
  for (const i in page_size_list) {
    const option = document.createElement("option");
    option.innerHTML = page_size_list[i];
    option.setAttribute("value", page_size_list[i]);
    if (i === 0) {
      option.setAttribute("selected", "selected");
    }
    select.appendChild(option);
  }
  select.addEventListener("change", (e) => {
    limit = parseInt(e.target.value);
    current_page = Math.ceil(offset / limit);
    togostanza.setAttribute("limit", limit);
    togostanza.setAttribute("offset", offset);
    setBothPagination();
    setKnobWidth(limit, max);
  });

  const setBothPagination = () => {
    if (params.top_button) {
      setPagination(stanza.select("#paginationTop"));
    }
    if (params.bottom_button) {
      setPagination(stanza.select("#paginationBottom"));
    }
  };

  const setPagination = (div) => {
    if (!button_display) {
      button_display = document.defaultView.getComputedStyle(
        div.getElementsByClassName("0_button")[0],
        ""
      ).display;
    }
    for (let i = 0; i < click_pages; i++) {
      div.getElementsByClassName(
        i + "_button"
      )[0].style.display = button_display;
      if (i !== click_pages - 1) {
        div
          .getElementsByClassName(i + "_button")[0]
          .classList.remove("page_button_right");
      }
    }
    max_page = Math.ceil(max / limit);
    show_pages = click_pages;
    if (click_pages > max_page) {
      for (let i = max_page; i < click_pages; i++) {
        div.getElementsByClassName(i + "_button")[0].style.display = "none";
        show_pages -= 1;
      }
      div
        .getElementsByClassName(max_page - 1 + "_button")[0]
        .classList.add("page_button_right");
    }
    let start_page = current_page - Math.floor(click_pages / 2);
    if (start_page < 0) {
      start_page = 0;
    }
    if (start_page + show_pages > max_page) {
      start_page = max_page - show_pages;
    }
    const child = div.getElementsByClassName("page_button");
    for (let i = 0; i < click_pages; i++) {
      child[i + 2].innerHTML = start_page + i + 1;
      if (start_page + i === current_page) {
        child[i + 2].classList.add("current_button");
      } else {
        child[i + 2].classList.remove("current_button");
      }
    }
    div
      .getElementsByClassName("first_button")[0]
      .classList.remove("inactive_button");
    div
      .getElementsByClassName("prev_button")[0]
      .classList.remove("inactive_button");
    div
      .getElementsByClassName("last_button")[0]
      .classList.remove("inactive_button");
    div
      .getElementsByClassName("next_button")[0]
      .classList.remove("inactive_button");
    if (current_page === 0) {
      div
        .getElementsByClassName("first_button")[0]
        .classList.add("inactive_button");
      div
        .getElementsByClassName("prev_button")[0]
        .classList.add("inactive_button");
    } else if (current_page === max_page - 1) {
      div
        .getElementsByClassName("last_button")[0]
        .classList.add("inactive_button");
      div
        .getElementsByClassName("next_button")[0]
        .classList.add("inactive_button");
    }

    if (params.slider) {
      div.style.setProperty("text-align", "center", "important");

      const slider = div.getElementsByClassName("page_slider_div")[0];
      const knob_ul = div.getElementsByClassName("page_slider_knob_ul")[0];
      const knob = div.getElementsByClassName("page_slider_knob")[0];
      knob.innerHTML = current_page + 1;
      knobX = Math.round(
        ((current_page + 1) * (slider.offsetWidth - knob.offsetWidth)) /
          max_page
      );
      knob_ul.style.transform = "translateX(" + knobX + "px)";
      setSliderRange(div, knobX);
    }

    let bottom = offset + limit;
    if (bottom > max) {
      bottom = max;
    }
    setListStartEnd(offset + 1, bottom);
  };

  const makeSlider = (div) => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("class", "slider_range");
    div.appendChild(canvas);

    const slider = document.createElement("div");
    slider.setAttribute("class", "page_slider_div");
    div.appendChild(slider);
    const slider_bar = document.createElement("div");
    slider_bar.setAttribute("class", "page_slider_bar");
    slider.appendChild(slider_bar);
    const knob_ul = document.createElement("ul");
    knob_ul.setAttribute("class", "page_slider_knob_ul");
    slider.appendChild(knob_ul);
    const knob = document.createElement("li");
    knob.setAttribute("class", "page_slider_knob");

    knob.innerHTML = "1";
    knob_ul.appendChild(knob);
    knob.onmouseover = () => {
      knob.classList.add("onmouse_button");
    };
    knob.onmouseout = () => {
      knob.classList.remove("onmouse_button");
    };

    knob_ul.onmousedown = (e) => {
      dragF = true;
      startX = e.pageX;
    };
    div.onmousemove = (e) => {
      if (dragF) {
        const width = slider.offsetWidth - knob.offsetWidth;
        let dragX = knobX + e.pageX - startX;
        if (dragX < 0) {
          dragX = 0;
        }
        if (dragX > width) {
          dragX = width;
        }
        let page = Math.ceil((max_page * dragX) / width);
        if (page < 1) {
          page = 1;
        }

        if (params.top_button) {
          const div = stanza.select("#paginationTop");
          div.getElementsByClassName("page_slider_knob")[0].innerHTML = page;
          div.getElementsByClassName("page_slider_knob_ul")[0].style.transform =
            "translateX(" + dragX + "px)";
          setSliderRange(div, dragX);
        }
        if (params.bottom_button) {
          const div = stanza.select("#paginationBottom");
          div.getElementsByClassName("page_slider_knob")[0].innerHTML = page;
          div.getElementsByClassName("page_slider_knob_ul")[0].style.transform =
            "translateX(" + dragX + "px)";
          setSliderRange(div, dragX);
        }
      }
    };
    div.onmouseup = (e) => {
      if (dragF) {
        knobX += e.pageX - startX;
        current_page = parseInt(knob.innerHTML) - 1;
        offset = limit * current_page;
        if (offset < 0) {
          offset = 0;
        }
        if (offset > max) {
          offset = max - limit;
        }
        togostanza.setAttribute("offset", offset);
        setBothPagination();
        dragF = false;
      }
    };
  };

  const appendButton = (ul, text, tag) => {
    const li = document.createElement("li");
    li.innerHTML = text;
    li.setAttribute("class", tag + "_button page_button");
    ul.appendChild(li);
    li.addEventListener("click", (e) => {
      const text = e.target.innerHTML;
      const current_offset = offset;
      if (text === "&lt;&lt;") {
        offset = 0;
        current_page = 0;
      } else if (text === "&lt;") {
        offset -= limit;
        if (offset < 0) {
          offset = 0;
        }
        current_page -= 1;
        if (current_page < 0) {
          current_page = 0;
        }
      } else if (text === "&gt;") {
        offset += limit;
        if (offset > max) {
          offset = max - limit;
        }
        current_page += 1;
        if (current_page > max_page) {
          current_page = max_page - 1;
        }
      } else if (text === "&gt;&gt;") {
        offset = max - (max % limit);
        if (offset === max) {
          offset = max - limit;
        }
        current_page = max_page - 1;
      } else {
        current_page = parseInt(text) - 1;
        offset = limit * current_page;
        if (offset < 0) {
          offset = 0;
        }
        if (offset > max) {
          offset = max - limit;
        }
      }
      if (current_offset !== offset) {
        togostanza.setAttribute("offset", offset);
        setBothPagination();
      }
    });
    li.onmouseover = () => {
      li.classList.add("onmouse_button");
    };
    li.onmouseout = () => {
      li.classList.remove("onmouse_button");
    };
    if (tag === 0) {
      li.classList.add("page_button_left");
    }
    if (tag === click_pages - 1) {
      li.classList.add("page_button_right");
    }
  };

  const makeButtons = (div) => {
    const ul = document.createElement("ul");
    ul.setAttribute("class", "page_button_ul");
    div.appendChild(ul);
    appendButton(ul, "&lt;&lt;", "first");
    appendButton(ul, "&lt;", "prev");
    for (let i = 0; i < click_pages; i++) {
      appendButton(ul, i + 1, i);
    }
    appendButton(ul, "&gt;", "next");
    appendButton(ul, "&gt;&gt;", "last");
  };

  const setSliderRange = (div, knobX) => {
    const slider = div.getElementsByClassName("page_slider_div")[0];
    const knob = div.getElementsByClassName("page_slider_knob")[0];
    const canvas = div.getElementsByClassName("slider_range")[0];
    const canvas_width = slider.offsetWidth;
    canvas.setAttribute("width", canvas_width);
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.beginPath();
      ctx.moveTo(knobX + knob.offsetWidth - 10, 12);
      ctx.lineTo(knobX + 10, 10);
      ctx.lineTo(
        canvas_width / 2 -
          (div.getElementsByClassName("1_button")[0].offsetWidth * show_pages) /
            2,
        100
      );
      ctx.lineTo(
        canvas_width / 2 +
          (div.getElementsByClassName("1_button")[0].offsetWidth * show_pages) /
            2,
        100
      );
      ctx.closePath();
      ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue(
        "--slider-range-color"
      );
      ctx.fill();
    }
  };

  if (params.slider) {
    if (params.top_button) {
      makeSlider(stanza.select("#paginationTop"));
    }
    if (params.bottom_button) {
      makeSlider(stanza.select("#paginationBottom"));
    }
  }
  if (params.top_button) {
    makeButtons(stanza.select("#paginationTop"));
  }
  if (params.bottom_button) {
    makeButtons(stanza.select("#paginationBottom"));
  }

  // total size
  const options = {
    method: "POST",
    mode: "cors",
    body: params.params.split(/\s+/).join("&"),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const url = params.table_data_count_api;
  const q = fetch(url, options).then((res) => res.json());
  q.then(function (data) {
    max = parseInt(data.count);
    max_page = Math.ceil(max / limit);
    stanza.select("#totalSize").innerHTML = max;
    setBothPagination();
    setKnobWidth(limit, max);
  });

  const setKnobWidth = (limit, max) => {
    const max_page = Math.ceil(max / limit);
    const div = stanza.select("#paginationTop");
    const knob = div.getElementsByClassName("page_slider_knob")[0];
    knob.setAttribute("style", `width: calc(100% * ${limit / max_page})`);
  };
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': tablePagination
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dev-table-pagination",
	"stanza:label": "dev Table pagination metastanza",
	"stanza:definition": "metastanza for table pagination with slider.",
	"stanza:parameter": [
	{
		"stanza:key": "table_data_count_api",
		"stanza:example": "http://togostanza.org/sparqlist/api/metastanza_table?count=1",
		"stanza:description": "table row count api",
		"stanza:required": true
	},
	{
		"stanza:key": "table_stanza",
		"stanza:example": "https://togostanza.github.io/metastanza/dev-table-body/",
		"stanza:description": "table stanza (req. 'limit' and 'offset' parameters)'",
		"stanza:required": true
	},
	{
		"stanza:key": "params",
		"stanza:example": "taxonomy=9606",
		"stanza:description": "parameters for count api",
		"stanza:required": false
	},
	{
		"stanza:key": "table_stanza_params",
		"stanza:example": "params='taxonomy=9606' table_data_api='http://togostanza.org/sparqlist/api/metastanza_table'",
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
		"stanza:default": "#FFFFFF",
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
	},
	{
		"stanza:key": "--general-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "general font family"
	},
	{
		"stanza:key": "--control-font-color",
		"stanza:type": "color",
		"stanza:default": "#707070",
		"stanza:description": "general font color"
	},
	{
		"stanza:key": "--control-font-size",
		"stanza:type": "number",
		"stanza:default": "12px",
		"stanza:description": "general font size"
	},
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "basic fill color"
	},
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#44b8cc",
		"stanza:description": "emphasized color"
	},
	{
		"stanza:key": "--background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color"
	},
	{
		"stanza:key": "--tabletitle-display",
		"stanza:type": "text",
		"stanza:default": "flex",
		"stanza:description": "display of table title.(flex, block or none)"
	},
	{
		"stanza:key": "--tabletitle-placement",
		"stanza:type": "text",
		"stanza:default": "center",
		"stanza:description": "table title placement when table title is displayed.(left, right, center)"
	},
	{
		"stanza:key": "--tabletitle-margin",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "margin of table title"
	},
	{
		"stanza:key": "--tabletitle-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "font size of table title"
	},
	{
		"stanza:key": "--tabletitle-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "font color of table title"
	},
	{
		"stanza:key": "--table-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #eee",
		"stanza:description": "style of table border"
	},
	{
		"stanza:key": "--table-shadow",
		"stanza:type": "text",
		"stanza:default": "1px 1px 3px 1px #eee",
		"stanza:description": "style of table shadow"
	},
	{
		"stanza:key": "--tbody-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #eee",
		"stanza:description": "Border bottom of tbody"
	},
	{
		"stanza:key": "--control-border-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "radius of search box"
	},
	{
		"stanza:key": "--searchbox-border-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "border color of search box"
	},
	{
		"stanza:key": "--control-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "color of search box"
	},
	{
		"stanza:key": "--height",
		"stanza:type": "text",
		"stanza:default": "400px",
		"stanza:description": "height of table"
	},
	{
		"stanza:key": "--searchbtn-height",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "height of search button"
	},
	{
		"stanza:key": "--searchbtn-width",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "width of search button"
	},
	{
		"stanza:key": "--searchbox-height",
		"stanza:type": "text",
		"stanza:default": "20px",
		"stanza:description": "height of search box"
	},
	{
		"stanza:key": "--searchbox-width",
		"stanza:type": "text",
		"stanza:default": "164px",
		"stanza:description": "width of search box"
	},
	{
		"stanza:key": "--searchbox-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of search box"
	},
	{
		"stanza:key": "--searchbox-font-color",
		"stanza:type": "text",
		"stanza:default": "#707070",
		"stanza:description": "font color of search box"
	},
	{
		"stanza:key": "--control-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of search box"
	},
	{
		"stanza:key": "--searchbtn-border-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "border color of search button"
	},
	{
		"stanza:key": "--searchbtn-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "radius of search button"
	},
	{
		"stanza:key": "--searchbtn-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "color of search button"
	},
	{
		"stanza:key": "--searchbtn-img-width",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "width of search button image"
	},
	{
		"stanza:key": "--searchbtn-img-height",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "height of search button image"
	},
	{
		"stanza:key": "--searchimg-display",
		"stanza:type": "text",
		"stanza:default": "block",
		"stanza:description": "display of search button image"
	},
	{
		"stanza:key": "--searchtext-display",
		"stanza:type": "text",
		"stanza:default": "none",
		"stanza:description": "display of search button text.(dafault: none)"
	},
	{
		"stanza:key": "--searchtext-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "color of search button text"
	},
	{
		"stanza:key": "--searchtext-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of search button text"
	},
	{
		"stanza:key": "--dlbtn-img-width",
		"stanza:type": "text",
		"stanza:default": "13px",
		"stanza:description": "width of download button image"
	},
	{
		"stanza:key": "--dlbtn-img-height",
		"stanza:type": "text",
		"stanza:default": "13px",
		"stanza:description": "height of download button image"
	},
	{
		"stanza:key": "--information-margin",
		"stanza:type": "text",
		"stanza:default": "0px 0px 10px 0px",
		"stanza:description": "margin of information area"
	},
	{
		"stanza:key": "--searchicon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of search icon"
	},
	{
		"stanza:key": "--filtericon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of filter icon"
	},
	{
		"stanza:key": "--sorticon-display",
		"stanza:type": "text",
		"stanza:default": "inline-block",
		"stanza:description": "display of sort icon"
	},
	{
		"stanza:key": "--thead-border-color",
		"stanza:type": "text",
		"stanza:default": "#000000",
		"stanza:description": "border color of thead"
	},
	{
		"stanza:key": "--thead-font-size",
		"stanza:type": "text",
		"stanza:default": "12px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--tbody-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--thead-font-color",
		"stanza:type": "color",
		"stanza:default": "#256d80",
		"stanza:description": "font color of table header"
	},
	{
		"stanza:key": "--thead-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "font weight of table header"
	},
	{
		"stanza:key": "--thead-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table header"
	},
	{
		"stanza:key": "--tbody-font-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "font color of table body"
	},
	{
		"stanza:key": "--tbody-border-right",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border right of table body"
	},
	{
		"stanza:key": "--tbody-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border bottom of table body"
	},
	{
		"stanza:key": "--tbody-border-left",
		"stanza:type": "text",
		"stanza:default": "0px solid #333",
		"stanza:description": "border left of table body"
	},
	{
		"stanza:key": "--tbody-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--tbody-odd-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--tbody-even-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--showinfo-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "show info placement"
	},
	{
		"stanza:key": "--font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "font(e.g: serif,san serif,fantasy)"
	},
	{
		"stanza:key": "--greeting-align",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "text align of greeting"
	}
],
	"stanza:usage": "<togostanza-table-pagination></togostanza-table-pagination>",
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
    return "<div class=\"main\">\n  <div id=\"tableBody\"></div>\n  <div id=\"tableInfo\">\n    <div class=\"float_left\">\n      Showing\n      <span id=\"listStart\"></span>\n      ..\n      <span id=\"listEnd\"></span>\n      of\n      <span id=\"totalSize\">\n        entries\n      </span>\n    </div>\n    <div class=\"float_right\">\n      Page size:\n      <select id=\"pageSizeSelect\"></select>\n    </div>\n  </div>\n  <div id=\"paginationTop\"></div>\n</div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=dev-table-pagination.js.map
