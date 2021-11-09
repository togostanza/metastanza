import Stanza from "togostanza/stanza";
import vegaEmbed from "vega-embed";

export default class heatmapGeographicMap extends Stanza {
  async render() {
    const spec = await fetch(
      "https://vega.github.io/vega/examples/annual-precipitation.vg.json"
    ).then((res) => res.json());

    spec.width = this.params["width"]; //metadata.jsにパラメータを定義
    spec.height = this.params["height"];

    spec.data = [
      {
        name: "precipitation",
        url: "https://vega.github.io/vega/data/annual-precip.json", //一時的にVegaのデータを使用
      },
      {
        name: "contours",
        source: "precipitation",
        transform: [
          {
            type: "isocontour",
            thresholds: { signal: "sequence(step, stop, step)" },
          },
        ],
      },
      {
        name: "world",
        url: "https://vega.github.io/vega/data/world-110m.json", //一時的にVegaのデータを使用
        format: { type: "topojson", feature: "countries" },
      },
    ];

    spec.projections = [
      {
        name: "projection",
        type: { signal: "projection" },
        scale: { signal: "scale" },
        rotate: { signal: "[rotate0, rotate1, rotate2]" },
        translate: { signal: "[width/2, height/2]" },
      },
    ];

    (spec.scales = [
      {
        name: "color",
        type: "quantize",
        domain: { signal: "[0, stop]" },
        range: { scheme: "bluepurple", count: { signal: "levels" } },
      },
    ]),
      (spec.marks = [
        {
          type: "shape",
          clip: true,
          from: { data: "world" },
          encode: {
            update: {
              strokeWidth: { value: 1 },
              stroke: { value: "var(--togostanza-map-border-color)" },
              fill: { value: "var(--togostanza-map-color)" },
            },
          },
          transform: [
            {
              type: "geoshape",
              projection: "projection",
            },
          ],
        },
        {
          type: "shape",
          clip: true,
          from: { data: "contours" },
          encode: {
            update: {
              fill: { scale: "color", field: "contour.value" },
              fillOpacity: { signal: "opacity" },
            },
          },
          transform: [
            {
              type: "geoshape",
              field: "datum.contour",
              projection: "projection",
            },
          ],
        },
      ]);

    spec.legends = [
      {
        title: "Annual Precipitation (mm)",
        fill: "color",
        orient: "bottom",
        offset: 5,
        type: "gradient",
        gradientLength: 300,
        gradientThickness: 12,
        titlePadding: 10,
        titleOrient: "left",
        titleAnchor: "end",
        direction: "horizontal",
      },
    ];

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);
  }
}
