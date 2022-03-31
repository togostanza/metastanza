import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import { _3d } from "d3-3d";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
// import drawGridLayout from "./drawGridLayout";

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
      downloadSvgMenuItem(this, "graph-3d-grid"),
      downloadPngMenuItem(this, "graph-3d-grid"),
      downloadJSONMenuItem(this, "graph-3d-grid", this._data),
      downloadCSVMenuItem(this, "graph-3d-grid", this._data),
      downloadTSVMenuItem(this, "graph-3d-grid", this._data),
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
    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    // Setting color scale
    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }
    const color = function () {
      return d3.scaleOrdinal().range(togostanzaColors);
    };

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("graph-3d-grid");

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

    // === Drawing the grid ===
    const origin = [WIDTH / 2, HEIGHT / 2];

    const scale = 0.75;

    const key = function (d) {
      return d.id;
    };
    const startAngle = Math.PI / 4;

    const nodesColor = color();
    const edgesColor = color();
    const svgG = svg
      .call(
        d3.drag().on("drag", dragged).on("start", dragStart).on("end", dragEnd)
      )
      .append("g");

    var mx, my, mouseX, mouseY;

    const point3d = _3d()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      })
      .z(function (d) {
        return d.z;
      })
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    const edge3d = _3d()
      .scale(scale)
      .origin(origin)
      .shape("LINE")
      .rotateY(startAngle)
      .rotateX(-startAngle);

    function processData(data) {
      const linesStrip = svgG.selectAll("line").data(data[1]);

      linesStrip
        .enter()
        .append("line")
        .attr("class", "_3d")
        .merge(linesStrip)
        .attr("fill", "none")
        .attr("stroke", (d) => d.color)
        .attr("opacity", 0.5)
        .attr("stroke-width", 2)
        .sort(function (a, b) {
          return b[0].rotated.z - a[0].rotated.z;
        })
        .attr("x1", function (d) {
          return d[0].projected.x;
        })
        .attr("y1", function (d) {
          return d[0].projected.y;
        })
        .attr("x2", function (d) {
          return d[1].projected.x;
        })
        .attr("y2", function (d) {
          return d[1].projected.y;
        });

      linesStrip.exit().remove();

      const points = svgG.selectAll("circle").data(data[0], key);

      points
        .enter()
        .append("circle")
        .attr("class", "_3d")
        .merge(points)
        .attr("cx", posPointX)
        .attr("cy", posPointY)
        .attr("r", 3)
        .attr("stroke", function (d) {
          return d3.color(nodesColor(d.id)).darker(3);
        })
        .attr("fill", function (d) {
          return nodesColor(d.id);
        })
        .attr("opacity", 1)
        .attr("data-tooltip", (d) => d.id);

      points.exit().remove();

      d3.selectAll("._3d").sort(_3d().sort);
    }

    function posPointX(d) {
      return d.projected.x;
    }

    function posPointY(d) {
      return d.projected.y;
    }
    const edgesCoords = [];

    function init() {
      // Laying out nodes=========

      // const gridSizeForGroup = {};
      const groupHash = {};
      const nodesHash = {};

      nodes.forEach((node) => {
        const groupName = "" + node.group;
        groupHash[groupName]
          ? groupHash[groupName].push(node)
          : (groupHash[groupName] = [node]);
        nodesHash["" + node.id] = node;
      });

      // nodes.forEach((node) => {
      //   const groupName = "" + node.group;
      //   gridSizeForGroup[groupName] = Math.ceil(
      //     Math.sqrt(groupHash[groupName].length)
      //   );
      // });

      const DEPTH = WIDTH;
      const yPointScale = d3
        .scalePoint([-DEPTH / 2, DEPTH / 2])
        .domain(Object.keys(groupHash));

      // add random noise to pisition to prevent fully overlapping edges

      const rand = () => {
        return 0;
      }; // d3.randomNormal(0, 5);

      Object.keys(groupHash).forEach((gKey) => {
        let ii = 0;
        let jj = 0;

        const group = groupHash[gKey];
        const gridSize = Math.ceil(Math.sqrt(groupHash[gKey].length));

        const dx = WIDTH / gridSize;
        const dz = HEIGHT / gridSize;

        group.forEach((node) => {
          if (jj < gridSize) {
            node.x = jj * dx + rand() - WIDTH / 2;
            node.z = ii * dz + rand() - HEIGHT / 2;
            node.y = yPointScale(gKey) + rand();
            jj++;
          } else {
            jj = 0;
            ii++;
            node.x = jj * dx + rand() - WIDTH / 2;
            node.z = ii * dz + rand() - HEIGHT / 2;
            node.y = yPointScale(gKey) + rand();
            jj++;
          }
        });
      });

      edges.forEach((edge) => {
        const toPush = [
          [
            nodesHash[edge.source].x,
            nodesHash[edge.source].y,
            nodesHash[edge.source].z,
          ],
          [
            nodesHash[edge.target].x,
            nodesHash[edge.target].y,
            nodesHash[edge.target].z,
          ],
        ];
        toPush.color = edgesColor(edge.source);
        edgesCoords.push(toPush);
      });

      const data = [point3d(nodes), edge3d(edgesCoords)];
      processData(data);
    }

    function dragStart(e) {
      mx = e.x;
      my = e.y;
    }

    function dragged(e) {
      let alpha = 0;
      let beta = 0;

      mouseX = mouseX || 0;
      mouseY = mouseY || 0;
      beta = ((e.x - mx + mouseX) * Math.PI) / 230;
      alpha = (((e.y - my + mouseY) * Math.PI) / 230) * -1;
      const data = [
        point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(nodes),
        edge3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          edgesCoords
        ),
      ];
      processData(data);
    }

    function dragEnd(e) {
      mouseX = e.x - mx + mouseX;
      mouseY = e.y - my + mouseY;
    }

    d3.selectAll("button").on("click", init);

    init();

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
  }
}
