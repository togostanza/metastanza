import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import drawGridLayout from "./drawGridLayout";
import drawArcLayout from "./drawArcLayout";
import drawFoecLayout from "./drawForceLayout";
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
      downloadSvgMenuItem(this, "force-graph"),
      downloadPngMenuItem(this, "force-graph"),
      downloadJSONMenuItem(this, "force-graph", this._data),
      downloadCSVMenuItem(this, "force-graph", this._data),
      downloadTSVMenuItem(this, "force-graph", this._data),
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
      this.params["data-type"]
    );

    this._data = values;

    const nodes = values.nodes;
    const edges = values.links;

    const count = {};
    for (const element of edges) {
      if (count[element.target]) {
        count[element.target] += 1;
      } else {
        count[element.target] = 1;
      }
      if (count[element.source]) {
        count[element.source] += 1;
      } else {
        count[element.source] = 1;
      }
    }

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
    const color = d3.scaleOrdinal().range(togostanzaColors);

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("force-graph");

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

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      symbols,
      nodeSizeParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      labelsParams: {
        margin: this.params["labels-margin"],
        dataKey: this.params["labels-data-key"],
      },
    };

    // svg
    //   .append("defs")
    //   .append("marker")
    //   .attr("id", "arrow")
    //   .attr("refX", 12)
    //   .attr("refY", 6)
    //   .attr("markerUnits", "userSpaceOnUse")
    //   .attr("markerWidth", 12)
    //   .attr("markerHeight", 18)
    //   .attr("orient", "auto")
    //   .append("path")
    //   .attr("d", "M 0 0 12 6 0 12 3 6");

    switch (this.params["layout"]) {
      case "force":
        drawFoecLayout(svg, nodes, edges, params);
        break;
      case "arc":
        drawArcLayout(svg, nodes, edges, params);
        break;
      case "grid":
        drawGridLayout(svg, nodes, edges, params);
        break;
      case "circle":
        drawCircleLayout(svg, nodes, edges, params);
        break;
      default:
        break;
    }

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
  }
}
