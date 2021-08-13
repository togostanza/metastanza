import Stanza from "togostanza/stanza";

import loadData from "@/lib/load-data";

import { appendCustomCss } from "@/lib/metastanza_utils.js";

export default class Text extends Stanza {
  menu() {
    return [
      {
        type: "item",
        label: "Download Text",
        handler: () => {
          const textBlob = new Blob([this._dataset.value], {
            type: "text/plain",
          });
          const textUrl = URL.createObjectURL(textBlob);
          const link = document.createElement("a");
          document.body.appendChild(link);
          link.href = textUrl;
          link.download = "text.txt";
          link.click();
          document.body.removeChild(link);
        },
      },
    ];
  }

  async render() {
    this._dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        rows: [
          {
            value: this._dataset.value,
          },
        ],
      },
    });

    appendCustomCss(this, this.params["custom-css-url"]);

    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];
    const container = this.root.querySelector(".container");
    const main = this.root.querySelector("main");
    main.setAttribute("style", `padding: ${padding}px;`);
    container.setAttribute(`style`, `width: ${width}px; height: ${height}px;`);
  }
}
