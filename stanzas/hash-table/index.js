import loadData from "@/lib/load-data";

export default async function hashTable(stanza, params) {
  let dataset = await loadData(params["data-url"], params["data-type"]);
  dataset = dataset[0]
  const columns = params.columns
    ? JSON.parse(params.columns)
    : Object.keys(dataset).map((key) => {
        return { id: key }
      });
  const values = columns.map((column) => {
    const datam_label = Object.keys(dataset).find(datam => {
      return datam === column.id
    })
    const label = column.label
      ? column.label
      : params["format-key"] === "true"
      ? datam_label.charAt(0).toUpperCase() +
        datam_label.substring(1).replace(/_/g, " ")
      : datam_label;

    return {
      label,
      value: dataset[column.id],
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
