// import { key } from "vega";
import vegaEmbed from "vega-embed";

export default async function piechart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  //width・height・padding
  // spec.width = params["width"]
  // spec.height = params["height"]
  // spec.autosize = params["autosize"]
  spec.padding = { left: 5, top: 5, right: 150, bottom: 30 };

  //innerpadding
  spec.signals[2].value = params["inner-padding-angle"];
  spec.signals[3].value = params["inner-radius"];

  //delete default controller
  for (const signal of spec.signals) {
    delete signal.bind;
  }

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];

  spec.data[0] = {
    name: "table",
    url: params["your-data"],
    transform: [
      {
        type: "pie",
        field: valueVariable,
        startAngle: { signal: "startAngle" },
        endAngle: { signal: "endAngle" },
        sort: { signal: "sort" },
      },
    ],
  };

  // scales(color scheme)
  spec.scales = [
    {
      name: "color",
      type: "ordinal",
      domain: { data: "table", field: labelVariable },
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

  spec.marks[0].encode = {
    enter: {
      fill: { scale: "color", field: labelVariable },
      x: { signal: "width / 2" },
      y: { signal: "height / 2" },
    },
    update: {
      startAngle: { field: "startAngle" },
      endAngle: { field: "endAngle" },
      padAngle: { signal: "padAngle" },
      innerRadius: { signal: "innerRadius" },
      outerRadius: { signal: "width / 2" },
      cornerRadius: { signal: "cornerRadius" },
      fill: { scale: "color", field: labelVariable },
      stroke: { value: "var(--stroke-color)" },
      strokeWidth: { value: "var(--stroke-width)" },
    },
    hover: {
      fill: { value: "var(--emphasized-color)" },
      stroke: { value: "var(--hover-stroke-color)" },
      strokeWidth: { value: "var(--hover-stroke-width)" },
    },
  };

  //legend
  spec.legends = [
    {
      fill: "color",
      orient: "none",
      legendX: "220",
      legendY: "5",
      title: params["legend-title"],
      titleColor: "var(--legendtitle-color)",
      labelColor: "var(--legendlabel-color)",
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

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
