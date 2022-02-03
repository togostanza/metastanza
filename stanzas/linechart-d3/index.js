import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
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
    const groupKeyName = this.params["group-by"];
    const showXGrid = this.params["xgrid"] === "true" ? true : false;
    const showYGrid = this.params["ygrid"] === "true" ? true : false;
    const xLabelAngle =
      parseInt(this.params["xlabel-angle"]) === 0
        ? 0
        : parseInt(this.params["xlabel-angle"]) || -90;
    const yLabelAngle =
      parseInt(this.params["ylabel-angle"]) === 0
        ? 0
        : parseInt(this.params["ylabel-angle"]) || 0;

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

    const xAxisPlacement = this.params["xaxis-placement"] || "bottom";
    const yAxisPlacement = this.params["yaxis-placement"] || "left";

    const xTitlePadding = this.params["xtitle-padding"] || 15;
    const yTitlePadding = this.params["ytitle-padding"] || 15;

    const xTickSize = this.params["xtick-size"] || 5;
    const yTickSize = this.params["ytick-size"] || 5;
    const axisTitleFontSize =
      parseInt(css("--togostanza-title-font-size")) || 10;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const legendShow = this.params["legend"] || "none";

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

    if (legendShow !== "none") {
      this.legend = new Legend();
      root.append(this.legend);
    }

    let values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    // TODO change data to include errors. For now, artificially add 20% error
    values.forEach((item) => {
      item.error = item.count * 0.2;
    });

    //Filter out all non-numeric x-axis values from data
    if (xDataType === "number") {
      values = values.filter((item) => !isNaN(item[xKeyName]));
    }

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

    const MARGIN = {
      TOP:
        xAxisPlacement === "top"
          ? Math.max(60, xTitlePadding + 10 + xTickSize + axisTitleFontSize)
          : 10,
      BOTTOM:
        xAxisPlacement === "top"
          ? 10
          : Math.max(60, xTitlePadding + xTickSize + 10 + axisTitleFontSize),
      LEFT:
        yAxisPlacement === "left"
          ? Math.max(60, yTitlePadding + yTickSize + 10 + axisTitleFontSize)
          : 10,
      RIGHT:
        yAxisPlacement === "right"
          ? Math.max(60, yTitlePadding + yTickSize + 10 + axisTitleFontSize)
          : 10,
    };

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

    const xAxisArea = graphArea.append("g").attr("class", "x axis");

    const yAxisArea = graphArea.append("g").attr("class", "y axis");

    const yTitleArea = graphArea.append("g").attr("class", "y axis title");

    const xTitleArea = graphArea.append("g").attr("class", "x axis title");

    if (xAxisPlacement === "top") {
      xAxisArea.attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

      xTitleArea
        .attr(
          "transform",
          `translate(0,${MARGIN.TOP - xTitlePadding - xTickSize})`
        )
        .attr("dominant-baseline", "bottom");
    } else {
      xAxisArea.attr(
        "transform",
        `translate(${MARGIN.LEFT},${HEIGHT + MARGIN.TOP})`
      );
      xTitleArea
        .attr(
          "transform",
          `translate(0,${HEIGHT + MARGIN.TOP + xTickSize + xTitlePadding})`
        )
        .attr("dominant-baseline", "hanging");
    }

    if (yAxisPlacement === "right") {
      yAxisArea.attr(
        "transform",
        `translate(${MARGIN.LEFT + WIDTH},${MARGIN.TOP})`
      );
      yTitleArea.attr(
        "transform",
        `translate(${MARGIN.LEFT + WIDTH + yTickSize + yTitlePadding},0)`
      );
    } else {
      yAxisArea.attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);
      yTitleArea.attr(
        "transform",
        `translate(${MARGIN.LEFT - yTickSize - yTitlePadding},0)`
      );
    }

    yTitleArea
      .append("text")
      .text(yAxisTitle)
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -HEIGHT / 2 - MARGIN.TOP);

    xTitleArea
      .append("text")
      .text(xAxisTitle)
      .attr("text-anchor", "middle")
      .attr("x", MARGIN.LEFT + WIDTH / 2);

    const errorBarsGroup = linesArea
      .append("g")
      .attr("class", "error-bars-group");

    const xAxisLabelsProps = getXTextLabelProps(
      xLabelAngle,
      xLabelPadding + xTickSize,
      xAxisPlacement
    );
    const yAxisLabelsProps = getYTextLabelProps(
      yLabelAngle,
      yLabelPadding + yTickSize,
      yAxisPlacement
    );

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

      let xAxisGenerator;

      if (xAxisPlacement === "top") {
        xAxisGenerator = d3.axisTop(x);
      } else {
        xAxisGenerator = d3.axisBottom(x);
      }
      xAxisGenerator.tickSizeOuter(0).tickSizeInner(xTickSize);

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

      let yAxisGenerator;

      if (yAxisPlacement === "right") {
        yAxisGenerator = d3.axisRight(y).tickSizeOuter(0);
      } else {
        yAxisGenerator = d3.axisLeft(y).tickSizeOuter(0);
      }

      yAxisGenerator
        .ticks(yTicksNumber)
        .tickFormat((d) => d3.format(ylabelFormat)(d))
        .tickSizeInner(yTickSize);

      if (!showYTicks) {
        yAxisGenerator.tickSize(0);
      }

      yAxisArea
        .transition()
        .duration(200)
        .call(yAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", yAxisLabelsProps.textAnchor)
        .attr("alignment-baseline", yAxisLabelsProps.dominantBaseline)
        .attr("dy", null)
        .attr("x", yAxisLabelsProps.x)
        .attr("y", yAxisLabelsProps.y)
        .attr("transform", `rotate(${yLabelAngle})`);

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
        .attr("id", (d) => "data-" + groups.findIndex((item) => item === d[0]))
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
      if (legendShow !== "none") {
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
            position: legendShow.split("-"),
            fadeProp: "stroke-opacity",
          }
        );
      }
    };

    update(values);

    if (legendShow !== "none") {
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
}

