import vegaEmbed from "vega-embed";

export default async function devGroupedBarchart(stanza, params) {
  const spec = await fetch(
    "https://vega.github.io/vega/examples/grouped-bar-chart.vg.json"
  ).then((res) => res.json());

  // width,hight,padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];

  const labelVariable = params["category"]; //category
  const valueVariable = params["value"]; //value
  const groupVariable = params["group"]; //position?

  spec.data = [
    {
      name: "table",
      url: params["your-data"],
    },
  ];

  //scales
  spec.scales = [
    {
      name: "yscale",
      type: "band",
      domain: { data: "table", field: labelVariable },
      range: "height",
      padding: 0.2,
    },
    {
      name: "xscale",
      type: "linear",
      domain: { data: "table", field: valueVariable },
      range: "width",
      round: true,
      zero: true,
      nice: true,
    },
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
    },
  ];

  spec.scales[0].paddingInner = 0.1;
  spec.scales[0].paddingOuter = 0.4;

  //axes
  spec.axes = [
    {
      scale: "yscale",
      orient: params["yaxis-placement"],
      domainColor: "var(--axis-color)",
      domainWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--axis-width"
      ),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash-length"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      // tickCount: params["ytick-count"],
      tickColor: "var(--tick-color)",
      tickSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-size"
      ),
      tickWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--tick-width"
      ),
      title: labelVariable,
      titleColor: "var(--title-font-color)",
      titleFont: getComputedStyle(stanza.root.host).getPropertyValue(
        "--font-family"
      ),
      titleFontSize: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-font-size"
      ),
      titleFontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
        "--title-width"
      ),
      titlePadding: Number(
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
      ),
      labelPadding: 4,
      zindex: 1,
      ticks: params["ytick"] === "true",
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
            fill: { value: "var(--label-font-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--font-family"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font-size"
              ),
            },
          },
        },
        domain: {
          update: {
            stroke: { value: "var(--axis-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--axis-width"
              ),
            },
          },
        },
      },
    },
    {
      scale: "xscale",
      orient: params["xaxis-placement"],
      title: valueVariable,
      titleColor: "var(--title-font-color)",
      titlePadding: Number(
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")
      ),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash-length"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      ticks: params["xtick"] === "true",
      encode: {
        ticks: {
          update: {
            stroke: { value: "var(--tick-color)" },
          },
        },
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            fill: { value: "var(--label-font-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--font-family"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font-size"
              ),
            },
          },
        },
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--font-family"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-font-size"
              ),
            },
            fontWeight: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-font-weight"
              ),
            },
          },
        },
        domain: {
          update: {
            stroke: { value: "var(--axis-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--axis-width"
              ),
            },
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
      legendX: 840,
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
        "--legend-font-size"
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
            },
          },
          update: {
            fill: { value: "var(--series-0-color)" },
            stroke: { value: "var(--stroke-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--stroke-width"
              ),
            },
          },
        },
        {
          type: "text",
          from: { data: "bars" },
          encode: {
            enter: {
              x: { field: "x2", offset: -5 },
              y: { field: "y", offset: { field: "height", mult: 0.5 } },
              fill: [
                {
                  test:
                    "contrast('white', datum.fill) > contrast('black', datum.fill)",
                  value: "white",
                },
                { value: "black" },
              ],
              align: { value: "right" },
              baseline: { value: "middle" },
              // text: {field: `datum[${valueVariable}]`}
            },
          },
        },
      ],
    },
  ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
