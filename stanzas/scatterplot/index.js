import vegaEmbed from "vega-embed";
import loadData from "@/lib/load-data";
import { appendDlButton } from "@/lib/metastanza_utils.js";

export default async function scatterplot(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  //width,height,padding
  const width = Number(params["width"]);
  const height = Number(params["height"]);
  const padding = Number(params["padding"]);

  const xVariable = params["x"];
  const yVariable = params["y"];
  const zVariable = params["z"] ? params["z"] : "none";

  const values = await loadData(params["data-url"], params["data-type"]);

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
      orient: params["xaxis-placement"],
      domain: true,
      domainColor: "var(--togostanza-axis-color)",
      domainWidth: css("--togostanza-axis-width"),
      grid: params["xgrid"] === "true",
      gridColor: "var(--togostanza-grid-color)",
      gridDash: css("--togostanza-grid-dash-length"),
      gridOpacity: css("--togostanza-grid-opacity"),
      gridWidth: css("--togostanza-grid-width"),
      ticks: params["xtick"] === "true",
      // tickCount: params["xtick-count"],
      tickColor: "var(--togostanza-tick-color)",
      tickSize: css("--togostanza-tick-length"),
      tickWidth: css("--togostanza-tick-width"),
      title: params["x-title"] === "" ? xVariable : params["x-title"],
      titleColor: "var(--togostanza-title-font-color)",
      titleFont: css("--togostanza-font-family"),
      titleFontSize: css("--togostanza-title-font-size"),
      titleFontWeight: css("--togostanza-title-font-weight"),
      titlePadding: params["xtitle-padding"],
      labelPadding: params["xlabel-padding"],
      zindex: 0,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
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
      orient: params["yaxis-placement"],
      domain: true,
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
      title: params["y-title"] === "" ? yVariable : params["y-title"],
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
      title: params["legend-title"] === "" ? zVariable : params["legend-title"],
      titleColor: "var(--togostanza-title-font-color)",
      titleFont: css("--togostanza-font-family"),
      titleFontSize: css("--togostanza-title-font-size"),
      titleFontWeight: css("--togostanza-title-font-weight"),
      labelColor: "var(--togostanza-label-font-color)",
      labelFont: css("--togostanza-font-family"),
      labelFontSize: css("--togostanza-label-font-size"),
      symbolType: params["symbol-shape"],
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
          shape: { value: params["symbol-shape"] },
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
      zVariable === "none" || params["legend"] === "false" ? [] : legends,
    marks,
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector("svg"),
    "threevariable-scatter-plot",
    stanza
  );

  const menuButton = stanza.root.querySelector("#dl_button");
  const menuList = stanza.root.querySelector("#dl_list");
  switch (params["metastanza-menu-placement"]) {
    case "top-left":
      menuButton.setAttribute("class", "dl-top-left");
      menuList.setAttribute("class", "dl-top-left");
      break;
    case "top-right":
      menuButton.setAttribute("class", "dl-top-right");
      menuList.setAttribute("class", "dl-top-right");
      break;
    case "bottom-left":
      menuButton.setAttribute("class", "dl-bottom-left");
      menuList.setAttribute("class", "dl-bottom-left");
      break;
    case "bottom-right":
      menuButton.setAttribute("class", "dl-bottom-right");
      menuList.setAttribute("class", "dl-bottom-right");
      break;
    case "none":
      menuButton.setAttribute("class", "dl-none");
      menuList.setAttribute("class", "dl-none");
      break;
  }
}
