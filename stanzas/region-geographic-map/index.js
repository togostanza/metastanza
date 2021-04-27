import vegaEmbed, { vega } from "vega-embed";

export default async function regionGeographicMap(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  const vegaJson = await fetch(
    "https://vega.github.io/vega/examples/county-unemployment.vg.json"
  ).then((res) => res.json());

  const data = [
    {
      name: "unemp",
      url: "https://vega.github.io/vega/data/unemployment.tsv",
      format: { type: "tsv", parse: "auto" },
    },
    {
      name: "counties",
      url: "https://vega.github.io/vega/data/us-10m.json",
      format: { type: "topojson", feature: "counties" },
      transform: [
        {
          type: "lookup",
          from: "unemp",
          key: "id",
          fields: ["id"],
          values: ["rate"],
        },
        { type: "filter", expr: "datum.rate != null" },
      ],
    },
  ];

  const projections = [
    {
      name: "projection",
      type: "albersUsa",
    },
  ];

  const colorRangeMax = [
    "var(--togostanza-series-0-color)",
    "var(--togostanza-series-1-color)",
    "var(--togostanza-series-2-color)",
    "var(--togostanza-series-3-color)",
    "var(--togostanza-series-4-color)",
    "var(--togostanza-series-5-color)",
    "var(--togostanza-series-6-color)",
    "var(--togostanza-series-7-color)",
  ];

  const colorRange = 
    colorRangeMax.slice(0, Number(params["group-amount"]));

  const scales = [
    {
      name: "userColor",
      type: "quantize",
      domain: [0, 0.15],
      range: colorRange
    },
  ];

  const legends = [
    {
      fill: "userColor",
      orient: params["legend-orient"],
      title: params["legend-title"],
      titleColor: "var(--togostanza-title-font-color)",
      titleFont: "var(--togostanza-font-family)",
      titleFontWeight: "var(--togostanza-title-font-weight)",
      format: "0.1%",
    },
  ];

  const marks = [
    {
      type: "shape",
      from: { data: "counties" },
      encode: {
        enter: { tooltip: { signal: "format(datum.rate, '0.1%')" } },
        hover: {
          fill: { value: "var(--togostanza-hover-color)" },
        },
        update: {
          fill: { scale: "userColor", field: "rate" },
          stroke: params["border"]
            ? { value: "var(--togostanza-region-border-color)" }
            : "",
        },
      },
      transform: [{ type: "geoshape", projection: "projection" }],
    },
  ];

  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 1000,
    height: 500,
    signals: vegaJson.signals,
    data,
    projections,
    scales,
    legends: params["legend"] ? legends : [],
    marks,
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
