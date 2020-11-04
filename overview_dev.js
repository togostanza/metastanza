import { d as defineStanzaElement } from './stanza-element-46541929.js';
import './timer-a7d16713.js';
import { m as metastanza, s as select } from './metastanza_utils-280c63af.js';

function sourceEvent(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

function pointer(event, node) {
  event = sourceEvent(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

async function overviewDev(stanza, params) {
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
    }
  });
  
  let apis = JSON.parse(params.apis);
  if(typeof apis == "object") draw(stanza.root.querySelector('#chart'), apis, []);
}

async function draw(element, apis, body) {
  const labelMargin = 100;
  const width = 700;
  const height = 50;
  
  let dataset = {};
  for(let api of apis){
    dataset[api] = await metastanza.getFormatedJson(api, element, body.join("&"));
  }
  
  // first render
  if (!element.querySelector("div")){
    for(let api of apis){
      let div = select(element).append("div").attr("id", api);
      let svg = div.append("svg").attr("width", width + labelMargin).attr("height", height);
      svg.append("text").attr("x", 0).attr("y", height / 2).attr("alignment-baseline", "central").text(dataset[api].type);

      dataset[api].data = setData(dataset[api].data, width, height, labelMargin);

      svg.attr("id", "svg_" + dataset[api].type);
      svg.selectAll("rect")
	.data(dataset[api].data)
	.enter()
	.append("rect")
	.attr("x", function(d){ return d.barStart }).attr("y", 0)
	.attr("width", function(d){ return d.barWidth }).attr("height", height)
	.attr("id", function(d){ return d.onclick_list[0].id })
	.attr("class", function(d, i){ return "bar-style-" + i })
	.on("mouseover", function(e, d){
	  let mouse = pointer(e);
	  svg.append("text").attr("id", d.onclick_list[0].id).text(d.label + ": " + d.count)
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
	  body.push(dataset[api].type + "=" + d.onclick_list[0].id);
	  for(let api of apis){
	    let newData = await metastanza.getFormatedJson(api, element, body.join("&"));
	    dataset[api].data = changeData(dataset[api].data, newData.data, width, height, labelMargin);
	    let svg = select(element).select("#svg_" + dataset[api].type);
	    svg.selectAll("rect")
	      .data(dataset[api].data)
	      .transition()
              .delay(500)
              .duration(1000)
	      .attr("x", function(d){ return d.barStart })
	      .attr("width", function(d){ return d.barWidth });
	  }
	});
    }
  }

  function setData(data, width, height, labelMargin){
    let total = 0;
    for(let category of data){
      total += parseFloat(category.count);
    }
    
    let start = labelMargin;
    for(let i = 0; i < data.length; i++){
      let barWidth =  width * parseFloat(data[i].count) / total;
      if (data.length - 1 == i) barWidth = width - start + labelMargin;
      data[i].barStart = start;
      data[i].barWidth = barWidth;
      start += barWidth;
    }
    return data;
  }
  
  function changeData(data, newData, width, height, labelMargin){
    let total = 0;
    let label2data = {};
    for(let category of newData){
      total += parseFloat(category.count);
      label2data[category.label] = category;
    }
    
    let start = labelMargin;
    for(let i = 0; i < data.length; i++){
      if (label2data[data[i].label]) data[i] = label2data[data[i].label];
      else data[i].count = 0;
      let barWidth =  width * parseFloat(data[i].count) / total;
      if (data.length - 1 == i) barWidth = width - start + labelMargin;
      data[i].barStart = start;
      data[i].barWidth = barWidth;
      start += barWidth;
    }
    return data;
  }
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "overview_dev",
	"stanza:label": "Overview dev",
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
		"stanza:example": "[\"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=species\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=organ\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=disease\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=instrument\"]",
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
    return "<h1>overview</h1>\n<div id=\"chart\"></div>\n";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}\n\n.bar-style-0 {\n  fill: var(--series-0-color);\n}\n\n.bar-style-1 {\n  fill: var(--series-1-color);\n}\n\n.bar-style-2 {\n  fill: var(--series-2-color);\n}\n\n.bar-style-3 {\n  fill: var(--series-3-color);\n}\n\n.bar-style-4 {\n  fill: var(--series-4-color);\n}\n\n.bar-style-5 {\n  fill: var(--series-5-color);\n}\n\n.bar-style-5 {\n  fill: var(--series-5-color);\n}\n\n.bar-style-6 {\n  fill: var(--series-6-color);\n}\n\n.bar-style-7 {\n  fill: var(--series-7-color);\n}\n\n.bar-style-8 {\n  fill: var(--series-8-color);\n}\n\n.bar-style-9 {\n  fill: var(--series-9-color);\n}";

defineStanzaElement(overviewDev, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=overview_dev.js.map
