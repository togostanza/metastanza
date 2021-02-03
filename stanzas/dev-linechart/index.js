import vegaEmbed from "vega-embed";

export default async function devLinechart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  //width、height、padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];

  //delete default controller
  for (const signal of spec.signals) {
    delete signal.bind;
  }

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];
  const groupVariable = params["group-variable"];

  spec.data = [
    {
      name: "table",
      url: params["your-data"],
      // values: [
      //   {"x": 0, "y": 28, "c":0}, {"x": 0, "y": 20, "c":1},
      //   {"x": 1, "y": 43, "c":0}, {"x": 1, "y": 35, "c":1},
      //   {"x": 2, "y": 81, "c":0}, {"x": 2, "y": 10, "c":1},
      //   {"x": 3, "y": 19, "c":0}, {"x": 3, "y": 15, "c":1},
      //   {"x": 4, "y": 52, "c":0}, {"x": 4, "y": 48, "c":1},
      //   {"x": 5, "y": 24, "c":0}, {"x": 5, "y": 28, "c":1},
      //   {"x": 6, "y": 87, "c":0}, {"x": 6, "y": 66, "c":1},
      //   {"x": 7, "y": 17, "c":0}, {"x": 7, "y": 27, "c":1},
      //   {"x": 8, "y": 68, "c":0}, {"x": 8, "y": 16, "c":1},
      //   {"x": 9, "y": 49, "c":0}, {"x": 9, "y": 25, "c":1}
      // ]
    },
  ];
  //scale
  spec.scales = [
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
      legendX: 420,
      legendY: -5,
      title: groupVariable,
      titleColor: "var(--legendtitle-color)",
      labelColor: "var(--legendlabel-color)",
      encode: {
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--font-family"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendtitle-size"
              ),
            },
            fontWeight: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendtitle-weight"
              ),
            },
          },
        },
        labels: {
          interactive: true,
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legend-font"
              ),
            },
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
  spec.marks = [
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
                value: getComputedStyle(stanza.root.host).getPropertyValue(
                  "--line-width"
                ),
              },
            },
            update: {
              interpolate: { signal: "interpolate" },
              strokeOpacity: { value: 1 },
              stroke: { scale: "color", field: groupVariable },
            },
            hover: {
              stroke: { value: "var(--emphasized-color)" },
              // strokeOpacity: {value: 0.5}
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
