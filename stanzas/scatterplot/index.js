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
  const zVariable = params["z"];

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
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash-length"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["xtick"] === "true",
      // tickCount: params["xtick-count"],
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-length"),
      tickWidth: css("--tick-width"),
      title: params["x-title"] === "" ? xVariable : params["x-title"],
      titleColor: "var(--title-font-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-font-size"),
      titleFontWeight: css("--title-font-weight"),
      titlePadding: params["xtitle-padding"],
      labelPadding: params["xlabel-padding"],
      zindex: 0,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            fill: { value: "var(--label-font-color)" },
            font: {
              value: css("--font-family"),
            },
            fontSize: {
              value: css("--label-font-size"),
            },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-placement"],
      domain: true,
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash-length"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["ytick"] === "true",
      // tickCount: params["ytick-count"],
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-length"),
      tickWidth: css("--tick-width"),
      title: params["y-title"] === "" ? yVariable : params["y-title"],
      titleColor: "var(--title-font-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-font-size"),
      titleFontWeight: css("--title-font-weight"),
      titlePadding: params["ytitle-padding"],
      labelPadding: params["ylabel-padding"],
      zindex: 0,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
            fill: { value: "var(--label-font-color)" },
            font: {
              value: css("--font-family"),
            },
            fontSize: {
              value: css("--label-font-size"),
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
      title: params["z-title"] === "" ? zVariable : params["z-title"],
      titleColor: "var(--title-font-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-font-size"),
      titleFontWeight: css("--title-font-weight"),
      labelColor: "var(--label-font-color)",
      labelFont: css("--font-family"),
      labelFontSize: css("--legend-font-size"),
      symbolType: params["symbol-shape"],
      symbolFillColor: "var(--series-0-color)",
      symbolStrokeColor: css("--border-color"),
      symbolStrokeWidth: css("--border-width"),
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
          stroke: { value: "var(--border-color)" },
          strokeWidth: {
            value: css("--border-width"),
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
