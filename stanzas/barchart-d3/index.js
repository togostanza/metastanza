import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
// import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  copyHTMLSnippetToClipboardMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Barchart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "barchart"),
      downloadPngMenuItem(this, "barchart"),
      downloadJSONMenuItem(this, "barchart", this._data),
      downloadCSVMenuItem(this, "barchart", this._data),
      downloadTSVMenuItem(this, "barchart", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width、height、padding

    const padding = this.params["padding"];

    //data
    const xKeyName = this.params["category"];
    const yKeyName = this.params["value"];
    const xAxisTitle = this.params["category-title"];
    const yAxisTitle = this.params["value-title"];
    const showXTicks = this.params["xtick"] === "true" ? true : false;
    const showYTicks = this.params["ytick"] === "true" ? true : false;
    const showLegend = this.params["legend"] === "true" ? true : false;
    const groupKeyName = this.params["group-by"];
    const showXGrid = this.params["xgrid"] === "true" ? true : false;
    const showYGrid = this.params["ygrid"] === "true" ? true : false;
    const xLabelAngle = parseInt(this.params["xlabel-angle"]) || -90;
    const yLabelAngle = parseInt(this.params["ylabel-angle"]) || 0;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector(":scope > div");

    // On change params rerender - Check if legend and svg already existing and remove them -
    const existingLegend = this.root.querySelector("togostanza--legend");
    if (existingLegend) {
      existingLegend.remove();
    }
    const existingSVG = this.root.querySelector("svg");
    if (existingSVG) {
      existingSVG.remove();
    }
    // ====

    // Add legend

    if (showLegend) {
      this.legend = new Legend();
      root.append(this.legend);
    }

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    this._data = values;

    const subKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];
    const stack = d3.stack().keys(subKeyNames);

    const dataset = [];
    for (const entry of d3.group(values, (d) => d[xKeyName]).entries()) {
      dataset.push({
        x: entry[0],
        ...Object.fromEntries(
          entry[1].map((d) => [d[groupKeyName], +d[yKeyName]])
        ),
      });
    }

    const stackedData = stack(dataset);

    const dataMin = d3.min(values, (d) => +d[yKeyName]);
    const dataMax = d3.max(stackedData[stackedData.length - 1], (d) => d[1]);

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const MARGIN = { TOP: 10, BOTTOM: 60, LEFT: 50, RIGHT: 10 };
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    const el = this.root.querySelector("#barchart-d3");

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const graphArea = svg.append("g").attr("class", "chart");

    const barsArea = graphArea
      .append("g")
      .attr("class", "bars")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const xAxisArea = graphArea
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(${MARGIN.LEFT},${HEIGHT + MARGIN.TOP})`);

    const yTitleArea = graphArea.append("g").attr("class", "y axis title");
    const xTitleArea = graphArea
      .append("g")
      .attr("class", "x axis title")
      .attr("dominant-baseline", "hanging")
      .attr(
        "transform",
        `translate(0,${HEIGHT + MARGIN.TOP + MARGIN.BOTTOM / 2})`
      );

    const yTitle = yTitleArea
      .append("text")
      .text(yAxisTitle)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -HEIGHT / 2 - MARGIN.TOP)
      .attr("y", 10);

    xTitleArea
      .append("text")
      .text(xAxisTitle)
      .attr("text-anchor", "middle")
      .attr("x", MARGIN.LEFT + WIDTH / 2);

    const yAxisArea = graphArea
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`)
      .attr("class", "y axis");

    /// Axes preparation
    const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];

    const x = d3.scaleBand().domain(xAxisLabels).range([0, WIDTH]).padding(0.2);
    const y = d3.scaleLinear().domain([0, dataMax]).range([HEIGHT, 0]);

    // Show/hide axes ticks
    if (showXTicks) {
      let xdy = "0.5em";
      let xx = "-0.7em";
      let textAnchor = "end";
      if ((xLabelAngle < 0) & (xLabelAngle !== -90)) {
        xdy = "0.8em";
        textAnchor = "end";
      }
      if ((xLabelAngle > 0) & (xLabelAngle !== 90)) {
        xx = "0.7em";
        xdy = "0.71em";
        textAnchor = "start";
      }

      xAxisArea
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("text-anchor", textAnchor)
        .attr("x", xx)
        .attr("y", "0")
        .attr("dy", xdy)
        .attr("transform", `rotate(${xLabelAngle})`);
    }
    if (showYTicks) {
      yAxisArea
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("transform", `rotate(${yLabelAngle})`);
    }

    // ====

    if (groupKeyName) {
      //   [...new Set(values.map((d) => d[groupKeyName]))].map((keyName) => {
      //     return values.map((d) => ({ x: d[xKeyName], y: +d[yKeyName] }));
      //   })
      // );

      //d3.group(values, (d) => d[groupKeyName]);
      ///const groups = [...categorizedData.keys()];

      const color = d3
        .scaleOrdinal()
        .domain(subKeyNames)

        // TODO make colors from palette css
        .range(["#e41a1c", "#377eb8", "#4daf4a", "#c5c5c5", "375eb8"]);

      const stackGroups = barsArea
        .selectAll("g")
        .data(stack(dataset))
        .enter()
        .append("g")
        .style("fill", function (d, i) {
          return color(subKeyNames[i]);
        });

      const tooltipGroup = svg.append("g").attr("class", "tooltip-group");

      const tooltip = tooltipGroup
        .append("rect")
        .attr("width", 50)
        .attr("height", 15)
        .attr("fill", "#ffffff")
        .attr("class", "tooltip");

      const toolTipText = tooltipGroup
        .append("text")
        .attr("x", tooltip.attr("width") / 2)
        .attr("y", tooltip.attr("height"))
        .attr("text-anchor", "middle")
        .attr("class", "tooltip-label")
        .attr("fill", "black")
        .text("text");

      const barGroups = stackGroups
        .selectAll("rect")
        .data((d) => {
          return d;
        })
        .enter()
        .append("rect")
        .on("mouseover", function (event, d) {
          tooltipGroup.style("display", null);
          tooltipGroup
            .transition()
            .duration(200)
            .attr(
              "transform",
              `translate(${x(d.data.x) + MARGIN.LEFT + x.bandwidth()}, ${
                (y(d[0]) + y(d[1])) / 2 + tooltip.attr("height") / 2
              })`
            );

          toolTipText.text("" + (d[1] - d[0]));
        })
        .on("mouseout", function () {
          tooltipGroup
            .transition()
            .duration(200)
            .style("opacity", 0)
            .end(() => {
              tooltipGroup.style("display", "none");
            });
        })
        .attr("class", "bars")
        .attr("x", (d) => x(d.data.x))
        .attr("y", (d) => {
          return y(d[1]);
        })
        .attr("width", x.bandwidth())
        .attr("height", (d) => {
          if (d[1]) {
            return y(d[0]) - y(d[1]);
          }
          return 0;
        });

      barGroups;

      // .attr("class", "data-bars")
      // .selectAll("g")
      // .data(categorizedData)
      // .enter()
      // .append("path")
      // .attr("id", (_, i) => "data-" + i)
      // .attr("class", "data-lines")
      // .attr("fill", "none")
      // .attr("stroke", function (d) {
      //   return color(d[0]);
      // })
      // .attr("stroke-width", 1.5)
      // .attr("d", function (d) {
      //   return d3
      //     .line()
      //     .x(function (d) {
      //       return x(d[xKeyName]) + x.bandwidth() / 2;
      //     })
      //     .y(function (d) {
      //       return y(+d[yKeyName]);
      //     })(d[1]);
      // });

      // Add legend

      this.legend.setup(
        subKeyNames.map((item, index) => ({
          id: "" + index,
          label: item,
          color: color(item),
          node: this.root.querySelector(`svg #data-${index}`),
        })),
        this.root.querySelector("main"),
        {
          fadeoutNodes: this.root.querySelectorAll("rect.bars"),
          position: ["top", "right"],
          fadeProp: "opacity",
        }
      );

      // ====
      // Show/hide grid lines
      if (showXGrid) {
        const xAxisGridGenerator = d3
          .axisBottom(x)
          .tickSize(-HEIGHT)
          .tickFormat("")
          .ticks(10);

        const xAxisGrid = barsArea
          .append("g")
          .attr("class", "x gridlines")
          .attr("transform", "translate(0," + HEIGHT + ")")
          .call(xAxisGridGenerator);
      }

      if (showYGrid) {
        const yAxisGridGenerator = d3
          .axisLeft(y)
          .tickSize(-WIDTH)
          .tickFormat("")
          .ticks(10);

        const yAxisGrid = barsArea
          .append("g")
          .attr("class", "y gridlines")
          .call(yAxisGridGenerator);
      }
    } else {
      // else just draw line

      return;
    }
  }
}
