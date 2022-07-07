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

    if (existingLegend) {
      existingLegend.remove();
    }

    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this._validatedParams = validateParams(this.metadata, this.params);

    //data
    let xKeyName = this._validatedParams.get("axis-x-data_key").value;
    let yKeyName = this._validatedParams.get("axis-y-data_key").value;
    const xAxisTitle = this._validatedParams.get("axis-x-title").value; //this.params["x-axis-title"] || "";
    const yAxisTitle = this._validatedParams.get("axis-y-title").value || "";
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
    const axisType = {
      x: xScale,
      y: yScale,
    };
    const xRangeMin = this._validatedParams.get("axis-x-range_min").value;
    const xRangeMax = this._validatedParams.get("axis-x-range_max").value;
    const yRangeMin = this._validatedParams.get("axis-y-range_min").value;
    const yRangeMax = this._validatedParams.get("axis-y-range_max").value;
    const errorKeyName = this._validatedParams.get("error_bars-data_key").value;
    const xAxisPlacement = this._validatedParams.get("axis-x-placement").value;
    const yAxisPlacement = this._validatedParams.get("axis-x-placement").value;
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

    this._data = values;

    parseData.call(this);

    const root = this.root.querySelector("main");

    const el = this.root.getElementById("linechart-d3");

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

    const chartWidth = WIDTH;
    const chartHeight = HEIGHT * 0.8 - PD / 2;

    const previewWidth = WIDTH;
    const previewHeight = HEIGHT * 0.2 - PD / 2;

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

    function cropData(axis, range) {
      if (axisType[axis] === "ordinal") {
        this._groupedData = this._groupedData
          .map((d) => {
            const localFrom = [
              ...new Set(d.data.map((e) => e[axis])),
            ].findIndex((e) => e === range[0]);
            const localTo = [...new Set(d.data.map((e) => e[axis]))].findIndex(
              (e) => e === range[range.length - 1]
            );
            return {
              ...d,
              data: d.data.slice(localFrom, localTo + 1),
            };
          })
          .filter((d) => d && d.data.length > 0);
      } else {
        this._groupedData.forEach((d) => {
          d.data = d.data.filter((v) => {
            return range[0] <= v[axis] && v[axis] <= range[range.length - 1];
          });
        });

        this._groupedData = this._groupedData.filter(
          (group) => group.data.length > 0
        );
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

    if (xRangeMin && xRangeMax) {
      cropData.call(this, "x", [
        parseValue(xRangeMin, xScale),
        parseValue(xRangeMax, xScale),
      ]);
    }
    if (yRangeMin && yRangeMax) {
      cropData.call(this, "y", [
        parseValue(yRangeMin, yScale),
        parseValue(yRangeMax, yScale),
      ]);
    }

    const svg = d3
      .select(root)
      .append("svg")
      .attr("width", SVGWidth)
      .attr("height", SVGHeight);

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

    const graphArea = svg
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${SVGMargin.left}, ${SVGMargin.top})`);

    const previewArea = svg
      .append("g")
      .attr("class", "preview")
      .attr(
        "transform",
        `translate(${SVGMargin.left}, ${SVGMargin.top + chartHeight + PD})`
      );

    let xAxis, xAxis2, yAxis, yAxis2;

    let xExtent, yExtent;

    const setXAxes = () => {
      xAxis = d3.axisBottom(this._scaleX);
      xAxis2 = d3.axisBottom(this._previewScaleX);
    };

    const setYAxes = () => {
      yAxis = d3.axisLeft(this._scaleY);
      yAxis2 = d3.axisLeft(this._previewScaleY);
    };

    this._scaleX = getScale(xScale).range([0, chartWidth]);
    this._scaleY = getScale(yScale).range([chartHeight, 0]);
    this._previewScaleX = getScale(xScale).range([0, previewWidth]);
    this._previewScaleY = getScale(yScale).range([previewHeight, 0]);

    setXAxes();
    setYAxes();

    if (xScale === "linear") {
      try {
        xAxis.tickFormat(d3.format(xAxisTicksFormat));
        xAxis2.tickFormat(d3.format(xAxisTicksFormat));
      } catch {
        xAxis.tickFormat((d) => d);
        xAxis2.tickFormat((d) => d);
      }

      if (xTicksInterval) {
        xExtent = d3.extent(this._xDDomain);
        const ticks = [];
        for (let i = xExtent[0]; i <= xExtent[1]; i = i + xTicksInterval) {
          ticks.push(i);
        }
        xAxis.tickValues(ticks);
        xAxis2.tickValues(ticks);
      } else {
        xAxis.ticks(xTicksNumber);
        xAxis2.ticks(xTicksNumber);
      }
      try {
        xAxis.tickFormat(xAxisTicksFormat);
        xAxis2.tickFormat(xAxisTicksFormat);
      } catch {
        xAxis.tickFormat((d) => d);
        xAxis2.tickFormat((d) => d);
      }
    } else if (xScale === "time") {
      try {
        xAxis.tickFormat(d3.timeFormat(xAxisTicksFormat));
        xAxis2.tickFormat(d3.timeFormat(xAxisTicksFormat));
      } catch {
        xAxis.tickFormat(d3.timeFormat("%Y-%m-%d"));
        xAxis2.tickFormat(d3.timeFormat("%Y-%m-%d"));
      }

      if (xTicksInterval && xAxisTicksIntervalUnits) {
        const interval =
          intervalMap[xAxisTicksIntervalUnits]().every(xTicksInterval);
        xAxis.ticks(interval);
        xAxis2.ticks(interval);
      } else {
        xAxis.ticks(xTicksNumber);
        xAxis2.ticks(xTicksNumber);
      }
    } else {
      try {
        xAxis.tickFormat(d3.format(xAxisTicksFormat));
        xAxis2.tickFormat(d3.format(xAxisTicksFormat));
      } catch {
        xAxis.tickFormat((d) => d);
        xAxis2.tickFormat((d) => d);
      }
    }

    if (yScale === "linear") {
      try {
        yAxis.tickFormat(d3.format(yAxisTicksFormat));
        yAxis2.tickFormat(d3.format(yAxisTicksFormat));
      } catch {
        yAxis.tickFormat((d) => d);
        yAxis2.tickFormat((d) => d);
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
      yAxis2.ticks(2);
    } else if (yScale === "time") {
      try {
        yAxis.tickFormat(d3.timeFormat(yAxisTicksFormat));
        yAxis2.tickFormat(d3.timeFormat(yAxisTicksFormat));
      } catch {
        yAxis.tickFormat(d3.timeFormat("%Y-%m-%d"));
        yAxis2.tickFormat(d3.timeFormat("%Y-%m-%d"));
      }

      if (
        yTicksInterval &&
        yAxisTicksIntervalUnits &&
        yAxisTicksIntervalUnits !== "none"
      ) {
        yAxis.ticks(
          intervalMap[yAxisTicksIntervalUnits]().every(yTicksInterval)
        );
      } else {
        yAxis.ticks(yTicksNumber);
      }
      yAxis2.ticks(2);
    } else {
      yAxis.tickFormat(d3.format(yAxisTicksFormat));
      yAxis2.tickFormat(d3.format(yAxisTicksFormat));
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
        if (yScale === "ordinal") {
          return this._scaleY(d.y) + this._scaleY.bandwidth() / 2;
        }

        return this._scaleY(d.y);
      });

    const line2 = d3
      .line()
      .x((d) => {
        if (xScale === "ordinal") {
          return this._previewScaleX(d.x) + this._previewScaleX.bandwidth() / 2;
        }
        return this._previewScaleX(d.x);
      })
      .y((d) => this._previewScaleY(d.y));

    const graphXAxisG = graphArea
      .append("g")
      .attr("class", "axis x")
      .attr("clip-path", "url(#clip)")
      .attr("transform", `translate(0, ${chartHeight})`);

    const graphYAxisG = graphArea.append("g").attr("class", "axis y");

    const previewXAxisG = previewArea
      .append("g")
      .attr("class", "axis x")
      .attr("transform", `translate(0, ${previewHeight})`)
      .attr("clip-path", "url(#clip)");

    const previewYAxisG = previewArea.append("g").attr("class", "axis y");

    previewArea.append("g").attr("class", "brush");

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
      this._previewScaleX.domain(getXDomain());
      this._previewScaleY.domain(getYDomain());

      const previewLinesUpdate = previewArea
        .selectAll(".line")
        .data(this._currentData);

      const previewLinesEnter = previewLinesUpdate
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", (d) => line2(d.data))
        .attr("clip-path", "url(#clip)");

      previewLinesUpdate
        .merge(previewLinesEnter)
        .attr("stroke", (d) => d.color);

      const previewLinesExit = previewLinesUpdate.exit().remove();

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
          interpolator[d.name] = d3
            .scaleLinear()
            .domain(d.data.map((d) => d.x))
            .range(d.data.map((d) => d.y));
        });
      } else if (xScale === "time") {
        this._currentData.forEach((d) => {
          interpolator[d.name] = d3
            .scaleTime()
            .domain(d.data.map((d) => d.x))
            .range(d.data.map((d) => d.y));
        });
      }

      const brushed = (e) => {
        const s = e.selection || this._previewScaleX.range();

        if (xScale === "ordinal") {
          const currentRange = [
            Math.floor(s[0] / this._previewScaleX.step()),
            Math.floor(s[1] / this._previewScaleX.step()),
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
          this._scaleY.domain(
            d3.extent(croppedData.map((d) => d.data.map((v) => v.y)).flat())
          );

          updateRange(croppedData);
        } else if (xScale === "linear" || xScale === "time") {
          const x0x1 = s.map(this._previewScaleX.invert, this._previewScaleX);
          this._scaleX.domain(x0x1);
          const croppedData = this._currentData.map((d) => {
            return {
              group: d.group,
              color: d.color,
              show: d.show,
              data: d.data.filter((v) => x0x1[0] <= v.x && v.x <= x0x1[1]),
            };
          });

          const extents = [];

          croppedData.forEach((d) => {
            const values = d.data.map((v) => v.y);

            extents.push(
              d3.extent(
                values.concat(x0x1.map((d) => interpolator[d.group](d)))
              )
            );
          });

          // filter all data to be in between x0 x1, and see domain inside it

          this._scaleY.domain(d3.extent(extents.flat()));

          graphXAxisG.call(xAxis);
          graphYAxisG.call(yAxis);

          graphArea.selectAll(".line").attr("d", (d) => line(d.data));
        } else {
          throw new Error("Unsupported scale");
        }
      };

      const updateRange = (data) => {
        graphArea.selectAll(".line").remove();
        const linesUpdate = graphArea.selectAll(".line").data(data);

        const linesEnter = linesUpdate
          .enter()
          .append("path")
          .attr("class", "line")
          .attr("d", (d) => line(d.data))
          .attr("clip-path", "url(#clip)");

        linesUpdate.merge(linesEnter).attr("stroke", (d) => d.color);
        linesUpdate.exit().remove();

        graphXAxisG.call(xAxis);
        graphYAxisG.call(yAxis);
        previewXAxisG.call(xAxis2);
        previewYAxisG.call(yAxis2);
      };

      updateRange(this._currentData);

      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [previewWidth, previewHeight],
        ])
        .on("brush end", brushed);

      previewArea.call(brush).call(brush.move, this._scaleX.range());
    };

    update();

    if (showLegend) {
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
