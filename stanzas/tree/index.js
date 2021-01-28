import vegaEmbed from "vega-embed";

export default async function tree(stanza, params) {
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
  const labelVariable = params["label-variable"]; //"name"
  const valueVariable = params["value-variable"]; //"size"
  const parentVariable = params["parent-variable"]; //"parent"
  const idVariable = params["id-variable"]; //"id-variable"

  spec.data = [
    {
      name: "tree",
      url: params["your-data"],
      transform: [
        {
          type: "stratify",
          key: idVariable,
          parentKey: parentVariable,
        },
        {
          type: "tree",
          method: { signal: "layout" },
          size: [{ signal: "height" }, { signal: "width - 100" }],
          separation: { signal: "separation" },
          as: ["y", "x", "depth", "children"],
        },
      ],
    },
    {
      name: "links",
      source: "tree",
      transform: [
        { type: "treelinks" },
        {
          type: "linkpath",
          orient: "horizontal",
          shape: { signal: "links" },
        },
      ],
    },
  ];

  //scales
  spec.scales = [
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
      domain: { data: "tree", field: "depth" },
      zero: true,
    },
  ];

  //legend
  spec.legends = [
    {
      fill: "color",
      title: params["legend-title"],
      titleColor: "var(--legendtitle-color)",
      labelColor: "var(--legendlabel-color)",
      orient: "top-left",
      encode: {
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legend-font"
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
        symbols: {
          update: {
            shape: { value: params["symbol-shape"] },
            stroke: { value: "var(--stroke-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--stroke-width"
              ),
            },
            opacity: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--opacity"
              ),
            },
          },
        },
      },
    },
  ];

  //marks
  spec.marks = [
    {
      type: "path",
      from: { data: "links" },
      encode: {
        update: {
          path: { field: "path" },
          stroke: { value: "var(--branch-color)" },
        },
        hover: {
          stroke: { value: "var(--emphasized-color)" },
        },
      },
    },
    {
      type: "symbol",
      from: { data: "tree" },
      encode: {
        enter: {
          size: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--node-size"
            ),
          },
          stroke: { value: "var(--stroke-color)" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          fill: { scale: "color", field: "depth" },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--stroke-width"
            ),
          },
        },
        hover: {
          fill: { value: "var(--emphasized-color)" },
          stroke: { value: "var(--hover-stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--hover-stroke-width"
            ),
          },
        },
      },
    },
    {
      type: "text",
      from: { data: "tree" },
      encode: {
        enter: {
          text: { field: labelVariable },
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
          baseline: { value: "middle" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          dx: { signal: "datum.children ? -7 : 7" },
          align: { signal: "datum.children ? 'right' : 'left'" },
          opacity: { signal: "labels ? 1 : 0" },
          fill: { value: "var(--label-color)" },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--stroke-width"
            ),
          },
        },
        hover: {
          fill: { value: "var(--emphasized-color)" },
          // "stroke": {"value": "var(--hover-stroke-color)"},
          // "strokeWidth": {"value": "0.5"}
          // "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-stroke-width")}
        },
      },
    },
  ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
