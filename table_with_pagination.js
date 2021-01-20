import { d as defineStanzaElement } from './stanza-element-6585decd.js';
import './timer-be811b16.js';
import { m as metastanza } from './metastanza_utils-6f306649.js';

async function tableWithPagination(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
  });

  const formBody = [];
  for (const key in params) {
    if (params[key] && key !== "table_data_api") {
      formBody.push(key + "=" + encodeURIComponent(params[key]));
    }
  }

  const api = params.table_data_api;
  const element = stanza.root.querySelector("#renderDiv");
  const dataset = await metastanza.getFormatedJson(
    api,
    element,
    formBody.join("&")
  );
  if (typeof dataset === "object") {
    draw(dataset, stanza, element);
  }
}

function draw(dataset, stanza, element) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  element.appendChild(table);
  table.appendChild(thead);
  table.appendChild(tbody);

  let order = [];
  if (dataset.head.order) {
    for (let i = 0; i < dataset.head.order.length; i++) {
      if (parseInt(dataset.head.order[i]) >= 0) {
        order[parseInt(dataset.head.order[i])] = i;
      }
    }
  } else {
    order = [...Array(dataset.head.vars.length).keys()];
  }

  let tr = document.createElement("tr");
  tr.classList.add("table-fixed");
  thead.appendChild(tr);
  for (const i of order) {
    const th = document.createElement("th");
    const span_filter = document.createElement("span");
    const span_sort = document.createElement("span");
    let label = dataset.head.vars[i];
    if (dataset.head.labels) {
      label = dataset.head.labels[i];
    }
    th.innerHTML = label;
    span_filter.classList.add("icon", "filter-icon");
    span_sort.setAttribute("data-type", label);
    span_sort.classList.add("icon", "sort-icon");
    th.appendChild(span_filter);
    th.appendChild(span_sort);
    tr.appendChild(th);
  }

  for (const row of dataset.body) {
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    for (const j of order) {
      const td = document.createElement("td");
      if (dataset.head.href[j]) {
        const a = document.createElement("a");
        a.setAttribute("href", row[dataset.head.href[j]].value);
        a.innerHTML = row[dataset.head.vars[j]].value;
        td.appendChild(a);
      } else {
        td.innerHTML = row[dataset.head.vars[j]].value;
      }
      tr.appendChild(td);
    }
  }

  var sort = stanza.select(".sort-icon");
  sort.addEventListener("click", function () {
    console.log("クリックされました");
  });
  // bb.onclick = function(){
  //   alert("ボタンが押されました。")
  // }
  // setTimeout(function(){
  //   const hoge = document.getElementById('sort-icon-id3');
  //   if(hoge){
  //     hoge.addEventListener("click", function () {
  //       console.log("クリックされました");
  //     });
  //   }
  // },5000)
}

// document.getElementsByClassName("sort-icon").onclick = function(){
//   console.log("クリックされた");
// }
// document.getElementsByClassName("sort-icon").click (function(){
//   console.log("クリックされた");
// })

// var bb = document.getElementsByClassName("sort-icon");
// bb.onclick = function(){
//   console.log("ボタンが押されました");
// }

