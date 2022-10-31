import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import Legend2 from "@/lib/Legend2";
import { v4 as uuidv4 } from "uuid";
import { parseValue } from "./utils";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import validateParams from "../../lib/validateParams";

export default class Linechart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
      downloadJSONMenuItem(this, "linechart", this._data),
      downloadCSVMenuItem(this, "linechart", this._data),
      downloadTSVMenuItem(this, "linechart", this._data),
    ];
  }

  async render() {
    this._hideError();

    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this._validatedParams = validateParams(this.metadata, this.params);

    //data
    const xKeyName = this._validatedParams.get("axis-x-key").value;
    const yKeyName = this._validatedParams.get("axis-y-key").value;
    const xAxisTitle = this._validatedParams.get("axis-x-title").value;
    const yAxisTitle = this._validatedParams.get("axis-y-title").value || "";
    const hideXAxis = this._validatedParams.get("axis-x-hide").value;
    const hideYAxis = this._validatedParams.get("axis-y-hide").value;
    const hideXAxisTicks = this._validatedParams.get("axis-x-ticks_hide").value;
    const hideYAxisTicks = this._validatedParams.get("axis-y-ticks_hide").value;
    const showPoints = this._validatedParams.get("points-show").value;
    const pointsSize = this._validatedParams.get("points-size").value;
    // const showErrorBars = this._validatedParams.get(
    //   "chart-error_bars-show"
    // ).value;

    const errorKeyName = this._validatedParams.get("error_bars-key").value;

    const xTicksAngle = this._validatedParams.get(
      "axis-x-ticks_label_angle"
    ).value;

    const groupingColorKey = this._validatedParams.get("color_by-key").value;

    const xTicksNumber = 5;
    const xGridNumber = xTicksNumber;
    const xTicksInterval = !isNaN(
      parseFloat(this._validatedParams.get("axis-x-ticks_interval").value)
    )
      ? Math.abs(
          parseFloat(this._validatedParams.get("axis-x-ticks_interval").value)
        )
      : null;

    const xGridInterval = xTicksInterval;

    const showYGridlines = this._validatedParams.get(
      "axis-y-show_gridlines"
    ).value;

    const showXGridlines = this._validatedParams.get(
      "axis-x-show_gridlines"
    ).value;

    const yTicksNumber = 3;
    const yGridNumber = yTicksNumber;
    const yTicksInterval = !isNaN(
      parseFloat(this._validatedParams.get("axis-y-ticks_interval").value)
    )
      ? Math.abs(
          parseFloat(this._validatedParams.get("axis-y-ticks_interval").value)
        )
      : null;

    const yGridInterval = yTicksInterval;

    this.xScale = this._validatedParams.get("axis-x-scale").value;
    this.yScale = this._validatedParams.get("axis-y-scale").value;

    const showXPreview = this._validatedParams.get("axis-x-preview").value;
    const showYPreview = this._validatedParams.get("axis-y-preview").value;
    const showLegend = this._validatedParams.get("legend-show").value;
    const legendPosition = this._validatedParams.get("legend-placement").value;
    const legendTitle = this._validatedParams.get("legend-title").value;

    const xAxisTicksIntervalUnits = this._validatedParams.get(
      "axis-x-ticks_interval_units"
    ).value;

    const xAxisGridIntervalUnits = xAxisTicksIntervalUnits;

    const xTitlePadding = this._validatedParams.get(
      "axis-x-title_padding"
    ).value;
    const yTitlePadding = this._validatedParams.get(
      "axis-y-title_padding"
    ).value;

    const xAxisTicksFormat = this._validatedParams.get(
      "axis-x-ticks_labels_format"
    ).value;

    const yAxisTicksFormat = this._validatedParams.get(
      "axis-y-ticks_labels_format"
    ).value;

    const groupKeyName = this._validatedParams.get("group_by-key").value;

    const axisYRangeMin = this._validatedParams.get("axis-y-range_min").value;
    const axisYRangeMax = this._validatedParams.get("axis-y-range_max").value;

    if (
      this.yScale === "log" &&
      (parseFloat(axisYRangeMin) <= 0 || parseFloat(axisYRangeMin) <= 0)
    ) {
      this._renderError("Y axis range must be positive");
      throw new Error("Y axis range must be positive");
    }

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    /* eslint-disable-next-line */
    this._data = structuredClone(values);

    parseData.call(this);

    const showErrorBars = this._data.some((d) => d[errorKeyName]);

    const root = this.root.querySelector("main");

    if (root.querySelector("svg")) {
      root.querySelector("svg").remove();
    }

    // Data symbols
    const symbolGenerator = d3.symbol().size(pointsSize).type(d3.symbolCircle);

    const { width, height } = root.getBoundingClientRect();

    const MARGIN = {
      top: parseFloat(getComputedStyle(root).paddingTop),
      right: parseFloat(getComputedStyle(root).paddingRight),
      bottom: parseFloat(getComputedStyle(root).paddingBottom),
      left: parseFloat(getComputedStyle(root).paddingLeft),
    };

    const SVGMargin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 24,
    };

    const togostanzaColors = [];

    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-theme-series_${i}_color`));
    }

    const color = d3.scaleOrdinal().range(togostanzaColors);

    function getScale(scaleType) {
      if (scaleType === "linear") {
        return d3.scaleLinear();
      } else if (scaleType === "log") {
        return d3.scaleLog();
      } else if (scaleType === "time") {
        return d3.scaleTime();
      } else {
        return d3.scaleBand();
      }
    }

    function parseData() {
      this._data.forEach((d) => {
        d[xKeyName] = parseValue(d[xKeyName], this.xScale);
        d[yKeyName] = parseValue(d[yKeyName], this.yScale);
      });
    }

    this._groups = [];
    this._groupByNameMap = new Map();

    if (groupKeyName && this._data.some((d) => d[groupKeyName])) {
      this._groupedData = this._data.reduce((acc, d) => {
        const group = d[groupKeyName];

        if (
          this.xScale !== "ordinal" &&
          (isNaN(d[xKeyName]) || isNaN(d[yKeyName]))
        ) {
          return acc;
        }
        const groupIndex = acc.findIndex((g) => g.group === group);
        if (groupIndex === -1) {
          acc.push({
            group,
            id: uuidv4(),
            color: color(d[groupingColorKey]),
            show: true,
            data: [
              {
                x: d[xKeyName],
                y: d[yKeyName],
                error: d[errorKeyName],
              },
            ],
          });
          this._groups.push(group);
          this._groupByNameMap.set(group, acc[acc.length - 1]);
        } else {
          if (d[xKeyName] && d[yKeyName]) {
            acc[groupIndex].data.push({
              x: d[xKeyName],
              y: d[yKeyName],
              error: d[errorKeyName],
            });
          }
        }
        return acc;
      }, []);
    } else {
      this._groupedData = [
        {
          group: "data",
          color: color("data"),
          show: true,
          id: uuidv4(),
          data: this._data
            .map((d) => {
              if (d[yKeyName] && d[yKeyName]) {
                return {
                  x: d[xKeyName],
                  y: d[yKeyName],
                  error: d[errorKeyName],
                };
              }
            })
            .filter((d) => d),
        },
      ];
    }

    const svg = d3.select(root).append("svg");

    if (showLegend) {
      this.legend = new Legend2();

      root.append(this.legend);
      root.classList.add(`legend-${legendPosition}`);

      this.legend.items = this._groups.map((item, index) => {
        return {
          id: "" + index,
          label: item,
          color: this._groupByNameMap.get(item).color,
          toggled: false,
        };
      });
    } else {
      this.legend.removeEventListener(
        "legend-item-click",
        this._legendListener
      );
      this.legend.remove();
    }

    // Add legend, after rendering, so we know its width
    requestAnimationFrame(() => {
      const legendRect = this.legend?.getBoundingClientRect();
      if (
        this.legend &&
        (legendPosition === "right" || legendPosition === "left")
      ) {
        legendRect.height = 0;
      }
      if (
        this.legend &&
        (legendPosition === "top" || legendPosition === "bottom")
      ) {
        legendRect.width = 0;
      }

      afterLegendRendered.bind(this)(legendRect);
    });

    function afterLegendRendered(legendRect) {
      // render svg after we got legend width

      const SVGWidth = width - MARGIN.left - MARGIN.right - legendRect.width;
      const SVGHeight = height - MARGIN.top - MARGIN.bottom - legendRect.height;

      // Width and height of the chart
      const WIDTH =
        width -
        MARGIN.left -
        SVGMargin.left -
        MARGIN.right -
        SVGMargin.right -
        legendRect.width;
      const HEIGHT =
        height -
        MARGIN.top -
        SVGMargin.top -
        MARGIN.bottom -
        SVGMargin.bottom -
        legendRect.height;

      // padding betsween chart and preview
      const PD = 20;

      let chartWidth = WIDTH;
      let chartHeight = HEIGHT;
      let previewXWidth = WIDTH;
      let previewYHeight = HEIGHT;
      const previewYWidth = WIDTH * 0.2 - PD / 2;
      const previewXHeight = HEIGHT * 0.2 - PD / 2;

      if (showXPreview) {
        chartHeight = HEIGHT * 0.8 - PD / 2;
        previewYHeight = chartHeight;
      }

      if (showYPreview) {
        chartWidth = WIDTH * 0.8 - PD / 2;
        previewXWidth = chartWidth;
      }

      this._currentData = this._groupedData;

      const getXDomain = () => {
        if (this.xScale === "ordinal") {
          return [
            ...new Set(
              this._currentData.map((d) => d.data.map((d) => d.x)).flat()
            ),
          ];
        } else {
          const xDomain = this._currentData.map((d) => d.data.map((d) => d.x));
          return d3.extent(xDomain.flat());
        }
      };

      // set y domain
      const getYDomain = () => {
        const yDomain = this._currentData.map((d) => d.data.map((d) => d.y));
        let extent = d3.extent(yDomain.flat());

        if (showErrorBars) {
          const mins = this._currentData.map((d) => {
            return d.data.map((d) => {
              // const error = d[errorKeyName];
              return d.error[0];
            });
          });

          const maxs = this._currentData.map((d) => {
            return d.data.map((d) => {
              // const error = d[errorKeyName];
              return d.error[1];
            });
          });

          extent = d3.extent([...mins.flat(), ...maxs.flat()]);
        }

        return [
          !isNaN(parseFloat(axisYRangeMin))
            ? parseFloat(axisYRangeMin)
            : extent[0],

          !isNaN(parseFloat(axisYRangeMax))
            ? parseFloat(axisYRangeMax)
            : extent[1],
        ];
      };

      svg.attr("width", SVGWidth).attr("height", SVGHeight);

      const graphArea = svg
        .append("g")
        .attr("class", "chart")
        .attr("transform", `translate(${SVGMargin.left}, ${SVGMargin.top})`);

      const yAxisTitleGroup = graphArea
        .append("g")
        .attr("class", "axis-title-group y");

      const xAxisTitleGroup = graphArea
        .append("g")
        .attr("class", "axis-title-group x");

      //Add title to axes if they are not empty
      let yTitleWidth = 0;
      let xTitleHeight = 0;
      if (yAxisTitle) {
        const yTitle = yAxisTitleGroup
          .append("text")
          .text(yAxisTitle)
          .attr("class", "title y")
          .attr("y", chartHeight / 2)
          .attr("dominant-baseline", "hanging")
          .attr("transform", `rotate(-90, 0, ${chartHeight / 2})`);

        yTitleWidth = yTitle.node().getBBox().height;
      }

      if (xAxisTitle) {
        const xTitle = xAxisTitleGroup
          .append("text")
          .text(xAxisTitle)
          .attr("class", "title x")
          .attr("y", xTitlePadding || 0)
          .attr("x", chartWidth / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "hanging");

        xTitleHeight = xTitle.node().getBBox().height;
      }

      xAxisTitleGroup.attr(
        "transform",
        `translate(${yTitleWidth + yTitlePadding},${
          chartHeight - xTitlePadding - xTitleHeight
        })`
      );

      chartWidth -= yTitleWidth + yTitlePadding;
      chartHeight -= xTitleHeight + xTitlePadding;
      previewXWidth -= yTitleWidth + yTitlePadding;
      previewYHeight -= xTitleHeight + xTitlePadding;

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

      const chartAreaGroup = graphArea
        .append("g")
        .attr("class", "chart-area")
        .attr("transform", `translate(${yTitleWidth + yTitlePadding}, 0)`);

      let previewXArea;
      let previewYArea;

      if (showXPreview) {
        previewXArea = svg
          .append("g")
          .attr("class", "preview")
          .attr(
            "transform",
            `translate(${SVGMargin.left + yTitleWidth + yTitlePadding}, ${
              SVGMargin.top + chartHeight + xTitleHeight + xTitlePadding + PD
            })`
          );
      }
      if (showYPreview) {
        previewYArea = svg
          .append("g")
          .attr("class", "preview")
          .attr(
            "transform",
            `translate(${
              SVGMargin.left + chartWidth + yTitleWidth + yTitlePadding + PD
            }, ${SVGMargin.top})`
          );
      }

      const errorsGroup = chartAreaGroup
        .append("g")
        .attr("class", "error-bars")
        .attr("clip-path", "url(#clip)");

      let xExtent, yExtent;

      this._scaleX = getScale(this.xScale).range([0, chartWidth]);
      this._scaleY = getScale(this.yScale).range([chartHeight, 0]);

      this._previewXScaleX = getScale(this.xScale).range([0, previewXWidth]);
      this._previewXScaleY = getScale(this.yScale).range([previewXHeight, 0]);
      this._previewYScaleX = getScale(this.xScale).range([0, previewYWidth]);
      this._previewYScaleY = getScale(this.yScale).range([previewYHeight, 0]);

      const xAxis = d3.axisBottom(this._scaleX);
      const xAxisX = d3.axisBottom(this._previewXScaleX).tickValues([]);
      const xAxisY = d3.axisBottom(this._previewYScaleX).tickValues([]);
      const yAxis = d3.axisLeft(this._scaleY);
      const yAxisX = d3.axisLeft(this._previewXScaleY).tickValues([]);
      const yAxisY = d3.axisLeft(this._previewYScaleY).tickValues([]);

      const xAxisGrid = d3
        .axisBottom(this._scaleX)
        .tickSize(-chartHeight)
        .tickFormat("");

      const yAxisGrid = d3
        .axisLeft(this._scaleY)
        .tickSize(-chartWidth)
        .tickFormat("");

      if (this.xScale === "linear") {
        try {
          xAxis.tickFormat(d3.format(xAxisTicksFormat));
          xAxisX.tickFormat(d3.format(xAxisTicksFormat));
        } catch {
          xAxis.tickFormat((d) => d);
          xAxisX.tickFormat((d) => d);
        }
        xExtent = d3.extent(getXDomain());

        if (showXGridlines) {
          if (xGridInterval) {
            const ticks = [];
            for (let i = xExtent[0]; i <= xExtent[1]; i = i + xGridInterval) {
              ticks.push(i);
            }
            xAxisGrid.tickValues(ticks);
          } else {
            xAxisGrid.ticks(xGridNumber);
          }
        }

        if (xTicksInterval) {
          const ticks = [];
          for (let i = xExtent[0]; i <= xExtent[1]; i = i + xTicksInterval) {
            ticks.push(i);
          }
          xAxis.tickValues(ticks);
        } else {
          xAxis.ticks(xTicksNumber);
        }
        try {
          xAxis.tickFormat(xAxisTicksFormat);
          xAxisX.tickFormat(xAxisTicksFormat);
        } catch {
          xAxis.tickFormat((d) => d);
          xAxisX.tickFormat((d) => d);
        }
      } else if (this.xScale === "time") {
        try {
          xAxis.tickFormat(d3.timeFormat(xAxisTicksFormat));
          xAxisX.tickFormat(d3.timeFormat(xAxisTicksFormat));
        } catch {
          xAxis.tickFormat(d3.timeFormat("%Y-%m-%d"));
          xAxisX.tickFormat(d3.timeFormat("%Y-%m-%d"));
        }

        if (showXGridlines) {
          if (
            xGridInterval &&
            xAxisGridIntervalUnits &&
            xAxisGridIntervalUnits !== "none"
          ) {
            const interval =
              intervalMap[xAxisGridIntervalUnits]().every(xGridInterval);
            xAxisGrid.ticks(interval);
          } else {
            xAxisGrid.ticks(xGridNumber);
          }
        }

        if (
          xTicksInterval &&
          xAxisTicksIntervalUnits &&
          xAxisTicksIntervalUnits !== "none"
        ) {
          const interval =
            intervalMap[xAxisTicksIntervalUnits]().every(xTicksInterval);
          xAxis.ticks(interval);
        } else {
          xAxis.ticks(xTicksNumber);
        }
      } else {
        try {
          xAxis.tickFormat(d3.format(xAxisTicksFormat));
          xAxisX.tickFormat(d3.format(xAxisTicksFormat));
        } catch {
          xAxis.tickFormat((d) => d);
          xAxisX.tickFormat((d) => d);
        }
      }

      if (this.yScale === "linear") {
        try {
          yAxis.tickFormat(d3.format(yAxisTicksFormat));
        } catch {
          yAxis.tickFormat((d) => d);
        }

        yExtent = d3.extent(getYDomain());

        if (showYGridlines) {
          if (yGridInterval) {
            const ticks = [];
            for (let i = yExtent[0]; i <= yExtent[1]; i = i + yGridInterval) {
              ticks.push(i);
            }
            yAxisGrid.tickValues(ticks);
          } else {
            yAxisGrid.ticks(yGridNumber);
          }
        }

        if (yTicksInterval) {
          const ticks = [];
          for (let i = yExtent[0]; i <= yExtent[1]; i = i + yTicksInterval) {
            ticks.push(i);
          }
          yAxis.tickValues(ticks);
        } else {
          yAxis.ticks(yTicksNumber);
        }
      } else {
        yAxis.tickFormat(d3.format(yAxisTicksFormat));
      }

      const errorVertical = (d, error) => {
        return `M 0,${-Math.abs(
          this._scaleY(d.y) - this._scaleY(error[1])
        )} L 0,${Math.abs(this._scaleY(d.y) - this._scaleY(error[0]))}`;
      };

      const errorHorizontalTop = (d, error) => {
        const barWidth = 5;

        return `M ${-barWidth / 2},${-Math.abs(
          this._scaleY(d.y) - this._scaleY(error[1])
        )} L ${barWidth / 2},${-Math.abs(
          this._scaleY(d.y) - this._scaleY(error[1])
        )}`;
      };

      const errorHorizontalBottom = (d, error) => {
        const barWidth = 5;

        return `M ${-barWidth / 2},${Math.abs(
          this._scaleY(d.y) - this._scaleY(error[0])
        )} L ${barWidth / 2},${Math.abs(
          this._scaleY(d.y) - this._scaleY(error[0])
        )}`;
      };

      const line = d3
        .line()
        .x((d) => {
          if (this.xScale === "ordinal") {
            return this._scaleX(d.x) + this._scaleX.bandwidth() / 2;
          }
          return this._scaleX(d.x);
        })
        .y((d) => {
          return this._scaleY(d.y);
        });

      const linePreviewX = d3
        .line()
        .x((d) => {
          if (this.xScale === "ordinal") {
            return (
              this._previewXScaleX(d.x) + this._previewXScaleX.bandwidth() / 2
            );
          }
          return this._previewXScaleX(d.x);
        })
        .y((d) => this._previewXScaleY(d.y));

      const linePreviewY = d3
        .line()
        .x((d) => {
          if (this.xScale === "ordinal") {
            return (
              this._previewYScaleX(d.x) + this._previewYScaleX.bandwidth() / 2
            );
          }
          return this._previewYScaleX(d.x);
        })
        .y((d) => {
          return this._previewYScaleY(d.y);
        });

      const graphXAxisG = xAxisTitleGroup
        .append("g")
        .attr("class", "axis x")
        .attr("clip-path", "url(#clip)");

      const graphXGridG = xAxisTitleGroup.append("g").attr("class", "grid x");

      const graphYAxisG = yAxisTitleGroup
        .append("g")
        .attr("class", "axis y")
        .attr("transform", `translate(${yTitlePadding + yTitleWidth}, 0)`);

      const graphYGridG = yAxisTitleGroup
        .append("g")
        .attr("class", "grid y")
        .attr("transform", `translate(${yTitlePadding + yTitleWidth}, 0)`)
        .attr("clip-path", "url(#clip)");

      let previewXAxisXG;
      let previewXAxisYG;
      let previewYAxisXG;
      let previewYAxisYG;

      // append preview if true
      if (showXPreview) {
        previewXAxisXG = previewXArea
          .append("g")
          .attr("class", "axis x")
          .attr("transform", `translate(0, ${previewXHeight})`)
          .attr("clip-path", "url(#clip)");

        previewXAxisYG = previewXArea.append("g").attr("class", "axis y");
        previewXArea.append("g").attr("class", "brushX");
      }

      if (showYPreview) {
        previewYAxisXG = previewYArea
          .append("g")
          .attr("class", "axis x")
          .attr("transform", `translate(0, ${previewYHeight})`)
          .attr("clip-path", "url(#clip)");

        previewYAxisYG = previewYArea.append("g").attr("class", "axis y");
        previewYArea.append("g").attr("class", "brushY");
      }

      // update with new data (when toggling via legend)
      const update = () => {
        this._currentData = this._groupedData.filter((group) => group.show);

        this._scaleX.domain(getXDomain());
        this._scaleY.domain(getYDomain());

        if (showXPreview) {
          this._previewXScaleX.domain(getXDomain());
          this._previewXScaleY.domain(getYDomain());

          const previewLinesUpdate = previewXArea
            .selectAll(".line")
            .data(this._currentData);

          const previewLinesEnter = previewLinesUpdate
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)");

          previewLinesUpdate
            .merge(previewLinesEnter)
            .attr("d", (d) => linePreviewX(d.data))
            .attr("stroke", (d) => d.color);

          previewLinesUpdate.exit().remove();
        }

        if (showYPreview) {
          this._previewYScaleX.domain(getXDomain());
          this._previewYScaleY.domain(getYDomain());

          const previewLinesUpdate = previewYArea
            .selectAll(".line")
            .data(this._currentData);

          const previewLinesEnter = previewLinesUpdate
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)");

          previewLinesUpdate
            .merge(previewLinesEnter)
            .attr("d", (d) => linePreviewY(d.data))
            .attr("stroke", (d) => d.color);

          previewLinesUpdate.exit().remove();
        }

        const interpolator = {};

        if (this.xScale === "linear") {
          this._currentData.forEach((d) => {
            const domain = d.data.map((d) => d.x);
            const range = d.data.map((d) => d.y);
            if (
              [...new Set(domain)].length < 2 ||
              [...new Set(range)].length < 2
            ) {
              this._renderError(
                "Cannot interpolate with less than 2 points. Probably wrong scale type was chosen."
              );
              return;
            }
            interpolator[d.group] = d3
              .scaleLinear()
              .domain(d.data.map((d) => d.x))
              .range(d.data.map((d) => d.y));
          });
        } else if (this.xScale === "ordinal") {
          this._currentData.forEach((d) => {
            interpolator[d.group] = d3
              .scaleLinear()
              .domain(d.data.map((d) => d.x))
              .range(d.data.map((d) => d.y));
          });
        } else if (this.xScale === "time") {
          this._currentData.forEach((d) => {
            const domain = d.data.map((d) => d.x);
            const range = d.data.map((d) => d.y);
            if (
              [...new Set(domain)].length < 2 ||
              [...new Set(range)].length < 2
            ) {
              this._renderError(
                "Cannot interpolate with less than 2 points. Probably wrong scale type was chosen."
              );
              return;
            }
            interpolator[d.group] = d3
              .scaleTime()
              .domain(d.data.map((d) => d.x))
              .range(d.data.map((d) => d.y));
          });
        } else if (this.xScale === "log") {
          this._currentData.forEach((d) => {
            const domain = d.data.map((d) => d.x);
            const range = d.data.map((d) => d.y);
            if (
              [...new Set(domain)].length < 2 ||
              [...new Set(range)].length < 2
            ) {
              this._renderError(
                "Cannot interpolate with less than 2 points. Probably wrong scale type was chosen."
              );
              return;
            }
            interpolator[d.group] = d3
              .scaleLog()
              .domain(d.data.map((d) => d.x))
              .range(d.data.map((d) => d.y));
          });
        } else {
          this._renderError(
            "Unknown scale type. Probably wrong scale type was chosen."
          );
          return;
        }

        const brushedX = (e) => {
          const s = e.selection || this._previewXScaleX.range();

          previewXArea.select(".left").attr("width", s[0]);
          previewXArea
            .select(".right")
            .attr("width", previewXWidth - s[1])
            .attr("x", s[1]);

          if (this.xScale === "ordinal") {
            const currentRange = [
              Math.floor(s[0] / this._previewXScaleX.step()),
              Math.floor(s[1] / this._previewXScaleX.step()),
            ];
            const newDomainX = getXDomain().slice(
              currentRange[0],
              currentRange[1] + 1
            );

            const croppedData = this._currentData.map((d) => {
              return {
                ...d,
                data: d.data.filter((v) => newDomainX.includes(v.x)),
              };
            });

            this._scaleX.domain(newDomainX);

            if (!showYPreview) {
              this._scaleY.domain(
                d3.extent(croppedData.map((d) => d.data.map((v) => v.y)).flat())
              );
            }

            updateRange(croppedData);
          } else {
            const x0x1 = s.map(
              this._previewXScaleX.invert,
              this._previewXScaleX
            );
            this._scaleX.domain(x0x1);

            if (!showYPreview) {
              const extents = [];

              this._currentData.forEach((d) => {
                const ext = d3.extent(
                  d.data
                    .filter((v) => x0x1[0] < v.x && v.x < x0x1[1])
                    .map((v) => v.y)
                );

                ext.push(...x0x1.map((v) => interpolator[d.group](v)));

                extents.push(d3.extent(ext));
              });

              this._scaleY.domain(d3.extent(extents.flat()));
            }
          }

          if (showXPreview) {
            previewXArea.selectAll(".handle").attr("rx", 2).attr("ry", 2);
            previewXArea
              .selectAll(".handle")
              .attr("y", previewXHeight / 4)
              .attr("height", previewXHeight / 2);
          }

          graphArea.selectAll(".line").attr("d", (d) => line(d.data));

          if (showYGridlines) {
            graphYGridG.call(yAxisGrid);
          }

          if (showXGridlines) {
            graphXGridG.call(xAxisGrid);
          }

          if (showErrorBars) {
            graphArea
              .selectAll(".error-bar")
              .call(updateErrorTranslate.bind(this));
          }
          if (showPoints) {
            graphArea
              .selectAll(".symbol")
              .call(updateSymbolTranslate.bind(this));
          }

          if (!hideXAxis && !hideXAxisTicks) {
            graphXAxisG.call(xAxis).call(rotateXTickLabels);
          }

          if (!hideYAxis && !hideYAxisTicks) {
            graphYAxisG.call(yAxis);
          }
        };

        const brushedY = (e) => {
          const s = e.selection || this._previewYScaleY.range();

          previewYArea.select(".top").attr("height", Math.min(...s));

          previewYArea
            .select(".bottom")
            .attr("y", Math.max(...s))
            .attr("height", previewYHeight - Math.max(...s));

          const y0y1 = s.map(this._previewYScaleY.invert, this._previewYScaleY);

          this._scaleY.domain(d3.extent(y0y1));

          if (!hideXAxis && !hideXAxisTicks) {
            graphXAxisG.call(xAxis).call(rotateXTickLabels);
          }

          if (!hideYAxis && !hideYAxisTicks) {
            graphYAxisG.call(yAxis);
          }

          if (showYGridlines) {
            graphYGridG.call(yAxisGrid);
          }

          if (showXGridlines) {
            graphXGridG.call(xAxisGrid);
          }

          graphArea.selectAll(".line").attr("d", (d) => line(d.data));

          graphArea
            .selectAll(".error-bar")
            .call(updateErrorTranslate.bind(this));

          graphArea.selectAll(".error-bar").call(updateErrorScale);

          graphArea.selectAll(".symbol").call(updateSymbolTranslate.bind(this));

          if (showYPreview) {
            previewYArea.selectAll(".handle").attr("rx", 2).attr("ry", 2);
            previewYArea
              .selectAll(".handle")
              .attr("x", previewYWidth / 4)
              .attr("width", previewYWidth / 2);
          }
        };

        if (showXPreview) {
          previewXArea.selectAll(".handle").attr("rx", 2).attr("ry", 2);
          previewXArea
            .selectAll(".handle")
            .attr("y", previewXHeight / 4)
            .attr("height", previewXHeight / 2);
        }

        if (showYPreview) {
          previewYArea.selectAll(".handle").attr("rx", 2).attr("ry", 2);
          previewYArea
            .selectAll(".handle")
            .attr("x", previewYWidth / 4)
            .attr("width", previewYWidth / 2);
        }

        const updateSymbols = (data) => {
          const symUpdateG = chartAreaGroup
            .selectAll(".symbol-group")
            .data(data, (d) => d.id);

          const symEnterG = symUpdateG.enter().append("g");

          const mergedSymbols = symUpdateG
            .merge(symEnterG)
            .attr("class", "symbol-group")
            .attr("clip-path", "url(#clip)")
            .attr("fill", (d) => d.color);

          symUpdateG.exit().remove();

          const symUpdate = mergedSymbols.selectAll(".symbol").data((d) => {
            return d.data;
          });

          const symEnter = symUpdate
            .enter()
            .append("g")
            .attr("transform", (d) => {
              return `translate(${
                this._scaleX(d.x) + (this._scaleX.bandwidth?.() / 2 || 0)
              },${this._scaleY(d.y)})`;
            });

          symUpdate
            .merge(symEnter)
            .attr("class", "symbol")
            .append("path")
            .attr("d", symbolGenerator);

          symUpdate.exit().remove();
        };

        function updateErrorTranslate(nodes) {
          nodes.attr("transform", (d) => {
            const x = this._scaleX(d.x) + (this._scaleX.bandwidth?.() / 2 || 0);
            const y = this._scaleY(d.y);
            return `translate(${x},${y})`;
          });
        }

        function updateSymbolTranslate(nodes) {
          nodes.attr("transform", (d) => {
            const x = this._scaleX(d.x) + (this._scaleX.bandwidth?.() / 2 || 0);
            const y = this._scaleY(d.y);
            return `translate(${x},${y})`;
          });
        }

        function updateErrorScale(nodes) {
          nodes.each(function (d) {
            const errorG = d3.select(this);

            errorG.select("path.vertical").attr("d", errorVertical(d, d.error));

            errorG.select("path.top").attr("d", errorHorizontalTop(d, d.error));
            errorG
              .select("path.bottom")
              .attr("d", errorHorizontalBottom(d, d.error));
          });
        }

        const updateErrors = (data) => {
          const errorUpdate = errorsGroup
            .selectAll(".error")
            .data(data, (d) => d.id);

          const errorEnter = errorUpdate.enter().append("g");

          const mergedErrors = errorUpdate
            .merge(errorEnter)
            .classed("error", true)
            .attr("stroke", (d) => d.color);

          errorUpdate.exit().remove();

          const errorBarUpdate = mergedErrors.selectAll(".error-bar").data(
            (d) => {
              return d.data;
            },
            (d) => d.x
          );

          const errorBarEnter = errorBarUpdate.enter().append("g");

          errorBarEnter
            .append("path")
            .attr("d", (d) => errorVertical(d, d.error))
            .attr("class", "vertical");

          errorBarEnter
            .append("path")
            .attr("d", (d) => errorHorizontalTop(d, d.error))
            .attr("class", "top");

          errorBarEnter
            .append("path")
            .attr("d", (d) => errorHorizontalBottom(d, d.error))
            .attr("class", "bottom");

          errorBarUpdate
            .merge(errorBarEnter)
            .attr("class", "error-bar")
            .attr("transform", (d) => {
              return `translate(${
                this._scaleX(d.x) + (this._scaleX.bandwidth?.() / 2 || 0)
              },${this._scaleY(d.y)})`;
            });

          errorBarUpdate.exit().remove();
        };

        const updateRange = (data) => {
          const linesUpdate = chartAreaGroup
            .selectAll(".line")
            .data(data, (d) => d.id);

          const linesEnter = linesUpdate
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)");

          linesUpdate
            .merge(linesEnter)
            .attr("d", (d) => line(d.data))
            .attr("stroke", (d) => d.color);

          if (showPoints) {
            updateSymbols(data);
          }
          if (showErrorBars) {
            updateErrors(data);
          }

          linesUpdate.exit().remove();

          graphXAxisG.call(xAxis).call(rotateXTickLabels);
          graphYAxisG.call(yAxis);

          if (showXPreview) {
            previewXAxisXG.call(xAxisX).call(rotateXTickLabels);
            previewXAxisYG.call(yAxisX);
          }

          if (showYPreview) {
            previewYAxisXG.call(xAxisY).call(rotateXTickLabels);
            previewYAxisYG.call(yAxisY);
          }

          if (hideXAxis) {
            graphXAxisG.call(hideTicks);
            graphXAxisG.call((g) => g.select(".domain").remove());
            if (showXPreview) {
              previewXAxisXG.call(hideTicks);
              previewXAxisXG.call((g) => g.select(".domain").remove());
            }
            xAxisTitleGroup.call((g) => g.select(".text").remove());
          }
          if (hideYAxis) {
            graphYAxisG.call(hideTicks);
            graphYAxisG.call((g) => g.select(".domain").remove());
            if (showXPreview) {
              previewXAxisYG.call(hideTicks);
              previewXAxisYG.call((g) => g.select(".domain").remove());
            }
            yAxisTitleGroup.call((g) => g.select(".text").remove());
          }
          if (hideXAxisTicks) {
            graphXAxisG.call(hideTicks);
            if (showXPreview) {
              previewXAxisXG.call(hideTicks);
            }
          }
          if (hideYAxisTicks) {
            graphYAxisG.call(hideTicks);
            if (showXPreview) {
              previewXAxisYG.call(hideTicks);
            }
          }
          if (showYGridlines) {
            graphYGridG.call(yAxisGrid);
          }

          if (showXGridlines) {
            graphXGridG.call(xAxisGrid);
          }
        };

        updateRange(this._currentData);

        let brushX;
        let brushY;

        if (showXPreview) {
          brushX = d3
            .brushX()
            .extent([
              [0, 0],
              [previewXWidth, previewXHeight],
            ])
            .on("start brush end", brushedX);
          previewXArea
            .append("rect")
            .attr("class", "non-selection left")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", previewXHeight);

          previewXArea
            .append("rect")
            .attr("class", "non-selection right")
            .attr("y", 0)
            .attr("height", previewXHeight);

          previewXArea.call(brushX).call(brushX.move, this._scaleX.range());
        }
        if (showYPreview) {
          brushY = d3
            .brushY()
            .extent([
              [0, 0],
              [previewYWidth, previewYHeight],
            ])
            .on("start brush end", brushedY);

          previewYArea
            .append("rect")
            .attr("class", "non-selection top")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", previewYWidth);

          previewYArea
            .append("rect")
            .attr("class", "non-selection bottom")
            .attr("x", 0)
            .attr("width", previewYWidth);

          previewYArea
            .call(brushY)
            .call(brushY.move, [
              this._scaleY.range()[1],
              this._scaleY.range()[0],
            ]);
        }
      };

      update();

      function hideTicks(g) {
        g.selectAll(".tick").remove();
      }

      function rotateXTickLabels(g) {
        if (xTicksAngle !== 0) {
          const allTicks = g
            .selectAll(".tick text")
            .attr("y", 0)
            .attr("dy", 0)
            .attr(
              "transform",
              `translate(0, ${xAxis.tickSize() * 1.2}) rotate(${xTicksAngle})`
            )
            .attr("dominant-baseline", "middle");
          if (xTicksAngle > 0) {
            allTicks.attr("text-anchor", "start");
          } else {
            allTicks.attr("text-anchor", "end");
          }
        }
      }
      this._legendListener = (e) => {
        e.stopPropagation();

        const group = e.detail.label;

        this._groupedData.forEach((d) => {
          if (d.group === group) {
            d.show = !d.show;
          }
        });

        e.target.items = e.target.items.map((item) => {
          return {
            ...item,
            toggled: item.label === group ? !item.toggled : item.toggled,
          };
        });

        update();
      };
      if (showLegend) {
        this.legend.title = legendTitle || null;
        this.legend.nodes = this._groups.map((item, index) => {
          return {
            id: "" + index,
            node: svg
              .selectAll("path.line")
              .filter((d) => d.group === item)
              .nodes(),
          };
        });

        this.legend.options = {
          fadeoutNodes: svg.selectAll("path.line").nodes(),
          position: legendPosition.split("-"),
          fadeProp: "opacity",
          showLeaders: false,
        };

        this.legend.addEventListener("legend-item-click", this._legendListener);
      }
    }
  }

  _renderError(error) {
    const main = this.root.querySelector("main");
    let errorDiv = main.querySelector("div.error");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.classList.add("error");
      main.appendChild(errorDiv);
    }
    errorDiv.innerText = error;
  }
  _hideError() {
    const main = this.root.querySelector("main");
    const errorDiv = main.querySelector("div.error");
    if (errorDiv) {
      errorDiv.remove();
    }
  }
}

const intervalMap = {
  second: () => d3.utcSecond,
  minute: () => d3.utcMinute,
  hour: () => d3.utcHour,
  day: () => d3.utcDay,
  week: () => d3.utcWeek,
  month: () => d3.utcMonth,
  year: () => d3.utcYear,
};
