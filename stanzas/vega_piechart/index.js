import vegaEmbed from "vega-embed";

export default async function vegaPiechart(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  console.log(spec.marks)
  // spec.data[0].values = [
  //   {"id": 1, "field": 1},
  //   {"id": 2, "field": 1},
  //   {"id": 3, "field": 1},
  //   {"id": 4, "field": 5},
  //   {"id": 5, "field": 8},
  //   {"id": 6, "field": 10}
  // ]

  // vega.scheme('metastabasic', ['#AB3F61', '#F7EF8D', '#F7749E', '#5CD5F7', '#4895AB', '#4895AB']);
  // spec.scales[0].range.scheme = 'pastel1';
  spec.scales[0].range.scheme = params["color-scheme"];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}