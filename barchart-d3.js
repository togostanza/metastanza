import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { s as select } from './index-847f2a80.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { T as ToolTip } from './ToolTip-23bc44c8.js';
import { L as Legend } from './Legend-08cf2f79.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import { m as max } from './max-2c042256.js';
import { o as ordinal, f as format } from './ordinal-0cb0fa8d.js';
import { b as band } from './band-6f9e71db.js';
import { l as linear } from './linear-af9e44cc.js';
import { a as axisBottom, b as axisLeft } from './axis-3dba94d9.js';
import { a as array } from './array-89f97098.js';
import { c as constant } from './constant-c49047a5.js';
import { g as group } from './group-ac79bcd0.js';
import { e as extent } from './extent-14a1e8e9.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';
import './range-e15c6861.js';
import './descending-63ef45b8.js';

function none$1(series, order) {
  if (!((n = series.length) > 1)) return;
  for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
    s0 = s1, s1 = series[order[i]];
    for (j = 0; j < m; ++j) {
      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
    }
  }
}

function none(series) {
  var n = series.length, o = new Array(n);
  while (--n >= 0) o[n] = n;
  return o;
}

function stackValue(d, key) {
  return d[key];
}

function stackSeries(key) {
  const series = [];
  series.key = key;
  return series;
}

function stack() {
  var keys = constant([]),
      order = none,
      offset = none$1,
      value = stackValue;

  function stack(data) {
    var sz = Array.from(keys.apply(this, arguments), stackSeries),
        i, n = sz.length, j = -1,
        oz;

    for (const d of data) {
      for (i = 0, ++j; i < n; ++i) {
        (sz[i][j] = [0, +value(d, sz[i].key, j, data)]).data = d;
      }
    }

    for (i = 0, oz = array(order(sz)); i < n; ++i) {
      sz[oz[i]].index = i;
    }

    offset(sz, oz);
    return sz;
  }

  stack.keys = function(_) {
    return arguments.length ? (keys = typeof _ === "function" ? _ : constant(Array.from(_)), stack) : keys;
  };

  stack.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), stack) : value;
  };

  stack.order = function(_) {
    return arguments.length ? (order = _ == null ? none : typeof _ === "function" ? _ : constant(Array.from(_)), stack) : order;
  };

  stack.offset = function(_) {
    return arguments.length ? (offset = _ == null ? none$1 : _, stack) : offset;
  };

  return stack;
}

function getXTextLabelProps(
  angle,
  xLabelsMarginUp,
  axisPlacement = "bottom"
) {
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
  }

  return {
    x,
    y,
    textAnchor,
    dominantBaseline,
  };
}
function getYTextLabelProps(
  angle,
  yLabelsMarginRight,
  axisPlacement = "left"
) {
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
  }

  return {
    x,
    y,
    textAnchor,
    dominantBaseline,
  };
}

