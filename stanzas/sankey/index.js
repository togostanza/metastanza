import Stanza from "togostanza/stanza";

import * as d3 from "d3";
import { sankey as d3sankey, sankeyLinkHorizontal } from "d3-sankey";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import { debounce } from "lodash";
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
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    let width;
    let height;

    const { default: metadata } = await import("./metadata.json");

    let params;
    try {
      params = validateParams(metadata, this.params);
    } catch (error) {
      console.error(error);
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log("size changed!");
        if (entry.contentBoxSize) {
          // Firefox implements `contentBoxSize` as a single content rect, rather than an array
          const contentBoxSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;

          width = contentBoxSize.inlineSize;
          height = contentBoxSize.blockSize;
        } else {
          width = entry.contentRect.width;
          height = entry.contentRect.height;
        }
      }
    });

    const main = this.root.querySelector("main");
    //resizeObserver.observe(main);

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const { default: values } = await import("./assets/energy.json");

    // = await loadData(
    //   this.params["data-url"],
    //   this.params["data-type"],
    //   this.root.querySelector("main")
    // );

    this._data = values;

    // Setting color scale
    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza_theme_series-${i}-color`));
    }
    const color = d3.scaleOrdinal(togostanzaColors);

    const dataNodesParams = {
      nodesAccessor:
        this.params["data_nodes_accessor"] ||
        params.get("data_nodes_accessor").default,
      nodeIdAccessor:
        this.params["data_nodes_id-accessor"] ||
        params.get("data_node_id-accessor").default,
    };

    const dataLinksParams = {
      linksAccessor:
        this.params["data_links_accessor"] ||
        params.get("data_links_accessor").default,
      linkSourceAccessor:
        this.params["data_links_source-accessor"] ||
        params.get("data_links_source-accessor").default,
      linkTargetAccessor:
        this.params["data_links_target-accessor"] ||
        params.get("data_links_target-accessor").default,
    };

    const svg = d3.select(main).append("svg");

    width = 600;
    height = 400;
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const MARGIN = {
      TOP: 20,
      BOTTOM: 20,
      LEFT: 20,
      RIGHT: 20,
    };

    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    const _sankey = d3sankey()
      .nodeWidth(5)
      .nodePadding(5)
      .nodeSort((a, b) => {
        return b.value - a.value;
      })
      .extent([
        [0, 0],
        [WIDTH, HEIGHT],
      ]);

    const sankey = ({ nodes, links }) =>
      _sankey({
        nodes: nodes.map((d) => d),
        links: links.map((d) => d),
      });

    const { nodes, links } = sankey(values);

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const node = g
      .append("g")
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("stroke-opacity", 0.8)
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("fill", (d) => {
        return color(d.name);
      });

    const link = g
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.8)
      .selectAll("g")
      .data(links)
      .join("g")
      .attr("stroke-width", (d) => d.width)
      .style("mix-blend-mode", "multiply");

    link
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke-width", ({ width }) => Math.max(0.5, width));

    const gradient = link
      .append("linearGradient")
      .attr("id", (d) => `gradient-${d.index}`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", ({ source }) => source.x0)
      .attr("x2", ({ target }) => target.x1);

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", (d) => color(d.source.name));

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", (d) => color(d.target.name));

    link.attr("stroke", (d) => `url(#gradient-${d.index})`);
  }
}

/**
 * Validates params given to a stanza
 * Throws error if params marked as `required` are not present
 * @param {object} metadata contents of metadata JSON file
 * @param {object} thisparams this.params object of a stanza
 * @returns {Map} map of params with values
 */
function validateParams(metadata, thisparams) {
  const params = new Map(
    metadata["stanza:parameter"].map((param) => [
      param["stanza:key"],
      {
        default: param["stanza:example"],
        required: !!param["stanza:required"],
      },
    ])
  );

  for (const param in thisparams) {
    if (
      params.get(param).required &&
      typeof thisparams[param] === "undefined"
    ) {
      throw new Error(`Required parameter ${param} is not defined`);
    }
  }

  return params;
}
