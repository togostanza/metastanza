import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  copyHTMLSnippetToClipboardMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Linechart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
      downloadJSONMenuItem(this, "linechart", this._data),
      downloadCSVMenuItem(this, "linechart", this._data),
      downloadTSVMenuItem(this, "linechart", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width、height、padding

    const padding = this.params["padding"];

    //data
    const labelVariable = this.params["category"];
    const valueVariable = this.params["value"];
    const groupVariable = this.params["group-by"]
      ? this.params["group-by"]
      : "none";

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    this._data = values;

    // find most long legend caption

    const dataMin = d3.min(values, (d) => +d.count);
    const dataMax = d3.max(values, (d) => +d.count);

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const MARGIN = { TOP: 10, BOTTOM: 60, LEFT: 50, RIGHT: 150 };
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    const el = this.root.querySelector("#linechart-d3");

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const graphArea = svg.append("g").attr("class", "chart");

    const legendArea = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - MARGIN.RIGHT},0)`);

    const linesArea = graphArea
      .append("g")
      .attr("class", "lines")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const xAxisArea = graphArea
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(${MARGIN.LEFT},${HEIGHT + MARGIN.TOP})`);

    const yAxisArea = graphArea
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`)
      .attr("class", "y axis");

    const groups = [...new Set(values.map((d) => d.chromosome))];

    const subgroups = [...new Set(values.map((d) => d[groupVariable]))];

    const x = d3.scaleBand().domain(groups).range([0, WIDTH]);

    xAxisArea
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("x", "-0.7em")
      .attr("y", "0")
      .attr("dy", "0.4em")
      //.attr("dominant-baseline", "middle")
      .attr("transform", "rotate(-90)");

    const y = d3.scaleLinear().domain([dataMin, dataMax]).range([HEIGHT, 0]);

    yAxisArea.call(d3.axisLeft(y));

    const xAxisGrid = d3
      .axisBottom(x)
      .tickSize(-HEIGHT)
      .tickFormat("")
      .ticks(10);

    const yAxisGrid = d3.axisLeft(y).tickSize(-WIDTH).tickFormat("").ticks(10);

    linesArea
      .append("g")
      .attr("class", "x gridlines")
      .attr("transform", "translate(0," + HEIGHT + ")")
      .call(xAxisGrid);

    linesArea.append("g").attr("class", "y gridlines").call(yAxisGrid);

    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    const categorizedData = d3.group(values, (d) => d[groupVariable]);

    console.log("categorizedData", categorizedData);

    linesArea
      .append("g")
      .attr("class", "data-lines")
      .selectAll("g")
      .data(categorizedData)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d[0]);
      })
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        console.log("d", d);
        return d3
          .line()
          .x(function (d) {
            return x(d.chromosome) + x.bandwidth() / 2;
          })
          .y(function (d) {
            return y(+d.count);
          })(d[1]);
      });

    const legendItems = legendArea
      .selectAll("g")
      .data(subgroups)
      .join("g")
      .attr("class", "legend item");

    legendItems
      .append("line")
      .attr("x1", 15)
      .attr("x2", "30")
      .attr("y1", (_, i) => {
        return MARGIN.TOP + i * 15;
      })
      .attr("y2", (_, i) => {
        return MARGIN.TOP + i * 15;
      })
      .attr("stroke-width", 1.5)
      .attr("stroke", (d) => color(d));

    legendItems
      .append("text")
      .attr("x", 33)
      .attr("y", (_, i) => {
        return MARGIN.TOP + i * 15;
      })
      .attr("class", "legend label")
      .attr("font-size", "0.6em")
      .attr("alignment-baseline", "middle")
      .text((d) => d);
  }
}
