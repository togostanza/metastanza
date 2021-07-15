import Stanza from "togostanza/stanza";

import loadData from "@/lib/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
} from "@/lib/metastanza_utils.js";

export default class Scorecard extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "scorecard"),
      downloadPngMenuItem(this, "scorecard"),
    ];
  }

  async render() {
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

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
      },
    });

    const key = this.root.querySelector("#key");
    const value = this.root.querySelector("#value");
    if (this.params["legend"] === "false") {
      key.setAttribute(`style`, `display: none;`);
    }

    key.setAttribute("font-size", css("--togostanza-key-font-size"));
    key.setAttribute("fill", "var(--togostanza-key-font-color)");
    value.setAttribute("font-size", css("--togostanza-value-font-size"));
    value.setAttribute("fill", "var(--togostanza-value-font-color)");

    const keyBox = key.getBBox();
    const valueBox = value.getBBox();

    key.setAttribute("y", keyBox.height);
    value.setAttribute("y", keyBox.height + valueBox.height);

    const scorecardText = this.root.querySelector("#scorecardText");
    scorecardText.setAttribute("font-family", "var(--togostanza-font-family)");

    const box = scorecardText.getBBox();
    const chartWrapper = this.root.querySelector(".chart-wrapper");
    chartWrapper.setAttribute(
      `style`,
      `width: ${box.width}px; height: ${box.height}px; padding: ${padding}px`
    );

    const scorecardSvg = this.root.querySelector("#scorecardSvg");
    scorecardSvg.setAttribute(
      `width`,
      `${box.width}px`
    );
  }
}
