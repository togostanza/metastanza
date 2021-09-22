import Stanza from "togostanza/stanza";

import vegaEmbed from "vega-embed";
import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Tree extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "tree"),
      downloadPngMenuItem(this, "tree"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width,height,padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];

    //data
    const labelVariable = this.params["label"]; //"name"
    const parentVariable = this.params["parent-node"]; //"parent"
    const idVariable = this.params["node"]; //"id-variable"

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    const signals = [
      {
        name: "labels",
        value: true,
      },
      {
        name: "layout",
        value: "tidy",
      },
      {
        name: "links",
        value: "diagonal",
      },
      {
        name: "separation",
        value: false,
      },
    ];

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
              field:
                this.params["label"] === ""
                  ? this.params["node"]
                  : labelVariable,
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
      signals,
      data,
      scales,
      marks,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);
  }
}
