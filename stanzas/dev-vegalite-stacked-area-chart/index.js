import vegaEmbed from "vega-embed";

export default function devVegaliteStackedAreaChart(stanza /* , params */) {
  //let spec = await fetch(params["src-url"]).then((res) => res.json());
  const spec = JSON.parse(`{
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "width": 300, "height": 200,
    "data": {"url": "https://vega.github.io/vega-lite/data/unemployment-across-industries.json"},
    "mark": "area",
    "encoding": {
      "x": {
        "timeUnit": "yearmonth", "field": "date",
        "axis": {"format": "%Y"}
      },
      "y": {
        "aggregate": "sum", "field": "count"
      },
      "color": {
        "field": "series",
        "scale": {"scheme": "category20b"}
      }
    }
  }`);

  console.log(spec);

  // 新たにカラースキームを自作したいが、反映されない
  // vega.scheme('basic', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']);

  //カラースキームのセットをパラメータ化して、選択できるようにしたいがvar(--color-scheme)が認識されない・・・
  // spec.encoding.color.scale = {"scheme": "var(--color-scheme)"}
  spec.encoding.color.scale = { scheme: "pastel1" };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  vegaEmbed(el, spec, opts);
}
