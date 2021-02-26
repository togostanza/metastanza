import vegaEmbed from "vega-embed";

export default async function devLinechart(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  const vegaJson = await fetch(
    "https://vega.github.io/vega/examples/line-chart.vg.json"
  ).then((res) => res.json());

  //width、height、padding
  const width = params["width"];
  const height = params["height"];
  const padding = params["padding"];

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];
  const groupVariable = params["group-variable"];

  const data = [
    {
      name: "table",
      url: params["your-data"],
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
        "var(--series-0-color)",
        "var(--series-1-color)",
        "var(--series-2-color)",
        "var(--series-3-color)",
        "var(--series-4-color)",
        "var(--series-5-color)",
      ],
      domain: { data: "table", field: groupVariable },
    },
  ];

  //axes
  const axes = [
    {
      scale: "x",
      orient: params["xaxis-orient"],
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
      title: labelVariable,
      titleColor: "var(--title-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-size"),
      titleFontWeight: css("--title-weight"),
      titlePadding: Number(css("--title-padding")),
      zindex: 1,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            dx: { value: params["xlabel-horizonal-offset"] },
            dy: { value: params["xlabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: { value: css("--font-family") },
            fontSize: { value: css("--label-size") },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-orient"],
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
      title: valueVariable,
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
            font: { value: css("--font-family") },
            fontSize: { value: css("--label-size") },
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
      legendX: 420,
      legendY: -5,
      title: groupVariable,
      titleColor: "var(--legendtitle-color)",
      labelColor: "var(--legendlabel-color)",
      encode: {
        title: {
          update: {
            font: { value: css("--font-family") },
            fontSize: {
              value: css("--legendtitle-size"),
            },
            fontWeight: { value: css("--legendtitle-weight") },
          },
        },
        labels: {
          interactive: true,
          update: {
            font: { value: css("--legend-font") },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendlabel-size"
              ),
            },
          },
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
                value: css("--line-width"),
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
    signals: vegaJson.signals,
    data,
    scales,
    axes,
    legends,
    marks,
  };

  //delete default controller
  for (const signal of vegaJson.signals) {
    delete signal.bind;
  }

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
