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
    const xTicksInterval = this._validatedParams.get(
      "axis-x-ticks_interval"
    ).value;
    const yTicksNumber = 3;
    const yTicksInterval = this._validatedParams.get(
      "axis-y-ticks_interval"
    ).value;
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

    const xTitlePadding = this._validatedParams.get(
      "axis-x-title_padding"
    ).value;
    const yTitlePadding = this._validatedParams.get(
      "axis-y-title_padding"
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
      bottom: 0,
      left: 0,
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
      groupedData = new Map(["data", this._data]);
    }

    const groups = Array.from(groupedData.keys());

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

    switch (xScale) {
      case "linear":
        this._scaleX = d3.scaleLinear();
        this._previewScaleX = d3.scaleLinear();
        break;
      case "ordinal":
        this._scaleX = d3.scaleBand().paddingOuter(0);
        this._previewScaleX = d3.scaleBand().paddingOuter(0);
        break;
      case "time":
        this._scaleX = d3.scaleTime();
        this._previewScaleX = d3.scaleTime();
        break;
      default:
        this._scaleX = d3.scaleLinear();
        this._previewScaleX = d3.scaleLinear();
        break;
    }

    switch (yScale) {
      case "linear":
        this._scaleY = d3.scaleLinear();
        this._previewScaleY = d3.scaleLinear();
        break;
      case "ordinal":
        this._scaleY = d3.scaleBand().paddingOuter(0);
        this._previewScaleY = d3.scaleBand().paddingOuter(0);
        break;
      case "time":
        this._scaleY = d3.scaleTime();
        this._previewScaleY = d3.scaleTime();
        break;
      default:
        this._scaleY = d3.scaleLinear();
        this._previewScaleY = d3.scaleLinear();
        break;
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
        return this._previewScaleX(d[xKeyName]);
      })
      .y((d) => this._previewScaleY(+d[yKeyName]));

    const xAxis = d3.axisBottom(this._scaleX),
      xAxis2 = d3.axisBottom(this._previewScaleX),
      yAxis = d3.axisLeft(this._scaleY),
      yAxis2 = d3.axisLeft(this._previewScaleY);

    const graphXAxisG = graphArea
      .append("g")
      .attr("class", "axis x")
      .attr("transform", `translate(0, ${chartHeight})`);

    const graphYAxisG = graphArea.append("g").attr("class", "axis y");

    const previewXAxisG = previewArea
      .append("g")
      .attr("class", "axis x")
      .attr("transform", `translate(0, ${previewHeight})`)
      .call(xAxis2);

    const previewYAxisG = previewArea
      .append("g")
      .attr("class", "axis y")
      .call(yAxis2);

    previewArea.append("g").attr("class", "brush");

    const update = (groupsToShow) => {
      this._currentData = groupsToShow.map((group) => {
        return {
          values: [...groupedData.get(group)],
          name: group,
          color: groupedData.get(group)[colorSym],
        };
      });

      // Set x domain
      if (xScale === "ordinal") {
        this._xDomain = [
          ...new Set(
            this._currentData
              .map((d) => d.values.map((d) => d[xKeyName]))
              .flat()
          ),
        ];
      } else {
        const xDomain = this._currentData.map((d) =>
          d.values.map((d) => +d[xKeyName])
        );
        this._xDomain = d3.extent(xDomain.flat());
      }

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

      this._scaleX.domain(this._xDomain);
      this._scaleY.domain(getYDomain());
      this._previewScaleX.domain(this._xDomain);
      this._previewScaleY.domain(getYDomain());

      const previewLinesUpdate = previewArea
        .selectAll(".line")
        .data(this._currentData);

      const previewLinesEnter = previewLinesUpdate
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", (d) => line2(d.values));

      previewLinesUpdate
        .merge(previewLinesEnter)
        .attr("stroke", (d) => d.color);

      const previewLinesExit = previewLinesUpdate.exit().remove();

      const interpolator = {};
      if (xScale === "linear") {
        this._currentData.forEach((d) => {
          interpolator[d.name] = d3
            .scaleLinear()
            .domain(d.values.map((d) => +d[xKeyName]))
            .range(d.values.map((d) => +d[yKeyName]));
        });
      } else if (xScale === "ordinal") {
        this._currentData.forEach((d) => {
          interpolator[d.name] = d3.piecewise(
            d3.interpolate,
            d.values.map((d) => this._scaleX(d[xKeyName]))
          );
        });
      }

      const brushed = (e) => {
        const s = e.selection || this._previewScaleX.range();

        if (xScale === "ordinal") {
          const currentRange = [
            Math.floor(s[0] / this._previewScaleX.step()),
            Math.floor(s[1] / this._previewScaleX.step()),
          ];
          const newDomainX = this._xDomain.slice(
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
        } else {
          this._scaleX.domain(
            s.map(this._previewScaleX.invert, this._previewScaleX)
          );

          const x0x1 = s.map(this._previewScaleX.invert, this._previewScaleX);
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
        }
      };

      const updateRange = (data) => {
        graphArea.selectAll(".line").remove();
        const linesUpdate = graphArea.selectAll(".line").data(data);

        const linesEnter = linesUpdate
          .enter()
          .append("path")
          .attr("class", "line")
          .attr("d", (d) => line(d.values));

        linesUpdate.merge(linesEnter).attr("stroke", (d) => d.color);
        linesUpdate.exit().remove();

        graphXAxisG.call(xAxis);
        graphYAxisG.call(yAxis);
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
    const showXGrid = this.params["xgrid"] === "true" ? true : false;
    const showYGrid = this.params["ygrid"] === "true" ? true : false;
    const xLabelAngle =
      parseInt(this.params["axis-x-ticks_labels_angle"]) === 0
        ? 0
        : parseInt(this.params["axis-x-ticks_labels_angle"]) || -90;
    const yLabelAngle =
      parseInt(this.params["axis-y-ticks_labels_angle"]) === 0
        ? 0
        : parseInt(this.params["axis-y-ticks_labels_angle"]) || 0;

    const xDataType = this.params["x-axis-data-type"] || "string";
    // const errorKeyName = this.params["error-key"];
    // const showErrorBars =
    //   this.params["error-key"] !== "" || this.params["error-key"] !== undefined;

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

    // const xAxisPlacement = this.params["xaxis-placement"] || "bottom";
    // const yAxisPlacement = this.params["yaxis-placement"] || "left";

    // const xTitlePadding = this.params["xtitle-padding"] || 15;
    // const yTitlePadding = this.params["ytitle-padding"] || 15;
    const xTickSize = parseInt(this.params["xtick-size"])
      ? parseInt(this.params["xtick-size"])
      : 0;
    const yTickSize = parseInt(this.params["ytick-size"])
      ? parseInt(this.params["ytick-size"])
      : 0;

    const axisTitleFontSize =
      parseInt(css("--togostanza-title-font-size")) || 10;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const legendShow = this.params["legend"] || "none";

    // const root = this.root.querySelector("main");

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

    function getRandomTrueFalse() {
      return Math.random() >= 0.5;
    }

    // TODO change data to include errors. For now, artificially add 20% error  and randomly add or not add it.
    values.forEach((item) => {
      if (getRandomTrueFalse()) {
        item.error = item[yKeyName] * 0.2;
      }
    });

    //Filter out all non-numeric x-axis values from data
    if (xDataType === "number") {
      values = values.filter((item) => !isNaN(item[xKeyName]));
    }

    // Check data
    {
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
    }

    //=========

    this._data = values;

    const categorizedData = d3.group(values, (d) => d[groupKeyName]);

    // const groups = [...categorizedData.keys()];

    const toggleState = new Map(groups.map((_, index) => ["" + index, false]));

    // const togostanzaColors = [];
    // for (let i = 0; i < 6; i++) {
    //   togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    // }

    // const color = d3.scaleOrdinal().domain(groups).range(togostanzaColors);

    // const width = parseInt(this.params["width"]);
    // const height = parseInt(this.params["height"]);

    // const el = this.root.getElementById("linechart-d3");

    // const svg = d3
    //   .select(el)
    //   .append("svg")
    //   .attr("width", width)
    //   .attr("height", height);

    const redrawSVG = (
      MARGIN = {
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

      dataMax = d3.max(
        values,
        (d) => +d[yKeyName] + (parseFloat(d[errorKeyName]) || 0)
      );
      dataMin = d3.min(
        values,
        (d) => +d[yKeyName] - (parseFloat(d[errorKeyName]) || 0)
      );

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

        dataMax = d3.max(
          values,
          (d) => +d[yKeyName] + (parseFloat(d[errorKeyName]) || 0)
        );
        dataMin = d3.min(
          values,
          (d) => +d[yKeyName] - (parseFloat(d[errorKeyName]) || 0)
        );

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

        const g = dataGroup
          .selectAll("path")
          .data(categorizedData, (d) => d[0]);

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
          .attr(
            "id",
            (d) => "data-" + groups.findIndex((item) => item === d[0])
          )
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
            .filter((d) => {
              return (
                d[errorKeyName] !== undefined &&
                !isNaN(parseFloat(d[errorKeyName]))
              );
            })
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
              (item) =>
                !toggleState.get("" + groups.indexOf(item[groupKeyName]))
            );

            update(newData);
          }
        });
      }
    };
    redrawSVG();
  }

  computeParams() {
    const resultParams = new Map(this._validatedParams);
    const getTickInterval = (axis) => {
      const [dataMin, dataMax] = getRange(
        this._data,
        this._validatedParams.get(`axis-${axis}-data_key`)
      );
    };

    const getRange = (axis) => {
      const scale = this._validatedParams.get(`axis-${axis}-scale`);
      const dataKey = this._validatedParams.get(`axis-${axis}-data_key`);
      if (scale === "time") {
        // if scale for this axis is time, parse it first
        return d3.extent(this._data, (d) => Date.parse(d[dataKey]));
      } else if (scale === "ordinal") {
        // if the scale is ordinal set min and max to first and last elements
        return [
          this._data[0][dataKey],
          this._data[this._data.length - 1][dataKey],
        ];
      }
      return d3.extent(this._data, (d) => d[dataKey]);
    };

    const getAxisTitle = (axis) => {
      const title = this._validatedParams.get(`axis-${axis}-title`);
      if (title) {
        return title;
      }
      return this._validatedParams.get(`axis-${axis}-data_key`);
    };

    for (const param of this._validatedParams) {
      console.log(
        "metadata",
        this._metadataParamsMap.get(param[0])["stanza:computed"]
      );
      if (this._metadataParamsMap.get(param[0])["stanza:computed"]) {
        switch (param[0]) {
          case "axis-x-title":
            resultParams.set(param[0], getAxisTitle("x"));
            break;
          case "axis-x-range_min":
            resultParams.set(param[0], getRange("x")[0]);
            break;
          case "axis-x-range_max":
            resultParams.set(param[0], getRange("x")[1]);
            break;
          case "axis-y-range_min":
            resultParams.set(param[0], getRange("y")[0]);
            break;
          case "axis-y-range_max":
            resultParams.set(param[0], getRange("y")[1]);
            break;
          default:
            break;
        }
      }
    }

    return resultParams;
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
