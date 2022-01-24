import Stanza from "togostanza/stanza";

import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  copyHTMLSnippetToClipboardMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Scorecard extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
      downloadJSONMenuItem(this, "scorecard", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    const [key, value] = Object.entries(dataset)[0];
    this._data = { [key]: value };

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        scorecards: [
          {
            key,
            value,
          },
        ],
        width,
        height,
        padding,
      },
    });

    const chartWrapper = this.root.querySelector(".chart-wrapper");
    chartWrapper.setAttribute(
      `style`,
      `width: ${width}px; height: ${height}px; padding: ${padding}px`
    );

    const scorecardSvg = this.root.querySelector("#scorecardSvg");
    scorecardSvg.setAttribute(
      "height",
      `${
        Number(css("--togostanza-key-font-size")) +
        Number(css("--togostanza-value-font-size"))
      }`
    );

    const keyElement = this.root.querySelector("#key");
    const valueElement = this.root.querySelector("#value");
    if (this.params["legend"] === "false") {
      keyElement.setAttribute(`style`, `display: none;`);
    }

    keyElement.setAttribute("y", Number(css("--togostanza-key-font-size")));
    keyElement.setAttribute("fill", "var(--togostanza-key-font-color)");
    valueElement.setAttribute(
      "y",
      Number(css("--togostanza-key-font-size")) +
        Number(css("--togostanza-value-font-size"))
    );
    valueElement.setAttribute("fill", "var(--togostanza-value-font-color)");
    keyElement.setAttribute("font-size", css("--togostanza-key-font-size"));
    valueElement.setAttribute("font-size", css("--togostanza-value-font-size"));
  }
}
