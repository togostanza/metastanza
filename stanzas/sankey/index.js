import Stanza from "togostanza/stanza";

import * as d3 from "d3";
import {
  sankey as d3sankey,
  sankeyLinkHorizontal,
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify,
} from "d3-sankey";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";

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

    const { default: metadata } = await import("./metadata.json");

    let params;
    try {
      params = validateParams(metadata, this.params);
    } catch (error) {
      console.error(error);
      return;
    }

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
    const linearColor = d3
      .scaleLinear()
      .range([togostanzaColors[0], togostanzaColors[5]]);

    const dataNodesParams = {
      dataKey:
        this.params["data_nodes_data-key"] ||
        params.get("data_nodes_data-key").default,
      IdDataKey:
        this.params["data_nodes_id-data-key"] ||
        params.get("data_node_id-data-key").default,
    };

    const nodesColorParams = {
      dataKey: this.params["nodes_color_data-key"],
      minColor:
        this.params["nodes_color_min-color"] ||
        css("--togostanza_theme_series-0-color"),
      maxColor:
        this.params["nodes_color_max-color"] ||
        css("--togostanza_theme_series-5-color"),
      colorScale: this.params["nodes_color_scale"] || "ordinal",
    };

    const dataLinksParams = {
      dataKey:
        this.params["data_links_data-key"] ||
        params.get("data_links_data-key").default,
    };

    const linkColorParams = {
      basedOn:
        this.params["links_color_based-on"] ||
        params.get("links_color_based-on").default,
      dataKey: this.params["links_color_data-key"],
    };

    const nodesAlignParams = {
      alignment:
        {
          left: sankeyLeft,
          right: sankeyRight,
          center: sankeyCenter,
          justify: sankeyJustify,
        }[this.params["nodes_alignment"]] ||
        params.get("nodes_alignment").default,
    };

    const nodesSortParams = {
      sortBy:
        this.params["nodes_sort_by"] || params.get("nodes_sort_by").default,
      sortOrder: this.params["nodes_sort_order"],
    };

    const nodeLabelParams = {
      dataKey:
        this.params["nodes_label_data-key"] ||
        params.get("nodes_label_data-key").default,

      margin:
        this.params["nodes_label_margin"] === 0
          ? 0
          : this.params["nodes_label_margin"] ||
            params.get("nodes_label_margin").default,
    };

    const tooltipParams = {
      dataKey: this.params["tooltips_data-key"],
    };

    const highlightParams = {
      highlight: !!this.params["nodes_highlight"],
    };

    const sortFnGenerator = (sortBy, sortOrder) => {
      switch (sortOrder) {
        case "ascending":
          return (a, b) => (a[sortBy] > b[sortBy] ? -1 : 1);
        case "descending":
          return (a, b) => (a[sortBy] > b[sortBy] ? 1 : -1);
        case "none":
          return () => 0;
        default:
          return () => 0;
      }
    };

    const root = this.root.querySelector("main");
    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const svg = d3.select(root).append("svg");

    const width = parseInt(css("--togostanza_outline_width"));
    const height = parseInt(css("--togostanza_outline_height"));

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const MARGIN = {
      TOP: parseInt(css("--togostanza_outline_padding-top")) || 0,
      BOTTOM: parseInt(css("--togostanza_outline_padding-bottom")) || 0,
      LEFT: parseInt(css("--togostanza_outline_padding-left")) || 0,
      RIGHT: parseInt(css("--togostanza_outline_padding-right")) || 0,
    };

    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    const _sankey = d3sankey()
      .nodeWidth(5)
      .nodePadding(5)
      .nodeSort(
        sortFnGenerator(nodesSortParams.sortBy, nodesSortParams.sortOrder)
      )
      .extent([
        [0, 0],
        [WIDTH, HEIGHT],
      ])
      .nodeAlign(nodesAlignParams.alignment)

      .iterations(32);

    const sankey = (data) =>
      _sankey({
        nodes: data[dataNodesParams.dataKey].map((d) => d),
        links: data[dataLinksParams.dataKey].map((d) => d),
      });

    const { nodes, links } = sankey(values);

    const colorSym = Symbol("color");

    if (
      nodes.every((d) => typeof d[nodesColorParams.dataKey] !== "undefined")
    ) {
      // if there is such datakey in every node
      // then if its a hex color, use it directly
      if (nodes.every((d) => checkIfHexColor(d[nodesColorParams.dataKey]))) {
        nodes.forEach((d) => {
          d[colorSym] = d[nodesColorParams.dataKey];
        });
      } else {
        // else if
        if (nodesColorParams.colorScale === "linear") {
          if (
            nodes.every((d) => checkIfIntOrFloat(d[nodesColorParams.dataKey]))
          ) {
            // if the color scale is linear
            // then use the linear scale
            linearColor.domain([
              d3.min(nodes, (d) => d[nodesColorParams.dataKey]),
              d3.max(nodes, (d) => d[nodesColorParams.dataKey]),
            ]);
            nodes.forEach((d) => {
              d[colorSym] = linearColor(d[nodesColorParams.dataKey]);
            });
          } else {
            // else use the ordinal scale
            nodes.forEach((d) => {
              d[colorSym] = color(d[nodesColorParams.dataKey]);
            });
          }
        } else {
          // else use the ordinal scale
          nodes.forEach((d) => {
            d[colorSym] = color(d[nodesColorParams.dataKey]);
          });
        }
      }
    }

    const nodeHash = nodes.reduce(
      (acc, node) => ({ ...acc, [node[dataNodesParams.IdDataKey]]: node }),
      {}
    );

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const node = g
      .append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("class", "node")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("style", (d) => `fill: ${d[colorSym]};`);

    if (
      tooltipParams.dataKey &&
      nodes.some((d) => !!d[tooltipParams.dataKey])
    ) {
      node.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
      this.tooltip.setup(svg.node().querySelectorAll("[data-tooltip]"));
    }

    let label;
    if (nodes.some((d) => d[nodeLabelParams.dataKey])) {
      label = g
        .append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("class", "label")
        .attr("x", (d) =>
          d.x0 < width / 2
            ? d.x1 + nodeLabelParams.margin
            : d.x0 - nodeLabelParams.margin
        )
        .attr("y", (d) => (d.y1 + d.y0) / 2)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
        .text((d) => d[nodeLabelParams.dataKey] || "");
    }

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
      .attr("stroke-width", ({ width }) => Math.max(0.5, width))
      .attr("class", "link");

    if (linkColorParams.basedOn === "source-target") {
      const gradient = link
        .append("linearGradient")
        .attr("id", (d) => `gradient-${d.index}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", (d) => nodeHash[d.source[dataNodesParams.IdDataKey]].x0)
        .attr("x2", (d) => nodeHash[d.target[dataNodesParams.IdDataKey]].x1);

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr(
          "stop-color",
          (d) => nodeHash[d.source[dataNodesParams.IdDataKey]][colorSym]
        );

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr(
          "stop-color",
          (d) => nodeHash[d.target[dataNodesParams.IdDataKey]][colorSym]
        );

      link.attr("stroke", (d) => `url(#gradient-${d.index})`);
    } else if (
      linkColorParams.basedOn === "source" ||
      linkColorParams.basedOn === "target"
    ) {
      link.attr(
        "stroke",
        (d) =>
          nodeHash[d[linkColorParams.basedOn][dataNodesParams.IdDataKey]][
            colorSym
          ]
      );
    } else {
      // if "data-key"
      if (
        linkColorParams.dataKey &&
        links.every((d) => d[linkColorParams.dataKey])
      ) {
        // if there is such datakey in every link
        // then if its a hex color, use it directly
        if (links.every((d) => checkIfHexColor(d[linkColorParams.dataKey]))) {
          link.attr("stroke", (d) => d[linkColorParams.dataKey]);
        } else {
          // else use ordinal scale
          link.attr("stroke", (d) => color(d[linkColorParams.dataKey]));
        }
      } else {
        //no datakey, use default color
        link.attr("stroke", togostanzaColors[0]);
      }
    }

    if (highlightParams.highlight) {
      node.on("mouseover", function (e, d) {
        node.classed("fadeout", true);
        link.classed("fadeout", true);

        node.filter((p) => d.index === p.index).classed("fadeout", false);

        const neighbourNodes = link
          .filter(
            (p) => d.index === p.source.index || d.index === p.target.index
          )
          .classed("fadeout", false)
          .data()
          .map((d) => [d.source.index, d.target.index])
          .flat();

        node
          .filter((p) => neighbourNodes.includes(p.index))
          .classed("fadeout", false);
        if (label) {
          label.classed("fadeout", true);
          label.filter((p) => d.index === p.index).classed("fadeout", false);
          label
            .filter((p) => neighbourNodes.includes(p.index))
            .classed("fadeout", false);
        }
      });

      node.on("mouseout", function () {
        node.classed("fadeout", false);
        link.classed("fadeout", false);
        if (label) {
          label.classed("fadeout", false);
        }
      });
    }
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
      (typeof thisparams[param] === "undefined" || thisparams[param] === "")
    ) {
      throw new Error(`Required parameter ${param} is not defined`);
    }
  }

  return params;
}

function checkIfHexColor(text) {
  const hexRegex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
  return hexRegex.test(text);
}

function checkIfIntOrFloat(value) {
  console.log("check number", value);
  if (typeof value === "number") {
    console.log(true);
    return true;
  }
  const intRegex = /^\d+$/;
  const floatRegex = /^\d+\.\d+$/;
  console.log(intRegex.test(value) || floatRegex.test(value));
  return intRegex.test(value) || floatRegex.test(value);
}
