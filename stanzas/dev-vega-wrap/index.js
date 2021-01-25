import * as Vega from "vega";

export default async function devVegaWrap(stanza, params) {
  const spec = await fetch(params["vega-json"]).then((res) => res.json());

  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      title: params.title,
    },
  });

  const conf = {
    range: {
      category: [
        "var(--series-0-color)",
        "var(--series-1-color)",
        "var(--series-2-color)",
        "var(--series-3-color)",
        "var(--series-4-color)",
        "var(--series-5-color)",
      ],
    },
  };

  const view = new Vega.View(Vega.parse(spec, conf), {
    renderer: "svg",
    container: stanza.root.querySelector("#chart"),
    hover: true,
  });

  await view.runAsync();
}