class Barchart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "barchart"),
      downloadPngMenuItem(this, "barchart"),
      downloadJSONMenuItem(this, "barchart", this._data),
      downloadCSVMenuItem(this, "barchart", this._data),
      downloadTSVMenuItem(this, "barchart", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width、height、padding

    //data
    const xKeyName = this.params["category"];
    const yKeyName = this.params["value"];
    const xAxisTitle = this.params["category-title"];
    const yAxisTitle = this.params["value-title"];
    const yTicksNumber = this.params["yticks-number"] || 3;
    const showLegend = this.params["legend"] || "top-right";
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
    const errorKeyName = this.params["error-key"];
    const showErrorBars =
      this.params["error-key"] !== "" || this.params["error-key"] !== undefined;

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
    const yTitlePadding = this.params["ytitle-padding"] || 25;
    const xTickSize = parseInt(this.params["xtick-size"])
      ? parseInt(this.params["xtick-size"])
      : 0;
    const yTickSize = parseInt(this.params["ytick-size"])
      ? parseInt(this.params["ytick-size"])
      : 0;
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

    const showXAxis = this.params["show-x-axis"] === "false" ? false : true;
    const showYAxis = this.params["show-y-axis"] === "false" ? false : true;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("barchart-d3");

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

    if (showLegend !== "none") {
      this.legend = new Legend();
      root.append(this.legend);
    }

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    // TODO For now, artificially add 20% error and randomly add or not add it

    function getRandomTrueFalse() {
      return Math.random() >= 0.5;
    }

    values.forEach((item) => {
      if (getRandomTrueFalse()) {
        item.error = item[yKeyName] * 0.2;
      }
    });

    // Check data
    let error;
    if (!values.some((val) => yKeyName in val || parseFloat(val[yKeyName]))) {
      error = new Error(
        "--togostanza-barchart ERROR: No y-axis key found in data"
      );
      console.error(error);
      return error;
    }
    if (!values.some((val) => xKeyName in val || parseFloat(val[xKeyName]))) {
      error = new Error(
        "--togostanza-barchart ERROR: No x-axis key found in data"
      );
      console.error(error);
      return error;
    }

    //=========

    this._data = values;

    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }

    let dataMax = max(
      values,
      (d) => +d[yKeyName] + (parseFloat(d[errorKeyName]) || 0)
    );

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);

    const svg = select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    /// make below function to redraw with different margins if some labels are beyound the svg

    const redrawSVG = (
      MARGIN = {
        TOP: 10,
        BOTTOM: Math.max(
          60,
          xTitlePadding + xTickSize + 10 + axisTitleFontSize
        ),
        LEFT: Math.max(60, yTitlePadding + yTickSize + 10 + axisTitleFontSize),

        RIGHT: 10,
      }
    ) => {
      const existingChart = svg.select("g.chart");
      if (!existingChart.empty()) {
        existingChart
          .transition()
          .duration(200)
          .attr("opacity", 0)
          .on("end", () => {
            existingChart.remove();
          });
      }

      const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
      const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

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
          `translate(0,${HEIGHT + MARGIN.TOP + xTickSize + xTitlePadding})`
        );

      xTitleArea
        .append("text")
        .text(xAxisTitle)
        .attr("text-anchor", "middle")
        .attr("x", MARGIN.LEFT + WIDTH / 2);

      const yAxisArea = graphArea
        .append("g")
        .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`)
        .attr("class", "y axis");

      yTitleArea.attr(
        "transform",
        `translate(${MARGIN.LEFT - yTickSize - yTitlePadding},0)`
      );

      yTitleArea
        .append("text")
        .text(yAxisTitle)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "top")
        .attr("transform", `rotate(-90)`)
        .attr("x", -HEIGHT / 2 - MARGIN.TOP);

      const xAxisLabelsProps = getXTextLabelProps(
        xLabelAngle,
        xLabelPadding + xTickSize
      );
      const yAxisLabelsProps = getYTextLabelProps(
        yLabelAngle,
        yLabelPadding + yTickSize
      );

      /// Axes preparation
      const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
      const gSubKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];

      const color = ordinal()
        .domain(gSubKeyNames)
        .range(togostanzaColors);

      const toggleState = new Map(
        gSubKeyNames.map((_, index) => ["" + index, false])
      );

      const x = band()
        .domain(xAxisLabels)
        .range([0, WIDTH])
        .padding(barPaddings);

      const y = linear().range([HEIGHT, 0]);

      const xAxisGenerator = axisBottom(x).tickSizeOuter(0);

      const yAxisGenerator = axisLeft(y)
        .ticks(yTicksNumber)
        .tickFormat((d) => format(ylabelFormat)(d));

      const xAxisGridGenerator = axisBottom(x)
        .tickSize(-HEIGHT)
        .tickFormat("");

      const yAxisGridGenerator = axisLeft(y)
        .tickSize(-WIDTH)
        .tickFormat("")
        .ticks(yTicksNumber);

      const yGridLines = barsArea.append("g").attr("class", "y gridlines");

      const barsGroups = barsArea.append("g").attr("class", "bars-group");

      xAxisGenerator.tickSize(xTickSize);

      yAxisGenerator.tickSize(yTickSize);

      const update = (values) => {
        const xAxisLabels = [...new Set(values.map((d) => d[xKeyName]))];
        const subKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];

        x.domain(xAxisLabels);

        if (showXAxis) {
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
            .attr("transform", `rotate(${xLabelAngle})`)
            .on("end", function (_, i, nodes) {
              if (i === nodes.length - 1) {
                check(xAxisArea.node().getBoundingClientRect());
              }
            });
        }

        if (xTickPlacement === "in-between") {
          xAxisArea
            .selectAll("g.tick>line")
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

        if (barPlacement === "stacked") {
          updateStackedBars(values);
        } else {
          updateGroupedBars(values);
        }

        if (showBarTooltips) {
          const arr = this.root.querySelectorAll("svg rect");
          this.tooltip.setup(arr);
        }

        if (showLegend !== "none") {
          this.legend.setup(
            gSubKeyNames.map((item, index) => {
              return {
                id: "" + index,
                label: item,
                color: color(item),
                node: svg
                  .selectAll("g.bars-group rect")
                  .filter((d) => {
                    if (barPlacement === "stacked") {
                      return d.key === item;
                    }
                    return d[groupKeyName] === item;
                  })
                  .nodes(),
              };
            }),
            this.root.querySelector("main"),
            {
              fadeoutNodes: svg.selectAll("g.bars-group rect").nodes(),
              position: showLegend.split("-"),
              fadeProp: "opacity",
              showLeaders: false,
            }
          );
        }

        function updateStackedBars(values) {
          const stack$1 = stack().keys(subKeyNames);

          const dataset = [];
          for (const entry of group(values, (d) => d[xKeyName]).entries()) {
            dataset.push({
              x: entry[0],
              ...Object.fromEntries(
                entry[1].map((d) => [d[groupKeyName], +d[yKeyName]])
              ),
            });
          }

          const stackedData = stack$1(dataset);

          dataMax = max(stackedData.flat(), (d) => d[1]);

          y.domain([0, dataMax * 1.05]);

          if (showYAxis) {
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
          }

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
          const dataset = group(values, (d) => d[xKeyName]);

          const yMinMax = extent(
            values,
            (d) => +d[yKeyName] + (parseFloat(d[errorKeyName]) || 0) / 2
          );

          y.domain([0, yMinMax[1] * 1.05]);
          if (showYAxis) {
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
          }

          if (showYGrid) {
            yGridLines.transition().duration(200).call(yAxisGridGenerator);
          }

          const subX = band()
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
              (enter) => enter.append("rect").transition(300),
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

          if (showErrorBars) {
            barsGroup.call(errorBars, y, subX, errorBarWidth);
          }
        }
        // Check if X axis labels gets beyond the svg borders and adjust margins if necessary:

        function check(axisBBox) {
          const svgBBox = svg.node().getBoundingClientRect();

          const deltaLeftWidth = svgBBox.left - axisBBox.left;
          const deltaRightWidth = axisBBox.right - svgBBox.right;
          const deltaBottomHeight = axisBBox.bottom - svgBBox.bottom;
          const deltaTopHeight = svgBBox.top - axisBBox.top;

          if (
            deltaLeftWidth > 0 ||
            deltaRightWidth > 0 ||
            deltaBottomHeight > 0 ||
            deltaTopHeight > 0
          ) {
            MARGIN.LEFT =
              deltaLeftWidth > 0
                ? MARGIN.LEFT + deltaLeftWidth + 5
                : MARGIN.LEFT;
            MARGIN.RIGHT =
              deltaRightWidth > 0
                ? MARGIN.RIGHT + deltaRightWidth + 5
                : MARGIN.RIGHT;
            MARGIN.BOTTOM =
              deltaBottomHeight > 0
                ? MARGIN.BOTTOM + deltaBottomHeight + 5
                : MARGIN.BOTTOM;
            MARGIN.TOP =
              deltaTopHeight > 0 ? MARGIN.TOP + deltaTopHeight + 5 : MARGIN.TOP;

            redrawSVG(MARGIN);
          }
        }
      };

      update(values);

      if (showLegend !== "none") {
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
      }

      function errorBars(selection, yAxis, subXAxis, errorBarWidth) {
        selection.each(function (d) {
          const selG = select(this);

          const errorBarGroup = selG
            .selectAll("g")
            .data(d[1])
            .enter()
            .filter((d) => {
              return (
                d[errorKeyName] !== undefined &&
                !isNaN(parseFloat(d[errorKeyName]))
              );
            })
            .append("g")
            .attr("class", "error-bar");

          errorBarGroup
            .append("line")
            .attr("class", "error-bar-line")
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
            .attr("class", "error-bar-line")
            .attr(
              "x1",
              (d) =>
                subXAxis(d[groupKeyName]) +
                subXAxis.bandwidth() / 2 -
                errorBarWidth / 2
            )
            .attr(
              "x2",
              (d) =>
                subXAxis(d[groupKeyName]) +
                subXAxis.bandwidth() / 2 +
                errorBarWidth / 2
            )
            .attr("y1", (d) => yAxis(+d[yKeyName] - d[errorKeyName] / 2))
            .attr("y2", (d) => yAxis(+d[yKeyName] - d[errorKeyName] / 2));
          // lower stroke
          errorBarGroup
            .append("line")
            .attr("class", "error-bar-line")
            .attr(
              "x1",
              (d) =>
                subXAxis(d[groupKeyName]) +
                subXAxis.bandwidth() / 2 -
                errorBarWidth / 2
            )
            .attr(
              "x2",
              (d) =>
                subXAxis(d[groupKeyName]) +
                subXAxis.bandwidth() / 2 +
                errorBarWidth / 2
            )
            .attr("y1", (d) => yAxis(+d[yKeyName] + d[errorKeyName] / 2))
            .attr("y2", (d) => yAxis(+d[yKeyName] + d[errorKeyName] / 2));
        });
      }
    };

    redrawSVG();
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Barchart
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "barchart-d3",
	"stanza:label": "Barchart-D3",
	"stanza:definition": "Barchart-D3 MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Einishi Tech"
],
	"stanza:created": "2021-01-18",
	"stanza:updated": "2021-02-16",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://sparql-support.dbcls.jp/sparqlist/api/metastanza_multi_data_chart",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "category",
		"stanza:example": "chromosome",
		"stanza:description": "Variable to be assigned as category",
		"stanza:required": true
	},
	{
		"stanza:key": "value",
		"stanza:example": "count",
		"stanza:description": "Variable to be assigned as value",
		"stanza:required": true
	},
	{
		"stanza:key": "group-by",
		"stanza:example": "category",
		"stanza:description": "Variable to be assigned as group",
		"stanza:required": false
	},
	{
		"stanza:key": "bar-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"stacked",
			"grouped"
		],
		"stanza:example": "grouped",
		"stanza:description": "Bars arrangement",
		"stanza:required": true
	},
	{
		"stanza:key": "error-key",
		"stanza:type": "string",
		"stanza:example": "error",
		"stanza:description": "Show error bars",
		"stanza:required": false
	},
	{
		"stanza:key": "error-bar-width",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Error bar horizontal line width in px",
		"stanza:required": false
	},
	{
		"stanza:key": "bar-paddings",
		"stanza:type": "number",
		"stanza:example": 0.1,
		"stanza:description": "Bars spacing",
		"stanza:required": false
	},
	{
		"stanza:key": "bar-sub-paddings",
		"stanza:type": "number",
		"stanza:example": 0.1,
		"stanza:description": "Bars spacing inside bar group",
		"stanza:required": false
	},
	{
		"stanza:key": "bar-tooltips",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": "true",
		"stanza:description": "Show bars tooltips",
		"stanza:required": false
	},
	{
		"stanza:key": "category-title",
		"stanza:example": "chromosome",
		"stanza:description": "Title for category variable (In case of blank, 'category' variable name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "value-title",
		"stanza:example": "count",
		"stanza:description": "Title for value variable (In case of blank, 'value' variable name will be assigned)",
		"stanza:required": false
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 600,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 50,
		"stanza:description": "Padding"
	},
	{
		"stanza:key": "legend",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"none",
			"top-left",
			"top-right",
			"bottom-left",
			"bottom-right"
		],
		"stanza:example": "top-right",
		"stanza:description": "Where to show the legend. 'none' for no legend"
	},
	{
		"stanza:key": "xgrid",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": false,
		"stanza:description": "Show X grid"
	},
	{
		"stanza:key": "ygrid",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show Y grid"
	},
	{
		"stanza:key": "xtick",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show X tick"
	},
	{
		"stanza:key": "xtick-placement",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"center",
			"in-between"
		],
		"stanza:example": "in-between",
		"stanza:description": "Show X tick"
	},
	{
		"stanza:key": "ytick",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show Y tick"
	},
	{
		"stanza:key": "yticks-number",
		"stanza:example": 3,
		"stanza:description": "Y axis ticks number",
		"stanza:required": true
	},
	{
		"stanza:key": "xtick-size",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "X axis tick size"
	},
	{
		"stanza:key": "ytick-size",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Y axis tick size"
	},
	{
		"stanza:key": "xlabel-angle",
		"stanza:example": -90,
		"stanza:description": "X label angle (in degree)"
	},
	{
		"stanza:key": "ylabel-angle",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Y label angle (in degree)"
	},
	{
		"stanza:key": "ylabel-format",
		"stanza:type": "string",
		"stanza:example": ",.2r",
		"stanza:description": "Y axis tick labels number format. See more format strings in d3.format() documentation"
	},
	{
		"stanza:key": "xlabel-padding",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Padding between X label and tick"
	},
	{
		"stanza:key": "ylabel-padding",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Padding between Y label and tick"
	},
	{
		"stanza:key": "xtitle-padding",
		"stanza:type": "number",
		"stanza:example": 20,
		"stanza:description": "Padding between X title and label"
	},
	{
		"stanza:key": "ytitle-padding",
		"stanza:type": "number",
		"stanza:example": 40,
		"stanza:description": "Padding between Y title and label"
	},
	{
		"stanza:key": "show-x-axis",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show X Axis"
	},
	{
		"stanza:key": "show-y-axis",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"true",
			"false"
		],
		"stanza:example": true,
		"stanza:description": "Show Y Axis"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-axis-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Axis color"
	},
	{
		"stanza:key": "--togostanza-axis-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Axis width"
	},
	{
		"stanza:key": "--togostanza-grid-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Grid color"
	},
	{
		"stanza:key": "--togostanza-grid-dash-length",
		"stanza:type": "number",
		"stanza:default": "",
		"stanza:description": "Grid dash length (Blank for solid lines)"
	},
	{
		"stanza:key": "--togostanza-grid-opacity",
		"stanza:type": "number",
		"stanza:default": 0.1,
		"stanza:description": "Grid opacity (0-1)"
	},
	{
		"stanza:key": "--togostanza-grid-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Grid width"
	},
	{
		"stanza:key": "--togostanza-tick-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Tick color"
	},
	{
		"stanza:key": "--togostanza-tick-length",
		"stanza:type": "number",
		"stanza:default": 1.5,
		"stanza:description": "Tick length (in pixel)"
	},
	{
		"stanza:key": "--togostanza-tick-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Tick width (in pixel)"
	},
	{
		"stanza:key": "--togostanza-errorbar-line-width",
		"stanza:type": "number",
		"stanza:default": 1,
		"stanza:description": "Errorbar line width"
	},
	{
		"stanza:key": "--togostanza-errorbar-line-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Errorbar line color"
	},
	{
		"stanza:key": "--togostanza-errorbar-line-opacity",
		"stanza:type": "number",
		"stanza:default": 0.4,
		"stanza:description": "Errorbar line opacity"
	},
	{
		"stanza:key": "--togostanza-title-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Title font color"
	},
	{
		"stanza:key": "--togostanza-title-font-size",
		"stanza:type": "number",
		"stanza:default": 10,
		"stanza:description": "Title font size"
	},
	{
		"stanza:key": "--togostanza-title-font-weight",
		"stanza:type": "number",
		"stanza:default": 400,
		"stanza:description": "Title font weight"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 10,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-bars-border-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Bars border color"
	},
	{
		"stanza:key": "--togostanza-bars-border-width",
		"stanza:type": "number",
		"stanza:default": 0.5,
		"stanza:description": "Bars border width"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0,
		"stanza:description": "Border width"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0.0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"barchart-d3\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=barchart-d3.js.map
