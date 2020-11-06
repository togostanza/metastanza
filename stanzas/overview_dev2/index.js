import * as d3 from 'd3';
import metastanza from '@/lib/metastanza_utils.js';

export default async function overviewDev2(stanza, params) {
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
    let div = d3.select(element).append("div").attr("id", "div_" + id).attr("class", "bar");
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
	let rect = this;
	let mouse = d3.pointer(e);
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
      .on("mouseout", function(e, d){ svg.select("text#" + d.onclick_list[0].id).remove() })
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
	d3.select(e.currentTarget).select("#selected-sign-" + d.onclick_list[0].id).style("display", "block");
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
  d3.select(element).append("p").html("reset").style("cursor", "pointer")
    .on("click", function(){
      // reset-render
      body = [];
      for (let api of apis) {
	dataset[api].data = changeData(dataset[api], JSON.parse(JSON.stringify(initDataset[api].data)), width, height, labelMargin, true);
	reRender(element, dataset[api]);
      }
      d3.select(element).selectAll("rect.selected-sign").style("display", "none");
    });

  async function getDataAndRender(element, api, body, dataset){
    let newData = await metastanza.getFormatedJson(api, element.querySelector('#div_' + dataset[api].id), body.join("&"));
    dataset[api].data = changeData(dataset[api], newData.data, width, height, labelMargin);
    reRender(element, dataset[api]);
  };
  
  function reRender(element, dataset){
    console.log(dataset.data);
    let svg = d3.select(element).select("#svg_" + dataset.type.replace(/\s/g, "_"));
    svg.selectAll(".target-bar")
      .data(dataset.data)
      .transition()
      .delay(200)
      .duration(1000)
      .attr("x", function(d){ return d.barStart })
      .attr("width", function(d){ return d.targetBarWidth });
  };
  
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
  };
  
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
  };
}
