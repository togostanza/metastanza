import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import { _3d } from "d3-3d";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import { getColorSeries } from "@/lib/ColorGenerator";
import prepareGraphData, {
  get3DEdges,
  getGroupPlanes,
} from "@/lib/prepareGraphData";
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
      downloadSvgMenuItem(this, "layered-graph"),
      downloadPngMenuItem(this, "layered-graph"),
      downloadJSONMenuItem(this, "layered-graph", this._data),
      downloadCSVMenuItem(this, "layered-graph", this._data),
      downloadTSVMenuItem(this, "layered-graph", this._data),
    ];
  }

  async render() {
    const setFallbackNumVal = (value, defVal) => {
      return isNaN(parseFloat(value)) ? defVal : value;
    };

    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("layered-graph");

    //data
    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = values;

    //params

    const width = setFallbackNumVal(css("--togostanza-outline-width"), 200);
    const height = setFallbackNumVal(css("--togostanza-outline-height"), 200);
    const MARGIN = getMarginsFromCSSString(css("--togostanza-outline-padding"));

    // Setting color scale
    const togostanzaColors = getColorSeries(this);

    const nodes = values.nodes;
    const edges = values.links;

    const HEIGHT = height - MARGIN.TOP - MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    const color = function () {
      return d3.scaleOrdinal().range(togostanzaColors);
    };

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

    const constRarius = !!this.params["group_planes-constant_radius"];

    const groupPlaneColorParams = {
      basedOn: this.params["group-plane-color-based-on"],
      // default fixed color by css
    };

    const groupsSortParams = {
      sortBy: this.params["group-planes-sort-by"],
      sortOrder: this.params["group-planes-sort-order"] || "ascending",
    };

    const nodesSortParams = {
      sortBy: this.params["nodes-sort-by"],
      sortOrder: this.params["nodes-sort-order"] || "ascending",
    };

    const nodeSizeParams = {
      dataKey: this.params["node-size-key"] || "",
      minSize: setFallbackNumVal("node-size-min", 0),
      maxSize: this.params["node-size-max"],
      scale: this.params["node-size-scale"] || "linear",
    };

    // const nodeSizeParams = {
    //   basedOn: this.params["node-size-based-on"] || "fixed",
    //   dataKey: this.params["node-size-data-key"] || "",
    //   fixedSize: this.params["node-fixed-size"] || 3,
    //   minSize: this.params["node-min-size"],
    //   maxSize: this.params["node-max-size"],
    // };

    const nodeColorParams = {
      basedOn: this.params["node-color-based-on"] || "fixed",
      dataKey: this.params["node-color-data-key"] || "",
    };

    const edgeWidthParams = {
      basedOn: this.params["edge-width-based-on"] || "fixed",
      dataKey: this.params["edge-width-data-key"] || "",
      fixedWidth: this.params["edge-fixed-width"] || 1,
      minWidth: this.params["edge-min-width"],
      maxWidth: this.params["edge-max-width"],
    };

    const edgeColorParams = {
      basedOn: this.params["edge-color-based-on"] || "fixed",
      dataKey: this.params["edge-color-data-key"] || "",
    };

    const tooltipParams = {
      dataKey: this.params["nodes-tooltip-data-key"],
      show: nodes.some((d) => d[this.params["nodes-tooltip-data-key"]]),
    };

    const highlightAdjEdges = this.params["highlight-adjacent-edges"] || false;
    const highlightGroupPlanes = this.params["highlight-group-planes"] || false;

    const params = {
      MARGIN,
      width,
      height,
      svg,
      color,
      highlightAdjEdges,
      nodeSizeParams,
      nodesSortParams,
      groupsSortParams,
      nodeColorParams,
      edgeWidthParams,
      edgeColorParams,
      tooltipParams,
    };

    const { prepNodes, prepEdges, groupHash, symbols } = prepareGraphData(
      nodes,
      edges,
      params
    );

    const maxNodesInGroup = d3.max(
      Object.entries(groupHash),
      (d) => d[1].length
    );

    const Rmax = (0.8 * WIDTH) / 2;

    const arcLength = ((2 * Math.PI) / maxNodesInGroup) * Rmax;

    const origin = [MARGIN.LEFT + WIDTH / 2, MARGIN.TOP + HEIGHT / 2];
    const scale = 0.75;

    let isDragging = false;

    const key = function (d) {
      return d.id;
    };

    const startAngle = (Math.PI * 8) / 180;

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
        .attr("style", (d) => `fill: ${d.color}`)
        .attr("d", plane3d.draw)
        .sort(plane3d.sort);

      planes.exit().remove();
      const linesStrip = svgG
        .selectAll("line")
        .data(data[1], (d) => d.edge[symbols.idSym]);

      linesStrip
        .enter()
        .append("line")
        .attr("class", "_3d")
        .classed("link", true)
        .merge(linesStrip)
        .style("stroke", (d) => d.edge[symbols.edgeColorSym])
        .style("stroke-width", (d) => d.edge[symbols.edgeWidthSym])
        .attr("x1", (d) => d.edge[symbols.sourceNodeSym].projected.x)
        .attr("y1", (d) => d.edge[symbols.sourceNodeSym].projected.y)
        .attr("x2", (d) => d.edge[symbols.targetNodeSym].projected.x)
        .attr("y2", (d) => d.edge[symbols.targetNodeSym].projected.y)
        .sort(edge3d.sort);

      linesStrip.exit().remove();

      const points = svgG.selectAll("circle").data(data[0], key);

      const p = points
        .enter()
        .append("circle")
        .attr("class", "_3d")
        .classed("node", true)
        .merge(points)
        .attr("cx", posPointX)
        .attr("cy", posPointY)
        .attr("r", (d) => d[symbols.nodeSizeSym])
        .style("stroke", (d) => d[symbols.nodeBorderColorSym])
        .style("fill", (d) => d[symbols.nodeColorSym])
        .sort(point3d.sort);

      if (tooltipParams.show) {
        p.attr("data-tooltip", (d) => d[tooltipParams.dataKey]);
      }

      points.exit().remove();
    }

    function posPointX(d) {
      return d.projected.x;
    }

    function posPointY(d) {
      return d.projected.y;
    }

    let groupPlanes = [];

    let edgesWithCoords = [];
    function init() {
      // Add x,y,z of source and target nodes to 3D edges
      edgesWithCoords = get3DEdges(prepEdges);

      // Laying out nodes=========
      const DEPTH = HEIGHT;
      const yPointScale = d3.scalePoint([-DEPTH / 2, DEPTH / 2]).domain(
        Object.keys(groupHash).sort((a, b) => {
          if (a > b) {
            return groupsSortParams.sortOrder === "ascending" ? 1 : -1;
          }
          if (a < b) {
            return groupsSortParams.sortOrder === "ascending" ? -1 : 1;
          }
          return 0;
        })
      );

      Object.keys(groupHash).forEach((gKey) => {
        // Laying out nodes ===

        const group = groupHash[gKey];

        const angleScale = d3
          .scalePoint()
          .domain(group.map((node) => node.id))
          .range([0, Math.PI * 2 - (Math.PI * 2) / group.length]);

        const R = constRarius
          ? Rmax
          : arcLength / ((Math.PI * 2) / group.length);

        group.forEach((node) => {
          if (group.length === 1) {
            node.x = 0;
            node.z = 0;
            node.y = yPointScale(gKey);
            return;
          }

          node.x = R * Math.cos(angleScale(node.id));
          node.z = R * Math.sin(angleScale(node.id));
          node.y = yPointScale(gKey);
        });
      });

      groupPlanes = getGroupPlanes(groupHash, {
        WIDTH,
        HEIGHT,
        DEPTH,
        color,
        yPointScale,
        groupPlaneColorParams,
      });

      const data = [
        point3d(prepNodes),
        edge3d(edgesWithCoords),
        plane3d(groupPlanes),
      ];

      processData(data);

      const planes = svgG.selectAll("path.group-plane");
      const points = svgG.selectAll("circle.node");
      const links = svgG.selectAll("line.link");

      if (highlightGroupPlanes) {
        addPlanesHighlight(planes, points, links);
      }

      if (highlightAdjEdges) {
        addEdgesHighlight(points, links);
      }
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

    function addPlanesHighlight(planes, points, links) {
      planes.on("mouseover", function (_e, d) {
        if (isDragging) {
          return;
        }

        const group = d.group;

        const nodesIdsInGroup = group.map((node) => node.id);

        const edgesConnectedToThisGroup = prepEdges.filter((edge) => {
          return (
            nodesIdsInGroup.includes(edge.source) ||
            nodesIdsInGroup.includes(edge.target)
          );
        });

        const sourcesGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[symbols.sourceNodeSym].group
        );
        const targetsGroups = edgesConnectedToThisGroup.map(
          (edge) => "" + edge[symbols.targetNodeSym].group
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
        links.classed("fadeout", true);

        links
          .filter((p) => {
            return (
              (connectedNodes.includes(p.edge[symbols.sourceNodeSym].id) ||
                connectedNodes.includes(p.edge[symbols.targetNodeSym].id)) &&
              (nodesIdsInGroup.includes(p.edge[symbols.sourceNodeSym].id) ||
                nodesIdsInGroup.includes(p.edge[symbols.targetNodeSym].id))
            );
          })
          .classed("fadeout", false)
          .classed("half-active", true)
          .classed("dashed", true);

        links
          .filter(
            (p) =>
              nodesIdsInGroup.includes(p.edge[symbols.sourceNodeSym].id) &&
              nodesIdsInGroup.includes(p.edge[symbols.targetNodeSym].id)
          )
          .classed("fadeout", false)
          .classed("active", true);
      });

      planes.on("mouseleave", () => {
        if (isDragging) {
          return;
        }
        links.classed("fadeout", false);
        links.classed("active", false);
        links.classed("half-active", false);
        links.classed("dashed", false);
        planes.classed("active", false);
        planes.classed("fadeout", false);
        planes.classed("half-active", false);
        points.classed("fadeout", false);
        points.classed("active", false);
        points.classed("half-active", false);
      });
    }

    function addEdgesHighlight(points, links) {
      points.on("mouseover", function (e, d) {
        if (isDragging) {
          return;
        }

        // fade out all other nodes, highlight a little connected ones
        points.classed("fadeout", true);

        points
          .filter((p) => {
            return (
              p !== d &&
              d[symbols.edgeSym].some(
                (edge) =>
                  edge[symbols.sourceNodeSym] === p ||
                  edge[symbols.targetNodeSym] === p
              )
            );
          })
          .classed("half-active", true)
          .classed("fadeout", false);

        // highlight current node
        d3.select(this).classed("active", true).classed("fadeout", false);
        const edgeIdsOnThisNode = d[symbols.edgeSym].map(
          (edge) => edge[symbols.idSym]
        );

        // fadeout not connected edges, highlight connected ones
        links
          .classed(
            "fadeout",
            (p) => !edgeIdsOnThisNode.includes(p.edge[symbols.idSym])
          )
          .classed("active", (p) =>
            edgeIdsOnThisNode.includes(p.edge[symbols.idSym])
          );
      });

      points.on("mouseleave", function () {
        if (isDragging) {
          return;
        }
        links
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
        points
          .classed("active", false)
          .classed("fadeout", false)
          .classed("half-active", false);
      });
    }

    init();

    if (tooltipParams.show) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}

function getMarginsFromCSSString(str) {
  const splitted = str.trim().split(/\W+/);

  const res = {
    TOP: 0,
    RIGHT: 0,
    BOTTOM: 0,
    LEFT: 0,
  };

  switch (splitted.length) {
    case 1:
      res.TOP = res.RIGHT = res.BOTTOM = res.LEFT = parseInt(splitted[0]);
      break;
    case 2:
      res.TOP = res.BOTTOM = parseInt(splitted[0]);
      res.LEFT = res.RIGHT = parseInt(splitted[1]);
      break;
    case 3:
      res.TOP = parseInt(splitted[0]);
      res.LEFT = res.RIGHT = parseInt(splitted[1]);
      res.BOTTOM = parseInt(splitted[2]);
      break;
    case 4:
      res.TOP = parseInt(splitted[0]);
      res.RIGHT = parseInt(splitted[1]);
      res.BOTTOM = parseInt(splitted[2]);
      res.LEFT = parseInt(splitted[3]);
      break;
    default:
      break;
  }

  return res;
}
