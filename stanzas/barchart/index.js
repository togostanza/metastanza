// import { stratify } from "d3";
// import { nice } from "d3";
import { json } from "d3";
import vegaEmbed from "vega-embed";
import stackedBarJson from "./stacked.json";
import groupedBarJson from "./grouped.json";

export default async function barchart(stanza, params) {
  const chartType = params["chart-type"];

  function selectChartType(json){
    switch(chartType){
      case "stacked":
        json = Object.values(stackedBarJson)[0];
        break;
        case "grouped":
          json = Object.values(groupedBarJson)[0];
          break;
        }
    console.log(json);
    return json
  }
  let spec = await selectChartType();

  //width,height,padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];
  const groupVariable = params["group-variable"];

  spec.data = [
    {
      name: "table",
      url: params["your-data"],
      transform: [
        {
          type: "stack",
          field: valueVariable,
          groupby: [labelVariable],
          sort: {field: groupVariable}
        },
      ],
    },
  ];

  // spec.data[0].name = "table";
  // spec.data[0].url = params["your-data"];
  // spec.data[0].transform[0].field = valueVariable;
  // spec.data[0].transform[0].groupby = labelVariable;
  // spec.data[0].transform[0].sort = groupVariable;

  //scales
  spec.scales = [
    {
      name: "x",
      type: "band",
      range: "width",
      domain: { data: "table", field: labelVariable },
      // "domain": ["Evidence at protein level", "Evidence at transcript level", "Inferred from homology","Predicted", "Uncertain"]
      paddingInner: params["padding-inner"],
      paddingOuter: params["padding-outer"],
    },
    {
      name: "y",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: { data: "table", field: "y1" },
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
  spec.axes = [
    {
      scale: "x",
      orient: params["xaxis-orient"],
      domainColor: "var(--axis-color)",
      domainWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--axis-width"
      ),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      ticks: params["xtick"] === "true",
      // tickCount: params["xtick-count"],
      tickColor: "var(--tick-color)",
      tickSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-size"
      ),
      tickWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-width"
      ),
      title: labelVariable,
      titleColor: "var(--title-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-weight"
      ),
      titlePadding: Number(
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
      ),
      zindex: 1,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            dx: { value: params["xlabel-horizonal-offset"] },
            dy: { value: params["xlabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--font-family"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-size"
              ),
            },
            // limit: 1
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          },
        },
      },
    },
    {
      scale: "y",
      orient: params["yaxis-orient"],
      domainColor: "var(--axis-color)",
      domainWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--axis-width"
      ),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      ticks: params["ytick"] === "true",
      // tickCount: params["ytick-count"],
      tickColor: "var(--tick-color)",
      tickSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-size"
      ),
      tickWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-width"
      ),
      title: valueVariable,
      titleColor: "var(--title-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-weight"
      ),
      titlePadding: Number(
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
      ),
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
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--font-family"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-size"
              ),
            },
            // limit: 1
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          },
        },
      },
    },
  ];

  // legend
  spec.legends = [
    {
      fill: "color",
      orient: "none",
      legendX: 440,
      legendY: "0",
      title: groupVariable,
      titleColor: "var(--legendtitle-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--legendtitle-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--legendtitle-weight"
      ),
      labelColor: "var(--legendlabel-color)",
      labelFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      labelFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--legendlabel-size"
      ),
      symbolStrokeColor: getComputedStyle(stanza.root.host).getPropertyValue(
        "--stroke-color"
      ),
      symbolStrokeWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--stroke-width"
      ),
    },
  ];

  //marks
  spec.marks = [
    {
      type: "group",
      from: { data: "table" },
      encode: {
        enter: {
          x: { scale: "x", field: labelVariable },
          width: { scale: "x", band: params["bar-width"] },
          y: { scale: "y", field: "y0" },
          y2: { scale: "y", field: "y1" },
          fill: { scale: "color", field: groupVariable, offset: -1 },
        },
        update: {
          fill: { scale: "color", field: groupVariable },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--stroke-width"
            ),
          },
        },
        hover: {
          fill: { value: "var(--emphasized-color)" },
        },
      },
    },
  ];

  
  // spec.data = [
  //   {
  //     name: "table",
  //     url: params["your-data"],
  //   },
  // ];

  // //scales
  // spec.scales = [
  //   {
  //     name: "xscale",
  //     type: "band",
  //     range: "width",
  //     domain: { data: "table", field: labelVariable },
  //     padding: 0.05,
  //     paddingInner: params["padding-inner"],
  //     paddingOuter: params["padding-outer"],
  //     round: true,
  //   },
  //   {
  //     name: "yscale",
  //     range: "height",
  //     domain: { data: "table", field: valueVariable },
  //     // nice: true,
  //   },
  // ];

  // //axes
  // spec.axes = [
  //   {
  //     scale: "xscale",
  //     orient: params["xaxis-orient"],
  //     domainColor: "var(--axis-color)",
  //     domainWidth: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--axis-width"
  //     ),
  //     grid: params["xgrid"] === "true",
  //     gridColor: "var(--grid-color)",
  //     gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--grid-dash"
  //     ),
  //     gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--grid-opacity"
  //     ),
  //     gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--grid-weight"
  //     ),
  //     ticks: params["xtick"] === "true",
  //     // tickCount: params["xtick-count"],
  //     tickColor: "var(--tick-color)",
  //     tickSize: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--tick-size"
  //     ),
  //     tickWidth: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--tick-width"
  //     ),
  //     title: labelVariable,
  //     titleColor: "var(--title-color)",
  //     titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--font-family"
  //     ),
  //     titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--title-size"
  //     ),
  //     titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--title-width"
  //     ),
  //     titlePadding: Number(
  //       getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
  //     ),
  //     zindex: 1,
  //     encode: {
  //       labels: {
  //         interactive: true,
  //         update: {
  //           angle: { value: params["xlabel-angle"] },
  //           dx: { value: params["xlabel-horizonal-offset"] },
  //           dy: { value: params["xlabel-vertical-offset"] },
  //           fill: { value: "var(--label-color)" },
  //           font: {
  //             value: getComputedStyle(stanza.root.host).getPropertyValue(
  //               "--font-family"
  //             ),
  //           },
  //           fontSize: {
  //             value: getComputedStyle(stanza.root.host).getPropertyValue(
  //               "--label-size"
  //             ),
  //           },
  //           // limit: 1
  //         },
  //       },
  //     },
  //   },
  //   {
  //     scale: "yscale",
  //     orient: params["yaxis-orient"],
  //     domainColor: "var(--axis-color)",
  //     domainWidth: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--axis-width"
  //     ),
  //     grid: params["ygrid"] === "true",
  //     gridColor: "var(--grid-color)",
  //     gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--grid-dash"
  //     ),
  //     gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--grid-opacity"
  //     ),
  //     gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--grid-width"
  //     ),
  //     ticks: params["ytick"] === "true",
  //     // tickCount: params["ytick-count"],
  //     tickColor: "var(--tick-color)",
  //     tickSize: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--tick-size"
  //     ),
  //     tickWidth: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--tick-width"
  //     ),
  //     title: valueVariable,
  //     titleColor: "var(--title-color)",
  //     titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--font-family"
  //     ),
  //     titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--title-size"
  //     ),
  //     titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
  //       "--title-width"
  //     ),
  //     titlePadding: Number(
  //       getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
  //     ),
  //     encode: {
  //       labels: {
  //         interactive: true,
  //         update: {
  //           angle: { value: params["ylabel-angle"] },
  //           dx: { value: params["ylabel-horizonal-offset"] },
  //           dy: { value: params["ylabel-vertical-offset"] },
  //           fill: { value: "var(--label-color)" },
  //           font: {
  //             value: getComputedStyle(stanza.root.host).getPropertyValue(
  //               "--font-family"
  //             ),
  //           },
  //           fontSize: {
  //             value: getComputedStyle(stanza.root.host).getPropertyValue(
  //               "--label-size"
  //             ),
  //           },
  //           // limit: 1
  //         },
  //       },
  //     },
  //   },
  // ];

  // //marks
  // spec.marks = [
  //   {
  //     type: "rect",
  //     from: { data: "table" },
  //     encode: {
  //       enter: {
  //         x: { scale: "xscale", field: labelVariable },
  //         width: { scale: "xscale", band: params["bar-width"] },
  //         y: { scale: "yscale", field: valueVariable },
  //         y2: { scale: "yscale", value: 0 },
  //       },
  //       update: {
  //         fill: { value: "var(--series-0-color)" },
  //         stroke: { value: "var(--stroke-color)" },
  //         strokeWidth: {
  //           value: getComputedStyle(stanza.root.host).getPropertyValue(
  //             "--stroke-width"
  //           ),
  //         },
  //       },
  //       hover: {
  //         fill: { value: "var(--emphasized-color)" },
  //       },
  //     },
  //   },
  //   {
  //     type: "text",
  //     encode: {
  //       enter: {
  //         align: { value: "center" },
  //         baseline: { value: "bottom" },
  //         fill: { value: "var(--emphasized-color)" },
  //         font: {
  //           value: getComputedStyle(stanza.root.host).getPropertyValue(
  //             "--font-family"
  //           ),
  //         },
  //       },
  //     },
  //   },
  // ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}