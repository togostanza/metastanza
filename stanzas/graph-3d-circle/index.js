import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import { _3d } from "d3-3d";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
// import drawGridLayout from "./drawGridLayout";
import prepareGraphData from "./prepareGraphData";
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
      downloadSvgMenuItem(this, "graph-3d-circle"),
      downloadPngMenuItem(this, "graph-3d-circle"),
      downloadJSONMenuItem(this, "graph-3d-circle", this._data),
      downloadCSVMenuItem(this, "graph-3d-circle", this._data),
      downloadTSVMenuItem(this, "graph-3d-circle", this._data),
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
    const el = this.root.getElementById("graph-3d-circle");

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

    const edgeSym = Symbol.for("nodeAdjEdges");
    const groupSym = Symbol.for("nodeGroup");
    const edgeWidthSym = Symbol.for("edgeWidth");
    const sourceNodeSym = Symbol.for("sourceNode");
    const targetNodeSym = Symbol.for("targetNode");
    const nodeSizeSym = Symbol.for("nodeSize");
    const nodeColorSym = Symbol.for("nodeColor");
    const nodeLabelSym = Symbol.for("nodeLabel");
    const edgeColorSym = Symbol.for("edgeColor");

    const symbols = {
      edgeSym,
      edgeWidthSym,
      sourceNodeSym,
      targetNodeSym,
      nodeSizeSym,
      nodeColorSym,
      groupSym,
      edgeColorSym,
      nodeLabelSym,
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

    const { prepNodes, prepEdges } = prepareGraphData(nodes, edges, params);

    const groupHash = {};
    const nodeHash = {};
    prepNodes.forEach((node) => {
      const groupName = "" + node.group;
      groupHash[groupName]
        ? groupHash[groupName].push(node)
        : (groupHash[groupName] = [node]);
      nodeHash["" + node.id] = node;
    });

    prepEdges.forEach((edge, index) => {
      edge.id = `edge${index}`;
    });

    const maxNodesInGroup = d3.max(
      Object.entries(groupHash),
      (d) => d[1].length
    );

    const R = Math.min(WIDTH, HEIGHT) / 2;

    const arcLength = ((2 * Math.PI) / maxNodesInGroup) * R;

    const origin = [WIDTH / 2, HEIGHT / 2];

    const scale = 0.75;

    let isDragging = false;

    const key = function (d) {
      return d.id;
    };

    const startAngle = Math.PI / 4;

    const groupColor = color().domain(Object.keys(groupHash).sort());

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

    const plane3d = _3d()
      .shape("PLANE")
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    function processData(data) {
      const planes = svgG.selectAll("path").data(data[2], (d) => d.groupId);

      planes
        .enter()
        .append("path")
        .attr("class", "_3d")
        .classed("group-plane", true)
        .merge(planes)
        .attr("fill", (d) => {
          return groupColor("" + d.groupId);
        })
        .attr("opacity", 0.2)
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 1)
        .attr("d", plane3d.draw)
        .sort(plane3d.sort);

      planes.exit().remove();

      const linesStrip = svgG.selectAll("line").data(data[1], (d) => d.edge.id);

      linesStrip
        .enter()
        .append("line")
        .attr("class", "_3d")
        .classed("link", true)
        .merge(linesStrip)
        .style("stroke", (d) => d.edge[edgeColorSym])
        .style("stroke-width", (d) => d.edge[edgeWidthSym])
        .attr("x1", (d) => d.edge[sourceNodeSym].projected.x)
        .attr("y1", (d) => d.edge[sourceNodeSym].projected.y)
        .attr("x2", (d) => d.edge[targetNodeSym].projected.x)
        .attr("y2", (d) => d.edge[targetNodeSym].projected.y)
        .sort(edge3d.sort);

      linesStrip.exit().remove();

      const points = svgG.selectAll("circle").data(data[0], key);

      points
        .enter()
        .append("circle")
        .attr("class", "_3d")
        .classed("node", true)
        .merge(points)
        .attr("cx", posPointX)
        .attr("cy", posPointY)
        .attr("r", 3)
        .style("stroke", function (d) {
          return d3.color(d[symbols.nodeColorSym].trim()).darker(3);
        })
        .style("fill", function (d) {
          return d[symbols.nodeColorSym];
        })
        .attr("opacity", 1)
        .attr("data-tooltip", (d) => d.id)
        .sort(point3d.sort);

      points.exit().remove();

      planes.on("mouseover", function (_e, d) {
        if (isDragging) {
          return;
        }

        // const groupId = d.groupId;
        const group = d.group;

        const nodesIdsInGroup = group.map((node) => node.id);

        const edgesConnectedToThisGroup = prepEdges.filter((edge) => {
          return (
            nodesIdsInGroup.includes(edge.source) ||
            nodesIdsInGroup.includes(edge.target)
          );
        });

        const sourcesGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[sourceNodeSym].group
        );
        const targetsGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[targetNodeSym].group
        );

        const connectedTargetNodes = edgesConnectedToThisGroup.map(
          (edge) => edge.target
        );

        const connectedSourceNodes = edgesConnectedToThisGroup.map(
          (edge) => edge.source
        );

        const allConnectedNodes = [
          ...new Set([...connectedTargetNodes, ...connectedSourceNodes]),
        ];
        const connectedNodes = allConnectedNodes.filter(
          (nodeId) => !nodesIdsInGroup.includes(nodeId)
        );

        const allGroups = [...new Set([...sourcesGroups, ...targetsGroups])];
        const connectedGroups = allGroups.filter(
          (group) => group !== d.groupId
        );

        planes.classed("fadeout", true);
        planes.classed("active", false);
        planes.classed("half-active", false);

        planes
          .filter((p) => {
            return connectedGroups.includes(p.groupId);
          })
          .classed("fadeout", false)
          .classed("half-active", true);

        d3.select(this).classed("active", true).classed("fadeout", false);

        // highlight nodes belonging to this group
        points.classed("fadeout", true);
        points.classed("active", false);
        points.classed("half-active", false);

        points
          .filter((p) => {
            return nodesIdsInGroup.includes(p.id);
          })
          .classed("fadeout", false)
          .classed("active", true);

        points
          .filter((p) => {
            return connectedNodes.includes("" + p.id);
          })
          .classed("fadeout", false)
          .classed("half-active", true);

        // highlight edges that belongs to this group
        linesStrip.classed("fadeout", true);

        linesStrip
          .filter((p) => {
            // console.log("connectedNodes", connectedNodes);
            // console.log("nodesIdsInGroup", nodesIdsInGroup);

            return (
              (connectedNodes.includes(p.edge[sourceNodeSym].id) ||
                connectedNodes.includes(p.edge[targetNodeSym].id)) &&
              (nodesIdsInGroup.includes(p.edge[sourceNodeSym].id) ||
                nodesIdsInGroup.includes(p.edge[targetNodeSym].id))
            );
          })
          .classed("fadeout", false)
          .classed("half-active", true)
          .classed("dashed", true);

        linesStrip
          .filter(
            (p) =>
              nodesIdsInGroup.includes(p.edge[sourceNodeSym].id) &&
              nodesIdsInGroup.includes(p.edge[targetNodeSym].id)
          )
          .classed("fadeout", false)
          .classed("active", true);
      });

      planes.on("mouseleave", () => {
        if (isDragging) {
          return;
        }
        linesStrip.classed("fadeout", false);
        linesStrip.classed("active", false);
        linesStrip.classed("half-active", false);
        linesStrip.classed("dashed", false);
        planes.classed("active", false);
        planes.classed("fadeout", false);
        planes.classed("half-active", false);
        points.classed("fadeout", false);
        points.classed("active", false);
        points.classed("half-active", false);
      });

      points.on("mouseover", function (e, d) {
        if (isDragging) {
          return;
        }
        // highlight current node
        d3.select(this).classed("active", true);
        const edgeIdsOnThisNode = d[edgeSym].map((edge) => edge.id);
        // fade out all other nodes, highlight a little connected ones
        points
          .classed("fadeout", (p) => d !== p)
          .classed("half-active", (p) => {
            return (
              p !== d &&
              d[edgeSym].some(
                (edge) => edge[sourceNodeSym] === p || edge[targetNodeSym] === p
              )
            );
          });
        // fadeout not connected edges, highlight connected ones
        console.log("node group:", d.group);
        linesStrip
          .classed("fadeout", (p) => !edgeIdsOnThisNode.includes(p.edge.id))
          .classed("active", (p) => edgeIdsOnThisNode.includes(p.edge.id));
      });

      points.on("mouseleave", function () {
        if (isDragging) {
          return;
        }
        linesStrip
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
        points
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
      });
    }

    function posPointX(d) {
      return d.projected.x;
    }

    function posPointY(d) {
      return d.projected.y;
    }

    let groupPlanes = [];

    const edgesWithCoords = prepEdges.map((edge) => {
      const toPush = [
        [edge[sourceNodeSym].x, edge[sourceNodeSym].y, edge[sourceNodeSym].z],
        [edge[targetNodeSym].x, edge[targetNodeSym].y, edge[targetNodeSym].z],
      ];
      toPush.edge = edge;
      return toPush;
    });

    function init() {
      // Laying out nodes=========

      // const gridSizeForGroup = {};

      const DEPTH = WIDTH;
      const yPointScale = d3
        .scalePoint([-DEPTH / 2, DEPTH / 2])
        .domain(Object.keys(groupHash));

      // add random noise to position to prevent fully overlapping edges

      const rand = () => {
        return 0;
      }; // d3.randomNormal(0, 5);

      Object.keys(groupHash).forEach((gKey) => {
        // Laying out nodes ===

        const group = groupHash[gKey];

        const angleScale = d3
          .scalePoint()
          .domain(group.map((node) => node.id))
          .range([0, Math.PI * 2 - (Math.PI * 2) / group.length]);

        const R = arcLength / ((Math.PI * 2) / group.length);

        group.forEach((node) => {
          if (group.length === 1) {
            node.x = 0;
            node.z = 0;
            node.y = yPointScale(gKey) + rand();
            return;
          }

          node.x = R * Math.cos(angleScale(node.id));
          node.z = R * Math.sin(angleScale(node.id));
          node.y = yPointScale(gKey) + rand();
        });
      });

      function getGroupPlane(group) {
        const y = yPointScale(group);
        const LU = [-WIDTH / 2, y, -HEIGHT / 2];
        const LD = [-WIDTH / 2, y, HEIGHT / 2];
        const RD = [WIDTH / 2, y, HEIGHT / 2];
        const RU = [WIDTH / 2, y, -HEIGHT / 2];
        const groupPlane = [LU, LD, RD, RU];
        groupPlane.group = groupHash[group];
        groupPlane.groupId = group;
        return groupPlane;
      }

      groupPlanes = Object.keys(groupHash).map(getGroupPlane);

      const data = [
        point3d(prepNodes),
        edge3d(edgesWithCoords),
        plane3d(groupPlanes),
      ];
      processData(data);
    }

    function dragStart(e) {
      isDragging = true;
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
        point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          prepNodes
        ),
        edge3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          edgesWithCoords
        ),
        plane3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(
          groupPlanes
        ),
      ];
      processData(data);
    }

    function dragEnd(e) {
      isDragging = false;
      mouseX = e.x - mx + mouseX;
      mouseY = e.y - my + mouseY;
    }

    init();

    this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
  }
}
