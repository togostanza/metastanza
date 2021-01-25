import vegaEmbed from "vega-embed";

export default async function devLinechart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  spec.data[0].values = [
    { x: 0, y: 28, c: 0 },
    { x: 0, y: 20, c: 1 },
    { x: 0, y: 20, c: 3 },
    { x: 1, y: 43, c: 0 },
    { x: 1, y: 35, c: 1 },
    { x: 1, y: 20, c: 3 },
    { x: 2, y: 81, c: 0 },
    { x: 2, y: 10, c: 1 },
    { x: 2, y: 20, c: 3 },
    { x: 3, y: 19, c: 0 },
    { x: 3, y: 15, c: 1 },
    { x: 3, y: 20, c: 3 },
    { x: 4, y: 52, c: 0 },
    { x: 4, y: 48, c: 1 },
    { x: 4, y: 20, c: 3 },
    { x: 5, y: 24, c: 0 },
    { x: 5, y: 28, c: 1 },
    { x: 5, y: 20, c: 3 },
    { x: 6, y: 87, c: 0 },
    { x: 6, y: 66, c: 1 },
    { x: 6, y: 20, c: 3 },
    { x: 7, y: 17, c: 0 },
    { x: 7, y: 27, c: 1 },
    { x: 7, y: 20, c: 3 },
    { x: 8, y: 68, c: 0 },
    { x: 8, y: 16, c: 1 },
    { x: 8, y: 20, c: 3 },
    { x: 9, y: 49, c: 0 },
    { x: 9, y: 25, c: 1 },
    { x: 9, y: 20, c: 3 },
  ];

  // カラースキームを定義しようとしたけれどできない
  // vega.scheme('basic', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']);
  // spec.scales[2].range = {"scheme": "pastel1"}
  spec.scales[2].range = { scheme: params["color-scheme"] };
  spec.marks[0].marks[0].encode.enter.strokeWidth.value = "var(--stroke-width)";

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
