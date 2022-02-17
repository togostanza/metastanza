import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import Legend from "@/lib/Legend";
import ToolTip from "@/lib/ToolTip";
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

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this._data = values;

    const nodes = d3.map(values.nodes, (d) => ({ id: d.id }));
    const links = d3.map(values.links, (d) => ({
      source: d.source,
      target: d.target,
    }));

    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-series-${i}-color`));
    }

    const color = d3.scaleOrdinal().range(togostanzaColors);

    const width = parseInt(this.params["width"]) || 300;
    const height = parseInt(this.params["height"]) || 200;

    const root = this.root.querySelector(":scope > div");

    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
    }

    const svg = d3
      .select(root)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const gLinks = svg.append("g").attr("class", "links");
    const gNodes = svg.append("g").attr("class", "nodes");

    const draw = () => {
      const simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-40))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force(
          "link",
          d3
            .forceLink()
            .links(links)
            .id((d) => d.id)
            .distance(20)
        )
        .on("tick", ticked);

      const joinedLinks = gLinks
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "black");

      function updateLinks() {
        joinedLinks
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      }
      function updateNodes() {
        joinedNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
      }

      function ticked() {
        updateLinks();
        updateNodes();
      }

      const joinedNodes = gNodes
        .selectAll("circle")
        .data(nodes)
        .join(
          (enter) => {
            //const g = enter.append("g").attr("class", "node");
            return enter
              .append("circle")
              .attr("r", 7)
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("fill", (d) => color(d.id))
              .attr("data-tooltip", (d) => d.id);

            // return g;
          },
          (update) => update,
          (exit) => {
            exit.remove();
          }
        )

        .call(drag(simulation));

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

    draw();

    this.tooltip.setup(this.root.querySelectorAll("circle[data-tooltip]"));
  }
}
