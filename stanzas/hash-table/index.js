import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import {
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  copyHTMLSnippetToClipboardMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class HashTable extends Stanza {
  menu() {
    return [
      downloadJSONMenuItem(this, "hashtable", this._data),
      downloadCSVMenuItem(this, "hashtable", this._data),
      downloadTSVMenuItem(this, "hashtable", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const dataset = (
      await loadData(
        this.params["data-url"],
        this.params["data-type"],
        this.root.querySelector("main")
      )
    )[0];
    this._data = [dataset];

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
