import Stanza from "togostanza/stanza";

import loadData from "@/lib/load-data";
import { appendDlButton } from "@/lib/metastanza_utils.js";

export default class Scorecard extends Stanza {
  async render() {
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

    //menu button placement
    appendDlButton(
      this.root.querySelector(".chart-wrapper"),
      this.root.querySelector(".scorecard-svg"),
      "scorecard",
      this.root
    );

    const menuButton = this.root.querySelector("#dl_button");
    const menuList = this.root.querySelector("#dl_list");
    switch (this.params["metastanza-menu-placement"]) {
      case "top-left":
        menuButton.setAttribute("class", "dl-top-left");
        menuList.setAttribute("class", "dl-top-left");
        break;
      case "top-right":
        menuButton.setAttribute("class", "dl-top-right");
        menuList.setAttribute("class", "dl-top-right");
        break;
      case "bottom-left":
        menuButton.setAttribute("class", "dl-bottom-left");
        menuList.setAttribute("class", "dl-bottom-left");
        break;
      case "bottom-right":
        menuButton.setAttribute("class", "dl-bottom-right");
        menuList.setAttribute("class", "dl-bottom-right");
        break;
      case "none":
        menuButton.setAttribute("class", "dl-none");
        menuList.setAttribute("class", "dl-none");
        break;
    }
  }
}
