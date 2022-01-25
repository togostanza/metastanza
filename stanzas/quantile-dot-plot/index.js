import Stanza from "togostanza/stanza";
import vegaEmbed from "vega-embed";

export default class quantileDotPlot extends Stanza {
  async render() {
    //width,height,padding
    const width = Number(this.params["width"]);
    const height = Number(this.params["height"]);
    const padding = Number(this.params["padding"]);

    const vegaJson = await fetch(
      "https://vega.github.io/vega/examples/quantile-dot-plot.vg.json"
    ).then((res) => res.json());

    const signals = [
      {
        name: "quantiles",
        value: 20,
        bind: { input: "range", min: 10, max: 200, step: 1 },
      },
      { name: "mean", update: "log(11.4)" },
      { name: "sd", value: 0.2 },
      { name: "step", update: "1.25 * sqrt(20 / quantiles)" },
      { name: "size", update: "scale('x', step) - scale('x', 0)" },
      { name: "area", update: "size * size" },
      {
        name: "select",
        init: "quantileLogNormal(0.05, mean, sd)",
        on: [
          {
            events: "click, [mousedown, window:mouseup] > mousemove",
            update: "clamp(invert('x', x()), 0.0001, 30)",
          },
          {
            events: "dblclick",
            update: "0",
          },
        ],
      },
    ];

    const data = [
      {
        name: "quantiles",
        transform: [
          {
            type: "sequence",
            as: "p",
            start: { signal: "0.5 / quantiles" },
            step: { signal: "1 / quantiles" },
            stop: 1,
          },
          {
            type: "formula",
            as: "value",
            expr: "quantileLogNormal(datum.p, mean, sd)",
          },
          {
            type: "dotbin",
            field: "value",
            step: { signal: "step" },
          },
          {
            type: "stack",
            groupby: ["bin"],
          },
          {
            type: "extent",
            field: "y1",
            signal: "ext",
          },
        ],
      },
    ];

    // objects for marks
    const getSignalByColor = (color, color2 = "transparant") => {
      return `select ? '${color}': '${color2}'`;
    };

    const scales = [
      {
        name: "x",
        domain: [this.params["x-domain-start"], this.params["x-domain-end"]],
        range: "width",
      },
      {
        name: "y",
        domain: { signal: "[0, height / size]" },
        range: "height",
      },
    ];

    const symbol = {
      type: "symbol",
      from: { data: "quantiles" },
      encode: {
        enter: {
          x: { scale: "x", field: "bin" },
          y: { scale: "y", signal: "datum.y0 + 0.5" },
          size: { signal: "area" },
        },
        update: {
          fill: {
            signal:
              "datum.bin <" +
              getSignalByColor(
                "var(--togostanza-fill-selected)",
                "var(--togostanza-fill-unselected)"
              ),
          },
        },
      },
    };

    const rule = {
      type: "rule",
      interactive: false,
      encode: {
        update: {
          x: { scale: "x", signal: "select" },
          y: { value: 0 },
          y2: { signal: "height" },
          stroke: {
            signal: getSignalByColor("var(--togostanza-stroke-signal)"),
          },
        },
      },
    };

    const text = {
      type: "text",
      interactive: false,
      encode: {
        enter: {
          baseline: { value: "top" },
          dx: { value: 3 },
          y: { value: 3 },
        },
        update: {
          x: { scale: "x", signal: "select" },
          text: {
            signal: "format(cumulativeLogNormal(select, mean, sd), '.1%')",
          },
          fill: { signal: getSignalByColor("#002559") },
        },
      },
    };

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      signals,
      axes: vegaJson.axes,
      data,
      scales,
      marks: [symbol, rule, text],
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    console.log(this.params["x-domain-start"]);
    await vegaEmbed(el, spec, opts);
  }
}
