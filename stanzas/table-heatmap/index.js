import vegaEmbed from "vega-embed";

export default async function tableHeatmap(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  //width、height、padding
  const width = params["width"];
  const height = params["height"];
  const padding = params["padding"];

  //data
  const labelVariable = params["category"];
  const valueVariable = params["value"];
  const groupVariable = params["group-by"] ? params["group-by"] : "none";


  //axes
  const axes = [
    {
      scale: "x",
      orient: params["xaxis-placement"],
      domainColor: "var(--togostanza-axis-color)",
      domainWidth: css("--togostanza-axis-width"),
      grid: params["xgrid"] === "true",
      gridColor: "var(--togostanza-grid-color)",
      gridDash: css("--togostanza-grid-dash-length"),
      gridOpacity: css("--togostanza-grid-opacity"),
      gridWidth: css("--togostanza-grid-width"),
      ticks: params["xtick"] === "true",
      tickColor: "var(--togostanza-tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--togostanza-tick-width"),
      title:
        params["category-title"] === ""
          ? labelVariable
          : params["category-title"],
      titleColor: "var(--togostanza-title-font-color)",
      titleFont: css("--togostanza-font-family"),
      titleFontSize: css("--togostanza-title-font-size"),
      titleFontWeight: css("--togostanza-title-font-weight"),
      titlePadding: params["xtitle-padding"],
      labelPadding: params["xlabel-padding"],
      zindex: 1,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            fill: { value: "var(--togostanza-label-font-color)" },
            font: { value: css("--togostanza-font-family") },
            fontSize: { value: css("--togostanza-label-font-size") },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-placement"],
      domainColor: "var(--togostanza-axis-color)",
      domainWidth: css("--togostanza-axis-width"),
      grid: params["ygrid"] === "true",
      gridColor: "var(--togostanza-grid-color)",
      gridDash: css("--togostanza-grid-dash-length"),
      gridOpacity: css("--togostanza-grid-opacity"),
      gridWidth: css("--togostanza-grid-width"),
      ticks: params["ytick"] === "true",
      // tickCount: params["ytick-count"],
      tickColor: "var(--togostanza-tick-color)",
      tickSize: css("--togostanza-tick-length"),
      tickWidth: css("--togostanza-tick-width"),
      title:
        params["value-title"] === "" ? valueVariable : params["value-title"],
      titleColor: "var(--togostanza-title-font-color)",
      titleFont: css("--togostanza-font-family"),
      titleFontSize: css("--togostanza-title-font-size"),
      titleFontWeight: css("--togostanza-title-font-weight"),
      titlePadding: params["ytitle-padding"],
      labelPadding: params["ylabel-padding"],
      zindex: 0,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
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
        params["legend-title"] === "" ? groupVariable : params["legend-title"],
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

  const encoding =
  {
    "y": { "field": labelVariable, "type": "nominal" },
    "x": { "field": valueVariable, "type": "ordinal" },
    "color": { "aggregate": "mean", "field": "Horsepower" }
  }

  const config = {
    "axis": { "grid": true, "tickBand": "extent" }
  }


  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width,
    height,
    padding,
    data: { 'url': params["data-url"] },
    axes,
    legends,
    mark,
    encoding,
    config,
  };


  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