function getXTextLabelProps(angle, xLabelsMarginUp, axisPlacement = "bottom") {
  let textAnchor, dominantBaseline;
  angle = parseInt(angle);
  xLabelsMarginUp = parseInt(xLabelsMarginUp);

  let sign = 1;
  if (axisPlacement === "top") {
    dominantBaseline = "bottom";
    sign = -1;
  } else {
    dominantBaseline = "hanging";
  }

  const x = sign * xLabelsMarginUp * Math.sin((angle * Math.PI) / 180);
  const y = sign * xLabelsMarginUp * Math.cos((angle * Math.PI) / 180);

  switch (true) {
    case angle < 0 && angle % 180 !== 0:
      if (axisPlacement === "top") {
        textAnchor = "start";
      } else {
        textAnchor = "end";
      }
      if (angle === -90) {
        dominantBaseline = "central";
      }
      break;

    case angle > 0 && angle % 180 !== 0:
      if (axisPlacement === "top") {
        textAnchor = "end";
      } else {
        textAnchor = "start";
      }
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
function getYTextLabelProps(angle, yLabelsMarginRight, axisPlacement = "left") {
  let textAnchor, dominantBaseline;
  angle = parseInt(angle);
  yLabelsMarginRight = parseInt(yLabelsMarginRight);

  let sign = 1;

  if (axisPlacement === "right") {
    sign = -1;
    dominantBaseline = "hanging";
    textAnchor = "start";
  } else {
    dominantBaseline = "bottom";
    textAnchor = "end";
  }

  const x = -sign * yLabelsMarginRight * Math.cos((angle * Math.PI) / 180);
  const y = sign * yLabelsMarginRight * Math.sin((angle * Math.PI) / 180);

  switch (true) {
    case angle < 0 && angle % 180 !== 0:
      if (axisPlacement === "right") {
        dominantBaseline = "hanging";
      } else {
        dominantBaseline = "bottom";
      }
      if (angle === -90) {
        textAnchor = "middle";
      }
      break;

    case angle > 0 && angle % 180 !== 0:
      if (axisPlacement === "right") {
        dominantBaseline = "bottom";
      } else {
        dominantBaseline = "hanging";
      }
      if (angle === 90) {
        textAnchor = "middle";
      }
      break;

    case angle % 180 === 0:
      if (angle > 0) {
        textAnchor = "start";
      }
      dominantBaseline = "central";
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
