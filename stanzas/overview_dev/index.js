import * as d3 from 'd3';
import metastanza from '@/lib/metastanza_utils.js';

export default async function overviewDev(stanza, params) {
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
  
  // first render
  if (!element.querySelector("div")) {
    for (let api of apis) {
      let div = d3.select(element).append("div").attr("id", api);
      let svg = div.append("svg").attr("width", width + labelMargin).attr("height", height);
      svg.append("text").attr("x", 0).attr("y", height / 2).attr("alignment-baseline", "central").text(dataset[api].type);

      dataset[api].data = setData(dataset[api].data, width, height, labelMargin);

      svg.attr("id", "svg_" + dataset[api].type.replace(/\s/g, "_"));
      svg.selectAll("rect")
	.data(dataset[api].data)
	.enter()
	.append("rect")
	.attr("x", function(d){ return d.barStart }).attr("y", 0)
	.attr("width", function(d){ return d.barWidth }).attr("height", height)
	.attr("id", function(d){ return d.onclick_list[0].id })
	.attr("class", function(d, i){
	  if (d.label != "None") return "bar-style-" + i;
	  return "bar-style-na";
	})
	.on("mouseover", function(e, d){
	  let rect = this;
	  let mouse = d3.pointer(e);
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
	.on("mouseout", function(e, d){ svg.select("text#" + d.onclick_list[0].id).remove() })
	.on("click", async function(e, d){
	  body.push(dataset[api].type + "=" + d.onclick_list[0].id);
	  for (let api of apis) {
	    let newData = await metastanza.getFormatedJson(api, element, body.join("&"));
	    dataset[api].data = changeData(dataset[api].data, newData.data, width, height, labelMargin);
	    let svg = d3.select(element).select("#svg_" + dataset[api].type.replace(/\s/g, "_"));
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
    for (let category of data) {
      total += parseFloat(category.count);
    }
    
    let start = labelMargin;
    for (let i = 0; i < data.length; i++) {
      let barWidth =  width * parseFloat(data[i].count) / total;
      if (data.length - 1 == i) barWidth = width - start + labelMargin;
      data[i].barStart = start;
      data[i].barWidth = barWidth;
      start += barWidth;
    }
    data.push({
      label: "None",
      count: "0",
      barStart: width + labelMargin,
      barWidth: 0,
      onclick_list: [{id: "n-a"}]
    });
    console.log(data);
    return data;
  }
  
  function changeData(data, newData, width, height, labelMargin){
    let total = 0;
    let label2data = {};
    if (!newData[0]) {
      newData = [{
	label: "None",
	count: "1",
	onclick_list: [{id: "n-a"}]
      }];
    }
    for (let category of newData) {
      total += parseFloat(category.count);
      label2data[category.label] = category;
    }
    let start = labelMargin;
    for (let i = 0; i < data.length; i++) {
      if (label2data[data[i].label]) data[i] = label2data[data[i].label];
      else data[i].count = 0;
      let barWidth =  width * parseFloat(data[i].count) / total;
      if (data.length - 1 == i) barWidth = width - start + labelMargin;
      data[i].barStart = start;
      data[i].barWidth = barWidth;
      start += barWidth;
    }
    console.log(data);
    return data;
  }
}
