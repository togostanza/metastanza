import { stratify } from "d3";
import vegaEmbed from "vega-embed";

export default async function barchart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url = params["your-data"];

  //height, width, padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];
  // spec.padding = getComputedStyle(stanza.root.host).getPropertyValue("--padding");

  //scales
  spec.scales[0].paddingInner = 0.1;
  spec.scales[0].paddingOuter = 0.4;
  // spec.scales[0].paddingInner = getComputedStyle(stanza.root.host).getPropertyValue("--title-padding");
  // spec.scales[0].paddingOuter = getComputedStyle(stanza.root.host).getPropertyValue("--title-padding");

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

  spec.title = {
    text: params["figuretitle"], //"Title of this figure",
    orient: "bottom",
    // orient: getComputedStyle(stanza.root.host).getPropertyValue(
    //   "--figuretitle-orient"
    // ),
    anchor: "middle",
    // anchor: getComputedStyle(stanza.root.host).getPropertyValue(
    //   "--figuretitle-anchor"
    // ),
    color: getComputedStyle(stanza.root.host).getPropertyValue("--label-color"),
    // dx:
    //   getComputedStyle(stanza.root.host).getPropertyValue(
    //     "--figuretitle-horizonal-offset"
    //   ) - 0,
    // dy:
    //   getComputedStyle(stanza.root.host).getPropertyValue(
    //     "--figuretitle-vertical-offset"
    //   ) - 0,
    font: getComputedStyle(stanza.root.host).getPropertyValue("--label-font"),
    fontSize: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-font-size"
    ),
    fontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-font-weight"
    ),
  };

  //rect（棒）の描画について
  spec.marks[0] = {
    type: "rect",
    from: { data: "table" },
    encode: {
      enter: {
        x: { scale: "xscale", field: "category" },
        width: { scale: "xscale", band: params["bar-width"] },
        y: { scale: "yscale", field: "amount" },
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
      x: { scale: "xscale", signal: "tooltip.category", band: 0.5 },
      y: { scale: "yscale", signal: "tooltip.amount", offset: -1 },
      text: { signal: "tooltip.amount" },
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
