import Stanza from "togostanza/stanza";

import loadData from "@/lib/load-data";

export default class Text extends Stanza {
  async render() {
    this.importWebFontCSS(
      "https://use.fontawesome.com/releases/v5.6.3/css/all.css"
    );
    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    const textBlob = new Blob([dataset.value], {
      type: "text/plain",
    });

    const textUrl = URL.createObjectURL(textBlob);
    console.log(textUrl);

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        rows: [
          {
            value: dataset.value,
          },
        ],
        textUrl: URL.createObjectURL(textBlob),
      },
    });

    const style = this.root.querySelector("style");
    fetch(this.params["insert-css-url"])
      .then((response) => response.text())
      .then((data) => {
        style.insertAdjacentHTML("beforeend", data);
      });

    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];
    const container = this.root.querySelector(".container");
    const main = this.root.querySelector("main");
    main.setAttribute("style", `padding: ${padding}px;`);
    container.setAttribute(`style`, `width: ${width}px; height: ${height}px;`);

    const menu = this.root.querySelector(".menu");
    switch (this.params["metastanza-menu-placement"]) {
      case "top-left":
        break;
      case "top-right":
        menu.setAttribute("style", "justify-content: flex-end;");
        break;
      case "bottom-left":
        container.setAttribute("style", "flex-direction: column-reverse;");
        break;
      case "bottom-right":
        menu.setAttribute("style", "justify-content: flex-end;");
        container.setAttribute(
          "style",
          "justify-content flex-end; flex-direction: column-reverse;"
        );
        break;
      case "none":
        menu.setAttribute("style", "display: none;");
        break;
    }
  }
}
