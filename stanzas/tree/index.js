import vegaEmbed from "vega-embed";
import loadData from "@/lib/load-data";
import { appendDlButton } from "@/lib/metastanza_utils.js";

export default async function tree(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }

  const vegaJson = await fetch(
    "https://vega.github.io/vega/examples/tree-layout.vg.json"
  ).then((res) => res.json());

  //width,height,padding
  const width = params["width"];
  const height = params["height"];
  const padding = params["padding"];

  //data
  const labelVariable = params["label"]; //"name"
  const parentVariable = params["parent-node"]; //"parent"
  const idVariable = params["node"]; //"id-variable"

  const values = await loadData(params["data-url"], params["data-type"]);

  const data = [
    {
      name: "tree",
      values,
      transform: [
        {
          type: "stratify",
          key: idVariable,
          parentKey: parentVariable,
        },
        {
          type: "tree",
          method: { signal: "layout" },
          size: [{ signal: "height" }, { signal: "width - 100" }],
          separation: { signal: "separation" },
          as: ["y", "x", "depth", "children"],
        },
      ],
    },
    {
      name: "links",
      source: "tree",
      transform: [
        { type: "treelinks" },
        {
          type: "linkpath",
          orient: "horizontal",
          shape: { signal: "links" },
        },
      ],
    },
  ];

  //scales
  const scales = [
    {
      name: "color",
      type: "ordinal",
      range: [
        "var(--togostanza-series-0-color)",
        "var(--togostanza-series-1-color)",
        "var(--togostanza-series-2-color)",
        "var(--togostanza-series-3-color)",
        "var(--togostanza-series-4-color)",
        "var(--togostanza-series-5-color)",
      ],
      domain: { data: "tree", field: "depth" },
      zero: true,
    },
  ];

  //marks
  const marks = [
    {
      type: "path",
      from: { data: "links" },
      encode: {
        update: {
          path: { field: "path" },
          stroke: { value: "var(--togostanza-edge-color)" },
        },
      },
    },
    {
      type: "symbol",
      from: { data: "tree" },
      encode: {
        enter: {
          size: {
            value: css("--togostanza-node-size"),
          },
          stroke: { value: "var(--stroke-color)" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          fill: { scale: "color", field: "depth" },
          stroke: { value: "var(--togostanza-border-color)" },
          strokeWidth: { value: css("--togostanza-border-width") },
        },
      },
    },
    {
      type: "text",
      from: { data: "tree" },
      encode: {
        enter: {
          text: {
            field: params["label"] === "" ? params["node"] : labelVariable,
          },
          font: { value: css("--togostanza-font-family") },
          fontSize: { value: css("--togostanza-label-font-size") },
          baseline: { value: "middle" },
        },
        update: {
          x: { field: "x" },
          y: { field: "y" },
          dx: { signal: "datum.children ? -7 : 7" },
          align: { signal: "datum.children ? 'right' : 'left'" },
          opacity: { signal: "labels ? 1 : 0" },
          fill: { value: "var(--togostanza-label-font-color)" },
        },
      },
    },
  ];

  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width,
    height,
    padding,
    signals: vegaJson.signals,
    data,
    scales,
    marks,
  };

  //delete default controller
  for (const signal of vegaJson.signals) {
    delete signal.bind;
  }

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);

  //menu button placement
  appendDlButton(
    stanza.root.querySelector(".chart-wrapper"),
    stanza.root.querySelector("svg"),
    "tree",
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
