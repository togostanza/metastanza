import Stanza from "togostanza/stanza";

import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Scorecard extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    this.renderTemplate({
      template: "stanza.html.hbs",
      parameters: {
        scorecards: [
          {
            key: Object.keys(dataset)[0],
            value: Object.values(dataset)[0],
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

    const key = this.root.querySelector("#key");
    const value = this.root.querySelector("#value");
    if (this.params["legend"] === "false") {
      key.setAttribute(`style`, `display: none;`);
    }

    key.setAttribute("y", Number(css("--togostanza-key-font-size")));
    key.setAttribute("fill", "var(--togostanza-key-font-color)");
    value.setAttribute(
      "y",
      Number(css("--togostanza-key-font-size")) +
        Number(css("--togostanza-value-font-size"))
    );
    value.setAttribute("fill", "var(--togostanza-value-font-color)");
    key.setAttribute("font-size", css("--togostanza-key-font-size"));
    value.setAttribute("font-size", css("--togostanza-value-font-size"));
  }
}
