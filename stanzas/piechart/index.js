import vegaEmbed from "vega-embed";

export default async function piechart(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  const vegaJson = await fetch(
    "https://vega.github.io/vega/examples/pie-chart.vg.json"
  ).then((res) => res.json());

  //width,height,padding
  const width = Number(params["width"]);
  const height = Number(params["height"]);
  const padding = { left: 5, top: 5, right: 150, bottom: 30 };

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];
  const data = [
    {
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
    },
  ];

  // scales(color scheme)
  const scales = [
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
  const legends = [
    {
      fill: "color",
      orient: "none",
      legendX: "220",
      legendY: "5",
      title: labelVariable,
      titleColor: "var(--legendtitle-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--legendtitle-size"),
      titleFontWeight: css("--legendtitle-weight"),
      labelColor: "var(--legendlabel-color)",
      labelFont: css("--font-family"),
      labelFontSize: css("--legendlabel-size"),
      symbolType: params["symbol-shape"],
      symbolStrokeColor: css("--stroke-color"),
      symbolStrokeWidth: css("--stroke-width"),
    },
  ];

  //marks
  const marks = [
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

  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width,
    height,
    padding,
    autosize: "none",
    signals: vegaJson.signals,
    data,
    scales,
    legends,
    marks,
  };

  //delete default controller
  for (const signal of vegaJson.signals) {
    delete signal.bind;
  }

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
