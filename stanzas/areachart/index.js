import vegaEmbed from "vega-embed";

export default async function areachart(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());

  // カラースキームを定義しようとしたけれどできない
  // vega.scheme('basic', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']);
  // spec.scales[2].range = {"scheme": "var(--color-scheme)"}
  spec.scales[2].range = [
    'var(--series-0-color)',
    'var(--series-1-color)',
    'var(--series-2-color)',
    'var(--series-3-color)',
    'var(--series-4-color)',
    'var(--series-5-color)',
  ]
  // spec.marks[0].marks[0].encode.enter.strokeWidth.value = "var(--stroke-width)"

  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
      title: params.title
    }
  });

  // const conf = {
  //   range: {
  //     category: ["var(--series-0-color)", "var(--series-1-color)", "var(--series-2-color)", "var(--series-3-color)", "var(--series-4-color)", "var(--series-5-color)"]
  //   }
  // };

  // const view = new Vega.View(Vega.parse(spec, conf), {
  //   renderer: "svg",
  //   container: stanza.root.querySelector("#chart"),
  //   hover: true,
  // });

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);


}
