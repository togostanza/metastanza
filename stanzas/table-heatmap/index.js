import Stanza from "togostanza/stanza";
import vegaEmbed from "vega-embed";

export default class tableHeatmap extends Stanza {
  async render() {
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
        // tickCount: this.params["ytick-count"],
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

    const mark = "rect";

    const encoding = {
      y: { field: labelVariable, type: "nominal" },
      x: { field: valueVariable, type: "ordinal" },
      color: { aggregate: "mean", field: "Horsepower" },
    };

    const config = {
      axis: { grid: true, tickBand: "extent" },
    };

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width,
      height,
      padding,
      data: { url: this.params["data-url"] },
      axes,
      legends,
      mark,
      encoding,
      config,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);
  }
}