// window.onload = function(){
//   let bb = document.getElementsByClassName("sort-icon");
//   bb.addEventListener("click", function(){
//     console.log("ボタンが押されました。")
//   });
// };

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "table_with_pagination",
	"stanza:label": "table with pagination",
	"stanza:definition": "table with pagination for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Table",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-12-09",
	"stanza:updated": "2020-12-09",
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
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--general-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "general font family"
	},
	{
		"stanza:key": "--general-font-color",
		"stanza:type": "color",
		"stanza:default": "#707070",
		"stanza:description": "general font color"
	},
	{
		"stanza:key": "--general-font-size",
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
		"stanza:key": "--ruled-line",
		"stanza:type": "text",
		"stanza:default": "0.5px solid #eee",
		"stanza:description": "style of ruled line"
	},
	{
		"stanza:key": "--stack-line",
		"stanza:type": "text",
		"stanza:default": "1px solid #333",
		"stanza:description": "style of stack line"
	},
	{
		"stanza:key": "--searchbox-radius",
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
		"stanza:key": "--searchbox-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "color of search box"
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
		"stanza:default": "10px",
		"stanza:description": "font color of search box"
	},
	{
		"stanza:key": "--searchbox-background-color",
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
		"stanza:key": "--thead-font-size",
		"stanza:type": "number",
		"stanza:default": "12px",
		"stanza:description": "font size of labels"
	},
	{
		"stanza:key": "--tbody-font-size",
		"stanza:type": "number",
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
		"stanza:key": "--tbody-background-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "background color of table body"
	},
	{
		"stanza:key": "--pagination-padding",
		"stanza:type": "text",
		"stanza:default": "30px 0px 0px 0px",
		"stanza:description": "padding of pagination"
	},
	{
		"stanza:key": "--pagination-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "pagination placement"
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
		"stanza:key": "--paginationbtn-font-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "font color of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-background-color",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "background color of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #fff",
		"stanza:description": "border style of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-border-bottom",
		"stanza:type": "text",
		"stanza:default": "1px solid #fff",
		"stanza:description": "border-bottom style of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-border-radius",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "border radius of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-margin",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "margin of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-padding",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "padding of pagination button"
	},
	{
		"stanza:key": "--paginationbtn-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of pagination button"
	},
	{
		"stanza:key": "--currentbtn-font-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "font color of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-background-color",
		"stanza:type": "color",
		"stanza:default": "#D5E1E8",
		"stanza:description": "background color of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-border",
		"stanza:type": "text",
		"stanza:default": "1px solid #DDDDDD",
		"stanza:description": "border style of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-border-bottom",
		"stanza:type": "text",
		"stanza:default": "0px solid #DDDDDD",
		"stanza:description": "border-bottom style of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-border-radius",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "border radius of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-padding",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "padding of pagination button.(at current page)"
	},
	{
		"stanza:key": "--currentbtn-margin",
		"stanza:type": "text",
		"stanza:default": "4px",
		"stanza:description": "margin of pagination button.(at current page)"
	},
	{
		"stanza:key": "--arrowbtn-color",
		"stanza:type": "color",
		"stanza:default": "#002559",
		"stanza:description": "color of pagination arrow button."
	},
	{
		"stanza:key": "--label-font",
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
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<style>\n  table {\n      width: 100%;\n  }\n  td {\n      padding: 5px 20px 5px 20px;;\n  }\n  th {\n  }\n</style>\n\n<div class=\"container\">\n  <div class=\"infomation\">\n    <form class=\"search-form\" action=\"#\">\n      <input\n        class=\"search-box\"\n        type=\"text\"\n        placeholder=\"Serch for keywords...\"\n      />\n      <button class=\"search-btn\" type=\"submit\">\n        <img\n          src=\"https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/white-search1.svg\"\n          alt=\"search\"\n        />\n      </button>\n    </form>\n    <a class=\"dl-btn\" href=\"#\" download=\"#\">\n      <img\n        src=\"https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/grey-download1.svg\"\n        alt=\"\"\n      />\n    </a>\n  </div>\n  <div id=\"renderDiv\"></div>\n</div>\n\n<div id=\"pagenation\">\n  <ul>\n    <li class=\"first-btn\">\n      <span></span>\n      <span></span>\n    </li>\n    <li class=\"previous-btn\">\n      <span></span>\n    </li>\n    <li class=\"current-btn\">\n      1\n    </li>\n    <li>\n      2\n    </li>\n    <li>\n      3\n    </li>\n    <li>\n      4\n    </li>\n    <li>\n      …\n    </li>\n    <li>\n      10\n    </li>\n    <li class=\"next-btn\">\n      <span></span>\n    </li>\n    <li class=\"last-btn\">\n      <span></span>\n      <span></span>\n    </li>\n  </ul>\n</div>\n<p class=\"show-info\">\n  Showing 1 to 10 of 44 entres\n</p>\n\n";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  list-style: none;\n  color: var(--general-font-color);\n  font-family: var(--general-font-family);\n  font-size: var(--general-font-size);\n}\n\n#renderDiv {\n  width: 100%;\n}\n\n.container {\n  width: 100%;\n  max-width: 800px;\n}\n\n.infomation {\n  width: 100%;\n  height: 30px;\n  display: flex;\n  justify-content: space-between;\n}\n\n.search-form {\n  height: var(--searchbox-height);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.search-box {\n  margin-right: 3px;\n  height: var(--searchbox-height);\n  width: var(--searchbox-width);\n  border: 1px solid var(--searchbox-border-color);\n  border-radius: var(--searchbox-radius);\n  font-size: var(--searchbox-font-size);\n  color: var(--searchbox-font-color);\n  background-color: var(--searchbox-background-color);\n}\n\n::placeholder {\n  color: #eaeaea;\n}\n\n.search-btn {\n  margin-right: 2px;\n  height: var(--searchbtn-height);\n  width: var(--searchbtn-width);\n  border: 1px solid var(--searchbtn-border-color);\n  border-radius: var(--searchbtn-radius);\n  background-color: var(--searchbtn-color);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.search-btn img {\n  width: 12px;\n  height: 12px;\n  display: block;\n}\n\n.dl-btn img {\n  width: 13px;\n  height: 13px;\n}\n\ntable {\n  width: inherit;\n  text-align: left;\n  border-collapse: collapse;\n  margin: 0;\n  background-color: var(--background-color);\n  border: var(--table-border);\n  box-shadow: var(--table-shadow);\n}\n\nthead {\n  background-color: var(--thead-background-color);\n  font-size: var(--thead-font-size);\n  border-bottom: var(--stack-line);\n  color: var(--thead-font-color);\n  margin-bottom: 0;\n  padding: 8px 8px 0 8px;\n}\n\ntd,\nth {\n  width: 150px;\n  padding: 5px;\n}\n\ntbody td {\n  border-bottom: var(--ruled-line);\n  border-collapse: collapse;\n}\n\nthead > tr > td {\n  color: var(--series-0-color);\n}\n\n#renderDiv > table > thead > tr > th {\n  color: var(--thead-font-color);\n  font-weight: var(--thead-font-weight);\n}\n\nthead > tr > th > .icon {\n  cursor: pointer;\n  content: \"\";\n  display: inline-block;\n  width: 9px;\n  height: 13px;\n  background-repeat: no-repeat;\n  background-position: center 5px;\n  background-size: 8px 8px;\n}\n\n.filter-icon {\n  margin-left: 2px;\n  background-image: url(https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/grey-filter2.svg);\n}\n\n.sort-icon {\n  background-image: url(https://raw.githubusercontent.com/c-nakashima/metastanza/master/assets/grey-sort2.svg);\n}\n\ntbody {\n  background-color: var(--tbody-background-color);\n  font-size: var(--tbody-font-size);\n  color: var(--general-font-color);\n  padding: 0px 8px;\n}\n\nthead,\ntbody {\n  display: block;\n}\n\ntbody tr td:hover {\n  color: var(--emphasized-color);\n}\n\n.stack {\n  border-right: var(--stack-line);\n}\n\n#pagenation {\n  padding: var(--pagination-padding);\n  display: flex;\n  justify-content: var(--pagination-placement);\n}\n\n#pagenation ul {\n  display: flex;\n  padding: 0;\n}\n\n#pagenation li {\n  color: var(--paginationbtn-font-color);\n  background-color: var(--paginationbtn-background-color);\n  border: var(--paginationbtn-border);\n  border-bottom: var(--paginationbtn-border-bottom);\n  border-radius: var(--paginationbtn-border-radius);\n  margin: var(--paginationbtn-margin);\n  padding: var(--paginationbtn-padding);\n  font-size: var(--paginationbtn-font-size);\n}\n\n#pagenation .first-btn,\n#pagenation .previous-btn,\n#pagenation .last-btn,\n#pagenation .next-btn {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n#pagenation .first-btn span,\n#pagenation .previous-btn span {\n  display: block;\n  width: 7px;\n  height: 7px;\n  border: 1px solid;\n  border-color: transparent transparent var(--arrowbtn-color) var(--arrowbtn-color);\n  transform: rotate(45deg);\n}\n\n#pagenation .last-btn span,\n#pagenation .next-btn span {\n  display: block;\n  width: 7px;\n  height: 7px;\n  border: 1px solid;\n  border-color: var(--arrowbtn-color) var(--arrowbtn-color) transparent transparent;\n  transform: rotate(45deg);\n}\n\n#pagenation .current-btn {\n  color: var(--currentbtn-font-color);\n  background-color: var(--currentbtn-background-color);\n  border: var(--currentbtn-border);\n  border-bottom: var(--currentbtn-border-bottom);\n  border-radius: var(--currentbtn-border-radius);\n  padding: var(--currentbtn-padding);\n  margin: var(--currentbtn-margin);\n}\n\n.show-info {\n  display: flex;\n  justify-content: var(--showinfo-placement);\n}\n\nsummary {\n  display: none;\n}";

defineStanzaElement(tableWithPagination, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=table_with_pagination.js.map
