import vegaEmbed from "vega-embed";
import loadData from "@/lib/load-data";
import { appendDlButton } from "@/lib/metastanza_utils.js";

export default async function linechart(stanza, params) {
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
  const labelVariable = params["category"];
  const valueVariable = params["value"];
  const groupVariable = params["group"];

  const values = await loadData(params["data-url"], params["data-type"]);

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
      orient: params["xaxis-placement"],
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
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title:
        params["category-title"] === ""
          ? labelVariable
          : params["category-title"],
      titleColor: "var(--title-font-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-font-size"),
      titleFontWeight: css("--title-font-weight"),
      titlePadding: params["xtitle-padding"],
      labelPadding: params["xlabel-padding"],
      zindex: 1,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            fill: { value: "var(--label-font-color)" },
            font: { value: css("--font-family") },
            fontSize: { value: css("--label-font-size") },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-placement"],
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
      title:
        params["value-title"] === "" ? valueVariable : params["value-title"],
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
            font: { value: css("--font-family") },
            fontSize: { value: css("--label-font-size") },
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
      titleColor: "var(--title-font-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-font-size"),
      titleFontWeight: css("--title-font-weight"),
      labelColor: "var(--label-font-color)",
      labelFont: css("--font-family"),
      labelFontSize: css("--legend-font-size"),
      symbolStrokeColor: css("--border-color"),
      symbolStrokeWidth: css("--border-width"),
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
    legends: params["legend"] === "false" ? [] : legends,
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

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector("svg"),
    "piechart",
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
