import Stanza from "togostanza/stanza";
import vegaEmbed from "vega-embed";
import loadData from "@/lib/load-data";

const areas = new Map([
  [
    "us",
    [
      {
        name: "us-counties",
        url: "https://vega.github.io/vega/data/us-10m.json",
        format: { type: "topojson", feature: "counties" },
        transform: [
          {
            type: "lookup",
            from: "userData",
            key: "id",
            fields: ["id"],
            values: ["rate"],
          },
          { type: "filter", expr: "datum.rate != null" },
        ],
      },
    ],
  ],
  [
    "world",
    [
      {
        name: "world",
        url: "data/world-110m.json",
        format: {
          type: "topojson",
          feature: "countries",
        },
      },
      {
        name: "graticule",
        transform: [{ type: "graticule" }],
      },
    ],
  ],
]);
export default class regionGeographicMap extends Stanza {
  async render() {
    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
        const arr = [];
    // console.log(vegaJson);
    const valObj = {
      name: "userData",
      url: this.params["data-url"],
      format: { type: this.params["data-type"], parse: "auto" },
    };

    arr.push(valObj);

    for (const obj of areas.get(this.params["area"])) {
      // console.log("obj");
      // console.log(obj);
      arr.push(obj);
    }
    // console.log("arr");
    // console.log(arr);

    const data = arr;
    // const data = areas.get(this.params["area"]);
    // console.log(areas.get(this.params["area"]));
    // console.log(values);
    // console.log(data);

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

    const colorRange = colorRangeMax.slice(
      0,
      Number(this.params["group-amount"])
    );

    const scales = [
      {
        name: "userColor",
        type: "quantize",
        domain: [0, 0.15],
        range: colorRange,
      },
    ];

    const legends = [
      {
        fill: "userColor",
        orient: this.params["legend-orient"],
        title: this.params["legend-title"],
        titleColor: "var(--togostanza-title-font-color)",
        titleFont: "var(--togostanza-font-family)",
        titleFontWeight: "var(--togostanza-title-font-weight)",
        format: "0.1%",
      },
    ];

    const marks = [
      {
        type: "shape",
        from: { data: "us-counties" },
        encode: {
          enter: { tooltip: { signal: "format(datum.rate, '0.1%')" } },
          hover: {
            fill: { value: "var(--togostanza-hover-color)" },
          },
          update: {
            fill: { scale: "userColor", field: "rate" },
            stroke: this.params["border"]
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
      data,
      projections,
      scales,
      legends: this.params["legend"] ? legends : [],
      marks,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);
  }
}
