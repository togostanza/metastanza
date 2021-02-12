import vegaEmbed from "vega-embed";
// import stackedBarJson from "./stacked.json";
// import groupedBarJson from "./grouped.json";

export default async function barchart(stanza, params) {
  const chartType = params["chart-type"];

  let spec = {$schema : "https://vega.github.io/schema/vega/v5.json"};
  // switch(chartType){
  //   case "stacked":
  //     spec = Object.values(stackedBarJson)[0];
  //     break;
  //   case "grouped":
  //     spec = Object.values(groupedBarJson)[0];
  //     break;
  // }

  //width,height,padding
  const width = Number(params["width"]);
  const height = Number(params["height"]);
  const padding = Number(params["padding"]);
  spec.width = width;
  spec.height = height;
  spec.padding = padding;

  //data
  const labelVariable = params["label-variable"]; //x
  const valueVariable = params["value-variable"]; //y
  const groupVariable = params["group-variable"]; //z

  //axes
  spec.axes = [
    {
      scale: "xscale",
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
          },
        },
      },
    },
    {
      scale: "yscale",
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
      legendX: width + 40,
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

  spec.scales = [
    {
      name: "color",
      type: "ordinal",
      domain: { data: "table", field: groupVariable },
      range: [
        "var(--series-0-color)",
        "var(--series-1-color)",
        "var(--series-2-color)",
        "var(--series-3-color)",
        "var(--series-4-color)",
        "var(--series-5-color)",
      ],
    }
  ]

  if(chartType === "grouped"){
    spec.data = [
      {
        name: "table",
        url: params["your-data"],
      },
    ];

    //scales
    spec.scales[1] = {
      name: "xscale",
      type: "linear",
      domain: { data: "table", field: valueVariable },
      range: "width",
    }

    spec.scales[2] = {
      name: "yscale",
      type: "band",
      domain: { data: "table", field: labelVariable },
      range: "height",
      padding: 0.2,
      paddingInner: params["padding-inner"],
      paddingOuter: params["padding-outer"],
    }

    //marks
    spec.marks = [
      {
        type: "group",
        from: {
          facet: {
            data: "table",
            name: "facet",
            groupby: labelVariable,
          },
        },
        encode: {
          enter: {
            y: { scale: "yscale", field: labelVariable },
          },
        },
        signals: [{ name: "height", update: "bandwidth('yscale')" }],
        scales: [
          {
            name: "pos",
            type: "band",
            range: "height",
            domain: { data: "facet", field: groupVariable },
          },
        ],
        marks: [
          {
            name: "bars",
            from: { data: "facet" },
            type: "rect",
            encode: {
              enter: {
                y: { scale: "pos", field: groupVariable },
                height: { scale: "pos", band: 1 },
                x: { scale: "xscale", field: valueVariable },
                x2: { scale: "xscale", value: 0 },
                fill: { scale: "color", field: groupVariable },
                stroke: { value: "var(--stroke-color)" },
                strokeWidth: {
                  value: getComputedStyle(stanza.root.host).getPropertyValue(
                    "--stroke-width"
                  ),
                },
              },
            },
          },
        ],
      },
    ];
  } else { //stacked
  spec.data = [
    {
      name: "table",
      url: params["your-data"],
      transform: [
        {
          type: "stack",
          field: valueVariable,
          groupby: [labelVariable],
          sort: {field: groupVariable},
        },
      ],
    },
  ];

    //scales
    spec.scales[1] = {
        name: "xscale",
        type: "band",
        range: "width",
        domain: { data: "table", field: labelVariable },
        // "domain": ["Evidence at protein level", "Evidence at transcript level", "Inferred from homology","Predicted", "Uncertain"]
        paddingInner: params["padding-inner"],
        paddingOuter: params["padding-outer"],
      }

    spec.scales[2] = {
      name: "yscale",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: { data: "table", field: "y1" },
    },

    //marks
    spec.marks = [
      {
        type: "group",
        from: { data: "table" },
        encode: {
          enter: {
            x: { scale: "xscale", field: labelVariable },
            width: { scale: "xscale", band: params["bar-width"] },
            y: { scale: "yscale", field: "y0" },
            y2: { scale: "yscale", field: "y1" },
            fill: { scale: "color", field: groupVariable },
            stroke: { value: "var(--stroke-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--stroke-width"
              ),
            },
          },
        },
      },
    ];
  }

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}