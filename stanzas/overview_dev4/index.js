import * as d3 from 'd3';
import metastanza from '@/lib/metastanza_utils.js';

export default async function overviewDev3(stanza, params) {
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
    }
  });
  
  let apis = JSON.parse(params.apis);
  if (typeof apis == "object") draw(stanza.root.querySelector('#chart'), apis, {});
}

async function draw(element, apis, body) {
  const labelMargin = 100;
  const width = 700;
  const height = 50;
  
  let dataset = {};
  for (let api of apis) {
    dataset[api] = await metastanza.getFormatedJson(api, element, mkBody(body));
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
	svg.append("text").attr("id", d.onclick_list[0].id).text(d.label + ": " + d.count + "/" + d.origCount)
	  .attr("x", function(){
	    let x = d.barStart + d.barWidth / 2;
	    let left = x - this.getBBox().width / 2;
	    let right = x + this.getBBox().width / 2;
	    if (left > labelMargin + 10 && right < labelMargin + width - 10) {
	      d.textAnchor = "middle";
	      return x;
	    } else if (left < labelMargin + 10){
	      d.textAnchor = "start";
	      return labelMargin + 10;
	    }
	    d.textAnchor = "end";
	    return labelMargin + width - 10;
	  })
	  .attr("y", height / 2)
	  .attr("text-anchor", d.textAnchor)
	  .attr("dominant-baseline", "central");
      })
      .on("mouseout", function(e, d){ svg.select("text#" + d.onclick_list[0].id).remove() })
      .on("click", async function(e, d){
	// re-render
	const key = dataset[api].type.replace(/\s/g, "_");
	const value = d.onclick_list[0].id;
	if (d3.select(e.currentTarget).select("#selected-sign-" + d.onclick_list[0].id).style("display") == "none"){
	  if (body[key]) body[key].push(value);
	  else body[key] = [value];
	  for (let api of apis) {
	    getDataAndRender(element, api, body, dataset);
	  }
	  d3.select(e.currentTarget).select("#selected-sign-" + d.onclick_list[0].id).style("display", "block");
	} else {
	  if (body[key].length == 1) delete body[key];
	  else {
	    for (let i = 0; i < body[key].length; i++) {
	      if (body[key][i] == value) {
		body[key].splice(i, 1);
		break;
	      }
	    }
	  }
	  for (let api of apis) {
	    getDataAndRender(element, api, body, dataset);
	  }
	  d3.select(e.currentTarget).select("#selected-sign-" + d.onclick_list[0].id).style("display", "none");
	}
      });

    // bg bar
    bar_g.append("rect").attr("class", "na-bar")
      .attr("x", function(d){ return d.barStart }).attr("y", 0)
      .attr("width", function(d){ return d.barWidth }).attr("height", height);

    // ratio bar
    bar_g.append("rect")
      .attr("x", function(d){ return d.barStart }).attr("y", 0)
      .attr("width", function(d){ return d.barWidth }).attr("height", height)
      .attr("id", function(d){ return d.onclick_list[0].id })
      .attr("class", function(d, i){
	if (d.label != "None") return "target-bar";
	return "bar-style-na";
      })
      .attr("fill", function(d){ return d.color });

    // selected sign
    bar_g.append("rect")
      .attr("x", function(d){ return d.barStart }).attr("y", height - 10)
      .attr("width", function(d){ return d.barWidth }).attr("height", 10)
      .attr("id", function(d){ return "selected-sign-" + d.onclick_list[0].id })
      .attr("class", "selected-sign");
  }

  let initDataset = JSON.parse(JSON.stringify(dataset));
  d3.select(element).append("p").html("&gt; Reset").style("cursor", "pointer")
    .on("click", function(){
      // reset-render
      body = {};
      for (let api of apis) {
	dataset[api].data = changeData(dataset[api], JSON.parse(JSON.stringify(initDataset[api].data)), width, height, labelMargin);
	reRender(element, dataset[api]);
      }
      d3.select(element).selectAll("rect.selected-sign").style("display", "none");
    });

  async function getDataAndRender(element, api, body, dataset){
    let newData = await metastanza.getFormatedJson(api, element.querySelector('#div_' + dataset[api].id), mkBody(body));
    dataset[api].data = changeData(dataset[api], newData.data, width, height, labelMargin);
    reRender(element, dataset[api]);
  };
  
  function reRender(element, dataset){
    let svg = d3.select(element).select("#svg_" + dataset.type.replace(/\s/g, "_"));
    svg.selectAll(".target-bar")
      .data(dataset.data)
      .transition()
      .delay(200)
      .duration(1000)
     // .attr("x", function(d){ return d.barStart })
     // .attr("width", function(d){ return d.targetBarWidth })
      .filter(function(d){ return d.color })
      .attr("fill", function(d){ return d.color });
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
      data[i].color = "#ff8800";
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
  
  function changeData(dataset, newData, width, height, labelMargin){
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
      start += targetBarWidth;
      // color
      let delta = Math.floor(data[i].count / data[i].origCount * 127);
      if (delta){
	let g = (256 - delta).toString(16);
	let b = (128 - delta).toString(16);
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;
	data[i].color = "#ff" + g + b;
      }else {
	data[i].color = "#dddddd";
      }
    }
    return data;
  };

  function mkBody(body){
    let params = [];
    for (let key in body) {
      params.push(key + "=" + body[key].join(","));
    }
    
    return params.join("&");
  }
}
