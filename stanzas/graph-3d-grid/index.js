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
    let origin = [WIDTH / 2, HEIGHT / 2],
      j = 10,
      scale = 1,
      // yLine = [],
      // xGrid = [],
      beta = 0,
      alpha = 0,
      key = function (d) {
        return d.id;
      },
      startAngle = Math.PI / 4;

    const svgG = svg
      .call(
        d3.drag().on("drag", dragged).on("start", dragStart).on("end", dragEnd)
      )
      .append("g");

    var mx, my, mouseX, mouseY;

    // var grid3d = _3d()
    //   .shape("GRID", 20)
    //   .origin(origin)
    //   .rotateY(startAngle)
    //   .rotateX(-startAngle)
    //   .scale(scale);

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

    // var yScale3d = _3d()
    //   .shape("LINE_STRIP")
    //   .origin(origin)
    //   .rotateY(startAngle)
    //   .rotateX(-startAngle)
    //   .scale(scale);

    function processData(data, tt) {
      /* ----------- GRID ----------- */

      // var xGrid = svgG.selectAll("path.grid").data(data[0], key);

      // xGrid
      //   .enter()
      //   .append("path")
      //   .attr("class", "_3d grid")
      //   .merge(xGrid)
      //   .attr("stroke", "black")
      //   .attr("stroke-width", 0.3)
      //   .attr("fill", function (d) {
      //     return d.ccw ? "lightgrey" : "#717171";
      //   })
      //   .attr("fill-opacity", 0.9)
      //   .attr("d", grid3d.draw);

      // xGrid.exit().remove();

      /* ----------- POINTS ----------- */

      var points = svgG.selectAll("circle").data(data, key);

      points
        .enter()
        .append("circle")
        .attr("class", "_3d")
        .attr("opacity", 0)
        .attr("cx", (d) => {
          posPointX(d);
        })
        .attr("cy", posPointY)
        .merge(points)
        .transition()
        .duration(tt)
        .attr("r", 3)
        .attr("stroke", function (d) {
          return d3.color(color()(d.id)).darker(3);
        })
        .attr("fill", function (d) {
          return color()(d.id);
        })
        .attr("opacity", 1)
        .attr("cx", posPointX)
        .attr("cy", posPointY);

      points.exit().remove();

      /* ----------- y-Scale ----------- */

      // var yScale = svgG.selectAll("path.yScale").data(data[2]);

      // yScale
      //   .enter()
      //   .append("path")
      //   .attr("class", "_3d yScale")
      //   .merge(yScale)
      //   .attr("stroke", "black")
      //   .attr("stroke-width", 0.5)
      //   .attr("d", yScale3d.draw);

      // yScale.exit().remove();

      // /* ----------- y-Scale Text ----------- */

      // var yText = svgG.selectAll("text.yText").data(data[2][0]);

      // yText
      //   .enter()
      //   .append("text")
      //   .attr("class", "_3d yText")
      //   .attr("dx", ".3em")
      //   .merge(yText)
      //   .each(function (d) {
      //     d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
      //   })
      //   .attr("x", function (d) {
      //     return d.projected.x;
      //   })
      //   .attr("y", function (d) {
      //     return d.projected.y;
      //   })
      //   .text(function (d) {
      //     return d[1] <= 0 ? d[1] : "";
      //   });

      // yText.exit().remove();

      d3.selectAll("._3d").sort(_3d().sort);
    }

    function posPointX(d) {
      return d.projected.x;
    }

    function posPointY(d) {
      return d.projected.y;
    }

    function init() {
      // Laying out nodes=========

      const groups = [...new Set(nodes.map((d) => "" + d.group))];

      const gridSizeForGroup = {};
      const groupHash = {};

      nodes.forEach((node) => {
        const groupName = "" + node.group;
        groupHash[groupName]
          ? groupHash[groupName].push(node)
          : (groupHash[groupName] = [node]);
      });

      nodes.forEach((node) => {
        const groupName = "" + node.group;
        gridSizeForGroup[groupName] = Math.ceil(
          Math.sqrt(groupHash[groupName].length)
        );
      });

      const DEPTH = WIDTH;
      const yPointScale = d3.scalePoint([0, DEPTH]).domain(groups);

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
            node.x = jj * dx + rand();
            node.z = ii * dz + rand();
            node.y = yPointScale(gKey) + rand();
            //xGrid.push([jj * dx + rand(), 1, ii * dz + rand()]);
            jj++;
          } else {
            jj = 0;
            ii++;
            node.x = jj * dx + rand();
            node.z = ii * dz + rand();
            node.y = yPointScale(gKey) + rand();
            //xGrid.push([jj * dx + rand(), 1, ii * dz + rand()]);
            jj++;
          }
        });
      });

      // =========

      // d3.range(-1, 11, 1).forEach(function (d) {
      //   yLine.push([-j, -d, -j]);
      // });

      const data = point3d(nodes);
      processData(data, 1000);
    }

    function dragStart(e) {
      mx = e.x;
      my = e.y;
    }

    function dragged(e) {
      mouseX = mouseX || 0;
      mouseY = mouseY || 0;
      beta = ((e.x - mx + mouseX) * Math.PI) / 230;
      alpha = (((e.y - my + mouseY) * Math.PI) / 230) * -1;
      const data = point3d
        .rotateY(beta + startAngle)
        .rotateX(alpha - startAngle)(nodes);
      processData(data, 0);
    }

    function dragEnd(e) {
      mouseX = e.x - mx + mouseX;
      mouseY = e.y - my + mouseY;
    }

    d3.selectAll("button").on("click", init);

    init();

    //

    // this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
  }
}
