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

    const width = parseInt(this.params["width"]) || 300;
    const height = parseInt(this.params["height"]) || 200;

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

    // TODO delete next line
    this[Symbol.for("count")] = count;

    const MARGIN = {
      TOP: 50,
      BOTTOM: 50,
      LEFT: 50,
      RIGHT: 50,
    };

    // TODO delete next lines
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

    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }

    const edgeSym = Symbol.for("nodeAdjEdges");
    const edgeWidthSym = Symbol.for("edgeWidth");
    const sourceNodeSym = Symbol.for("sourceNode");
    const targetNodeSym = Symbol.for("targetNode");
    const nodeSizeSym = Symbol.for("nodeSize");

    const symbols = {
      edgeSym,
      edgeWidthSym,
      sourceNodeSym,
      targetNodeSym,
      nodeSizeSym,
    };
    const nodeSizeParams = {
      basedOn: "edgesNumber",
      dataKey: "value",
      fixedSize: 10,
      minSize: 5,
      maxSize: 15,
    };
    const edgeWidthParams = {
      basedOn: "dataKey",
      dataKey: "value",
      fixedWidth: 2,
      minWidth: 1,
      maxWidth: 10,
    };

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      symbols,
      nodeSizeParams,
      edgeWidthParams,
      labelsParams: { margin: 10, show: true },
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
