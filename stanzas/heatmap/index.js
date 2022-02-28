import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";

import * as d3 from "d3";

const tooltipHTML = ({ group, variable, value }) => (`<span>${group},${variable}: <strong>${value}</strong></span>`)

export default class Heatmap extends Stanza {
  async render() {
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);
    const chartElement = this.root.querySelector("main");

    const root = this.root.querySelector(":scope > div");
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
      this.legend = new Legend();
      root.append(this.legend);
    }

    const params = {
      top: this.params["top"],
      right: this.params["right"],
      bottom: this.params["bottom"],
      left: this.params["left"],
      width: this.params["width"],
      height: this.params["height"],
      legendGroups: this.params["legend-groups"],
      showDomains: this.params["show-domains"],
      showTickLines: this.params["show-tick-lines"],
    };
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );


    this.draw(chartElement, css, params, data);
  }
  async draw(el, css, params, dataset) {
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
      .attr("transform", `translate(${margin.left},${margin.top})`)


    // Labels of row and columns
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

    if (!params["showDomains"]) {svg.selectAll(".domain").remove();}
    if (!params["showTickLines"]) {svg.selectAll(".tick line").remove();}

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

    function mouseover() {
      d3.select(this)
        .style("stroke", css("--togostanza-hover-border-color"))
    }
    function mouseleave() {
      d3.select(this)
        .style("stroke", "none")
    }

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
      .attr("rx", css("--togostanza-border-radius"))
      .attr("ry", css("--togostanza-border-radius"))
      .style("fill", (d) => myColor(d.value))
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)

    // create legend objects based on min and max data values with number of steps as set by user in params 
    const values = [...new Set(dataset.map((d) => d.value))];
    const intervals = (steps = params["legendGroups"] ?? 5) => {
      const [min, max] = [Math.min(...values), Math.max(...values)];
      return [...Array(steps + 1).keys()].map((i) => {
        const n = Math.round(min + (i) * ((max - min) / steps))
        return {
          label: n,
          color: myColor(n)
        }
      });
    }
    this.tooltip.setup([...svg.selectAll("[data-tooltip]")]);
    // TODO: fix legend positioning
    this.legend.setup(intervals(), {}, this.root.querySelector("main"));
  }
}



