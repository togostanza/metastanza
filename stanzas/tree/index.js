import vegaEmbed from "vega-embed";

export default async function tree(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url = "https://vega.github.io/vega/data/flare.json";

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"];
  spec.height = params["height"];

  //stanzaのpadding
  spec.padding = params["padding"];

  //scales: カラースキームを指定
  spec.scales[0].type = "ordinal";

  spec.scales[0].range = [
    "var(--series-0-color)",
    "var(--series-1-color)",
    "var(--series-2-color)",
    "var(--series-3-color)",
    "var(--series-4-color)",
    "var(--series-5-color)",
  ];

  //legendを出す
  spec.legends = [
    {
      fill: "color",
      title: params["legend-title"],
      titleColor: "var(--legendtitle-color)",
      labelColor: "var(--legendlabel-color)",
      orient: "top--left",
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

  spec.title = {
    text: params["figuretitle"], //"Title of this figure",
    orient: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-orient"
    ),
    anchor: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-anchor"
    ),
    color: getComputedStyle(stanza.root.host).getPropertyValue("--label-color"),
    dx:
      getComputedStyle(stanza.root.host).getPropertyValue(
        "--tree-figuretitle-horizonal-offset"
      ) - 0,
    dy:
      getComputedStyle(stanza.root.host).getPropertyValue(
        "--tree-figuretitle-vertical-offset"
      ) - 0,
    font: getComputedStyle(stanza.root.host).getPropertyValue("--label-font"),
    fontSize: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-font-size"
    ),
    fontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-font-weight"
    ),
  };

  //marks:描画について

  //（デフォルトのコントローラを削除）
  for (const signal of spec.signals) {
    delete signal.bind;
  }

  spec.marks[0].encode = {
    update: {
      path: { field: "path" },
      stroke: { value: "var(--branch-color)" },
    },
    hover: {
      stroke: { value: "var(--emphasized-color)" },
    },
  };

  spec.marks[1].encode = {
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
  };

  spec.marks[2].encode = {
    enter: {
      text: { field: "name" },
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
      // stroke: {"value": "var(--stroke-color)"},
      stroke: { value: "red" },
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
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
