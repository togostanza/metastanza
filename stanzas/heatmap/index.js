import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import {getGradationColor} from "@/lib/ColorGenerator";
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
    // make colors
    const getColorMin = this.params["gradation-color-min"];
    const getColorMiddle = this.params["gradation-color-middle"];
    const getColorMax = this.params["gradation-color-max"];
    const myColor = getGradationColor(this, [getColorMin, getColorMiddle, getColorMax]);

    const tickSize = +this.css("--togostanza-tick-size") || 0;
    const xLabelAngle = this.params["x-label-angle"] || 0;
    const yLabelAngle = this.params["y-label-angle"] || 0;
    const borderWidth = +this.css("--togostanza-border-width") || 0;

    // set the dimensions and margins of the graph
    const margin = {
      bottom: +this.css("--togostanza-font-size_primary") + tickSize + 10,
      left: +this.css("--togostanza-font-size_primary") + tickSize + 10,
    };
    const width = this.params["width"],
      height = this.params["height"];

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

    const x = d3.scaleBand().domain(rows).range([0, width - 10]);

    const xAxisGenerator = d3
      .axisBottom(x)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    const y = d3.scaleBand().range([height, 10]).domain(columns);
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

    // normalize
    const values = [...new Set(dataset.map((d) => d.value))];
    const normalize = (num) => {
      return (num - Math.min(...values)) / (Math.max(...values) - Math.min(...values));
    }

    graphArea
    .selectAll()
    .data(dataset, function (d) {
      return d.group + ":" + d.variabl
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
    .style("fill", (d) => myColor(normalize(d.value)))
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave);

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    this.legend.setup(
      this.intervals(values, myColor),
      {},
      this.root.querySelector("main")
    );

    function mouseover() {
      d3.select(this).classed("highlighted", true).raise();
      if (!borderWidth) {
        d3.select(this).classed("highlighted", true).style("stroke-width", "1px").raise();
      }
    }
    function mouseleave() {
      d3.select(this).classed("highlighted", false);
      if (!borderWidth) {
        d3.select(this).classed("highlighted", false).style("stroke-width", "0px");
      }
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
      const n = Math.round(min + i * (Math.abs(max - min) / (steps - 1)));
      return {
        label: n,
        color: color((n - min) / (max - min)),
      };
    });
  }
}
