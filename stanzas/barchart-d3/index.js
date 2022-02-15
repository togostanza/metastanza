import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
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

    // const padding = this.params["padding"];

    //data
    const xKeyName = this.params["category"];
    const yKeyName = this.params["value"];
    const xAxisTitle = this.params["category-title"];
    const yAxisTitle = this.params["value-title"];
    const showXTicks = this.params["xtick"] === "true" ? true : false;
    const showYTicks = this.params["ytick"] === "true" ? true : false;
    const yTicksNumber = this.params["yticks-number"] || 3;
    const showLegend = this.params["legend"] === "true" ? true : false;
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

    const barPlacement = this.params["bar-placement"];
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

    const xTitlePadding = this.params["xtitle-padding"] || 15;
    const yTitlePadding = this.params["ytitle-padding"] || 15;

    const xTickSize = this.params["xtick-size"] || 5;
    const yTickSize = this.params["ytick-size"] || 5;
    const axisTitleFontSize =
      parseInt(css("--togostanza-title-font-size")) || 10;

    const barPaddings =
      typeof this.params["bar-paddings"] === "undefined"
        ? 0.1
        : this.params["bar-paddings"];
    const barSubPaddings =
      typeof this.params["bar-sub-paddings"] === "undefined"
        ? 0.1
        : this.params["bar-sub-paddings"];
    const xTickPlacement = this.params["xtick-placement"] || "in-between";

    const showBarTooltips =
      this.params["bar-tooltips"] === "true" ? true : false;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector(":scope > div");

    const el = this.root.querySelector("#barchart-d3");

    // On change params rerender - Check if legend and svg already existing and remove them -
    const existingLegend = this.root.querySelector("togostanza--legend");

    if (!this.tooltip && showBarTooltips) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }

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

    // TODO change data to include errors. For now, artificially add 5% error
    values.forEach((item) => {
      item.error = item.count * 0.2;
    });

    this._data = values;

    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }

    let dataMax;
    if (showErrorBars) {
      dataMax = d3.max(values, (d) => +d[yKeyName] + d[errorKeyName]);
    } else {
      dataMax = d3.max(values, (d) => +d[yKeyName]);
    }

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const MARGIN = { TOP: 10, BOTTOM: 60, LEFT: 50, RIGHT: 10 };
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

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

    /// Axes preparation
    const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
    const gSubKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];

    const color = d3
      .scaleOrdinal()
      .domain(gSubKeyNames)
      .range(togostanzaColors);

    const toggleState = new Map(
      gSubKeyNames.map((_, index) => ["" + index, false])
    );

    const x = d3
      .scaleBand()
      .domain(xAxisLabels)
      .range([0, WIDTH])
      .padding(barPaddings);

    const y = d3.scaleLinear().range([HEIGHT, 0]);

    const xAxisGenerator = d3.axisBottom(x).tickSizeOuter(0);

    const yAxisGenerator = d3.axisLeft(y).ticks(yTicksNumber);

    const xAxisGridGenerator = d3
      .axisBottom(x)
      .tickSize(-HEIGHT)
      .tickFormat("");

    const yAxisGridGenerator = d3
      .axisLeft(y)
      .tickSize(-WIDTH)
      .tickFormat("")
      .ticks(yTicksNumber);

    const yGridLines = barsArea.append("g").attr("class", "y gridlines");

    const barsGroups = barsArea.append("g").attr("class", "bars-group");

    if (!showXTicks) {
      xAxisGenerator.tickSize(0);
    }

    if (!showYTicks) {
      yAxisGenerator.tickSize(0);
    }

    const update = (values) => {
      const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
      const subKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];

      x.domain(xAxisLabels);

      xAxisArea
        .transition()
        .duration(200)
        .call(xAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", textAnchor)
        .attr("x", xx)
        .attr("y", "0")
        .attr("dy", xdy)
        .attr("transform", `rotate(${xLabelAngle})`);

      if (xTickPlacement === "in-between") {
        svg
          .selectAll(".x.axis .tick line")
          .attr("x1", -(x.bandwidth() + x.step() * x.paddingInner()) / 2)
          .attr("x2", -(x.bandwidth() + x.step() * x.paddingInner()) / 2);
      }

      // Show/hide grid lines
      if (showXGrid) {
        barsArea
          .append("g")
          .attr("class", "x gridlines")
          .attr("transform", "translate(0," + HEIGHT + ")")
          .call(xAxisGridGenerator);
      }

      let rects;

      if (barPlacement === "stacked") {
        updateStackedBars(values);
      } else {
        updateGroupedBars(values);
      }

      this.legend.setup(
        gSubKeyNames.map((item, index) => {
          return {
            id: "" + index,
            label: item,
            color: color(item),
            node: this.root.querySelectorAll(
              `#barchart-d3 svg rect.data-${index}`
            ),
          };
        }),
        this.root.querySelector("main"),
        {
          fadeoutNodes: this.root.querySelectorAll("svg rect"),
          position: ["top", "right"],
          fadeProp: "opacity",
        }
      );

      if (showBarTooltips) {
        const arr = this.root.querySelectorAll("svg rect");
        this.tooltip.setup(arr);
      }

      function updateStackedBars(values) {
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

        dataMax = d3.max(stackedData[stackedData.length - 1], (d) => d[1]);

        y.domain([0, dataMax * 1.05]);

        yAxisArea
          .transition()
          .duration(200)
          .call(yAxisGenerator)
          .selectAll("text")
          .attr("text-anchor", "end")
          .attr("transform", `rotate(${yLabelAngle})`);

        if (showYGrid) {
          yGridLines.transition().duration(200).call(yAxisGridGenerator);
        }

        stackedData.forEach((item) => {
          item.forEach((d) => (d.key = item.key));
        });

        const gs = barsGroups
          .selectAll("rect")
          .data(stackedData.flat(), (d) => `${d.key}-${d[0][xKeyName]}`);

        gs.join(
          (enter) => {
            return enter
              .append("rect")
              .attr("fill", (d) => color(d.key))
              .attr("x", (d) => {
                return x(d.data.x);
              })
              .attr("y", (d) => {
                return y(d[1]);
              })
              .attr("height", 0)
              .attr("width", x.bandwidth())
              .transition()
              .duration(200)
              .attr("y", (d) => {
                return y(d[1]);
              })
              .attr("height", (d) => {
                if (d[1]) {
                  return y(d[0]) - y(d[1]);
                }
                return 0;
              });
          },
          (update) => {
            return update
              .transition()
              .duration(200)
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
          },
          (exit) => {
            exit
              .transition()
              .duration(200)
              .attr("opacity", 0)
              .on("end", () => {
                exit.remove();
              });
          }
        )
          .attr("data-tooltip", (d) => `${d.key}: ${d[1] - d[0]}`)
          .attr("data-html", "true")
          .attr("class", (d) => {
            return `data-${gSubKeyNames.findIndex((item) => item === d.key)}`;
          });
      }

      function updateGroupedBars(values) {
        const dataset = d3.group(values, (d) => d[xKeyName]);

        const yAxisGenerator = d3.axisLeft(y).ticks(yTicksNumber);

        let yMinMax;
        if (showErrorBars) {
          yMinMax = d3.extent(
            values,
            (d) => Number(d[yKeyName]) + d[errorKeyName] / 2
          );
        } else {
          yMinMax = d3.extent(values, (d) => Number(d[yKeyName]));
        }

        y.domain([0, yMinMax[1] * 1.05]);

        yAxisArea
          .call(yAxisGenerator)
          .selectAll("text")
          .attr("text-anchor", "end")
          .attr("transform", `rotate(${yLabelAngle})`);

        if (showYGrid) {
          yGridLines.transition().duration(200).call(yAxisGridGenerator);
        }

        const subX = d3
          .scaleBand()
          .domain(subKeyNames)
          .range([0, x.bandwidth()])
          .padding(barSubPaddings);

        //For every group of bars - own g with
        const barsGroup = barsGroups
          .selectAll("g")
          .data(dataset, (d) => d[0])
          .join(
            (enter) => {
              return enter.append("g");
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .attr("transform", (d) => {
            return `translate(${x(d[0])},0)`;
          });

        // inside every g insert bars on its own x genertor
        barsGroup
          .selectAll("rect")
          .data(
            (d) => {
              return d[1];
            },
            (d) => `${d[xKeyName]}-${d[groupKeyName]}`
          )
          .join(
            (enter) => {
              return enter.append("rect").transition(300);
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .transition(300)
          .attr("data-tooltip", (d) => `${d[groupKeyName]}: ${d[yKeyName]}`)
          .attr("x", (d) => subX(d[groupKeyName]))
          .attr("y", (d) => y(+d[yKeyName]))
          .attr("width", subX.bandwidth())
          .attr("height", (d) => y(0) - y(+d[yKeyName]))
          .attr(
            "class",
            (d) =>
              `data-${gSubKeyNames.findIndex(
                (item) => item === d[groupKeyName]
              )}`
          )
          .attr("fill", (d) => {
            return color(d[groupKeyName]);
          });

        rects = [];
        subKeyNames.forEach((item, index) => {
          rects.push;
        });

        if (showErrorBars) {
          barsGroup.call(errorBars, y, subX, errorBarWidth);
        }
      }
    };

    update(values);

    this.legend.setup(
      gSubKeyNames.map((item, index) => {
        return {
          id: "" + index,
          label: item,
          color: color(item),
          node: barsArea
            .selectAll("g.bars-group>g>rect")
            .filter((d) => {
              return d[groupKeyName] === item;
            })
            .nodes(),
        };
      }),
      this.root.querySelector("main"),
      {
        fadeoutNodes: this.root.querySelectorAll("svg rect"),
        position: ["top", "right"],
        fadeProp: "opacity",
        showLeaders: false,
      }
    );

    const legend = this.root
      .querySelector("togostanza--legend")
      .shadowRoot.querySelector(".legend > table > tbody");

    legend.addEventListener("click", (e) => {
      const parentNode = e.target.parentNode;
      if (parentNode.nodeName === "TR") {
        const id = parentNode.dataset.id;
        parentNode.style.opacity = toggleState.get("" + id) ? 1 : 0.5;
        toggleState.set("" + id, !toggleState.get("" + id));

        // filter out data wich was clicked
        const newData = values.filter(
          (item) =>
            !toggleState.get("" + gSubKeyNames.indexOf(item[groupKeyName]))
        );

        update(newData);
      }
    });

    function errorBars(selection, yAxis, subXAxis, errorBarWidth) {
      selection.each(function (d) {
        const selG = d3.select(this);

        const errorBarGroup = selG
          .selectAll("g")
          .data(d[1])
          .enter()
          .append("g")
          .attr("class", "error-bar");

        errorBarGroup
          .append("line")
          .attr(
            "x1",
            (d) => subXAxis(d[groupKeyName]) + subXAxis.bandwidth() / 2
          )
          .attr("y1", (d) => yAxis(+d[yKeyName] - d[errorKeyName] / 2))
          .attr(
            "x2",
            (d) => subXAxis(d[groupKeyName]) + subXAxis.bandwidth() / 2
          )
          .attr("y2", (d) => yAxis(+d[yKeyName] + d[errorKeyName] / 2));

        // upper stroke
        errorBarGroup
          .append("line")
          .attr(
            "x1",
            (d) =>
              subXAxis(d[groupKeyName]) +
              subXAxis.bandwidth() / 2 -
              (subXAxis.bandwidth() * errorBarWidth) / 2
          )
          .attr(
            "x2",
            (d) =>
              subXAxis(d[groupKeyName]) +
              subXAxis.bandwidth() / 2 +
              (subXAxis.bandwidth() * errorBarWidth) / 2
          )
          .attr("y1", (d) => yAxis(+d[yKeyName] - d[errorKeyName] / 2))
          .attr("y2", (d) => yAxis(+d[yKeyName] - d[errorKeyName] / 2));
        // lower stroke
        errorBarGroup
          .append("line")
          .attr(
            "x1",
            (d) =>
              subXAxis(d[groupKeyName]) +
              subXAxis.bandwidth() / 2 -
              (subXAxis.bandwidth() * errorBarWidth) / 2
          )
          .attr(
            "x2",
            (d) =>
              subXAxis(d[groupKeyName]) +
              subXAxis.bandwidth() / 2 +
              (subXAxis.bandwidth() * errorBarWidth) / 2
          )
          .attr("y1", (d) => yAxis(+d[yKeyName] + d[errorKeyName] / 2))
          .attr("y2", (d) => yAxis(+d[yKeyName] + d[errorKeyName] / 2));
      });
    }
  }
}
