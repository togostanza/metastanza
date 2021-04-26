import vegaEmbed, { vega } from "vega-embed";

export default async function regionGeographicMap(stanza, params) {

  const spec = await fetch("https://vega.github.io/vega/examples/county-unemployment.vg.json").then((res) => res.json());


  spec.width = params["width"]; //metadata.jsにパラメータを定義
  spec.height = params["height"];
  spec.legends = params["legend"];
  

  spec.data = [
    {
      "name": "unemp",
      "url": "https://vega.github.io/vega/data/unemployment.tsv",
      "format": {"type": "tsv", "parse": "auto"}
    },
    {
      "name": "counties",
      "url": "https://vega.github.io/vega/data/us-10m.json",
      "format": {"type": "topojson", "feature": "counties"},
      "transform": [
        { "type": "lookup", "from": "unemp", "key": "id", "fields": ["id"], "values": ["rate"] },
        { "type": "filter", "expr": "datum.rate != null" }
      ]
    }
  ]

  spec.projections = [
    {
      "name": "projection",
      "type": "albersUsa",
      // "scale": {"signal": "scale"},
    }
  ]

  spec.scales =  [
    {
      "name": "color",
      "type": "quantize",
      "domain": [0, 0.15],
      "range": [
        "var(--togostanza-series-0-color)" ,
        "var(--togostanza-series-1-color)" ,
        "var(--togostanza-series-2-color)" ,
        "var(--togostanza-series-3-color)" ,
        "var(--togostanza-series-4-color)" ,
        "var(--togostanza-series-5-color)" ,
        "var(--togostanza-series-6-color)"
      ]
    }
  ]


  // set legend if metadata "legend" is true
  const legend = [
    {
      "fill": "color",
      "orient": params["legend-orient"],
      "title": params["legend-title"],
      "format": "0.1%"
    }
  ]

  params["legend"] ? spec.legends = legend : spec.legends = []

  spec.marks = [
    {
      "type": "shape",
      "from": {"data": "counties"},
      "encode": {
        "enter": { "tooltip": {"signal": "format(datum.rate, '0.1%')"}},
        "hover": { "fill": {"value": "var(--togostanza-hover-color)"} },
        "update": { 
          "fill": {"scale": "color", "field": "rate"} },
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" },
      ]
    }
  ]

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);

  // DELETE WHEN FINISHED
  console.log(spec)
  console.log("var(--togostanza-legend-orient)")
}