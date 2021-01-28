// import { stratify } from "d3";
import vegaEmbed from "vega-embed";

export default async function barchart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  //height,width,padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];
  // spec.padding = getComputedStyle(stanza.root.host).getPropertyValue("--padding");

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];

  spec.data = [
    {
      name: "table",
      url: params["your-data"],
    },
  ];

  //scales
  spec.scales = [
    {
      name: "xscale",
      type: "band",
      domain: { data: "table", field: labelVariable },
      range: "width",
      padding: 0.05,
      // paddingInner:
      //   getComputedStyle(stanza.root.host).getPropertyValue("--padding-inner") -
      //   0,
      // paddingOuter:
      //   getComputedStyle(stanza.root.host).getPropertyValue("--padding-outer") -
      //   0,
      paddingInner: 0.1,
      paddingOuter: 0.4,
      round: true,
    },
    {
      name: "yscale",
      domain: { data: "table", field: valueVariable },
      nice: true,
      range: "height",
    },
  ];

  //axis
  spec.axes[0] = {
    scale: "xscale",
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
    zindex: 1,
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
    scale: "yscale",
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
        x: { scale: "xscale", field: labelVariable },
        width: { scale: "xscale", band: params["bar-width"] },
        y: { scale: "yscale", field: valueVariable },
        y2: { scale: "yscale", value: 0 },
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
      hover: {
        fill: { value: "var(--emphasized-color)" },
      },
    },
  };

  spec.marks[1].encode = {
    enter: {
      align: { value: "center" },
      baseline: { value: "bottom" },
      fill: { value: "var(--emphasized-color)" },
      font: {
        value: getComputedStyle(stanza.root.host).getPropertyValue(
          "--label-font"
        ),
      },
      fontSize: {
        value: getComputedStyle(stanza.root.host).getPropertyValue(
          "--fontsize-value"
        ),
      },
      fontWeight: {
        value: getComputedStyle(stanza.root.host).getPropertyValue(
          "--fontweight-of-value"
        ),
      },
    },
    update: {
      x: { scale: "xscale", signal: `tooltip.${labelVariable}`, band: 0.5 },
      y: { scale: "yscale", signal: `tooltip.${valueVariable}`, offset: -1 },
      text: { signal: `tooltip.${valueVariable}` },
      fillOpacity: [{ test: "datum === tooltip", value: 0 }, { value: 1 }],
    },
  };
  // spec.marks[0].encode.update.fill.value = "var(--bar-color)"
  // spec.marks[0].encode.hover.fill.value = "var(--emphasized-color)"
  // spec.marks[1].encode.enter.fill.value = "var(--emphasized-color)"
  // spec.marks[1].encode.enter.fontSize = {value: params["fontsize-of-value"]}
  // spec.marks[1].encode.enter.fontWeight = {value: params["fontweight-of-value"]}

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
