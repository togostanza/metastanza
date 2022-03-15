import Stanza from "togostanza/stanza";
import * as d3 from "d3";
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

    // Setting node size scale
    const sizeScale = d3.scaleSqrt([0, d3.max(Object.values(count))], [4, 16]);

    // Setting color scale
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

    const marker = svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("refX", 12)
      .attr("refY", 6)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("markerWidth", 12)
      .attr("markerHeight", 18)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6");

    const drawArcDiagram = (nodes, edges) => {
      const nodeHash = {};
      nodes.forEach((node, i) => {
        nodeHash[node.id] = node;
        node.x = parseInt(i) * 10;
      });
      edges.forEach((edge) => {
        edge.weight = parseInt(edge.value);
        edge.source = nodeHash[edge.source];
        edge.target = nodeHash[edge.target];
      });

      const arcG = svg
        .append("g")
        .attr("id", "arcG")
        .attr("transform", `translate(50,${height / 2})`);

      arcG
        .selectAll("path")
        .data(edges)
        .enter()
        .append("path")
        .attr("class", "arc")
        .style("stroke-width", (d) => d.weight * 0.5)
        .style("stroke", (d) => color(d.source.id))
        .style("stroke-opacity", 0.25)
        .style("fill", "none")
        .attr("d", arc)
        .attr("marker-end", "url(#arrow)");

      arcG
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("fill", (d) => color(d.id))
        .attr("r", (d) => sizeScale(count[d.id]))
        .attr("cx", (d) => d.x);

      svg.selectAll("circle").on("mouseover", nodeOver);
      svg.selectAll("path").on("mouseover", edgeOver);
      svg.selectAll("circle").on("mouseout", nodeOut);
      svg.selectAll("path").on("mouseout", edgeOut);

      function nodeOut() {
        d3.select(this).classed("active", false);
        svg.selectAll("path").classed("active", false);
      }

      function edgeOut() {
        d3.select(this).classed("active", false);
        svg.selectAll("circle").classed("active", false);
      }

      function nodeOver(e, d) {
        svg.selectAll("circle").classed("active", (p) => p === d);
        svg
          .selectAll("path")
          .classed("active", (p) => p.source === d || p.target === d);
      }
      function edgeOver(e, d) {
        svg.selectAll("path").classed("active", (p) => p === d);
        svg
          .selectAll("circle")
          .classed("source", (p) => p === d.source)
          .classed("target", (p) => p === d.target);
      }
    };

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

    const drawGridLayout = (nodes, edges) => {
      const nodeHash = {};

      const marX = 50;
      const marY = 30;

      let ii = 0;
      let jj = 0;
      const gridSize = Math.ceil(Math.sqrt(nodes.length));
      console.log(gridSize);
      const dx = (width - 2 * marX) / (gridSize - 1);
      const dy = (height - 2 * marY) / (gridSize - 1);

      nodes.forEach((node) => {
        if (jj < gridSize) {
          node.x = jj * dx;
          node.y = ii * dy;
          jj++;
        } else {
          jj = 0;
          ii++;
          node.x = jj * dx;
          node.y = ii * dy;
          jj++;
        }
        nodeHash[node.id] = node;
      });
      edges.forEach((edge) => {
        edge.weight = parseInt(edge.value);
        edge.source = nodeHash[edge.source];
        edge.target = nodeHash[edge.target];
      });

      const gridG = svg
        .append("g")
        .attr("id", "gridG")
        .attr("transform", `translate(${marX},${marY})`);

      gridG
        .selectAll("path")
        .data(edges)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke-width", (d) => d.weight * 0.5)
        .style("stroke", (d) => color(d.source.id))
        .style("stroke-opacity", 0.25)
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      gridG
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("fill", (d) => color(d.id))
        .attr("r", (d) => sizeScale(count[d.id]))
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      gridG.on("mouseover", function (e, d) {});
    };

    // Useful functions

    function arc(d) {
      var draw = d3.line().curve(d3.curveBasis);
      var midX = (d.source.x + d.target.x) / 2;
      var midY = (d.source.x - d.target.x) * 2;
      return draw([
        [d.source.x, 0],
        [midX, midY],
        [d.target.x, 0],
      ]);
    }

    switch (this.params["layout"]) {
      case "force":
        drawForceSim();
        break;
      case "arc":
        drawArcDiagram(nodes, links);
        break;
      case "grid":
        drawGridLayout(nodes, links);
        break;
      default:
        break;
    }

    this.tooltip.setup(this.root.querySelectorAll("circle[data-tooltip]"));
  }
}
