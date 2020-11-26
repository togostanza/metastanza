import vegaEmbed from "vega-embed";

export default async function vegaTree(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  // spec.data[0].values = [
  //   {"category": "value1", "amount": 1},
  //   {"category": "value2", "amount": 7},
  //   {"category": "value3", "amount": 5},
  //   {"category": "value4", "amount": 9},
  // ]

  spec.data[0].url ="https://vega.github.io/vega/data/flare.json"

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}
