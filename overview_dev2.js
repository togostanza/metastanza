import { d as defineStanzaElement } from './stanza-element-46541929.js';
import './timer-a7d16713.js';
import { m as metastanza, s as select } from './metastanza_utils-962e7f54.js';
import { p as pointer } from './pointer-be8dd836.js';

async function overviewDev2(stanza, params) {
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
    }
  });
  
  let apis = JSON.parse(params.apis);
  if (typeof apis == "object") draw(stanza.root.querySelector('#chart'), apis, []);
}

async function draw(element, apis, body) {
  const labelMargin = 100;
  const width = 700;
  const height = 50;
  
  let dataset = {};
  for (let api of apis) {
    dataset[api] = await metastanza.getFormatedJson(api, element, body.join("&"));
  }
  

  for (let id = 0; id < apis.length; id++) {
    let api = apis[id];
    // first render
    let div = select(element).append("div").attr("id", "div_" + id).attr("class", "bar");
    let svg = div.append("svg").attr("width", width + labelMargin).attr("height", height);
    svg.append("text").attr("x", 0).attr("y", height / 2).attr("alignment-baseline", "central").text(dataset[api].type.charAt(0).toUpperCase() + dataset[api].type.slice(1));
    
    [dataset[api].data, dataset[api].total] = setData(dataset[api].data, width, height, labelMargin);
    dataset[api].id = id;
    
    svg.attr("id", "svg_" + dataset[api].type.replace(/\s/g, "_"));

    // bar group
    let bar_g = svg.selectAll(".bar-g")
      .data(dataset[api].data)
      .enter()
      .append("g")
      .attr("class", "bar-g")
      .on("mouseover", function(e, d){
	let mouse = pointer(e);
	svg.append("text").attr("id", d.onclick_list[0].id).text(d.label + ": " + d.count + "/" + d.origCount)
	  .attr("x", function(d){
	    if (mouse[0] > width / 2 + labelMargin) return mouse[0] - 10;
	    return mouse[0] + 10;
	  })
	  .attr("y", height / 2)
	  .attr("alignment-baseline", "central")
	  .attr("text-anchor", function(){
	    if (mouse[0] > width / 2 + labelMargin) return "end";
	  });
      })
      .on("mouseout", function(e, d){ svg.select("text#" + d.onclick_list[0].id).remove(); })
      .on("click", async function(e, d){
	// re-render
	let flag = true;
	for (let i = 0; i < body.length; i++) {
	  if (body[i].match(/(\w+)=/)[1] == dataset[api].type) {
	    body[i] += "," + d.onclick_list[0].id;
	    flag = false;
	  }
	}
	if (flag) body.push(dataset[api].type + "=" + d.onclick_list[0].id);
	for (let api of apis) {
	  getDataAndRender(element, api, body, dataset);
	}
	select(e.currentTarget).select("#selected-sign-" + d.onclick_list[0].id).style("display", "block");
      });

    // bg bar
    bar_g.append("rect").attr("class", "na-bar")
      .attr("x", function(d){ return d.barStart }).attr("y", 0)
      .attr("width", function(d){ return d.barWidth }).attr("height", height);

    // ratio bar
    bar_g.append("rect")
      .attr("x", function(d){ return d.barStart }).attr("y", 0)
      .attr("width", function(d){ return d.targetBarWidth }).attr("height", height)
      .attr("id", function(d){ return d.onclick_list[0].id })
      .attr("class", function(d, i){
	if (d.label != "None") return "target-bar bar-style-" + i;
	return "bar-style-na";
      });

    // selected sign
    bar_g.append("rect")
      .attr("x", function(d){ return d.barStart }).attr("y", height - 10)
      .attr("width", function(d){ return d.barWidth }).attr("height", 10)
      .attr("id", function(d){ return "selected-sign-" + d.onclick_list[0].id })
      .attr("class", "selected-sign");
  }

  let initDataset = JSON.parse(JSON.stringify(dataset));
  select(element).append("p").html("reset").style("cursor", "pointer")
    .on("click", function(){
      // reset-render
      body = [];
      for (let api of apis) {
	dataset[api].data = changeData(dataset[api], JSON.parse(JSON.stringify(initDataset[api].data)), width, height, labelMargin, true);
	reRender(element, dataset[api]);
      }
    });

  async function getDataAndRender(element, api, body, dataset){
    let newData = await metastanza.getFormatedJson(api, element.querySelector('#div_' + dataset[api].id), body.join("&"));
    dataset[api].data = changeData(dataset[api], newData.data, width, height, labelMargin);
    reRender(element, dataset[api]);
  }  
  function reRender(element, dataset){
    console.log(dataset.data);
    let svg = select(element).select("#svg_" + dataset.type.replace(/\s/g, "_"));
    svg.selectAll(".target-bar")
      .data(dataset.data)
      .transition()
      .delay(200)
      .duration(1000)
      .attr("x", function(d){ return d.barStart })
      .attr("width", function(d){ return d.targetBarWidth });
  }  
  function setData(data, width, height, labelMargin){
    let total = 0;
    for (let category of data) {
      total += parseFloat(category.count);
    }
    
    let start = labelMargin;
    for (let i = 0; i < data.length; i++) {
      let barWidth =  width * parseFloat(data[i].count) / total;
      if (data.length - 1 == i) barWidth = width - start + labelMargin;
      data[i].origCount = data[i].count;
      data[i].barStart = start;
      data[i].barWidth = barWidth;
      data[i].targetBarWidth = 0;
      start += barWidth;
    }
    data.push({
      label: "None",
      count: "0",
      barStart: width + labelMargin,
      barWidth: 0,
      onclick_list: [{id: "n-a"}]
    });
    return [data, total];
  }  
  function changeData(dataset, newData, width, height, labelMargin, initFlag){
    let data = dataset.data;
    let label2data = {};
    if (!newData[0]) {
      newData = [{
	label: "None",
	count: "1",
	onclick_list: [{id: "n-a"}]
      }];
    }
    let total = 0;
    for (let category of data) {
      total += parseFloat(category.count);
    }
    for (let category of newData) {
      label2data[category.label] = category;
    }
    let start = labelMargin;
    for (let i = 0; i < data.length; i++) {
      if (label2data[data[i].label]) data[i].count = label2data[data[i].label].count;
      else data[i].count = 0;
      let targetBarWidth =  width * parseFloat(data[i].count) / dataset.total;
      if (data.length - 1 == i) targetBarWidth = width - start + labelMargin;
      data[i].targetBarWidth = targetBarWidth;
      if (initFlag) data[i].targetBarWidth = 0;
      start += targetBarWidth;
    }
    return data;
  }}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "overview_dev2",
	"stanza:label": "Overview dev2",
	"stanza:definition": "",
	"stanza:type": "MetaStanza",
	"stanza:display": "Chart",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "TogoStanza",
	"stanza:address": "admin@biohackathon.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-04",
	"stanza:updated": "2020-11-04",
	"stanza:parameter": [
	{
		"stanza:key": "apis",
		"stanza:example": "[\"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=species\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=organ\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=disease\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=sample_type\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=cell_line\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=modification\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=instrument\"]",
		"stanza:description": "api list",
		"stanza:required": true
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#ffa8a8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-1-color",
		"stanza:type": "color",
		"stanza:default": "#ffffa8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-2-color",
		"stanza:type": "color",
		"stanza:default": "#a8ffa8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-3-color",
		"stanza:type": "color",
		"stanza:default": "#a8ffff",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-4-color",
		"stanza:type": "color",
		"stanza:default": "#a8a8ff",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-5-color",
		"stanza:type": "color",
		"stanza:default": "#ffa8ff",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-6-color",
		"stanza:type": "color",
		"stanza:default": "#ffd3a8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-7-color",
		"stanza:type": "color",
		"stanza:default": "#d3ffa8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-8-color",
		"stanza:type": "color",
		"stanza:default": "#a8ffd3",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-9-color",
		"stanza:type": "color",
		"stanza:default": "#a8d3ff",
		"stanza:description": "bar color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Overview 2</h1>\n<div id=\"chart\"></div>\n";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}\n\ndiv#chart {\n  position: relative;\n}\n\ndiv.bar {\n  position: relative;\n}\n\n.bar-style-na {\n  fill: #dddddd;\n}\n\n.bar-style-0 {\n  fill: var(--series-0-color);\n}\n\n.bar-style-1 {\n  fill: var(--series-1-color);\n}\n\n.bar-style-2 {\n  fill: var(--series-2-color);\n}\n\n.bar-style-3 {\n  fill: var(--series-3-color);\n}\n\n.bar-style-4 {\n  fill: var(--series-4-color);\n}\n\n.bar-style-5 {\n  fill: var(--series-5-color);\n}\n\n.bar-style-5 {\n  fill: var(--series-5-color);\n}\n\n.bar-style-6 {\n  fill: var(--series-6-color);\n}\n\n.bar-style-7 {\n  fill: var(--series-7-color);\n}\n\n.bar-style-8 {\n  fill: var(--series-8-color);\n}\n\n.bar-style-9 {\n  fill: var(--series-9-color);\n}\n\n.na-bar {\n  fill: #dddddd;\n  stroke: #888888;\n  stroke-width: 2px;\n}\n\n.selected-sign {\n  display: none;\n  fill: #e33512;\n}";

defineStanzaElement(overviewDev2, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=overview_dev2.js.map
