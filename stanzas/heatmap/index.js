import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";

import * as d3 from "d3";

export default class Heatmap extends Stanza {
  async render() {
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);
    const chartElement = this.root.querySelector("main");
    const params = {
      top: this.params["top"],
      right: this.params["right"],
      bottom: this.params["bottom"],
      left: this.params["left"],
      width: this.params["width"],
      height: this.params["height"],
    };
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    draw(chartElement, css, params, data);
  }
}

async function draw(el, css, params, dataset) {
  // set the dimensions and margins of the graph
  const margin = {
      top: params["top"],
      right: params["right"],
      bottom: params["bottom"],
      left: params["left"],
    },
    width = params["width"] - margin.left - margin.right,
    height = params["height"] - margin.top - margin.bottom;

  // remove svg element when params updated
  d3.select(el).select("svg").remove();

  // append the svg object to the body of the page
  const svg = d3
    .select(el)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Labels of row and columns
  const myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

  // Build X scales and axis:
  const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Build X scales and axis:
  const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
  svg.append("g").call(d3.axisLeft(y));

  // Set font
  svg
    .selectAll("text")
    .attr("font-family", css("--togostanza-font-family"))
    .attr("fill", css("--togostanza-font-color"))
    .attr("font-size", css("--togostanza-font-size") + 'px')
    .attr("font-weight", css("--togostanza-font-weight"));

  // Build color scale
  const myColor = d3
    .scaleLinear()
    .range([
      css("--togostanza-series-0-color"),
      css("--togostanza-series-1-color"),
    ])
    .domain([1, 100]);

  svg
    .selectAll()
    .data(dataset, function (d) {
      return d.group + ":" + d.variable;
    })
    .join("rect")
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return y(d.variable);
    })
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) {
      return myColor(d.value);
    });
}
