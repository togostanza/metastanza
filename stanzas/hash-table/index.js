import loadData from "@/lib/load-data";

export default async function hashTable(stanza, params) {
  let dataset = await loadData(params["data-url"], params["data-type"]);
  dataset = dataset[0];
  const columns = params.columns
    ? JSON.parse(params.columns)
    : Object.keys(dataset).map((key) => {
        return { id: key };
      });
  const values = columns.map((column) => {
    const datum_label = Object.keys(dataset).find((datum) => {
      return datum === column.id;
    });
    const label = column.label
      ? column.label
      : params["format-key"] === "true"
      ? datum_label.charAt(0).toUpperCase() +
        datum_label.substring(1).replace(/_/g, " ")
      : datum_label;
    const href = column.link ? dataset[column.link] : null;
    return {
      label,
      value: dataset[column.id],
      href,
    };
  });
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      values,
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
