import Stanza from "togostanza/stanza";

import vegaEmbed from "vega-embed";
import loadData from "togostanza-utils/load-data";
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
    const chartType = this.params["chart-type"];

    //width,height,padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    //data
    const labelVariable = this.params["category"]; //x
    const valueVariable = this.params["value"]; //y
    const groupVariable = this.params["group-by"]
      ? this.params["group-by"]
      : "none"; //z

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = values;

    function constructData(chartType) {
      switch (chartType) {
        case "grouped":
          return [
            {
              name: "table",
              values,
            },
          ];
        case "stacked":
          return [
            {
              name: "table",
              values,
              transform: [
                {
                  type: "stack",
                  field: valueVariable,
                  groupby: [labelVariable],
                  sort: { field: groupVariable },
                },
              ],
            },
          ];
      }
    }

    const getTitle = (
      stackedParamsTitle,
      stackedDefaultTitle,
      groupedParamsTitle,
      groupedDefaultTitle
    ) => {
      switch (chartType) {
        case "stacked":
          return stackedParamsTitle === ""
            ? stackedDefaultTitle
            : stackedParamsTitle;
        case "grouped":
          return groupedParamsTitle === ""
            ? groupedDefaultTitle
            : groupedParamsTitle;
      }
    };

    const axes = [
      {
        scale: "xscale",
        orient: this.params["xaxis-placement"],
        domainColor: "var(--togostanza-axis-color)",
        domainWidth: css("--togostanza-axis-width"),
        grid: this.params["xgrid"] === "true",
        gridColor: "var(--togostanza-grid-color)",
        gridDash: css("--togostanza-grid-dash-length"),
        gridOpacity: css("--togostanza-grid-opacity"),
        gridWidth: css("--togostanza-grid-width"),
        ticks: this.params["xtick"] === "true",
        tickColor: "var(--togostanza-tick-color)",
        tickSize: css("--togostanza-tick-length"),
        tickWidth: css("--togostanza-tick-width"),
        title: getTitle(
          this.params["category-title"],
          labelVariable,
          this.params["value-title"],
          valueVariable
        ),
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        titlePadding: this.params["xtitle-padding"],
        labelPadding: this.params["xlabel-padding"],
        labelAlign: this.params["xlabel-alignment"],
        labelLimit: this.params["xlabel-max-width"],
        encode: {
          labels: {
            interactive: true,
            update: {
              angle: { value: this.params["xlabel-angle"] },
              fill: { value: "var(--togostanza-label-font-color)" },
              font: { value: css("--togostanza-font-family") },
              fontSize: { value: css("--togostanza-label-font-size") },
            },
          },
        },
      },
      {
        scale: "yscale",
        orient: this.params["yaxis-placement"],
        domainColor: "var(--togostanza-axis-color)",
        domainWidth: css("--togostanza-axis-width"),
        grid: this.params["ygrid"] === "true",
        gridColor: "var(--togostanza-grid-color)",
        gridDash: css("--togostanza-grid-dash-length"),
        gridOpacity: css("--togostanza-grid-opacity"),
        gridWidth: css("--togostanza-grid-width"),
        ticks: this.params["ytick"] === "true",
        tickColor: "var(--togostanza-tick-color)",
        tickSize: css("--togostanza-tick-length"),
        tickWidth: css("--togostanza-tick-width"),
        title: getTitle(
          this.params["value-title"],
          valueVariable,
          this.params["category-title"],
          labelVariable
        ),
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        titlePadding: this.params["ytitle-padding"],
        labelPadding: this.params["ylabel-padding"],
        labelAlign: this.params["ylabel-alignment"],
        labelLimit: this.params["ylabel-max-width"],
        zindex: 0,
        encode: {
          labels: {
            interactive: true,
            update: {
              angle: { value: this.params["ylabel-angle"] },
              fill: { value: "var(--togostanza-label-font-color)" },
              font: {
                value: css("--togostanza-font-family"),
              },
              fontSize: { value: css("--togostanza-label-font-size") },
            },
          },
        },
      },
    ];

    // legend
    const legends = [
      {
        fill: "color",
        orient: "none",
        legendX: this.params["legend-padding"]
          ? width + this.params["legend-padding"]
          : width + 18,
        title: getTitle(
          this.params["legend-title"],
          groupVariable,
          this.params["legend-title"],
          groupVariable
        ),
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        labelColor: "var(--togostanza-label-font-color)",
        labelFont: css("--togostanza-font-family"),
        labelFontSize: css("--togostanza-label-font-size"),
        symbolStrokeColor: css("--togostanza-border-color"),
        symbolStrokeWidth: css("--togostanza-border-width"),
        symbolLimit: "2000",
      },
    ];

    const colorScale = {
      name: "color",
      type: "ordinal",
      domain: { data: "table", field: groupVariable },
      range: [
        "var(--togostanza-series-0-color)",
        "var(--togostanza-series-1-color)",
        "var(--togostanza-series-2-color)",
        "var(--togostanza-series-3-color)",
        "var(--togostanza-series-4-color)",
        "var(--togostanza-series-5-color)",
      ],
    };

    const constructScale = (chartType) => {
      switch (chartType) {
        case "grouped":
          return [
            colorScale,
            {
              name: "xscale",
              type: "linear",
              domain: { data: "table", field: valueVariable },
              range: "width",
            },
            {
              name: "yscale",
              type: "band",
              domain: { data: "table", field: labelVariable },
              range: "height",
              padding: 0.2,
              paddingInner: this.params["padding-inner"],
              paddingOuter: this.params["padding-outer"],
            },
          ];
        case "stacked":
          return [
            colorScale,
            {
              name: "xscale",
              type: "band",
              range: "width",
              domain: { data: "table", field: labelVariable },
              paddingInner: this.params["padding-inner"],
              paddingOuter: this.params["padding-outer"],
            },
            {
              name: "yscale",
              type: "linear",
              range: "height",
              nice: true,
              zero: true,
              domain: { data: "table", field: "y1" },
            },
          ];
      }
    };

    const constructMark = (chartType) => {
      switch (chartType) {
        case "grouped":
          return [
            {
              type: "group",
              from: {
                facet: {
                  data: "table",
                  name: "facet",
                  groupby: labelVariable,
                },
              },
              encode: {
                enter: {
                  y: { scale: "yscale", field: labelVariable },
                },
              },
              signals: [{ name: "height", update: "bandwidth('yscale')" }],
              scales: [
                {
                  name: "pos",
                  type: "band",
                  range: "height",
                  domain: { data: "facet", field: groupVariable },
                },
              ],
              marks: [
                {
                  name: "bars",
                  from: { data: "facet" },
                  type: "rect",
                  encode: {
                    enter: {
                      y: { scale: "pos", field: groupVariable },
                      height: { scale: "pos", band: 1 },
                      x: { scale: "xscale", field: valueVariable },
                      x2: { scale: "xscale", value: 0 },
                      fill: { scale: "color", field: groupVariable },
                      stroke: { value: "var(--togostanza-border-color)" },
                      strokeWidth: { value: css("--togostanza-border-width") },
                    },
                  },
                },
              ],
            },
          ];
        case "stacked":
          return [
            {
              type: "group",
              from: { data: "table" },
              encode: {
                enter: {
                  x: { scale: "xscale", field: labelVariable },
                  width: { scale: "xscale", band: this.params["bar-width"] },
                  y: { scale: "yscale", field: "y0" },
                  y2: { scale: "yscale", field: "y1" },
                  fill: { scale: "color", field: groupVariable },
                  stroke: { value: "var(--togostanza-border-color)" },
                  strokeWidth: { value: css("--togostanza-border-width") },
                },
              },
            },
          ];
      }
    };

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      data: constructData(chartType),
      scales: constructScale(chartType),
      axes,
      legends:
        this.params["legend"] === "true" && this.params["group-by"]
          ? legends
          : [],
      marks: constructMark(chartType),
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);
  }
}
