import * as d3 from 'd3';
import metastanza from '@/lib/metastanza_utils.js';

export default async function barchart(stanza, params) {
  
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
      title: params.title
    }
  });
  
  const element = stanza.root.querySelector('#chart');
  //const dataset = await metastanza.getJsonFromSparql(params.api, element, params.post_params, params.label_var_name, params.value_var_name);
  const dataset = await metastanza.getFormatedJson(params.api, element, params.post_params);
  if (typeof(dataset) === "object") draw(stanza.root.querySelector('#chart'), dataset);
}


function draw(el, dataset) {
  let width = 800;
  let height = 400;
  let pad_left = 50;
  let pad_right = 10;
  let pad_top = 10;
  let pad_bottom = 130;

  // SVG
  const svg = d3.select(el).append("svg").attr("width", width).attr("height", height);

  // axis scale
  let xScale = d3.scaleBand()
      .rangeRound([pad_left, width - pad_right])
      .padding(0.1)
      .domain(dataset.data.map(function(d) { return d.label; }));
  
  let yScale = d3.scaleLinear()
      .domain( [0, d3.max(dataset.data, function(d) {
	let sum  = 0;
	Object.keys(d).forEach(key => { if(key != "label") sum += d[key]; })
	return sum;
      }) ])
      .range([height - pad_bottom, pad_top]);
  
  // render axis
  svg.append("g")
    .attr("transform", "translate(" + 0 + "," + (height - pad_bottom) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("dx", "-0.8em")
    .attr("dy", "-0.6em");
  
  svg.append("g")
    .attr("transform", "translate(" + pad_left + "," + 0 + ")")
    .call(d3.axisLeft(yScale));
  
  let stack = d3.stack().keys(dataset.series).order(d3.stackOrderDescending);
  let series = stack(dataset.data);

  console.log(series);
  
  // render bar
  let data_bar_g = svg.append("g");
  let series_g = data_bar_g.selectAll(".series")
      .data(series)
      .enter()
      .append("g")
      .attr("class", function(d, i){ return "series series_" + i; });
  series_g.selectAll(".bar")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d.data.label); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); }); 

}
