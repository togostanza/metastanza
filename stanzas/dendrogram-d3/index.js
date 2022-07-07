import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import { getColorSeries } from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Dendrogram extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "dendrogram"),
      downloadPngMenuItem(this, "dendrogram"),
      downloadJSONMenuItem(this, "dendrogram", this._data),
      downloadCSVMenuItem(this, "dendrogram", this._data),
      downloadTSVMenuItem(this, "dendrogram", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    //data
    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const labelMargin = !isNaN(parseFloat(this.params["node-label-margin"]))
      ? this.params["node-label-margin"]
      : 5;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = values;

    const showToolTips =
      !!this.params["tooltips-data_key"] &&
      values.some((item) => item[this.params["tooltips-data_key"]]);

    // Setting color scale
    const togostanzaColors = getColorSeries(this);
    const color = togostanzaColors[0];

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("dendrogram-d3");

    const denroot = d3
      .stratify()
      .parentId((d) => d.parent)(values)
      .sort((a, b) => {
        if (
          a.data[this.params["node-label-data_key"]] &&
          b.data[this.params["node-label-data_key"]]
        ) {
          return a.data[this.params["node-label-data_key"]].localeCompare(
            b.data[this.params["node-label-data_key"]]
          );
        } else {
          return 0;
        }
      });

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    if (this.params["graph-direction"] === "portrait") {
      svg.attr("transform", `rotate(90)`);
    } else {
      svg.attr("transform", `rotate(0)`);
    }

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const rootGroup = svg
      .append("text")
      .text(
        denroot.descendants()[0].data[this.params["node-label-data_key"]] || ""
      );

    const rootLabelWidth = rootGroup.node().getBBox().width;
    rootGroup.remove();

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${rootLabelWidth + this.params["node-label-margin"]}, 0)`
      );

    const gContent = g.append("g");

    const data = denroot.descendants().slice(1);
    const maxDepth = d3.max(data, (d) => d.depth);

    const labelsarray = [];
    for (const n of data) {
      if (n.depth === maxDepth) {
        labelsarray.push(n.data[this.params["node-label-data_key"]] || "");
      }
    }

    const tempGroup = svg.append("g");
    tempGroup
      .selectAll("text")
      .data(labelsarray)
      .enter()
      .append("text")
      .text((d) => d);
    const maxLabelWidth = tempGroup.node().getBBox().width;
    tempGroup.remove();

    const toggle = (d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    };

    let graphType = d3.tree();

    if (this.params["graph-type"] === "tree") {
      graphType = d3.tree();
    } else {
      graphType = d3.cluster();
    }

    denroot.x0 = height / 2;
    denroot.y0 = 0;

    const update = (source) => {
      graphType.size([
        height,
        width - maxLabelWidth - rootLabelWidth - labelMargin * 2,
      ]);

      let i = 0;

      graphType(denroot);

      const node = gContent
        .selectAll(".node")
        .data(denroot.descendants(), (d) => d.id || (d.id = ++i));

      const nodeEnter = node
        .enter()
        .append("g")
        .classed("node", true)
        .attr("transform", `translate(${source.y0}, ${source.x0})`)
        .on("click", (e, d) => {
          toggle(d);
          update(d);
        });

      nodeEnter
        .append("circle")
        .attr("data-tooltip", (d) => d.data[this.params["tooltips-data_key"]])
        .classed("with-children", (d) => d.children);

      nodeEnter
        .append("text")
        .attr("x", (d) =>
          d.children || d._children ? -labelMargin : labelMargin
        )
        .attr("dy", "3")
        .attr("text-anchor", (d) =>
          d.children || d._children ? "end" : "start"
        )
        .text((d) => d.data[this.params["node-label-data_key"]] || "");

      const nodeUpdate = nodeEnter.merge(node);
      const duration = 500;

      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

      nodeUpdate
        .select("circle")
        .attr("r", parseFloat(this.params["node-size-fixed_size"] / 2))
        .attr("fill", (d) =>
          d._children ? "#fff" : d["data"]["color"] || color
        );

      node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", `translate(${source.y}, ${source.x})`)
        .remove();

      const link = gContent
        .selectAll(".link")
        .data(denroot.links(), (d) => d.target.id);

      const linkEnter = link
        .enter()
        .insert("path", "g")
        .classed("link", true)
        .attr("d", d3.linkHorizontal().x(source.y0).y(source.x0));

      const linkUpdate = linkEnter.merge(link);
      linkUpdate
        .transition()
        .duration(duration)
        .attr(
          "d",
          d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x)
        );

      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", d3.linkHorizontal().x(source.y).y(source.x))
        .remove();

      node.each((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };
    update(denroot);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 40])
      // .translateExtent([
      //   [-100, -100],
      //   [width + 90, height + 100],
      // ])
      .extent([
        [20, 0],
        [width, height],
      ])
      .on("zoom", (e) => {
        zoomed(e);
      });

    svg.call(zoom);

    function zoomed(e) {
      gContent.attr("transform", e.transform);
    }

    if (showToolTips) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}
