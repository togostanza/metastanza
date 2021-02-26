import vegaEmbed from "vega-embed";

export default async function threeVariablesScatterplot(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }
  // const vegaJson = await fetch("https://vega.github.io/vega/examples/scatter-plot.vg.json").then((res) => res.json());

  //width,height,padding
  const width = Number(params["width"]);
  const height = Number(params["height"]);
  const padding = Number(params["padding"]);

  const xVariable = params["x-variable"];
  const yVariable = params["y-variable"];
  const zVariable = params["z-variable"];

  const data = [
    {
      name: "source",
      url: params["your-data"],
      transform: [
        {
          type: "filter",
          expr: `datum['${xVariable}'] != null && datum['${yVariable}'] != null && datum['${zVariable}'] != null`,
        },
      ],
    },
  ];

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
      orient: params["xaxis-orient"],
      domain: true,
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["xtick"] === "true",
      // tickCount: params["xtick-count"],
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title: xVariable,
      titleColor: "var(--title-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-size"),
      titleFontWeight: css("--title-weight"),
      titlePadding: Number(css("--title-padding")),
      zindex: 0,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            dx: { value: params["xlabel-horizonal-offset"] },
            dy: { value: params["xlabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: css("--font-family"),
            },
            fontSize: {
              value: css("--label-size"),
            },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-orient"],
      domain: true,
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["ytick"] === "true",
      // tickCount: params["ytick-count"],
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title: yVariable,
      titleColor: "var(--title-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-size"),
      titleFontWeight: css("--title-weight"),
      titlePadding: Number(css("--title-padding")),
      zindex: 0,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
            dx: { value: params["ylabel-horizonal-offset"] },
            dy: { value: params["ylabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: css("--font-family"),
            },
            fontSize: {
              value: css("--label-size"),
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
      title: zVariable,
      titleColor: "var(--legendtitle-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--legendtitle-size"),
      titleFontWeight: css("--legendtitle-weight"),
      labelColor: "var(--legendlabel-color)",
      labelFont: css("--font-family"),
      labelFontSize: css("--legendlabel-size"),
      symbolType: params["symbol-shape"],
      symbolFillColor: "var(--series-0-color)",
      symbolStrokeColor: css("--stroke-color"),
      symbolStrokeWidth: css("--stroke-width"),
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
          shape: { value: params["symbol-shape"] },
          fill: { value: "var(--series-0-color)" },
          size: { scale: "size", field: zVariable },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: {
            value: css("--stroke-width"),
          },
          opacity: {
            value: css("--opacity"),
          },
        },
      },
    },
  ];

  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: width,
    height: height,
    padding: padding,
    data: data,
    scales: scales,
    axes: axes,
    legends: legends,
    marks: marks,
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
