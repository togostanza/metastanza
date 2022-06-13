import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";

import * as d3 from "d3";

const tooltipHTML = ({ group, variable, value }) =>
  `<span><strong>${group},${variable}: </strong>${value}</span>`;

export default class Heatmap extends Stanza {
  css(key) {
    return getComputedStyle(this.element).getPropertyValue(key);
  }
  async render() {
    const root = this.root.querySelector("main");
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
      this.legend = new Legend();
      root.append(this.legend);
    }

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this.draw(root, data);
  }
  async draw(el, dataset) {
    const tickSize = +this.css("--togostanza-tick-size") || 0;
    const xLabelAngle = this.params["x-label-angle"] || 0;
    const yLabelAngle = this.params["y-label-angle"] || 0;

    // set the dimensions and margins of the graph
    const margin = {
      bottom: +this.css("--togostanza-font-size") + tickSize + 10,
      left: +this.css("--togostanza-font-size") + tickSize + 10,
    };
    const width = this.params["width"] - margin.left,
      height = this.params["height"] - margin.bottom;

    // remove svg element whenthis.params updated
    d3.select(el).select("svg").remove();

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width + margin.left)
      .attr("height", height + margin.bottom);

    const graphArea = svg
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.left}, 0 )`);

    const rows = [...new Set(dataset.map((d) => d.group))];
    const columns = [...new Set(dataset.map((d) => d.variable))];

    const x = d3.scaleBand().domain(rows).range([0, width]).padding(0.01);

    const xAxisGenerator = d3
      .axisBottom(x)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    const y = d3.scaleBand().range([height, 0]).domain(columns).padding(0.01);
    const yAxisGridGenerator = d3
      .axisLeft(y)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    graphArea
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(200)
      .call(xAxisGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${xLabelAngle})`);

    graphArea
      .append("g")
      .classed("class", "y-axis")
      .transition()
      .duration(200)
      .call(yAxisGridGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${yLabelAngle})`);

    if (!this.params["show-domains"]) {
      svg.selectAll(".domain").remove();
    }
    if (!this.params["show-tick-lines"]) {
      svg.selectAll(".tick line").remove();
    }

    graphArea.selectAll("text").attr("class", "text");

    const myColor = d3
      .scaleLinear()
      .range([
        this.css("--togostanza-series-0-color"),
        this.css("--togostanza-series-1-color"),
      ])
      .domain([1, 100]);

    graphArea
      .selectAll()
      .data(dataset, function (d) {
        return d.group + ":" + d.variable;
      })
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.group))
      .attr("y", (d) => y(d.variable))
      .attr("data-tooltip-html", true)
      .attr("data-tooltip", (d) => tooltipHTML(d))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", this.css("--togostanza-border-radius"))
      .attr("ry", this.css("--togostanza-border-radius"))
      .style("fill", (d) => myColor(d.value))
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

    const values = [...new Set(dataset.map((d) => d.value))];

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    this.legend.setup(
      this.intervals(values, myColor),
      {},
      this.root.querySelector("main")
    );

    function mouseover() {
      d3.select(this).classed("highlighted", true);
    }
    function mouseleave() {
      d3.select(this).classed("highlighted", false);
    }
  }
  // create legend objects based on min and max data values with number of steps as set by user in this.params
  intervals(
    values,
    color,
    steps = this.params["legend-groups"] >= 2 ? this.params["legend-groups"] : 2
  ) {
    const [min, max] = [Math.min(...values), Math.max(...values)];
    return [...Array(steps).keys()].map((i) => {
      const n = Math.round(min + i * ((max - min) / steps));
      return {
        label: n,
        color: color(n),
      };
    });
  }
}
