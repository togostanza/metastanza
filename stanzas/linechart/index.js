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

export default class Linechart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "linechart"),
      downloadPngMenuItem(this, "linechart"),
      downloadJSONMenuItem(this, "linechart", this._data),
      downloadCSVMenuItem(this, "linechart", this._data),
      downloadTSVMenuItem(this, "linechart", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width、height、padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    //data
    const labelVariable = this.params["category"];
    const valueVariable = this.params["value"];
    const groupVariable = this.params["group-by"]
      ? this.params["group-by"]
      : "none";

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    this._data = values;

    const signals = [
      {
        name: "interpolate",
        value: "linear",
      },
    ];

    const data = [
      {
        name: "table",
        values,
      },
    ];

    //scale
    const scales = [
      {
        name: "x",
        type: "point",
        range: "width",
        domain: { data: "table", field: labelVariable },
      },
      {
        name: "y",
        type: "linear",
        range: "height",
        nice: true,
        zero: true,
        domain: { data: "table", field: valueVariable },
      },
      {
        name: "color",
        type: "ordinal",
        range: [
          "var(--togostanza-series-0-color)",
          "var(--togostanza-series-1-color)",
          "var(--togostanza-series-2-color)",
          "var(--togostanza-series-3-color)",
          "var(--togostanza-series-4-color)",
          "var(--togostanza-series-5-color)",
        ],
        domain: { data: "table", field: groupVariable },
      },
    ];

    //axes
    const axes = [
      {
        scale: "x",
        orient: this.params["xaxis-placement"],
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
        tickSize: css("--tick-size"),
        tickWidth: css("--togostanza-tick-width"),
        title:
          this.params["category-title"] === ""
            ? labelVariable
            : this.params["category-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        titlePadding: this.params["xtitle-padding"],
        labelPadding: this.params["xlabel-padding"],
        zindex: 1,
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
        scale: "y",
        orient: this.params["yaxis-placement"],
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
          this.params["value-title"] === ""
            ? valueVariable
            : this.params["value-title"],
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
              font: { value: css("--togostanza-font-family") },
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
        orient: "right",
        // legendX: width,
        legendY: -5,
        title:
          this.params["legend-title"] === ""
            ? groupVariable
            : this.params["legend-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        labelColor: "var(--togostanza-label-font-color)",
        labelFont: css("--togostanza-font-family"),
        labelFontSize: css("--togostanza-label-font-size"),
        symbolStrokeColor: css("--togostanza-border-color"),
        symbolStrokeWidth: css("--togostanza-border-width"),
        encode: {
          labels: {
            text: { field: "value" },
          },
        },
      },
    ];

    //marks
    const marks = [
      {
        type: "group",
        from: {
          facet: {
            name: "series",
            data: "table",
            groupby: groupVariable,
          },
        },
        marks: [
          {
            type: "line",
            from: { data: "series" },
            encode: {
              enter: {
                x: { scale: "x", field: labelVariable },
                y: { scale: "y", field: valueVariable },
                stroke: { scale: "color", field: groupVariable },
                strokeWidth: {
                  value: css("--togostanza-line-width"),
                },
              },
              update: {
                interpolate: { signal: "interpolate" },
                strokeOpacity: { value: 1 },
                stroke: { scale: "color", field: groupVariable },
              },
            },
          },
        ],
      },
    ];

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      signals,
      data,
      scales,
      axes,
      legends:
        this.params["legend"] === "true" && this.params["group-by"]
          ? legends
          : [],
      marks,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);
  }
}
