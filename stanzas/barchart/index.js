import * as d3 from 'd3';

const url = "http://togostanza.org/sparqlist/api/d3sparql_barchart";

export default async function barchart(stanza, params) {
  const json = await fetch(url).then(res => res.json());

  const dataset = json.results.bindings.map((row) => {
    return {
      label: row.pref.value,
      value: parseFloat(row.area.value)
    };
  });

  stanza.render({
    template: 'stanza.html.hbs'
  });

  draw(stanza.root.querySelector('#chart'), dataset);
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
    .domain(dataset.map(function(d) { return d.label; }));

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.value; })])
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

  // render bar
  svg.append("g")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d) { return xScale(d.label); })
    .attr("y", function(d) { return yScale(d.value); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - pad_bottom - yScale(d.value); })
    .attr("fill", "steelblue");
}
