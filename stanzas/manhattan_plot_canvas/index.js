import * as d3 from 'd3';
import metastanza from '@/lib/metastanza_utils.js';

export default async function manhattanPlotCanvas(stanza, params) {
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
      title: params.title
    }
  });

  console.log(params.api);
  let dataset = await metastanza.getFormatedJson(params.api, stanza.root.querySelector('#chart'));
  if (typeof dataset == "object") draw(dataset, stanza, params);
}

async function draw(dataset, stanza, params) {
  const width = 800;
  const height = 400;
  const marginLeft = 30;
  const marginBottom = 30;
  const areaWidth = width - marginLeft;
  const areaHeight = height - marginBottom;

  const chart_element = stanza.root.querySelector('#chart');
  const control_element = stanza.root.querySelector('#control');

  if (params.low_thresh == "") params.low_thresh = 0.5;
  if (params.high_thresh == "") params.high_thresh = Infinity;
  if (params.chromosome_key == "") params.chromosome_key = "chromosome";
  if (params.position_key == "") params.position_key = "position";
  if (params.p_value_key == "") params.p_value__key = "p-value";
  if (params.label_key == "") params.label_key = "label";
  const low_thresh = parseFloat(params.low_thresh);
  const high_thresh = parseFloat(params.high_thresh);
  const even_and_odd = (params.even_and_odd == 'true');
  const chromosome_key = params.chromosome_key;
  const position_key = params.position_key;
  const p_value_key = params.p_value_key;
  const label_key = params.label_key;
  
  const chromosomes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20","21", "22", "X", "Y"];
  const chromosomeNtLength = {
    hg38: {
      1: 248956422,
      2: 242193529,
      3: 198295559,
      4: 190214555,
      5: 181538259,
      6: 170805979,
      7: 159345973,
      8: 145138636,
      9: 138394717,
      10: 133797422,
      11: 135086622,
      12: 133275309,
      13: 114364328,
      14: 107043718,
      15: 101991189,
      16: 90338345,
      17: 83257441,
      18: 80373285,
      19: 58617616,
      20: 64444167,
      21: 46709983,
      22: 50818468,
      X: 156040895,
      Y: 57227415
    }
  }

  let canvas_div =  d3.select(chart_element).append("div").style("width", areaWidth + "px").style("overflow", "hidden").style("position", "absolute").style("left", marginLeft + "px");
  let canvas = canvas_div.append("canvas").attr("width", areaWidth).attr("height", areaHeight).style("position", "relative");
  let svg = d3.select(chart_element).append("svg").attr("width", width).attr("height", height);
  let plot_g = svg.append("g").attr("id", "plot_group");
  let axis_g = svg.append("g").attr("id", "axis");
  let xlabel_g = svg.append("g").attr("id", "x_label");
  let ylabel_g = svg.append("g").attr("id", "y_label");
  
  let range = []; // [begin position, en _position]
  let max_log_p = 0;
  let max_log_p_int;
  let total;

  // axis line
  axis_g.append("path")
    .attr("d", "M " + marginLeft + ", " + areaHeight + " H " + width +  " Z")
    .attr("class", "axis-line");
  axis_g.append("path")
    .attr("d", "M " + marginLeft + ", 0 V " + areaHeight +  " Z")
    .attr("class", "axis-line");

  // select range by drag
  let dragBegin = false;
  svg.on("mousedown", function(e, d){
    if (d3.pointer(e)[1] <= areaHeight) {
      dragBegin = d3.pointer(e)[0];
      svg.append("rect")
	.attr("fill", "rgba(128, 128, 128, 0.2)")
	.attr("stroke", "black")
	.attr("x", dragBegin)
	.attr("y", 0)
	.attr("width", 0)
	.attr("height", areaHeight)
	.attr("id", "selector");
    }
  })
    .on("mousemove", function(e, d){
      if(dragBegin){
	let dragEnd = d3.pointer(e)[0];
	if (dragBegin < dragEnd) {
	  svg.select("#selector")
	    .attr("width", dragEnd - dragBegin);
	} else {
	  svg.select("#selector")
	    .attr("x", dragEnd)
	    .attr("width", dragBegin - dragEnd);
	}
      }
    })
    .on("mouseup", function(e, d){
      if(dragBegin){
	let dragEnd = d3.pointer(e)[0];
	// re-render
	if (-5 > dragEnd - dragBegin) {
	  range = [dragEnd / width * (range[1] - range[0]) + range[0], dragBegin / width * (range[1] - range[0]) + range[0]];
	  reRender();
	} else if (dragEnd - dragBegin > 5) {
	  range = [dragBegin / width * (range[1] - range[0]) + range[0], dragEnd / width * (range[1] - range[0]) + range[0]];
	  reRender();
	}
	svg.select("#selector").remove();
	dragBegin = false;
      }
    });

  // slider
  let ctrl_svg = d3.select(control_element).append("svg").attr("width", width).attr("height", 20);
  ctrl_svg.append("path")
    .attr("d", "M " + marginLeft + ", 10 H " + width +  " Z")
    .attr("stroke", "#888888")
    .attr("stroke-width", "2px");
  ctrl_svg.append("rect")
    .attr("id", "slider")
    .attr("x", marginLeft)
    .attr("y", 2)
    .attr("width", areaWidth)
    .attr("height", 16)
    .attr("fill", "#8888ff")
    .call(
      d3.drag()
	.on("start", function(e){ dragBegin = e.x })
	.on("drag", function(e){
	  if(dragBegin) {
	    let slider = ctrl_svg.select("rect#slider");
	    let delta = e.x - dragBegin;
	    if (parseFloat(slider.attr("x")) + delta < marginLeft) delta = (parseFloat(slider.attr("x")) - marginLeft) * (-1);
	    else if (parseFloat(slider.attr("x")) + parseFloat(slider.attr("width")) + delta > width) delta = width - (parseFloat(slider.attr("x")) + parseFloat(slider.attr("width")));
	    slider.attr("transform", "translate(" + delta + ", 0)");
	    let move = delta / areaWidth * total;
	   // renderCanvas([range[0] + move, range[1] + move]);
	    canvas.style("left", ((range[0] + move) / (range[0] - range[1]) * areaWidth) + "px").style("display", "block");
	    plot_g.html("");
	    xlabel_g.html("");
	  }
	})
	.on("end", function(e){
	  if(dragBegin){
	    // re-render
	    let slider = ctrl_svg.select("rect#slider");
	    let delta = e.x - dragBegin;
	    if (parseFloat(slider.attr("x")) + delta < marginLeft) delta = (parseFloat(slider.attr("x")) - marginLeft) * (-1);
	    else if (parseFloat(slider.attr("x")) + parseFloat(slider.attr("width")) + delta > width) delta = width - (parseFloat(slider.attr("x")) + parseFloat(slider.attr("width")));
	    let move = delta / areaWidth * total;
	    range = [range[0] + move, range[1] + move];
	    reRender();
	    dragBegin = false;
	  }
	})
    );
  
  // button
  let ctrl_button = d3.select(control_element).append("div").attr("id", "ctrl_button");
  ctrl_button.append("input").attr("type", "button").attr("value", "-")
    .on("click", function(){
      let begin = range[0] - (range[1] - range[0]) / 2;
      let end = range[1] + (range[1] - range[0]) / 2;
      if (begin < 0) {
	begin = 0;
	end = (range[1] - range[0]) * 2;
	if (end > total) end = total;
      }else if (end > total) {
	end = total;
	begin = total - (range[1] - range[0]) * 2;
	if (begin < 0) begin - 0;
      }
      range = [begin, end];
      reRender();
    });
  ctrl_button.append("input").attr("type", "button").attr("value","+")
    .on("click", function(){
      let begin = range[0] + (range[1] - range[0]) / 4;
      let end = range[1] - (range[1] - range[0]) / 4;
      range = [begin, end];
      reRender();
    });
  ctrl_button.append("input").attr("type", "button").attr("value","reset")
    .on("click", function(){
      range = [];
      reRender();
    });

  reRender();
  
  function reRender(){
    
    if (range[0] == undefined) {
      range = [0,  Object.values(chromosomeNtLength.hg38).reduce((sum, value) => sum +value)];
      total = range[1];
    }
    
    max_log_p = 0;
    
    plot_g.html("");
    xlabel_g.html("");
    ylabel_g.html("");
    
    plot_g.selectAll(".plot")
      .data(dataset)
      .enter()
    // filter: display range
      .filter(function(d){
	if (!d.pos) {
	  // calculate  accumulated position
	  let pos = 0;
	  for(let ch of chromosomes){
	    if (ch == d[chromosome_key]) break;
	    pos += chromosomeNtLength.hg38[ch];
	  }
	  d.pos = pos + parseInt(d[position_key]);
	}
	return range[0] <= d.pos && d.pos <= range[1];
      })
    // filter: low p-value
      .filter(function(d){ return Math.log10(parseFloat(d[p_value_key])) * (-1) > low_thresh })
      .append("circle")
      .attr("class", function(d, i){
	if (even_and_odd) {
	  let tmp = "even";
	  if (d[chromosome_key] == "X" || parseInt(d[chromosome_key]) % 2 == 1) tmp = "odd";
	  return "plot ch_" + tmp;
	}
	return "plot ch_" + d[chromosome_key]
      })
      .attr("cx", function(d){
	return (d.pos - range[0]) / (range[1] - range[0]) * areaWidth + marginLeft})
      .attr("cy",function(d){
	// set max log(p-value)
	if (max_log_p < Math.log10(parseFloat(d[p_value_key])) * (-1)) max_log_p = Math.log10(parseFloat(d[p_value_key])) * (-1);
	return areaHeight;
      })
      .attr("r", 2)
    // filter: high p-value
      .filter(function(d){return Math.log10(parseFloat(d[p_value_key])) * (-1) > high_thresh })
      .classed("over-thresh-plot", true)
      .on("mouseover", function(e, d){
	svg.append("text").text(d[label_key]) //.text(d.dbSNP_RS_ID + ", " + d.Symbol)
	  .attr("x", d3.pointer(e)[0] + 10).attr("y", d3.pointer(e)[1]).attr("id", "popup_text");
      })
      .on("mouseout", function(e, d){
	svg.select("#popup_text").remove();
      });

    // set 'cy' from max log(p-value) (int)
    if (max_log_p_int == undefined) max_log_p_int = Math.floor(max_log_p);
    plot_g.selectAll(".plot")
      .attr("cy", function(d){ return areaHeight  - (Math.log10(parseFloat(d[p_value_key])) * (-1) - low_thresh) * areaHeight  / max_log_p_int});

    renderCanvas(range);
    
    // x axis label
    xlabel_g.selectAll(".xLabel")
      .data(chromosomes)
      .enter()
      .append("text")
      .attr("class", "axisLabel xLabel")
      .text(function(d){ return d; })
      .attr("x", function(d){
	let pos = chromosomeNtLength.hg38[d] / 2;
	for(let ch of chromosomes){
	  if (ch == d) break;
	  pos += chromosomeNtLength.hg38[ch];
	}
	return (pos - range[0]) / (range[1] - range[0]) * areaWidth + marginLeft;
      })
      .attr("y", areaHeight + 20);

    // y axis label
    for (let i = Math.floor(low_thresh) + 1; i <=  max_log_p_int; i++) {
      let y = areaHeight  - (i - low_thresh) * areaHeight / max_log_p_int;
      ylabel_g.append("text").text(i)
	.attr("class", "axisLabel yLabel")
	.attr("x", marginLeft - 16)
	.attr("y", y)
	.attr("text-anchor", "end");
      ylabel_g.append("path")
	.attr("class", "axis-line")
	.attr("d", "M " + (marginLeft - 10) + ", " + y + " H " + marginLeft + " Z");
    }
    //// y zero (low_thresh)
    ylabel_g.append("text").text(low_thresh)
      .attr("class", "axisLabel yLabel")
      .attr("x", marginLeft - 16)
      .attr("y", areaHeight)
      .attr("text-anchor", "end");
    ylabel_g.append("path")
      .attr("class", "axis-line")
      .attr("d", "M " + (marginLeft - 10) + ", " + areaHeight + " H " + marginLeft + " Z");

    // slider
    ctrl_svg.select("rect#slider")
      .attr("x", marginLeft + range[0] / total * areaWidth)
      .attr("width", (range[1] - range[0]) / total * areaWidth)
      .attr("transform", "translate(0, 0)");

  }
  
  function renderCanvas(range){
    if(canvas.node().getContext){
      canvas.attr("width", total / (range[1] - range[0]) * areaWidth);
      let ctx = canvas.node().getContext('2d');
      ctx.clearRect(0, 0, areaWidth, areaHeight);
      for (let d of dataset) {
	ctx.beginPath();
	if (Math.log10(parseFloat(d[p_value_key])) * (-1) > high_thresh) {
	  ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue("--over-thresh-color");
	} else if (even_and_odd) {
	  let tmp = "even";
	  if (d[chromosome_key] == "X" || parseInt(d[chromosome_key]) % 2 == 1) tmp = "odd";
	  ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue("--ch-" + tmp + "-color");
	} else {
	  ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue("--ch-" + d[chromosome_key] + "-color");
	}
	ctx.arc(d.pos / (range[1] - range[0]) * areaWidth, areaHeight  - (Math.log10(parseFloat(d[p_value_key])) * (-1) - low_thresh) * areaHeight  / max_log_p_int, 2 ,0 ,Math.PI * 2);
        ctx.fill();
      }
      canvas.style("left", (range[0] / (range[0] - range[1]) * areaWidth) + "px");
    }
    canvas.style("display", "none");
  }
  
}
