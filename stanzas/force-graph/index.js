import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import Legend from "@/lib/Legend";
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

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector(":scope > div");

    const svg = d3.select(root).append("svg");
    const gLinks = svg.append("g").attr("class", "links");
    const gNodes = svg.append("g").attr("class", "nodes");

    function draw() {
      const width = 400,
        height = 400;
      const nodes = [
        { name: "A" },
        { name: "B" },
        { name: "C" },
        { name: "D" },
        { name: "E" },
        { name: "F" },
        { name: "G" },
        { name: "H" },
      ];

      const links = [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 1, target: 6 },
        { source: 3, target: 4 },
        { source: 3, target: 7 },
        { source: 4, target: 5 },
        { source: 4, target: 7 },
      ];

      svg.attr("width", width).attr("height", height);

      const color = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(nodes.map((item) => item.name));
      const simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink().links(links))
        .on("tick", ticked);

      function updateLinks() {
        gLinks
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("stroke", "black")
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      }

      function updateNodes() {
        gNodes
          .selectAll("g")
          .data(nodes)
          .join(
            (enter) => {
              const g = enter.append("g").attr("class", "node");
              g.append("circle")
                .attr("r", 10)
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("fill", (d) => color(d.name));
              g.append("text")
                .text((d) => d.name)
                .attr("dy", 5);
              return g;
            },
            (update) => update,
            (exit) => {
              exit.remove();
            }
          )
          .attr("transform", (d) => `translate(${d.x},${d.y})`);
      }

      function ticked() {
        updateLinks();
        updateNodes();
      }
    }

    draw();
  }
}
