import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";

import * as d3 from "d3";

const tooltipHTML = ({ group, variable, value }) => (`<span><strong>${group},${variable}: </strong>${value}</span>`)

export default class Heatmap extends Stanza {
  css(key) {
    return getComputedStyle(this.element).getPropertyValue(key);
  }
  async render() {
    const chartElement = this.root.querySelector("main");

    const root = this.root.querySelector(":scope > div");
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
      this.legend = new Legend();
      root.append(this.legend);
    }

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );


    this.draw(chartElement, data);
  }
  async draw(el, dataset) {
    // set the dimensions and margins of the graph
    const margin = {
      top:this.params["top"],
      right:this.params["right"],
      bottom:this.params["bottom"],
      left:this.params["left"],
    },
      width =this.params["width"] - margin.left - margin.right,
      height =this.params["height"] - margin.top - margin.bottom;

    // remove svg element whenthis.params updated
    d3.select(el).select("svg").remove();

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const rows = [...new Set(dataset.map((d) => d.group))];
    const columns = [...new Set(dataset.map((d) => d.variable))];

    const x = d3.scaleBand()
      .range([0, width])
      .domain(rows)
      .padding(0.01);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))

    const y = d3.scaleBand()
      .range([height, 0])
      .domain(columns)
      .padding(0.01);
    svg.append("g")
      .call(d3.axisLeft(y));

    if (!this.params["show-domains"]) { svg.selectAll(".domain").remove(); }
    if (!this.params["show-tick-lines"]) { svg.selectAll(".tick line").remove(); }

    svg
      .selectAll("text")
      .attr("font-family", this.css("--togostanza-font-family"))
      .attr("fill", this.css("--togostanza-font-color"))
      .attr("font-size", Number(this.css("--togostanza-font-size")))
      .attr("font-weight", this.css("--togostanza-font-weight"));

    const myColor = d3
      .scaleLinear()
      .range([
        this.css("--togostanza-series-0-color"),
        this.css("--togostanza-series-1-color"),
      ])
      .domain([1, 100]);

    svg
      .selectAll()
      .data(dataset, function (d) {
        return d.group + ":" + d.variable;
      })
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.group))
      .attr("y", (d) => y(d.variable))
      .attr("data-tooltipHtml", true)
      .attr("data-tooltip", (d) => tooltipHTML(d))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", this.css("--togostanza-border-radius"))
      .attr("ry", this.css("--togostanza-border-radius"))
      .style("fill", (d) => myColor(d.value))
      .on("mouseover", this.mouseover.bind(this))
      .on("mouseleave", this.mouseleave)

    const values = [...new Set(dataset.map((d) => d.value))];
    this.tooltip.setup([...svg.selectAll("[data-tooltip]")]);
    this.legend.setup(this.intervals(values, myColor), {}, this.root.querySelector("main"));
  }
  // create legend objects based on min and max data values with number of steps as set by user inthis.params 
  intervals(values, color, steps = this.params["legend-groups"] ?? 5) {
    const [min, max] = [Math.min(...values), Math.max(...values)];
    return [...Array(steps + 1).keys()].map((i) => {
      const n = Math.round(min + (i) * ((max - min) / steps))
      return {
        label: n,
        color: color(n)
      }
    });
  }
  mouseover(e) {
    d3.select(e.path[0])
      .style("stroke", this.css("--togostanza-hover-border-color"))
  }
  mouseleave() {
    d3.select(this)
      .style("stroke", "none")
  }
}



