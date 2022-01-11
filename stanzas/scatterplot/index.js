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

export default class ScatterPlot extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scatter-plot"),
      downloadPngMenuItem(this, "scatter-plot"),
      downloadJSONMenuItem(this, "scatter-plot", this._data),
      downloadCSVMenuItem(this, "scatter-plot", this._data),
      downloadTSVMenuItem(this, "scatter-plot", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width,height,padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    const xVariable = this.params["x"];
    const yVariable = this.params["y"];
    const zVariable = this.params["z"] ? this.params["z"] : "none";

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = values;

    const data = [
      {
        name: "source",
        values,
        transform: [
          {
            type: "filter",
            expr: `datum['${xVariable}'] != null && datum['${yVariable}'] != null`,
          },
        ],
      },
    ];

    const signals = [];

    //scales
    const scales = [
      {
        name: "x",
        type: "linear",
        round: true,
        nice: true,
        zero: true,
        domain: { data: "source", field: xVariable },
        range: "width",
      },
      {
        name: "y",
        type: "linear",
        round: true,
        nice: true,
        zero: true,
        domain: { data: "source", field: yVariable },
        range: "height",
      },
      {
        name: "size",
        type: "linear",
        round: true,
        nice: false,
        zero: true,
        domain: { data: "source", field: zVariable },
        range: [4, 361],
      },
    ];

    //axes
    const axes = [
      {
        scale: "x",
        orient: this.params["xaxis-placement"],
        domain: true,
        domainColor: "var(--togostanza-axis-color)",
        domainWidth: css("--togostanza-axis-width"),
        grid: this.params["xgrid"] === "true",
        gridColor: "var(--togostanza-grid-color)",
        gridDash: css("--togostanza-grid-dash-length"),
        gridOpacity: css("--togostanza-grid-opacity"),
        gridWidth: css("--togostanza-grid-width"),
        ticks: this.params["xtick"] === "true",
        // tickCount: params["xtick-count"],
        tickColor: "var(--togostanza-tick-color)",
        tickSize: css("--togostanza-tick-length"),
        tickWidth: css("--togostanza-tick-width"),
        title:
          this.params["x-title"] === "" ? xVariable : this.params["x-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        titlePadding: this.params["xtitle-padding"],
        labelPadding: this.params["xlabel-padding"],
        zindex: 0,
        encode: {
          labels: {
            interactive: true,
            update: {
              angle: { value: this.params["xlabel-angle"] },
              fill: { value: "var(--togostanza-label-font-color)" },
              font: {
                value: css("--togostanza-font-family"),
              },
              fontSize: {
                value: css("--togostanza-label-font-size"),
              },
            },
          },
        },
      },
      {
        scale: "y",
        orient: this.params["yaxis-placement"],
        domain: true,
        domainColor: "var(--togostanza-axis-color)",
        domainWidth: css("--togostanza-axis-width"),
        grid: this.params["ygrid"] === "true",
        gridColor: "var(--togostanza-grid-color)",
        gridDash: css("--togostanza-grid-dash-length"),
        gridOpacity: css("--togostanza-grid-opacity"),
        gridWidth: css("--togostanza-grid-width"),
        ticks: this.params["ytick"] === "true",
        // tickCount: params["ytick-count"],
        tickColor: "var(--togostanza-tick-color)",
        tickSize: css("--togostanza-tick-length"),
        tickWidth: css("--togostanza-tick-width"),
        title:
          this.params["y-title"] === "" ? yVariable : this.params["y-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        titlePadding: this.params["ytitle-padding"],
        labelPadding: this.params["ylabel-padding"],
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
              fontSize: {
                value: css("--togostanza-label-font-size"),
              },
            },
          },
        },
      },
    ];

    // legend
    const legends = [
      {
        size: "size",
        format: "s",
        title:
          this.params["legend-title"] === ""
            ? zVariable
            : this.params["legend-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        labelColor: "var(--togostanza-label-font-color)",
        labelFont: css("--togostanza-font-family"),
        labelFontSize: css("--togostanza-label-font-size"),
        symbolType: this.params["symbol-shape"],
        symbolFillColor: "var(--togostanza-series-0-color)",
        symbolStrokeColor: css("--togostanza-border-color"),
        symbolStrokeWidth: css("--togostanza-border-width"),
      },
    ];

    //marks
    const marks = [
      {
        name: "marks",
        type: "symbol",
        from: { data: "source" },
        encode: {
          update: {
            x: { scale: "x", field: xVariable },
            y: { scale: "y", field: yVariable },
            shape: { value: this.params["symbol-shape"] },
            fill: { value: "var(--togostanza-series-0-color)" },
            size: { scale: "size", field: zVariable },
            stroke: { value: "var(--togostanza-border-color)" },
            strokeWidth: {
              value: css("--togostanza-border-width"),
            },
            opacity: {
              value: css("--togostanza-opacity"),
            },
          },
        },
      },
    ];

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      data,
      signals,
      scales,
      axes,
      legends:
        zVariable === "none" || this.params["legend"] === "false"
          ? []
          : legends,
      marks,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);
  }
}
