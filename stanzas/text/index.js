import Stanza from "togostanza/stanza";
import * as commonmark from "commonmark";
import hljs from "highlight.js";

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

    const main = this.root.querySelector("main");

    const value = this._dataset.value;
    if (this.params["mode"] === "markdown") {
      const parser = new commonmark.Parser();
      const renderer = new commonmark.HtmlRenderer();
      const html = renderer.render(parser.parse(value));
      this.renderTemplate({
        template: "stanza.html.hbs",
        parameters: {
          html,
        },
      });
      main.querySelectorAll("pre code").forEach((el) => {
        hljs.highlightElement(el);
      });
    } else {
      this.renderTemplate({
        template: "stanza.html.hbs",
        parameters: {
          rows: [
            {
              value,
            },
          ],
        },
      });
    }

    appendCustomCss(this, this.params["custom-css-url"]);

    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];
    const container = this.root.querySelector(".container");
    main.setAttribute("style", `padding: ${padding}px;`);
    container.setAttribute(`style`, `width: ${width}px; height: ${height}px;`);
  }
}
