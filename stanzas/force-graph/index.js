import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import drawGridLayout from "./drawGridLayout";
import drawArcLayout from "./drawArcLayout";
import drawFoecLayout from "./drawForceLayout";

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

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    const nodeHash = {};

    this._data = values;

    const nodes = values.nodes;
    const edges = values.links;

    nodes.forEach((node) => {
      nodeHash[node.id] = node;
    });

    await setTimeout(() => {}, 100);

    this[Symbol.for("nodeHash")] = nodeHash;

    console.log("nodeHash", this[Symbol.for("nodeHash")]);

    edges.forEach((edge) => {
      edge.weight = parseInt(edge.value);
      edge.sourceNode = nodeHash[edge.source];
      edge.targetNode = nodeHash[edge.target];
    });

    nodes.forEach((node) => {
      const adjEdges = edges.filter((edge) => {
        return edge.source === node || edge.target === node;
      });
      node[Symbol.for("nodeAdjEdges")] = adjEdges;
    });

    this[Symbol.for("nodes")] = nodes;
    this[Symbol.for("edges")] = edges;

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
    this[Symbol.for("count")] = count;

    // Setting node size scale
    const sizeScale = d3.scaleSqrt([0, d3.max(Object.values(count))], [4, 16]);
    this[Symbol.for("sizeScale")] = sizeScale;

    // Setting color scale
    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }
    const color = d3.scaleOrdinal().range(togostanzaColors);
    this[Symbol.for("color")] = color;

    const root = this.root.querySelector(":scope > div");

    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }

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

    // Useful functions
    switch (this.params["layout"]) {
      case "force":
        drawFoecLayout.call(this);
        break;
      case "arc":
        drawArcLayout.call(this);
        break;
      case "grid":
        drawGridLayout.call(this);
        break;
      default:
        break;
    }

    this.tooltip.setup(this.root.querySelectorAll("circle[data-tooltip]"));
  }
}
