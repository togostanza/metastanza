import Stanza from "togostanza/stanza";

import loadData from "@/lib/load-data";

export default class HashTable extends Stanza {
  async render() {
    const style = this.root.querySelector('style');
    fetch(this.params["insert-css-url"])
      .then(response => response.text())
      .then(data => {
        style.insertAdjacentHTML('beforeend', data);
      })
      
    let dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    dataset = dataset[0];

    const columns = this.params.columns
      ? JSON.parse(this.params.columns)
      : Object.keys(dataset).map((key) => {
          return { id: key };
        });
    const values = columns.map((column) => {
      const datum_label = Object.keys(dataset).find((datum) => {
        return datum === column.id;
      });
      const label = column.label
        ? column.label
        : this.params["format-key"] === "true"
        ? datum_label.charAt(0).toUpperCase() +
          datum_label.substring(1).replace(/_/g, " ")
        : datum_label;
      const href = column.link ? dataset[column.link] : null;
      return {
        label,
        value: dataset[column.id],
        href,
        unescape: column.escape === false,
      };
    });
    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        values,
      },
    });

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    main.parentNode.style.padding = `${this.params["padding"]}px`;
  }
}
