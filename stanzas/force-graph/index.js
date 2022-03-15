import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import drawGridLayout from "./drawGridLayout";
import drawArcLayout from "./drawArcLayout";
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
    console.log("render");
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

    this._data = values;

    const nodes = values.nodes;
    const links = values.links;

    const count = {};
    for (const element of links) {
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

    const width = parseInt(this.params["width"]) || 300;
    const height = parseInt(this.params["height"]) || 200;

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

    const drawForceSim = () => {
      const gLinks = svg.append("g").attr("class", "links");
      const gNodes = svg.append("g").attr("class", "nodes");

      const simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
        .force(
          "link",
          d3
            .forceLink()
            .links(links)
            .id((d) => d.id)
            .distance(50)
            .strength(0.5)
        )
        .force(
          "collide",
          d3
            .forceCollide()
            .radius((d) => sizeScale(count[d.id]))
            .iterations(2)
            .strength(0.9)
        )
        .on("tick", ticked);

      const joinedLinks = gLinks
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "gray");

      function updateLinks() {
        joinedLinks
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      }
      function updateNodes() {
        joinedNodes.attr("transform", (d) => {
          const r = sizeScale(count[d.id]);
          const dx = Math.max(r, Math.min(width - r, d.x));
          const dy = Math.max(r, Math.min(width - r, d.y));
          d.x = dx;
          d.y = dy;
          return `translate(${dx},${dy})`;
        });
        //joinedNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
      }

      function ticked() {
        updateLinks();
        updateNodes();
      }

      const joinedNodes = gNodes
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(drag(simulation));

      joinedNodes
        .append("circle")
        .attr("r", (d) => {
          return sizeScale(count[d.id]);
        })
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("fill", (d) => color(d.id))
        .attr("data-tooltip", (d) => d.id);

      joinedNodes
        .append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function (d) {
          return d.id;
        });

      function drag(simulation) {
        function dragstarted(event) {
          if (!event.active) {
            simulation.alphaTarget(0.3).restart();
          }
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          if (!event.active) {
            simulation.alphaTarget(0);
          }
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }
    };

    // Useful functions

    switch (this.params["layout"]) {
      case "force":
        drawForceSim();
        break;
      case "arc":
        drawArcLayout.call(this, nodes, links);
        break;
      case "grid":
        drawGridLayout.call(this, nodes, links);
        break;
      default:
        break;
    }

    this.tooltip.setup(this.root.querySelectorAll("circle[data-tooltip]"));
  }
}
