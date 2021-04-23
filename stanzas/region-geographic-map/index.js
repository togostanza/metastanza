import vegaEmbed from "vega-embed";

export default async function regionGeographicMap(stanza, params) {

  const spec = await fetch("https://vega.github.io/vega/examples/county-unemployment.vg.json").then((res) => res.json());

  spec.width = params["width"]; //metadata.jsにパラメータを定義
  spec.height = params["height"];

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
      "type": "albersUsa"
    }
  ]

  spec.scales =  [
    {
      "name": "color",
      "type": "quantize",
      "domain": [0, 0.15],
      "range": {"scheme": "blues", "count": 7}
    }
  ],

  spec.legends = [
    {
      "fill": "color",
      "orient": "bottom-right",
      "title": "Unemployment",
      "format": "0.1%"
    }
  ]

  spec.marks = [
    {
      "type": "shape",
      "from": {"data": "counties"},
      "encode": {
        "enter": { "tooltip": {"signal": "format(datum.rate, '0.1%')"}},
        "update": { "fill": {"scale": "color", "field": "rate"} },
        "hover": { "fill": {"value": "red"} }
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    }
  ]

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}