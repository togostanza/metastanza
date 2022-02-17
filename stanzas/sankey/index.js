import Stanza from "togostanza/stanza";

import * as d3 from "d3";
import * as d3SankeyDiagram from "d3-sankey-diagram";
import json from "./21082502.json";
// import loadData from "@/lib/load-data";
// import {
//   downloadSvgMenuItem,
//   downloadPngMenuItem,
//   appendCustomCss,
// } from "@/lib/metastanza_utils.js";
import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Sankey extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "sankey"),
      downloadPngMenuItem(this, "sankey"),
      downloadJSONMenuItem(this, "sankey", this._data),
      downloadCSVMenuItem(this, "sankey", this._data),
      downloadTSVMenuItem(this, "sankey", this._data),
    ];
  }

  async render() {
    // appendCustomCss(this, this.params["custom-css-url"]);

    appendCustomCss(this, this.params["custom-css-url"]);
    
    //width,height,padding
    const width = this.params["width"];
    const height = this.params["height"];
    const padding = this.params["padding"];
    const nodeIdKey = this.params["node-id"];

    const layout = d3SankeyDiagram.sankey()
      .nodeId(function (d) {
        return d[nodeIdKey] ? d[nodeIdKey] : d.id;
      })
      .extent([[padding/2, padding/2], [width - padding/2, height - padding/2]]);
    
    if (json.rankSets) {
      layout.rankSets(json.rankSets);
    }

    if (this.params["node-width"]) {
      layout.nodeWidth(this.params["node-width"]);
    }

    // const values = await loadData(
    //   this.params["data-url"],
    //   this.params["data-type"]
    // );

    const paramColors = [
      "var(--togostanza-series-0-color)",
      "var(--togostanza-series-1-color)",
      "var(--togostanza-series-2-color)",
      "var(--togostanza-series-3-color)",
      "var(--togostanza-series-4-color)",
      "var(--togostanza-series-5-color)",
    ];
    
    const nodeTitleKey = this.params["node-title"];
    const defaultLinkColor = "var(--link-color)";

    const color = d3.scaleOrdinal(paramColors);

    function nodeTitle(d) {
      return d[nodeTitleKey] ? d[nodeTitleKey] : d.title;
    }

    const diagram = d3SankeyDiagram.sankeyDiagram()
      .nodeTitle(nodeTitle)
      .linkTitle(function (d) {
        const sourceTitle = nodeTitle(d.source)
        const targetTitle = nodeTitle(d.target)
        return `${sourceTitle} → ${targetTitle}`
      })
      .linkColor(function (d) {
        return d.color || defaultLinkColor || color(d.type);
      });

    d3.select(this.root.querySelector('main'))
    .append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('width', width)
    .attr('height', height)
    .datum(layout(json))
    .call(diagram);
  }
}