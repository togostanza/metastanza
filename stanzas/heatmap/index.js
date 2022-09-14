import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import { StanzaInterpolateColorGenerator } from "@/lib/ColorGenerator";
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
    const cellColorMin = this.params["cell-color-range_min"];
    const cellColorMid = this.params["cell-color-range_mid"];
    const cellColorMax = this.params["cell-color-range_max"];
    const generateColor = new StanzaInterpolateColorGenerator(this, [
      cellColorMin,
      cellColorMid,
      cellColorMax,
    ]);
    const setColor = generateColor.series;

    const tickSize = +this.css("--togostanza-tick-size") || 0;
    const xLabelAngle = this.params["x-ticks_labels_angle"] || 0;
    const yLabelAngle = this.params["y-ticks_labels_angle"] || 0;
    const borderWidth = +this.css("--togostanza-border-width") || 0;

    // set the dimensions and margins of the graph
    const margin = {
      bottom: +this.css("--togostanza-fonts-font_size_primary") + tickSize + 10,
      left: +this.css("--togostanza-fonts-font_size_primary") + tickSize + 10,
    };
    const width = +this.css("--togostanza-outline-width"),
      height = +this.css("--togostanza-outline-height");

    // remove svg element whenthis.params updated
    d3.select(el).select("svg").remove();
    const titleSpace = 20;
    const axisXTitlePadding = this.params["axis-x-title_padding"];
    const axisYTitlePadding = this.params["axis-y-title_padding"];

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width + margin.left + titleSpace + axisYTitlePadding)
      .attr("height", height + margin.bottom + titleSpace + axisXTitlePadding);

    const graphArea = svg
      .append("g")
      .attr("class", "chart")
      .attr(
        "transform",
        `translate(${margin.left + titleSpace + axisYTitlePadding}, 0)`
      );

    const xDataKey = this.params["axis-x-data_key"];
    const yDataKey = this.params["axis-y-data_key"];

    const rows = [...new Set(dataset.map((d) => d[xDataKey]))];
    const columns = [...new Set(dataset.map((d) => d[yDataKey]))];

    const x = d3
      .scaleBand()
      .domain(
        rows.slice(
          this.params["axis-x-range_min"],
          this.params["axis-x-range_max"]
        )
      )
      .range([0, width - 10]);
    const xAxisGenerator = d3
      .axisBottom(x)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    const y = d3
      .scaleBand()
      .range([height, 0])
      .domain(
        columns.slice(
          this.params["axis-y-range_min"],
          this.params["axis-y-range_max"]
        )
      );
    const yAxisGridGenerator = d3
      .axisLeft(y)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    // normalize
    const cellColorDataKey = this.params["cell-color-data_key"];
    const values = [...new Set(dataset.map((d) => d[cellColorDataKey]))];
    const normalize = (num) => {
      return (
        (num - Math.min(...values)) /
        (Math.max(...values) - Math.min(...values))
      );
    };

    graphArea
      .selectAll()
      .data(dataset, function (d) {
        return d[xDataKey] + ":" + d[yDataKey];
      })
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[xDataKey]))
      .attr("y", (d) => y(d[yDataKey]))
      .attr("data-tooltip-html", true)
      .attr("data-tooltip", (d) => tooltipHTML(d))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", this.css("--togostanza-border-radius"))
      .attr("ry", this.css("--togostanza-border-radius"))
      .style("fill", (d) => setColor(normalize(d[cellColorDataKey])))
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);

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
      .attr("class", "y-axis")
      .transition()
      .duration(200)
      .call(yAxisGridGenerator)
      .selectAll("text")
      .attr("transform", `rotate(${yLabelAngle})`);

    if (!this.params["axis-x-hide"]) {
      svg.select(".x-axis path").remove();
    }
    if (!this.params["axis-y-hide"]) {
      svg.select(".y-axis path").remove();
    }
    if (!this.params["axis-x-ticks_hide"]) {
      svg.selectAll(".x-axis .tick line").remove();
    }
    if (!this.params["axis-y-ticks_hide"]) {
      svg.selectAll(".y-axis .tick line").remove();
    }

    const axisXTitle = this.params["axis-x-title"]
      ? this.params["axis-x-title"]
      : xDataKey;
    const axisYTitle = this.params["axis-y-title"]
      ? this.params["axis-y-title"]
      : yDataKey;

    graphArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(${width / 2}, ${height + margin.bottom + axisXTitlePadding})`
      )
      .text(axisXTitle);

    graphArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(-${margin.left + axisYTitlePadding}, ${
          height / 2
        })rotate(-90)`
      )
      .text(axisYTitle);

    graphArea.selectAll("text").attr("class", "text");

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    this.legend.setup(
      this.intervals(values, setColor),
      {},
      this.root.querySelector("main")
    );

    function mouseover() {
      d3.select(this).classed("highlighted", true).raise();
      if (!borderWidth) {
        d3.select(this)
          .classed("highlighted", true)
          .style("stroke-width", "1px")
          .raise();
      }
    }
    function mouseleave() {
      d3.select(this).classed("highlighted", false);
      if (!borderWidth) {
        d3.select(this)
          .classed("highlighted", false)
          .style("stroke-width", "0px");
        graphArea.selectAll(".x-axis").raise();
        graphArea.selectAll(".y-axis").raise();
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
