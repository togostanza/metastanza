import loadData from "@/lib/load-data";

export default async function hashTable(stanza, params) {
  const dataset = await loadData(params["data-url"], params["data-type"]);
  const columns = params.columns ? JSON.parse(params.columns) : null;
  const values = Object.entries(dataset[0]).map((datam) => {
    const label = columns
    ? columns.find((column) => column.id === datam[0]).label
    : params["format-key"] === "true"
    ? datam[0].charAt(0).toUpperCase() + datam[0].substring(1).replace(/_/g, " ")
    : datam[0];

    return {
      label,
      value: datam[1],
    };
  })
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      values
    },
  });

  const main = stanza.root.querySelector("main");
  main.setAttribute(
    "style",
    `width: ${params["width"]};
    height: ${params["height"]};
    padding: ${params["padding"]}`
  );
}
