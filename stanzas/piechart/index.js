import Stanza from "togostanza/stanza";

import vegaEmbed from "vega-embed";
import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class PieChart extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "piechart"),
      downloadPngMenuItem(this, "piechart"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width,height,padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = { left: 0, top: 0, right: 150, bottom: 0 };

    //data
    const labelVariable = this.params["category"];
    const valueVariable = this.params["value"];

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    const signals = [
      {
        name: "startAngle",
        value: 0,
      },
      {
        name: "endAngle",
        value: 6.29,
      },
      {
        name: "padAngle",
        value: 0,
      },
      {
        name: "innerRadius",
        value: 0,
      },
      {
        name: "cornerRadius",
        value: 0,
      },
      {
        name: "sort",
        value: false,
      },
    ];

    const data = [
      {
        name: "table",
        values,
        transform: [
          {
            type: "pie",
            field: valueVariable,
            startAngle: { signal: "startAngle" },
            endAngle: { signal: "endAngle" },
            sort: { signal: "sort" },
          },
        ],
      },
    ];

    // scales(color scheme)
    const scales = [
      {
        name: "color",
        type: "ordinal",
        domain: { data: "table", field: labelVariable },
        range: [
          "var(--togostanza-series-0-color)",
          "var(--togostanza-series-1-color)",
          "var(--togostanza-series-2-color)",
          "var(--togostanza-series-3-color)",
          "var(--togostanza-series-4-color)",
          "var(--togostanza-series-5-color)",
        ],
      },
    ];

    //legend
    const legends = [
      {
        fill: "color",
        orient: "right",
        legendY: "5",
        title:
          this.params["legend-title"] === ""
            ? labelVariable
            : this.params["legend-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: css("--togostanza-font-family"),
        titleFontSize: css("--togostanza-title-font-size"),
        titleFontWeight: css("--togostanza-title-font-weight"),
        labelColor: "var(--togostanza-label-font-color)",
        labelFont: css("--togostanza-font-family"),
        labelFontSize: css("--togostanza-label-font-size"),
        symbolType: this.params["symbol-shape"],
        symbolStrokeColor: css("--togostanza-border-color"),
        symbolStrokeWidth: css("--togostanza-border-width"),
      },
    ];

    //marks
    const marks = [
      {
        type: "arc",
        from: { data: "table" },
        encode: {
          enter: {
            fill: { scale: "color", field: labelVariable },
            x: { signal: "width / 2" },
            y: { signal: "height / 2" },
          },
          update: {
            startAngle: { field: "startAngle" },
            endAngle: { field: "endAngle" },
            padAngle: { signal: "padAngle" },
            innerRadius: { signal: "innerRadius" },
            outerRadius: { signal: "width / 2" },
            cornerRadius: { signal: "cornerRadius" },
            fill: { scale: "color", field: labelVariable },
            stroke: { value: "var(--togostanza-border-color)" },
            strokeWidth: { value: "var(--togostanza-border-width)" },
          },
        },
      },
    ];

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      signals,
      autosize: "none",
      data,
      scales,
      legends: this.params["legend"] === "false" ? [] : legends,
      marks,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);

    const svg = this.root.querySelector(".marks");
    svg.style.padding = `${this.params["padding"]}px`;
  }
}
