import Stanza from "togostanza/stanza";
import vegaEmbed from "vega-embed";
import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
} from "togostanza-utils";

const areas = new Map([
  [
    "us",
    {
      name: "map",
      url: "https://vega.github.io/vega/data/us-10m.json",
      format: { type: "topojson", feature: "counties" },
    },
  ],
  [
    "world",
    {
      name: "map",
      url: "https://vega.github.io/vega/data/world-110m.json",
      format: {
        type: "topojson",
        feature: "countries",
      },
    },
  ],
]);
export default class regionGeographicMap extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "region-geographis-map"),
      downloadPngMenuItem(this, "region-geographis-map"),
      downloadJSONMenuItem(this, "region-geographis-map", this._data),
      downloadCSVMenuItem(this, "region-geographis-map", this._data),
      downloadTSVMenuItem(this, "region-geographis-map", this._data),
    ];
  }

  async render() {
    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    const valObj = {
      name: "userData",
      values,
    };

    const transform = [
      {
        type: "lookup",
        from: "userData",
        key: "id",
        fields: ["id"],
        values: [this.params["value-key"]],
      },
    ];

    const obj = areas.get(this.params["area"]);
    obj.transform = transform;
    const data = [valObj, obj];

    const projections = [
      {
        name: "projection",
        type: this.params["area"] === "us" ? "albersUsa" : "mercator",
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
    const val = values.map((val) => val[this.params["value-key"]]);

    const scales = [
      {
        name: "userColor",
        type: "quantize",
        domain: [Math.min(...val), Math.max(...val)],
        range: colorRange,
      },
    ];

    const legends = [
      {
        fill: "userColor",
        orient: this.params["legend-orient"],
        title: this.params["legend-title"],
        format: this.params["percentage"] ? "0.1%" : "",
      },
    ];

    const marks = [
      {
        type: "shape",
        from: { data: "map" },
        encode: {
          enter: {
            tooltip: {
              signal: this.params["percentage"]
                ? `format(datum.${this.params["value-key"]}, '0.1%')`
                : `datum.${this.params["value-key"]}`,
            },
          },
          hover: {
            fill: { value: "var(--togostanza-hover-color)" },
          },
          update: {
            fill: { scale: "userColor", field: this.params["value-key"] },
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
