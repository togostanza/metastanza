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

    //data
    const xKeyName = this.params["x-axis-key"];
    const yKeyName = this.params["y-axis-key"];
    const xAxisTitle = this.params["x-axis-title"] || "";
    const yAxisTitle = this.params["y-axis-title"] || "";
    const showXTicks = this.params["xtick"] === "true" ? true : false;
    const showYTicks = this.params["ytick"] === "true" ? true : false;
    const xTicksNumber = this.params["xticks-number"] || 5;
    const yTicksNumber = this.params["yticks-number"] || 3;
    const showLegend = this.params["legend"] === "true" ? true : false;
    const groupKeyName = this.params["group-by"];
    const showXGrid = this.params["xgrid"] === "true" ? true : false;
    const showYGrid = this.params["ygrid"] === "true" ? true : false;
    const xLabelAngle =
      parseInt(this.params["xlabel-angle"]) === 0
        ? 0
        : parseInt(this.params["xlabel-angle"]) || -90;

    const xDataType = this.params["x-axis-data-type"] || "string";
    const errorKeyName = this.params["error-key"] || "error";
    const showErrorBars = this.params["error-bars"] === "true" ? true : false;
    const errorBarWidth =
      typeof this.params["error-bar-width"] !== "undefined"
        ? this.params["error-bar-width"]
        : 0.4;
    const xLabelPadding =
      parseInt(this.params["xlabel-padding"]) === 0
        ? 0
        : parseInt(this.params["xlabel-padding"]) || 7;
    const yLabelPadding =
      parseInt(this.params["ylabel-padding"]) === 0
        ? 0
        : parseInt(this.params["ylabel-padding"]) || 10;

    const ylabelFormat = this.params["ylabel-format"] || null;

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

    let values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    // TODO change data to include errors. For now, artificially add 5% error
    values.forEach((item) => {
      item.error = item.count * 0.2;
    });

    //Filter out all non-numeric y-axis values from data
    values = values.filter((item) => !isNaN(item[yKeyName]));
    // ===

    //Filter out all non-numeric x-axis values from data
    if (xDataType === "number") {
      values = values.filter((item) => !isNaN(item[xKeyName]));
    }
    // ===

    this._data = values;

    const categorizedData = d3.group(values, (d) => d[groupKeyName]);

    const groups = [...categorizedData.keys()];

    const toggleState = new Map(groups.map((_, index) => ["" + index, false]));

    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }

    const color = d3.scaleOrdinal().domain(groups).range(togostanzaColors);

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const MARGIN = { TOP: 10, BOTTOM: 60, LEFT: 50, RIGHT: 10 };
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    const el = this.root.querySelector("#linechart-d3");

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const graphArea = svg.append("g").attr("class", "chart");

    const linesArea = graphArea
      .append("g")
      .attr("class", "lines")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const dataGroup = linesArea.append("g").attr("class", "data-lines");

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

    yTitleArea
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

    const errorBarsGroup = linesArea
      .append("g")
      .attr("class", "error-bars-group");

    const xAxisLabelsProps = getXTextLabelProps(xLabelAngle, xLabelPadding);

    // Axes preparation

    let dataMax, dataMin;
    if (showErrorBars) {
      dataMax = d3.max(values, (d) => +d[yKeyName] + d[errorKeyName]);
      dataMin = d3.min(values, (d) => +d[yKeyName] - d[errorKeyName]);
    } else {
      dataMax = d3.max(values, (d) => +d[yKeyName]);
      dataMin = d3.min(values, (d) => +d[yKeyName]);
    }

    let x;
    if (xDataType === "number") {
      const xAxisData = values.map((d) => +d[xKeyName]);
      const xDataMinMax = [d3.min(xAxisData), d3.max(xAxisData)];
      x = d3.scaleLinear().domain(xDataMinMax).range([0, WIDTH]);
    } else {
      const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
      x = d3.scaleBand().domain(xAxisLabels).range([0, WIDTH]);
    }

    const y = d3.scaleLinear().domain([dataMin, dataMax]).range([HEIGHT, 0]);

    const xAxisGridGenerator = d3
      .axisBottom(x)
      .tickSize(-HEIGHT)
      .tickFormat("")
      .ticks(xTicksNumber);

    const yAxisGridGenerator = d3
      .axisLeft(y)
      .tickSize(-WIDTH)
      .tickFormat("")
      .ticks(yTicksNumber);

    const xGridLines = linesArea
      .append("g")
      .attr("class", "x gridlines")
      .attr("transform", "translate(0," + HEIGHT + ")");

    const yGridLines = linesArea.append("g").attr("class", "y gridlines");

    const update = (values) => {
      const categorizedData = d3.group(values, (d) => d[groupKeyName]);

      if (showErrorBars) {
        dataMax = d3.max(values, (d) => +d[yKeyName] + d[errorKeyName]);
        dataMin = d3.min(values, (d) => +d[yKeyName] - d[errorKeyName]);
      } else {
        dataMax = d3.max(values, (d) => +d[yKeyName]);
        dataMin = d3.min(values, (d) => +d[yKeyName]);
      }

      if (xDataType === "number") {
        const xAxisData = values.map((d) => +d[xKeyName]);
        const xDataMinMax = [d3.min(xAxisData), d3.max(xAxisData)];
        x.domain(xDataMinMax);
      } else {
        const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
        x.domain(xAxisLabels);
      }

      y.domain([dataMin, dataMax]);

      const xAxisGenerator = d3.axisBottom(x).tickSizeOuter(0);

      if (xDataType === "number") {
        xAxisGenerator.ticks(xTicksNumber);
      }

      if (!showXTicks) {
        xAxisGenerator.tickSize(0);
      }

      xAxisArea
        .transition()
        .duration(200)
        .call(xAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", xAxisLabelsProps.textAnchor)
        .attr("alignment-baseline", xAxisLabelsProps.dominantBaseline)
        .attr("y", xAxisLabelsProps.y)
        .attr("x", xAxisLabelsProps.x)
        .attr("dy", null)
        .attr("transform", `rotate(${xLabelAngle})`);

      const yAxisGenerator = d3
        .axisLeft(y)
        .ticks(yTicksNumber)
        .tickFormat((d) => d3.format(ylabelFormat)(d));

      if (!showYTicks) {
        yAxisGenerator.tickSize(0);
      }

      yAxisArea
        .transition()
        .duration(200)
        .call(yAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .attr("dy", null)
        .attr("x", -yLabelPadding);
      // .attr("transform", `rotate(${yLabelAngle})`);

      const g = dataGroup.selectAll("path").data(categorizedData, (d) => d[0]);

      g.exit().remove();

      // update
      g.transition()
        .duration(200)
        .attr("d", function (d) {
          return d3
            .line()
            .x(function (d) {
              if (xDataType === "number") {
                return x(d[xKeyName]);
              } else {
                return x(d[xKeyName]) + x.bandwidth() / 2;
              }
            })
            .y(function (d) {
              return y(+d[yKeyName]);
            })(d[1]);
        });

      // enter
      g.enter()
        .append("path")
        .attr("id", (_, i) => "data-" + i)
        .attr("class", "data-lines")
        .attr("fill", "none")
        .attr("stroke", function (d) {
          return color(d[0]);
        })
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
          return d3
            .line()
            .x(function (d) {
              if (xDataType === "number") {
                return x(d[xKeyName]);
              } else {
                return x(d[xKeyName]) + x.bandwidth() / 2;
              }
            })
            .y(function (d) {
              return y(+d[yKeyName]);
            })(d[1]);
        });

      if (showErrorBars) {
        //Draw error bars
        const barGroups = errorBarsGroup
          .selectAll("g")
          .data(
            values,
            (d) => `${d[groupKeyName]}-${d[yKeyName]}-${d[xKeyName]}`
          );

        const barGroupsEnter = barGroups
          .enter()
          .append("g")
          .attr("class", "errorbar-group");

        barGroupsEnter.append("line").attr("class", "errorbar vl");
        barGroupsEnter.append("line").attr("class", "errorbar bl");
        barGroupsEnter.append("line").attr("class", "errorbar tl");

        barGroups
          .merge(barGroupsEnter)
          .select("line.errorbar.vl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]);
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]);
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            }
          })
          .attr("y2", (d) => y(+d[yKeyName] + d[errorKeyName] / 2));

        barGroups
          .merge(barGroupsEnter)
          .select("line.errorbar.bl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) - errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 - errorBarWidth / 2;
            }
          })
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) + errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 + errorBarWidth / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("y2", (d) => y(+d[yKeyName] - d[errorKeyName] / 2));

        barGroups
          .merge(barGroupsEnter)
          .select("line.errorbar.tl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) - errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 - errorBarWidth / 2;
            }
          })
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) + errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 + errorBarWidth / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] + d[errorKeyName] / 2))
          .attr("y2", (d) => y(+d[yKeyName] + d[errorKeyName] / 2));

        barGroups.exit().remove();

        barGroupsEnter
          .select("line.errorbar-vl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]);
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]);
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2;
            }
          })
          .attr("y2", (d) => y(+d[yKeyName] + d[errorKeyName] / 2));

        barGroupsEnter
          .select("line.errorbar-bl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) - errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 - errorBarWidth / 2;
            }
          })
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) + errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 + errorBarWidth / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("y2", (d) => y(+d[yKeyName] - d[errorKeyName] / 2));

        barGroupsEnter
          .select("line.errorbar-tl")
          .attr("x1", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) - errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 - errorBarWidth / 2;
            }
          })
          .attr("x2", (d) => {
            if (xDataType === "number") {
              return x(d[xKeyName]) + errorBarWidth / 2;
            } else {
              return x(d[xKeyName]) + x.bandwidth() / 2 + errorBarWidth / 2;
            }
          })
          .attr("y1", (d) => y(+d[yKeyName] + d[errorKeyName] / 2))
          .attr("y2", (d) => y(+d[yKeyName] + d[errorKeyName] / 2));
      }

      // Show/hide grid lines
      if (showXGrid) {
        xGridLines.transition().duration(200).call(xAxisGridGenerator);
      }

      if (showYGrid) {
        yGridLines.transition().duration(200).call(yAxisGridGenerator);
      }

      // update legend

      this.legend.setup(
        groups.map((item, index) => ({
          id: "" + index,
          label: item,
          color: color(item),
          node: this.root.querySelector(`svg #data-${index}`) || null,
        })),
        this.root.querySelector("main"),
        {
          fadeoutNodes: this.root.querySelectorAll("path.data-lines"),
          position: ["top", "right"],
          fadeProp: "stroke-opacity",
        }
      );
    };

    update(values);

    const legend = this.root
      .querySelector("togostanza--legend")
      .shadowRoot.querySelector(".legend > table > tbody");

    // Set toggle behaviour
    legend.addEventListener("click", (e) => {
      const parentNode = e.target.parentNode;
      if (parentNode.nodeName === "TR") {
        const id = parentNode.dataset.id;
        parentNode.style.opacity = toggleState.get("" + id) ? 1 : 0.5;
        toggleState.set("" + id, !toggleState.get("" + id));

        // filter out data wich was clicked
        const newData = values.filter(
          (item) => !toggleState.get("" + groups.indexOf(item[groupKeyName]))
        );

        update(newData);
      }
    });
  }
}

function getXTextLabelProps(angle, xLabelsMarginUp) {
  let textAnchor, dominantBaseline, x, y;
  angle = parseInt(angle);
  xLabelsMarginUp = parseInt(xLabelsMarginUp);

  dominantBaseline = "hanging";
  x = xLabelsMarginUp * Math.sin((angle * Math.PI) / 180);
  y = xLabelsMarginUp * Math.cos((angle * Math.PI) / 180);

  switch (true) {
    case angle < 0 && angle % 180 !== 0:
      textAnchor = "end";
      if (angle === -90) {
        dominantBaseline = "central";
      }
      break;

    case angle > 0 && angle % 180 !== 0:
      textAnchor = "start";
      if (angle === 90) {
        dominantBaseline = "central";
      }
      break;
    case angle === 0:
      textAnchor = "middle";
      break;
    case angle % 180 === 0:
      textAnchor = "middle";
      dominantBaseline = "bottom";
      break;
    default:
      break;
  }

  return {
    x,
    y,
    textAnchor,
    dominantBaseline,
  };
}
