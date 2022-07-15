import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import Legend2 from "@/lib/Legend2";
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

    const existingLegend = this.root.querySelector("togostanza--legend2");

    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this._validatedParams = validateParams(this.metadata, this.params);

    //data
    let xKeyName = this._validatedParams.get("axis-x-data_key").value;
    let yKeyName = this._validatedParams.get("axis-y-data_key").value;
    const xAxisTitle = this._validatedParams.get("axis-x-title").value; //this.params["x-axis-title"] || "";
    const yAxisTitle = this._validatedParams.get("axis-y-title").value || "";
    const hideXAxis = this._validatedParams.get("axis-x-hide").value;
    const hideYAxis = this._validatedParams.get("axis-y-hide").value;
    const hideXAxisTicks = this._validatedParams.get("axis-x-ticks_hide").value;
    const hideYAxisTicks = this._validatedParams.get("axis-y-ticks_hide").value;

    const xTicksAngle = this._validatedParams.get(
      "axis-x-ticks_label_angle"
    ).value;
    const yTicksAngle = this._validatedParams.get(
      "axis-y-ticks_label_angle"
    ).value;

    const xTicksNumber = 5;
    const xTicksInterval = !isNaN(
      parseFloat(this._validatedParams.get("axis-x-ticks_interval").value)
    )
      ? parseFloat(this._validatedParams.get("axis-x-ticks_interval").value)
      : null;

    const yTicksNumber = 3;
    const yTicksInterval = !isNaN(
      parseFloat(this._validatedParams.get("axis-y-ticks_interval").value)
    )
      ? parseFloat(this._validatedParams.get("axis-y-ticks_interval").value)
      : null;

    const xScale = this._validatedParams.get("axis-x-scale").value;
    const yScale = this._validatedParams.get("axis-y-scale").value;

    const showXPreview = this._validatedParams.get("axis-x-preview").value;
    const showYPreview = this._validatedParams.get("axis-y-preview").value;

    const errorKeyName = this._validatedParams.get("error_bars-data_key").value;
    const xAxisPlacement = this._validatedParams.get("axis-x-placement").value;
    const yAxisPlacement = this._validatedParams.get("axis-y-placement").value;
    const showLegend = this._validatedParams.get("legend-show").value;

    const legendPosition = this._validatedParams.get("legend-placement").value;

    const xAxisTicksIntervalUnits = this._validatedParams.get(
      "axis-x-ticks_interval_units"
    ).value;

    const yAxisTicksIntervalUnits = this._validatedParams.get(
      "axis-y-ticks_interval_units"
    ).value;

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

    let groupKeyName = this._validatedParams.get(
      "data_grouping-group_by_data_key"
    ).value;

    const ignoreGroups = this._validatedParams
      .get("data_grouping-ignore_groups")
      .value.split(",");

    let values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    if (
      this.params["data-type"] === "csv" ||
      this.params["data-type"] === "tsv"
    ) {
      const csvRegroup = [];
      values.forEach((row) => {
        for (const col of values.columns.slice(1)) {
          if (col) {
            csvRegroup.push({
              column: col,
              row: row[values.columns[0]],
              value: row[col],
            });
          }
        }
      });
      values = csvRegroup;
      groupKeyName = "column";
      xKeyName = "row";
      yKeyName = "value";
    }

    /* eslint-disable-next-line */
    this._data = structuredClone(values);

    parseData.call(this);

    const root = this.root.querySelector("main");

    if (root.querySelector("svg")) {
      root.querySelector("svg").remove();
    }

    const { width, height } = root.getBoundingClientRect();

    const MARGIN = {
      top: parseFloat(getComputedStyle(root).paddingTop),
      right: parseFloat(getComputedStyle(root).paddingRight),
      bottom: parseFloat(getComputedStyle(root).paddingBottom),
      left: parseFloat(getComputedStyle(root).paddingLeft),
    };

    const SVGMargin = {
      top: 0,
      right: 0,
      bottom: 20,
      left: 24,
    };

    const SVGWidth = width - MARGIN.left - MARGIN.right;
    const SVGHeight = height - MARGIN.top - MARGIN.bottom;

    // Width and height of the chart
    const WIDTH =
      width - MARGIN.left - SVGMargin.left - MARGIN.right - SVGMargin.right;
    const HEIGHT =
      height - MARGIN.top - SVGMargin.top - MARGIN.bottom - SVGMargin.bottom;

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

    const togostanzaColors = [];

    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-theme-series_${i}_color`));
    }

    const color = d3.scaleOrdinal().range(togostanzaColors);

    function parseValue(value, scaleType) {
      if (scaleType === "linear" || scaleType === "log") {
        return parseFloat(value);
      } else if (scaleType === "time") {
        const parsedDate = new Date(value);
        return parsedDate instanceof Date ? parsedDate : NaN;
      } else {
        return value;
      }
    }

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
        d[xKeyName] = parseValue(d[xKeyName], xScale);
        d[yKeyName] = parseValue(d[yKeyName], yScale);
      });
    }

    this._groups = [];
    this._groupByNameMap = new Map();

    if (groupKeyName && this._data.some((d) => d[groupKeyName])) {
      this._groupedData = this._data.reduce((acc, d) => {
        const group = d[groupKeyName];
        if (
          ignoreGroups.includes(group) ||
          (xScale !== "ordinal" && (isNaN(d[xKeyName]) || isNaN(d[yKeyName])))
        ) {
          return acc;
        }
        const groupIndex = acc.findIndex((g) => g.group === group);
        if (groupIndex === -1) {
          acc.push({
            group,
            color: color(group),
            show: true,
            data: [{ x: d[xKeyName], y: d[yKeyName] }],
          });
          this._groups.push(group);
          this._groupByNameMap.set(group, acc[acc.length - 1]);
        } else {
          if (d[xKeyName] && d[yKeyName]) {
            acc[groupIndex].data.push({ x: d[xKeyName], y: d[yKeyName] });
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
          data: this._data
            .map((d) => {
              if (d[yKeyName] && d[yKeyName]) {
                return { x: d[xKeyName], y: d[yKeyName] };
              }
            })
            .filter((d) => d),
        },
      ];
    }

    this._xDDomain = this._groupedData
      .map((d) => d.data.map((d) => d.x))
      .flat();

    this._yDDomain = this._groupedData
      .map((d) => d.data.map((d) => d.y))
      .flat();

    const svg = d3
      .select(root)
      .append("svg")
      .attr("width", SVGWidth)
      .attr("height", SVGHeight);

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
        .classed(yAxisPlacement, true)
        .attr("y", chartHeight / 2)

        .attr(
          "dominant-baseline",
          yAxisPlacement === "left" ? "hanging" : "auto"
        )
        .attr("transform", `rotate(-90, 0, ${chartHeight / 2})`);

      yTitleWidth = yTitle.node().getBBox().height;
    }

    if (xAxisTitle) {
      const xTitle = xAxisTitleGroup
        .append("text")
        .text(xAxisTitle)
        .attr("class", "title x")
        .classed(xAxisPlacement, true)
        .attr(
          "y",
          xAxisPlacement === "top" ? -xTitlePadding || 0 : xTitlePadding || 0
        )
        .attr("x", chartWidth / 2)
        .attr("text-anchor", "middle")
        .attr(
          "dominant-baseline",
          xAxisPlacement === "top" ? "auto" : "hanging"
        );

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

    let xAxis, xAxisX, yAxis, yAxisX, yAxisY, xAxisY;

    let xExtent, yExtent;

    const setXAxes = () => {
      xAxis = d3.axisBottom(this._scaleX);
      xAxisX = d3.axisBottom(this._previewXScaleX);
      xAxisY = d3.axisBottom(this._previewYScaleX).tickValues([]);
    };

    const setYAxes = () => {
      yAxis = d3.axisLeft(this._scaleY);
      yAxisX = d3.axisLeft(this._previewXScaleY).tickValues([]);
      yAxisY = d3.axisLeft(this._previewYScaleY);
    };

    this._scaleX = getScale(xScale).range([0, chartWidth]);
    this._scaleY = getScale(yScale).range([chartHeight, 0]);

    this._previewXScaleX = getScale(xScale).range([0, previewXWidth]);
    this._previewXScaleY = getScale(yScale).range([previewXHeight, 0]);
    this._previewYScaleX = getScale(xScale).range([0, previewYWidth]);
    this._previewYScaleY = getScale(yScale).range([previewYHeight, 0]);

    setXAxes();
    setYAxes();

    if (xScale === "linear") {
      try {
        xAxis.tickFormat(d3.format(xAxisTicksFormat));
        xAxisX.tickFormat(d3.format(xAxisTicksFormat));
      } catch {
        xAxis.tickFormat((d) => d);
        xAxisX.tickFormat((d) => d);
      }

      if (xTicksInterval) {
        xExtent = d3.extent(this._xDDomain);
        const ticks = [];
        for (let i = xExtent[0]; i <= xExtent[1]; i = i + xTicksInterval) {
          ticks.push(i);
        }
        xAxis.tickValues(ticks);
        // xAxisX.tickValues(ticks);
      } else {
        xAxis.ticks(xTicksNumber);
        // xAxisX.ticks(xTicksNumber);
      }
      try {
        xAxis.tickFormat(xAxisTicksFormat);
        xAxisX.tickFormat(xAxisTicksFormat);
      } catch {
        xAxis.tickFormat((d) => d);
        xAxisX.tickFormat((d) => d);
      }
    } else if (xScale === "time") {
      try {
        xAxis.tickFormat(d3.timeFormat(xAxisTicksFormat));
        xAxisX.tickFormat(d3.timeFormat(xAxisTicksFormat));
      } catch {
        xAxis.tickFormat(d3.timeFormat("%Y-%m-%d"));
        xAxisX.tickFormat(d3.timeFormat("%Y-%m-%d"));
      }

      if (
        xTicksInterval &&
        xAxisTicksIntervalUnits &&
        xAxisTicksIntervalUnits !== "none"
      ) {
        const interval =
          intervalMap[xAxisTicksIntervalUnits]().every(xTicksInterval);
        xAxis.ticks(interval);
        // xAxisX.ticks(interval);
      } else {
        xAxis.ticks(xTicksNumber);
        // xAxisX.ticks(xTicksNumber);
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

    if (yScale === "linear") {
      try {
        yAxis.tickFormat(d3.format(yAxisTicksFormat));
      } catch {
        yAxis.tickFormat((d) => d);
      }

      if (yTicksInterval) {
        yExtent = d3.extent(this._yDDomain);
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

    const line = d3
      .line()
      .x((d) => {
        if (xScale === "ordinal") {
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
        if (xScale === "ordinal") {
          return (
            this._previewXScaleX(d.x) + this._previewXScaleX.bandwidth() / 2
          );
        }
        return this._previewXScaleX(d.x);
      })
      .y((d) => this._previewXScaleY(d.y));

    const linePreviewY = d3
      .line()
      .x((d) => this._previewYScaleX(d.x))
      .y((d) => {
        return this._previewYScaleY(d.y);
      });

    const graphXAxisG = xAxisTitleGroup
      .append("g")
      .attr("class", "axis x")
      .attr("clip-path", "url(#clip)");

    const graphYAxisG = yAxisTitleGroup
      .append("g")
      .attr("class", "axis y")
      .attr("transform", `translate(${yTitlePadding + yTitleWidth}, 0)`);

    let previewXAxisXG;
    let previewXAxisYG;
    let previewYAxisXG;
    let previewYAxisYG;
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

    const update = () => {
      this._currentData = this._groupedData.filter((group) => group.show);

      const getXDomain = () => {
        if (xScale === "ordinal") {
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
        if (yScale === "ordinal") {
          return [
            ...new Set(
              this._currentData.map((d) => d.data.map((d) => d.y)).flat()
            ),
          ];
        } else {
          const yDomain = this._currentData.map((d) => d.data.map((d) => d.y));

          return d3.extent(yDomain.flat());
        }
      };

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
          .attr("d", (d) => linePreviewX(d.data))
          .attr("clip-path", "url(#clip)");

        previewLinesUpdate
          .merge(previewLinesEnter)
          .attr("stroke", (d) => d.color);

        const previewLinesExit = previewLinesUpdate.exit().remove();
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
          .attr("d", (d) => linePreviewY(d.data))
          .attr("clip-path", "url(#clip)");

        previewLinesUpdate
          .merge(previewLinesEnter)
          .attr("stroke", (d) => d.color);

        const previewLinesExit = previewLinesUpdate.exit().remove();
      }

      const interpolator = {};

      if (xScale === "linear") {
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
      } else if (xScale === "ordinal") {
        this._currentData.forEach((d) => {
          interpolator[d.group] = d3
            .scaleLinear()
            .domain(d.data.map((d) => d.x))
            .range(d.data.map((d) => d.y));
        });
      } else if (xScale === "time") {
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
      } else if (xScale === "log") {
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

        if (xScale === "ordinal") {
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
              group: d.group,
              color: d.color,
              show: d.show,
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
          graphArea.selectAll(".line").attr("d", (d) => line(d.data));
        } else {
          const x0x1 = s.map(this._previewXScaleX.invert, this._previewXScaleX);
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

          if (!hideXAxis && !hideXAxisTicks) {
            graphXAxisG.call(xAxis).call(rotateXTickLabels);
          }
          if (!hideYAxis && !hideYAxisTicks) {
            graphYAxisG.call(yAxis);
          }

          graphArea.selectAll(".line").attr("d", (d) => line(d.data));
        }
      };
      const brushedY = (e) => {
        const s = e.selection || this._previewYScaleY.range();

        previewYArea.select(".top").attr("height", Math.min(...s));
        previewYArea
          .select(".bottom")
          .attr("height", previewYHeight - Math.max(...s))
          .attr("y", Math.max(...s));

        const y0y1 = s.map(this._previewYScaleY.invert, this._previewYScaleY);

        this._scaleY.domain(d3.extent(y0y1));

        if (!hideXAxis && !hideXAxisTicks) {
          graphXAxisG.call(xAxis).call(rotateXTickLabels);
        }
        if (!hideYAxis && !hideYAxisTicks) {
          graphYAxisG.call(yAxis);
        }

        graphArea.selectAll(".line").attr("d", (d) => line(d.data));
      };
      const errorG = chartAreaGroup
        .append("g")
        .classed("error-bars", true)
        .attr("clip-path", "url(#clip)");

      const updateRange = (data) => {
        //chartAreaGroup.selectAll(".line").remove();

        const linesUpdate = chartAreaGroup
          .selectAll(".line")
          .data(data, (d) => d.group);

        const linesEnter = linesUpdate
          .enter()
          .append("path")
          .attr("class", "line")
          .attr("d", (d) => line(d.data))
          .attr("clip-path", "url(#clip)");

        linesUpdate.merge(linesEnter).attr("stroke", (d) => d.color);
        linesUpdate.exit().remove();

        chartAreaGroup.call((g) => {
          const lines = g.selectAll(".line");
          lines.each((d) => {
            const updateErrG = errorG.selectAll("g").data(d.data);

            const enterErrG = updateErrG
              .enter()
              .append("g")
              .attr("class", "error-bar")
              .attr("transform", (d) => {
                console.log(d);
                return `translate(${this._scaleX(d.x)},${this._scaleY(d.y)})`;
              });

            enterErrG
              .append("line")
              .attr("y1", (d) =>
                Math.abs(this._scaleY(d.y * 1.1) - this._scaleY(d.y))
              )
              .attr(
                "y2",
                (d) => -Math.abs(this._scaleY(d.y * 1.1) - this._scaleY(d.y))
              )
              .attr("x1", 0)
              .attr("x2", 0)
              .attr("stroke", "black");
            updateErrG.merge(enterErrG).attr("fill", (d) => d.color);

            updateErrG.exit().remove();
          });
        });

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
          .on("brush end", brushedX);
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
          .on("brush end", brushedY);

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

        previewYArea.call(brushY).call(brushY.move, this._scaleY.range());
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

    if (showLegend && !existingLegend) {
      this.legend = new Legend2(
        this._groups.map((item, index) => {
          return {
            id: "" + index,
            label: item,
            color: this._groupByNameMap.get(item).color,
            node: svg
              .selectAll("path.line")
              .filter((d) => d.group === item)
              .nodes(),
          };
        }),
        {
          fadeoutNodes: svg.selectAll("path.line").nodes(),
          position: legendPosition.split("-"),
          fadeProp: "opacity",
          showLeaders: false,
        }
      );
      root.append(this.legend);

      this.legend.addEventListener("legend-item-click", (e) => {
        e.stopPropagation();

        const group = e.detail.label;

        this._groupedData.forEach((d) => {
          if (d.group === group) {
            d.show = !d.show;
          }
        });

        update();
      });
    }
  }

  _renderError(error) {
    const main = this.root.querySelector("main");
    let errorDiv = main.querySelector(".error");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.classList.add("error");
      main.appendChild(errorDiv);
    }
    errorDiv.innerText = error;
  }
  _hideError() {
    const main = this.root.querySelector("main");
    const errorDiv = main.querySelector(".error");
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
