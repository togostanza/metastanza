import vegaEmbed from "vega-embed";

export default async function stackedBarchart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  //width、height、padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = getComputedStyle(stanza.root.host).getPropertyValue(
    "--padding"
  );

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
          // "sort": {"field": groupVariable},
        },
      ],
    },
  ];

  console.log(spec.data[0].value);

  //scales
  spec.scales = [
    {
      name: "x",
      type: "band",
      range: "width",
      domain: { data: "table", field: labelVariable },
      // "domain": ["Evidence at protein level", "Evidence at transcript level", "Inferred from homology","Predicted", "Uncertain"]
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

  spec.scales[0].paddingInner = 0.1;
  spec.scales[0].paddingOuter = 0.5;

  //axis
  spec.axes[0] = {
    scale: "x",
    orient: params["xaxis-orient"],
    title: params["xaxis-title"],
    titleColor: "var(--title-color)",
    titlePadding:
      getComputedStyle(stanza.root.host).getPropertyValue("--title-padding") -
      0,
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
    encode: {
      axis: {
        update: {},
      },
      ticks: {
        update: {
          stroke: { value: "var(--tick-color)" },
        },
      },
      grids: {
        update: {
          zindex: { value: 0 },
        },
      },
      labels: {
        interactive: true,
        update: {
          angle: { value: params["xlabel-angle"] },
          fill: { value: "var(--label-color)" },
          font: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--label-font"
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
      title: {
        update: {
          font: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--label-font"
            ),
          },
          fontSize: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--title-size"
            ),
          },
          fontWeight: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--title-weight"
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
          zindex: { value: "1" },
        },
      },
    },
  };

  spec.axes[1] = {
    scale: "y",
    orient: params["yaxis-orient"],
    title: params["yaxis-title"],
    titleColor: "var(--title-color)",
    titlePadding:
      getComputedStyle(stanza.root.host).getPropertyValue("--title-padding") -
      0,
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
    encode: {
      axis: {
        update: {},
      },
      ticks: {
        update: {
          stroke: { value: "var(--tick-color)" },
        },
      },
      grids: {
        update: {
          zindex: { value: "0" },
        },
      },
      labels: {
        interactive: true,
        update: {
          angle: { value: params["ylabel-angle"] },
          fill: { value: "var(--label-color)" },
          font: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--label-font"
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
      title: {
        update: {
          font: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--label-font"
            ),
          },
          fontSize: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--title-size"
            ),
          },
          fontWeight: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--title-weight"
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
  };

  //marks
  spec.marks[0] = {
    type: "rect",
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
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
