import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import drawCircleLayout from "./drawCircleLayout";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class ForceGraph extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "graph-2d-force"),
      downloadPngMenuItem(this, "graph-2d-force"),
      downloadJSONMenuItem(this, "graph-2d-force", this._data),
      downloadCSVMenuItem(this, "graph-2d-force", this._data),
      downloadTSVMenuItem(this, "graph-2d-force", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //data

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    const nodes = values.nodes;
    const edges = values.links;

    const MARGIN = {
      TOP: this.params["padding"],
      BOTTOM: this.params["padding"],
      LEFT: this.params["padding"],
      RIGHT: this.params["padding"],
    };

    // Setting color scale
    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }

    const color = function () {
      return d3.scaleOrdinal().range(togostanzaColors);
    };

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("graph-2d-circle");

    const existingSvg = root.getElementsByTagName("svg")[0];
    if (existingSvg) {
      existingSvg.remove();
    }
    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const edgeSym = Symbol("nodeAdjEdges");
    const edgeWidthSym = Symbol("edgeWidth");
    const sourceNodeSym = Symbol("sourceNode");
    const targetNodeSym = Symbol("targetNode");
    const nodeSizeSym = Symbol("nodeSize");
    const nodeColorSym = Symbol("nodeColor");

    const symbols = {
      edgeSym,
      edgeWidthSym,
      sourceNodeSym,
      targetNodeSym,
      nodeSizeSym,
      nodeColorSym,
    };
    const nodeSizeParams = {
      basedOn: this.params["node-size-based-on"],
      dataKey: this.params["node-size-data-key"],
      fixedSize: this.params["node-size-fixed-size"],
      minSize: this.params["node-size-min-size"],
      maxSize: this.params["node-size-max-size"],
    };
    const nodeColorParams = {
      basedOn: this.params["node-color-based-on"],
      dataKey: this.params["node-color-data-key"],
    };

    const edgeWidthParams = {
      basedOn: this.params["edge-width-based-on"],
      dataKey: this.params["edge-width-data-key"],
      fixedWidth: this.params["edge-fixed-width"],
      minWidth: this.params["edge-min-width"],
      maxWidth: this.params["edge-max-width"],
    };

    const edgeColorParams = {
      basedOn: this.params["edge-color-based-on"],
      dataKey: this.params["edge-color-data-key"],
    };

    const labelsParams = {
      margin: this.params["labels-margin"],
      dataKey: this.params["labels-data-key"],
    };

    const tooltipParams = {
      dataKey: this.params["nodes-tooltip-data-key"],
      show: nodes.some((d) => d[this.params["nodes-tooltip-data-key"]]),
    };

    const highlightAdjEdges = this.params["highlight-adjacent-edges"];

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      symbols,
      highlightAdjEdges,
      nodeSizeParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      labelsParams,
      tooltipParams,
    };

    drawCircleLayout(svg, nodes, edges, params);

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
  }
}
