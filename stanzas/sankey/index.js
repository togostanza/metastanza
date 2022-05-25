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

    const getParam = (param) => {
      if (typeof this.params[param] === undefined) {
        if (params.get(param).default) {
          return params.get(param).default;
        }
        return undefined;
      }
      if (this.params[param] === 0 || this.params[param] === "") {
        return this.params[param];
      }
      return this.params[param];
    };

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
      dataKey: getParam("data_nodes_data-key"),
      IdDataKey: getParam("data_nodes_id-data-key"),
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
      dataKey: getParam("data_links_data-key"),
    };

    const linkColorParams = {
      basedOn: getParam("links_color_based-on"),
      dataKey: this.params["links_color_data-key"],
      blendMode:
        this.params["links_color_blend-mode"] ||
        params.get("links_color_blend-mode").default,
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
      sortBy: getParam("nodes_sort_by"),
      sortOrder: this.params["nodes_sort_order"],
    };

    const nodesParams = {
      padding: getParam("nodes_padding"),
      width: getParam("nodes_width"),
    };

    const nodeLabelParams = {
      dataKey: getParam("nodes_label_data-key"),
      margin: getParam("nodes_label_margin"),
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
      .nodeWidth(nodesParams.width)
      .nodePadding(nodesParams.padding)
      .nodeSort(
        sortFnGenerator(nodesSortParams.sortBy, nodesSortParams.sortOrder)
      )
      .extent([
        [0, 0],
        [WIDTH, HEIGHT],
      ])
      .nodeAlign(nodesAlignParams.alignment)
      .nodes(values[dataNodesParams.dataKey].map((d) => d))
      .links(values[dataLinksParams.dataKey].map((d) => d))
      .iterations(10);

    const sankey = _sankey();
    // const sankey = (data) =>
    //   _sankey({
    //     nodes: data[dataNodesParams.dataKey].map((d) => d),
    //     links: data[dataLinksParams.dataKey].map((d) => d),
    //   });

    const { links, nodes } = sankey;

    const nodeColorSym = Symbol("nodeColor");
    const linkColorSym = Symbol("linkColor");

    if (
      nodes.every((d) => typeof d[nodesColorParams.dataKey] !== "undefined")
    ) {
      // if there is such datakey in every node
      // then if its a hex color, use it directly
      if (nodes.every((d) => checkIfHexColor(d[nodesColorParams.dataKey]))) {
        nodes.forEach((d) => {
          d[nodeColorSym] = d[nodesColorParams.dataKey];
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
              d[nodeColorSym] = linearColor(d[nodesColorParams.dataKey]);
            });
          } else {
            // else use the ordinal scale
            nodes.forEach((d) => {
              d[nodeColorSym] = color(d[nodesColorParams.dataKey]);
            });
          }
        } else {
          // else use the ordinal scale
          nodes.forEach((d) => {
            d[nodeColorSym] = color(d[nodesColorParams.dataKey]);
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

    // const showLabels = nodes.some((d) => d[nodeLabelParams.dataKey]);

    const node = g.append("g");
    const link = g.append("g");
    const defs = svg.append("defs");

    if (linkColorParams.basedOn === "source-target") {
      const d = defs.selectAll("linearGradient").data(links, (d) => d.index);

      const gradient = d.join(
        (enter) => {
          const grad = enter
            .append("linearGradient")
            .attr("id", (d) => `gradient-${d.index}`)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", (d) => nodeHash[d.source[dataNodesParams.IdDataKey]].x0)
            .attr(
              "x2",
              (d) => nodeHash[d.target[dataNodesParams.IdDataKey]].x1
            );

          grad
            .append("stop")
            .attr("offset", "0%")
            .attr(
              "stop-color",
              (d) => nodeHash[d.source[dataNodesParams.IdDataKey]][nodeColorSym]
            );

          grad
            .append("stop")
            .attr("offset", "100%")
            .attr(
              "stop-color",
              (d) => nodeHash[d.target[dataNodesParams.IdDataKey]][nodeColorSym]
            );

          return grad;
        },
        (exit) => exit.remove(),
        (update) => {
          console.log("update", update.node());
          update
            .select("stop[offset='0%']")
            .attr(
              "stop-color",
              (d) => nodeHash[d.source[dataNodesParams.IdDataKey]][nodeColorSym]
            );
          update
            .select("stop[offset='100%']")
            .attr(
              "stop-color",
              (d) => nodeHash[d.target[dataNodesParams.IdDataKey]][nodeColorSym]
            );
        }
      );
    } else if (
      linkColorParams.basedOn === "source" ||
      linkColorParams.basedOn === "target"
    ) {
      links.forEach(
        (link) =>
          (link[linkColorSym] =
            nodeHash[link[linkColorParams.basedOn][dataNodesParams.IdDataKey]][
              nodeColorSym
            ])
      );
    } else {
      // if "data-key"
      if (linkColorParams.dataKey) {
        // if there is such datakey in every link
        // then if its a hex color, use it directly
        if (links.every((d) => checkIfHexColor(d[linkColorParams.dataKey]))) {
          links.forEach(
            (link) => (link[linkColorSym] = link[linkColorParams.dataKey])
          );
          //lEnter.attr("stroke", (d) => d[linkColorParams.dataKey]);
        } else {
          // else use ordinal scale
          links.forEach(
            (link) =>
              (link[linkColorSym] = color(link[linkColorParams.dataKey]))
          );
          //lEnter.attr("stroke", (d) => color(d[linkColorParams.dataKey]));
        }
      } else {
        //no datakey, use default color
        links.forEach(
          (link) => (link[linkColorSym] = linkColorParams.defaultColor)
        );
        //lEnter.attr("stroke", togostanzaColors[0]);
      }
    }

    function update() {
      const n = node.selectAll("g").data(nodes, (d) => d.name);

      const l = link.selectAll("path").data(links, (d) => d.index);

      const lEnter = l
        .enter()
        .append("path")
        .style("mix-blend-mode", linkColorParams.blendMode)
        .merge(l)
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke-width", ({ width }) => Math.max(0.5, width))
        .attr("class", "link")
        .attr("fill", "none");

      if (linkColorParams.basedOn === "source-target") {
        lEnter.each(function (d) {
          d3.select(this).attr("stroke", `url(#gradient-${d.index})`);
        });
      } else {
        lEnter.each(function () {
          d3.select(this).attr("stroke", (d) => d[linkColorSym]);
        });
      }

      n.join(
        (enter) => {
          const g = enter
            .append("g")
            .attr("class", "node-group")
            .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

          g.append("rect")
            .attr("class", "node")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 5)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("style", (d) => `fill: ${d[nodeColorSym]};`);

          g.append("text")
            .attr("class", "label")
            .attr("x", 5)
            .attr("y", (d) => (d.y1 - d.y0) / 2)
            .text((d) => d.name);

          g.call(d3.drag().on("start", dragstarted).on("drag", dragged));

          return g;
        },
        (update) => {
          update.attr("transform", (d) => {
            return `translate(${d.x0}, ${d.y0})`;
          });
        }
      );

      // .attr("x", (d) => d.x0)
      // .attr("y", (d) => d.y0)
      // .attr("height", (d) => d.y1 - d.y0)
      // .attr("width", (d) => d.x1 - d.x0);

      n.exit().remove();
    }

    update();

    let startY;
    let nodeHeight;

    function dragstarted(event, d) {
      nodeHeight = d.y1 - d.y0;
      startY = d3.select(this).attr("y");
    }

    function dragged(event, d) {
      const newY0 = d.y0 + event.dy;

      if (
        (newY0 > 0 || (newY0 <= 0 && event.dy > 0)) &&
        (newY0 < HEIGHT - nodeHeight ||
          (newY0 >= HEIGHT - nodeHeight && event.dy < 0))
      ) {
        d.y0 = newY0;
        d.y1 = d.y0 + nodeHeight;
      }

      d3sankey().update(sankey);
      update();
    }

    // if (nodes.some((d) => d[nodeLabelParams.dataKey])) {
    //   label = g
    //     .append("g")
    //     .selectAll("text")
    //     .data(nodes)
    //     .join("text")
    //     .attr("class", "label")
    //     .attr("x", (d) =>
    //       d.x0 < width / 2
    //         ? d.x1 + nodeLabelParams.margin
    //         : d.x0 - nodeLabelParams.margin
    //     )
    //     .attr("y", (d) => (d.y1 + d.y0) / 2)
    //     .attr("dominant-baseline", "middle")
    //     .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    //     .text((d) => d[nodeLabelParams.dataKey] || "");
    // }

    // if (highlightParams.highlight) {
    //   node.on("mouseover", function (e, d) {
    //     node.classed("fadeout", true);
    //     link.classed("fadeout", true);

    //     node.filter((p) => d.index === p.index).classed("fadeout", false);

    //     const neighbourNodes = link
    //       .filter(
    //         (p) => d.index === p.source.index || d.index === p.target.index
    //       )
    //       .classed("fadeout", false)
    //       .data()
    //       .map((d) => [d.source.index, d.target.index])
    //       .flat();

    //     node
    //       .filter((p) => neighbourNodes.includes(p.index))
    //       .classed("fadeout", false);
    //     if (label) {
    //       label.classed("fadeout", true);
    //       label.filter((p) => d.index === p.index).classed("fadeout", false);
    //       label
    //         .filter((p) => neighbourNodes.includes(p.index))
    //         .classed("fadeout", false);
    //     }
    //   });

    //   node.on("mouseout", function () {
    //     node.classed("fadeout", false);
    //     link.classed("fadeout", false);
    //     if (label) {
    //       label.classed("fadeout", false);
    //     }
    //   });
    // }
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
