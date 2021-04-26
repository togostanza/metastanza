import loadData from "@/lib/load-data";
import { appendDlButton } from "@/lib/metastanza_utils.js";

export default async function scorecard(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  const dataset = await loadData(params["data-url"], params["data-type"]);
  const width = params["width"];
  const height = params["height"];
  const padding = params["padding"];

  stanza.render({
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

  const main = stanza.root.querySelector("main");
  main.parentNode.setAttribute(
    `style`,
    `width: ${width}px; height: ${height}px; padding: ${padding}px; background-color: var(--togostanza-background-color);`
  );

  const chartWrapper = stanza.root.querySelector(".chart-wrapper");
  chartWrapper.setAttribute(`style`, `width: ${width}px; height: ${height}px;`);

  const key = stanza.root.querySelector("#scorecardKey");
  const value = stanza.root.querySelector("#scorecardValue");
  if (params["legend"] === "false") {
    key.setAttribute(`style`, `display: none;`);
  }

  key.setAttribute("x", `${width / 2}px`);
  key.setAttribute("y", Number(css("--togostanza-key-font-size")));
  value.setAttribute("x", `${width / 2}px`);
  value.setAttribute(
    "y",
    Number(css("--togostanza-key-font-size")) +
      Number(css("--togostanza-value-font-size"))
  );
  key.setAttribute("font-size", css("--togostanza-key-font-size"));
  value.setAttribute("font-size", css("--togostanza-value-font-size"));

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector(".scorecard-svg"),
    "scorecard",
    stanza
  );

  const menuButton = stanza.root.querySelector("#dl_button");
  const menuList = stanza.root.querySelector("#dl_list");
  switch (params["metastanza-menu-placement"]) {
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
