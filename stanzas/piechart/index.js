import vegaEmbed from "vega-embed";

export default async function piechart(stanza, params) {
  const spec = await fetch("https://vega.github.io/vega/examples/pie-chart.vg.json").then((res) => res.json());

  //width・height・padding
  // spec.width = params["width"]
  // spec.height = params["height"]
  // spec.autosize = params["autosize"]
  spec.padding = { left: 5, top: 5, right: 150, bottom: 30 };

  //delete default controller
  for (const signal of spec.signals) {
    delete signal.bind;
  }

  //innerpadding
  spec.signals[2].value = params["inner-padding-angle"];
  spec.signals[3].value = params["inner-radius"];

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];

  spec.data = [
    {
      name: "table",
      url: params["your-data"],
      // values: [
      //   { id: 1, field: 4 },
      //   { id: 2, field: 6 },
      //   { id: 3, field: 10 },
      //   { id: 4, field: 3 },
      //   { id: 5, field: 7 },
      //   { id: 6, field: 8 },
      // ],
      transform: [
        {
          type: "pie",
          field: valueVariable,
          startAngle: { signal: "startAngle" },
          endAngle: { signal: "endAngle" },
          sort: { signal: "sort" },
        },
      ],
    },
  ];

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

  //legend
  spec.legends = [
    {
      fill: "color",
      orient: "none",
      legendX: "220",
      legendY: "5",
      title: labelVariable,
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
      symbolType: params["symbol-shape"],
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
      type: "arc",
      from: { data: "table" },
      encode: {
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
      },
    },
  ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}