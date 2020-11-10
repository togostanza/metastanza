import vegaEmbed from "vega-embed";

export default async function vegaBarchart(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].values = [
    {"category": "a", "amount": 128},
    {"category": "b", "amount": 5},
    {"category": "c", "amount": 43},
    {"category": "d", "amount": 91},
    {"category": "e", "amount": 81},
    {"category": "f", "amount": 53},
    {"category": "g", "amount": 19},
    {"category": "h", "amount": 87}
  ]

  // signalにtextのプロパティの選択肢を追加することもできる
  spec.signals[1] = { 
    "name": "font",
    "value": "sans-serif",
    "bind": {"input": "select", "options": ["sans-serif", "serif", "monospace","arial"]}
  }

  // spec.signals[2] = { 
  //   "name": "fontSize",
  //   "value": 18,
  //   "bind": {"input": "range", "min": 0, "max": 150, "step": 1}
  // }

  spec.marks[1].encode.enter.font = {signal: "font"}
  // spec.marks[1].encode.enter.fontSize = {signal: "fontSize"}

  spec.marks[0].encode.update.fill.value = "var(--bar-color)"
  spec.marks[0].encode.hover.fill.value = "var(--hover-bar-color)"
  spec.marks[1].encode.enter.fill.value = "var(--hover-font-color)"
  // spec.marks[1].encode.enter.font = {value: params["font-of-value"]}
  spec.marks[1].encode.enter.fontSize = {value: params["fontsize-of-value"]}
  spec.marks[1].encode.enter.fontWeight = {value: params["fontweight-of-value"]}

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}
