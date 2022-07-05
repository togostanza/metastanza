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
  appendCustomCss,
} from "togostanza-utils";
import validateParams from "../../lib/validateParams";
import { InternMap } from "d3";

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
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this._validatedParams = validateParams(this.metadata, this.params);

    let values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._metadataParamsMap = new Map(
      this.metadata["stanza:parameter"].map((param) => [
        param["stanza:key"],
        Object.fromEntries(
          Object.entries(param).filter((key) => key[0] !== "stanza:key")
        ),
      ])
    );

    this._data = values;

    const root = this.root.querySelector("main");

    const el = this.root.getElementById("linechart-d3");

    //data
    const xKeyName = this._validatedParams.get("axis-x-data_key").value;
    const yKeyName = this._validatedParams.get("axis-y-data_key").value;
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
    const xRangeMin = this._validatedParams.get("axis-x-range_min").value;
    const xRangeMax = this._validatedParams.get("axis-x-range_max").value;
    const yRangeMin = this._validatedParams.get("axis-y-range_min").value;
    const yRangeMax = this._validatedParams.get("axis-y-range_max").value;
    const errorKeyName = this._validatedParams.get("error_bars-data_key").value;
    const showErrorBars = this._data.some((d) => d[errorKeyName] !== undefined);
    const xAxisPlacement = this._validatedParams.get("axis-x-placement").value;
    const yAxisPlacement = this._validatedParams.get("axis-x-placement").value;

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

    if (root.querySelector("svg")) {
      root.querySelector("svg").remove();
    }

    if (xScale === "linear") {
      // try to parse data to numbers
      this._data = this._data
        .filter((d) => !isNaN(parseFloat(d[xKeyName])))
        .map((d) => ({
          ...d,
          [xKeyName]: parseFloat(d[xKeyName]),
        }));
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

    const groupKeyName = this._validatedParams.get(
      "data_grouping-group_by-data_key"
    ).value;

    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-theme-series_${i}_color`));
    }

    let groupedData;
    if (groupKeyName && this._data.some((d) => d[groupKeyName])) {
      groupedData = d3.group(this._data, (d) => {
        return d[groupKeyName];
      });
    } else {
      groupedData = new InternMap();
      groupedData.set("data", this._data);
    }

    const groups = Array.from(groupedData.keys());

    if (xScale === "linear") {
      groupedData.forEach((val, key) => {
        groupedData.set(
          key,
          val.map((d) => ({
            ...d,
            [xKeyName]: parseFloat(d[xKeyName]),
          }))
        );
      });
    } else if (xScale === "time") {
      console.log(Object.entries(groupedData));

      groupedData.forEach((val, key) => {
        groupedData.set(
          key,
          val.map((d) => ({
            ...d,
            [xKeyName]: new Date(d[xKeyName]),
          }))
        );
      });
    }

    if (yScale === "linear") {
      for (const [key, val] in groupedData) {
        groupedData.set(
          key,
          val.map((d) => ({
            ...d,
            [yKeyName]: parseFloat(d[yKeyName]),
          }))
        );
      }
    } else if (yScale === "time") {
      for (const [key, val] in groupedData) {
        groupedData.set(
          key,
          val.map((d) => ({
            ...d,
            [yKeyName]: new Date(d[yKeyName]),
          }))
        );
      }
    }

    const xDDomain = Array.from(groupedData.values())
      .map((d) => {
        return d.map((dd) => dd[xKeyName]);
      })
      .flat();

    const yDDomain = Array.from(groupedData.values())
      .map((d) => {
        return d.map((dd) => dd[yKeyName]);
      })
      .flat();

    this._groups = groups;
    this._groupedData = groupedData;

    const color = d3.scaleOrdinal().domain(groups).range(togostanzaColors);

    const colorSym = Symbol("color");

    groupedData.forEach((d, key) => {
      d[colorSym] = color(key);
      d.show = true;
    });

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

    let xIntervalUnits, yIntervalUnits, xExtent, yExtent;

    const setXAxes = () => {
      xAxis = d3.axisBottom(this._scaleX);
      console.log(this._scaleX.domain());
      xAxis2 = d3.axisBottom(this._previewScaleX);
    };

    const setYAxes = () => {
      yAxis = d3.axisLeft(this._scaleY);
      yAxis2 = d3.axisLeft(this._previewScaleY);
    };

    if (xScale === "linear") {
      this._scaleX = d3.scaleLinear();
      this._previewScaleX = d3.scaleLinear();
      setXAxes();
      try {
        xAxis.tickFormat(d3.format(xAxisTicksFormat));
        xAxis2.tickFormat(d3.format(xAxisTicksFormat));
      } catch {
        xAxis.tickFormat((d) => d);
        xAxis2.tickFormat((d) => d);
      }

      if (xTicksInterval) {
        xExtent = d3.extent(xDDomain, (d) => parseFloat(d));
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
    } else if (xScale === "ordinal") {
      this._scaleX = d3.scaleBand().paddingOuter(0);
      this._previewScaleX = d3.scaleBand().paddingOuter(0);
      setXAxes();
    } else if (xScale === "time") {
      this._scaleX = d3.scaleTime();
      this._previewScaleX = d3.scaleTime();
      setXAxes();
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
      this._scaleX = d3.scaleLinear();
      this._previewScaleX = d3.scaleLinear();
      setXAxes();
      try {
        xAxis.tickFormat(d3.format(xAxisTicksFormat));
        xAxis2.tickFormat(d3.format(xAxisTicksFormat));
      } catch {
        xAxis.tickFormat((d) => d);
        xAxis2.tickFormat((d) => d);
      }

      xAxis.tickValues(
        d3.ticks(
          xExtent[0],
          xExtent[1],
          Math.abs(Math.floor((xExtent[1] - xExtent[0]) / xTicksInterval))
        )
      );
      xAxis2.tickValues(
        d3.ticks(
          xExtent[0],
          xExtent[1],
          Math.abs(Math.floor((xExtent[1] - xExtent[0]) / xTicksInterval))
        )
      );
    }

    if (yScale === "linear") {
      this._scaleY = d3.scaleLinear();
      this._previewScaleY = d3.scaleLinear();
      setYAxes();

      try {
        yAxis.tickFormat(d3.format(yAxisTicksFormat));
        yAxis2.tickFormat(d3.format(yAxisTicksFormat));
      } catch {
        yAxis.tickFormat((d) => d);
        yAxis2.tickFormat((d) => d);
      }

      if (yTicksInterval) {
        yExtent = d3.extent(yDDomain, (d) => parseFloat(d));
        const ticks = [];
        for (let i = yExtent[0]; i <= yExtent[1]; i = i + yTicksInterval) {
          ticks.push(i);
        }
        yAxis.tickValues(ticks);
      } else {
        yAxis.ticks(yTicksNumber);
      }
      yAxis2.ticks(2);
    } else if (yScale === "ordinal") {
      this._scaleY = d3.scaleBand().paddingOuter(0);
      this._previewScaleY = d3.scaleBand().paddingOuter(0);
      setYAxes();
    } else if (yScale === "time") {
      this._scaleY = d3.scaleTime();
      this._previewScaleY = d3.scaleTime();
      setYAxes();

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
      this._scaleY = d3.scaleLinear();
      this._previewScaleY = d3.scaleLinear();
      setYAxes();
      yAxis.tickFormat(d3.format(yAxisTicksFormat));
      yAxis2.tickFormat(d3.format(yAxisTicksFormat));
    }

    this._scaleX.range([0, chartWidth]);
    this._scaleY.range([chartHeight, 0]);
    this._previewScaleX.range([0, previewWidth]);
    this._previewScaleY.range([previewHeight, 0]);

    const line = d3
      .line()
      .x((d) => {
        if (xScale === "ordinal") {
          return this._scaleX(d[xKeyName]) + this._scaleX.bandwidth() / 2;
        } else if (xScale === "time") {
          // if (!this._scaleX(new Date(d[xKeyName]))) {
          //   console.log(
          //     "this._scaleX(new Date(d[xKeyName]))",
          //     this._scaleX(new Date(d[xKeyName]))
          //   );
          //   console.log(d);
          // }

          return this._scaleX(new Date(d[xKeyName]));
        }

        return this._scaleX(d[xKeyName]);
      })
      .y((d) => {
        if (yScale === "ordinal") {
          return this._scaleY(d[yKeyName]) + this._scaleY.bandwidth() / 2;
        }

        return this._scaleY(+d[yKeyName]);
      });

    const line2 = d3
      .line()
      .x((d) => {
        if (xScale === "ordinal") {
          return (
            this._previewScaleX(d[xKeyName]) +
            this._previewScaleX.bandwidth() / 2
          );
        } else if (xScale === "time") {
          return this._previewScaleX(new Date(d[xKeyName]));
        }

        return this._previewScaleX(d[xKeyName]);
      })
      .y((d) => this._previewScaleY(+d[yKeyName]));

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

    const update = (groupsToShow) => {
      this._currentData = groupsToShow.map((group) => {
        return {
          values: [...groupedData.get(group)],
          name: group,
          color: groupedData.get(group)[colorSym],
        };
      });

      const getXDomain = () => {
        if (xScale === "ordinal") {
          return [
            ...new Set(
              this._currentData
                .map((d) => d.values.map((d) => d[xKeyName]))
                .flat()
            ),
          ];
        } else if (xScale === "time") {
          const xDomain = this._currentData.map((d) =>
            d.values.map((d) => new Date(d[xKeyName]))
          );
          return d3.extent(xDomain.flat());
        } else {
          const xDomain = this._currentData.map((d) =>
            d.values.map((d) => +d[xKeyName])
          );
          return d3.extent(xDomain.flat());
        }
      };

      // set y domain
      const getYDomain = () => {
        if (yScale === "ordinal") {
          return [
            ...new Set(
              this._currentData
                .map((d) => d.values.map((d) => d[yKeyName]))
                .flat()
            ),
          ];
        } else {
          const yDomain = this._currentData.map((d) =>
            d.values.map((d) => +d[yKeyName])
          );

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
        .attr("d", (d) => line2(d.values))
        .attr("clip-path", "url(#clip)");

      previewLinesUpdate
        .merge(previewLinesEnter)
        .attr("stroke", (d) => d.color);

      const previewLinesExit = previewLinesUpdate.exit().remove();

      const interpolator = {};
      if (xScale === "linear" && yScale === "linear") {
        this._currentData.forEach((d) => {
          interpolator[d.name] = d3
            .scaleLinear()
            .domain(d.values.map((d) => +d[xKeyName]))
            .range(d.values.map((d) => +d[yKeyName]));
        });
      } else if (xScale === "ordinal" && yScale === "linear") {
        this._currentData.forEach((d) => {
          interpolator[d.name] = d3
            .scaleLinear()
            .domain(getXDomain())
            .range(d.values.map((d) => +d[yKeyName]));
        });
      } else if (xScale === "time") {
        this._currentData.forEach((d) => {
          interpolator[d.name] = d3
            .scaleTime()
            .domain(getXDomain())
            .range(d.values.map((d) => d[yKeyName]));
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
              ...d,
              values: d.values.filter((v) => newDomainX.includes(v[xKeyName])),
            };
          });

          this._scaleX.domain(newDomainX);
          this._scaleY.domain(
            d3.extent(
              croppedData.map((d) => d.values.map((v) => +v[yKeyName])).flat()
            )
          );

          updateRange(croppedData);
        } else if (xScale === "linear") {
          const x0x1 = s.map(this._previewScaleX.invert, this._previewScaleX);
          this._scaleX.domain(x0x1);

          const croppedData = this._currentData.map((d) => {
            return {
              ...d,
              values: d.values.filter(
                (v) => x0x1[0] <= +v[xKeyName] && +v[xKeyName] <= x0x1[1]
              ),
            };
          });

          const extents = [];

          croppedData.forEach((data) => {
            const values = data.values.map((v) => +v[yKeyName]);

            extents.push(
              d3.extent(
                values.concat(x0x1.map((d) => interpolator[data.name](d)))
              )
            );
          });

          // filter all data to be in between x0 x1, and see domain inside it

          this._scaleY.domain(d3.extent(extents.flat()));

          graphXAxisG.call(xAxis);
          graphYAxisG.call(yAxis);

          graphArea.selectAll(".line").attr("d", (d) => line(d.values));
        } else if (xScale === "time") {
          const x0x1 = s.map(this._previewScaleX.invert, this._previewScaleX);

          this._scaleX.domain(x0x1);

          const croppedData = this._currentData.map((d) => {
            return {
              ...d,
              values: d.values.filter((v) => {
                return x0x1[0] <= v[xKeyName] && v[xKeyName] <= x0x1[1];
              }),
            };
          });

          const extents = [];

          croppedData.forEach((data) => {
            const values = data.values.map((v) => +v[yKeyName]);

            extents.push(
              d3.extent(
                values.concat(x0x1.map((d) => interpolator[data.name](d)))
              )
            );
          });

          // filter all data to be in between x0 x1, and see domain inside it

          this._scaleY.domain(d3.extent(extents.flat()));

          graphXAxisG.call(xAxis);
          graphYAxisG.call(yAxis);

          graphArea.selectAll(".line").attr("d", (d) => line(d.values));
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
          .attr("d", (d) => line(d.values))
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

    update(groups);

    return;
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
