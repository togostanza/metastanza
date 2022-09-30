import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import { StanzaGradationColorGenerator } from "@/lib/ColorGenerator";
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
    // Create color series
    const cellColorMin = this.params["cell-color-range_min"];
    const cellColorMid = this.params["cell-color-range_mid"];
    const cellColorMax = this.params["cell-color-range_max"];
    const setColor = new StanzaGradationColorGenerator(this, [
      cellColorMin,
      cellColorMid,
      cellColorMax,
    ]).series;

    const axisTitlePadding = this.params["axis-title_padding"];
    const tickSize = +this.css("--togostanza-tick-size") || 0;
    const borderWidth = +this.css("--togostanza-border-width") || 0;

    //Margin between graph and title
    //現在は文字の大きさでmarginを考えているが、y軸後方のlabelの最大幅を考えるようにしたい、treeを参照する
    const margin =
      +this.css("--togostanza-fonts-font_size_primary") +
      tickSize +
      axisTitlePadding;

    //Width and height of GRAPH without coordinates
    const width = +this.css("--togostanza-outline-width"),
      height = +this.css("--togostanza-outline-height");

    //Remove svg element when this.params updated
    d3.select(el).select("svg").remove();

    //titleSpaceが固定値だから、変更したい。おそらく文字の大きさで幅を考えているからだと思われる。
    //y軸方向の最大の長さのlabelを取得すれば、解決されると考えられる
    const titleSpace = 20;

    //Drawing area
    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width + margin + titleSpace + axisTitlePadding)
      .attr("height", height + margin + titleSpace + axisTitlePadding);

    //Graph area including title
    //transrateが無い場合はx軸が左上のrectからになる。座標が描画されない
    const graphArea = svg
      .append("g")
      .attr("class", "chart")
      .attr(
        "transform",
        `translate(${margin + titleSpace + axisTitlePadding}, 0)`
      );

    //Parameters
    const xDataKey = this.params["axis-x-key"];
    const yDataKey = this.params["axis-y-key"];
    const xLabelAngle = this.params["x-ticks_labels_angle"] || 0;
    const yLabelAngle = this.params["y-ticks_labels_angle"] || 0;

    //Create a unique array of row and column labels
    const rows = [...new Set(dataset.map((d) => d[xDataKey]))];
    const columns = [...new Set(dataset.map((d) => d[yDataKey]))];

    //Set the x-axis direction
    const x = d3.scaleBand().domain(rows).range([0, width]);
    const xAxisGenerator = d3
      .axisBottom(x)
      .tickSizeOuter(0)
      .tickSizeInner(tickSize);

    //Set the y-axis direction
    const y = d3.scaleBand().domain(columns).range([0, height]);
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
        `translate(${width / 2}, ${height + margin + axisTitlePadding})`
      )
      .text(axisXTitle);

    graphArea
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(-${margin + axisTitlePadding}, ${height / 2})rotate(-90)`
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
