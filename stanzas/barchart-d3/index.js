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

    const padding = this.params["padding"];

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
    const xLabelAngle = parseInt(this.params["xlabel-angle"]) || -90;
    const yLabelAngle = parseInt(this.params["ylabel-angle"]) || 0;
    const barPlacement = this.params["bar-placement"];
    const errorKeyName = this.params["error-key"] || "error";
    const showErrorBars = errorKeyName ? this.params["error-bars"] : false;
    const errorBarWidth = this.params["error-bar-width"] || 0;
    const barPaddings = this.params["bar-paddings"] || 0.1;
    const barSubPaddings = this.params["bar-sub-paddings"] || 0.1;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector(":scope > div");

    const el = this.root.querySelector("#barchart-d3");

    // On change params rerender - Check if legend and svg already existing and remove them -
    const existingLegend = this.root.querySelector("togostanza--legend");

    if (!this.tooltip) {
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
    const subKeyNames = [...new Set(values.map((d) => d[groupKeyName]))];

    if (barPlacement === "stacked") {
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
      const x = d3
        .scaleBand()
        .domain(xAxisLabels)
        .range([0, WIDTH])
        .padding(barPaddings);
      const y = d3.scaleLinear().domain([0, dataMax]).range([HEIGHT, 0]);

      // Show/hide axes ticks

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

      const xAxisGenerator = d3.axisBottom(x).tickSizeOuter(0);
      if (!showXTicks) {
        xAxisGenerator.tickSize(0);
      }

      const yAxisGenerator = d3.axisLeft(y).ticks(yTicksNumber);
      if (!showYTicks) {
        yAxisGenerator.tickSize(0);
      }

      xAxisArea
        .call(xAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", textAnchor)
        .attr("x", xx)
        .attr("y", "0")
        .attr("dy", xdy)
        .attr("transform", `rotate(${xLabelAngle})`);

      yAxisArea
        .call(yAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("transform", `rotate(${yLabelAngle})`);

      if (groupKeyName) {
        const color = d3
          .scaleOrdinal()
          .domain(subKeyNames)
          .range(togostanzaColors);

        const stackGroups = barsArea
          .selectAll("g")
          .data(stack(dataset))
          .enter()
          .append("g")
          .style("fill", function (d, i) {
            return color(subKeyNames[i]);
          });

        const barGroups = stackGroups
          .selectAll("rect")
          .data((d) => {
            return d;
          })
          .enter()
          .append("rect")
          .attr("class", "bars")
          .attr("data-tooltip", (d) => d[1] - d[0])
          .attr("data-html", "true")
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

        this.tooltip.setup(this.root.querySelectorAll("[data-tooltip]"));

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
            fadeoutNodes: null,
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
            .tickFormat("");

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
            .ticks(yTicksNumber);

          const yAxisGrid = barsArea
            .append("g")
            .attr("class", "y gridlines")
            .call(yAxisGridGenerator);
        }
      } else {
        // else just draw line

        return;
      }
    } else {
      const dataset = d3.group(values, (d) => d[xKeyName]);

      const color = d3
        .scaleOrdinal()
        .domain(subKeyNames)
        .range(togostanzaColors);

      const x = d3
        .scaleBand()
        .domain(xAxisLabels)
        .range([0, WIDTH])
        .padding(barPaddings);

      const y = d3.scaleLinear().domain([0, dataMax]).range([HEIGHT, 0]);

      const xAxisGenerator = d3.axisBottom(x).tickSizeOuter(0);
      if (!showXTicks) {
        xAxisGenerator.tickSize(0);
      }

      const yAxisGenerator = d3.axisLeft(y).ticks(yTicksNumber);
      if (!showYTicks) {
        yAxisGenerator.tickSize(0);
      }

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
        .call(xAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", textAnchor)
        .attr("x", xx)
        .attr("y", "0")
        .attr("dy", xdy)
        .attr("transform", `rotate(${xLabelAngle})`);

      yAxisArea
        .call(yAxisGenerator)
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("transform", `rotate(${yLabelAngle})`);

      const subX = d3
        .scaleBand()
        .domain(subKeyNames)
        .range([0, x.bandwidth()])
        .padding(barSubPaddings);

      //For every group of bass - own g with
      const barsGroup = barsArea
        .selectAll("g")
        .data(dataset)
        .enter()
        .append("g")
        .attr("transform", (d) => {
          return `translate(${x(d[0])},0)`;
        });

      // inside every g insert bars on its own x genertor
      barsGroup
        .selectAll("rect")
        .data((d) => {
          return d[1];
        })
        .enter()
        .append("rect")
        .attr("x", (d) => subX(d[groupKeyName]))
        .attr("y", (d) => y(+d[yKeyName]))
        .attr("width", subX.bandwidth())
        .attr("height", (d) => y(0) - y(+d[yKeyName]))
        .attr("fill", (d) => {
          return color(d[groupKeyName]);
        });

      if (showErrorBars) {
        barsGroup.call(errorBars, errorKeyName, y, subX, errorBarWidth);
      }

      // Show/hide grid lines
      if (showXGrid) {
        const xAxisGridGenerator = d3
          .axisBottom(x)
          .tickSize(-HEIGHT)
          .tickFormat("");

        barsArea
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
          .ticks(yTicksNumber);

        barsArea
          .append("g")
          .attr("class", "y gridlines")
          .call(yAxisGridGenerator);
      }

      this.legend.setup(
        subKeyNames.map((item, index) => ({
          id: "" + index,
          label: item,
          color: color(item),
          node: this.root.querySelector(`svg #data-${index}`),
        })),
        this.root.querySelector("main"),
        {
          fadeoutNodes: null,
          position: ["top", "right"],
          fadeProp: "opacity",
        }
      );
    }
  }
}

function errorBars(selection, errorKeyName, yAxis, subXAxis, errorBarWidth) {
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
      .attr("stroke-width", 0.5)
      .attr("stroke", "black")
      .attr("x1", (d) => subXAxis(d.category) + subXAxis.bandwidth() / 2)
      .attr("y1", (d) => yAxis(+d.count - d[errorKeyName] / 2))
      .attr("x2", (d) => subXAxis(d.category) + subXAxis.bandwidth() / 2)
      .attr("y2", (d) => yAxis(+d.count + d[errorKeyName] / 2));

    // upper stroke
    errorBarGroup
      .append("line")
      .attr("stroke-width", 0.5)
      .attr("stroke", "black")
      .attr(
        "x1",
        (d) =>
          subXAxis(d.category) +
          subXAxis.bandwidth() / 2 -
          (subXAxis.bandwidth() * errorBarWidth) / 2
      )
      .attr(
        "x2",
        (d) =>
          subXAxis(d.category) +
          subXAxis.bandwidth() / 2 +
          (subXAxis.bandwidth() * errorBarWidth) / 2
      )
      .attr("y1", (d) => yAxis(+d.count - d[errorKeyName] / 2))
      .attr("y2", (d) => yAxis(+d.count - d[errorKeyName] / 2));
    // lower stroke
    errorBarGroup
      .append("line")
      .attr("stroke-width", 0.5)
      .attr("stroke", "black")
      .attr(
        "x1",
        (d) =>
          subXAxis(d.category) +
          subXAxis.bandwidth() / 2 -
          (subXAxis.bandwidth() * errorBarWidth) / 2
      )
      .attr(
        "x2",
        (d) =>
          subXAxis(d.category) +
          subXAxis.bandwidth() / 2 +
          (subXAxis.bandwidth() * errorBarWidth) / 2
      )
      .attr("y1", (d) => yAxis(+d.count + d[errorKeyName] / 2))
      .attr("y2", (d) => yAxis(+d.count + d[errorKeyName] / 2));
  });
}
