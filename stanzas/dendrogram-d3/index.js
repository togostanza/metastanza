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

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

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
    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-theme-series_${i}_color`));
    }

    const color = d3.scaleOrdinal().range(togostanzaColors);

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("dendrogram-d3");

    const existingSvg = root.getElementsByTagName("svg")[0];
    existingSvg?.remove();

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

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const rootGroup = svg
      .append("text")
      .attr("x", 5)
      .attr("y", 10)
      .text(
        denroot.descendants()[0].data[this.params["node-label-data_key"]] || ""
      );

    const rootLabelWidth = rootGroup.node().getBBox().width;
    rootGroup.remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${rootLabelWidth + 8},0)`);

    const tempGroup = svg.append("g");

    const data = denroot.descendants().slice(1);
    const maxDepth = d3.max(data, (d) => d.depth);

    const labelsarray = [];
    for (const n of data) {
      if (n.depth === maxDepth) {
        labelsarray.push(n.data[this.params["node-label-data_key"]] || "");
      }
    }

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

    let glaphType = d3.tree();

    if (this.params["glaph-type"] === "tree") {
      glaphType = d3.tree();
    } else {
      glaphType = d3.cluster();
    }

    denroot.x0 = height / 2;
    denroot.y0 = 0;

    const update = (source) => {
      glaphType.size([
        height,
        width - maxLabelWidth - rootLabelWidth - labelMargin * 2,
      ]);

      let i = 0;

      glaphType(denroot);

      const node = g
        .selectAll(".node")
        .data(denroot.descendants(), (d) => d.id || (d.id = ++i));

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", "translate(" + source.y0 + "," + source.x0 + ")")
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
        .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")");

      nodeUpdate
        .select("circle")
        .attr("r", parseFloat(this.params["node-size-fixed_size"] / 2))
        .attr("fill", (d) => (d._children ? "#fff" : color(d.depth)));

      node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", "translate(" + source.y + "," + source.x + ")")
        .remove();

      const link = g
        .selectAll(".link")
        .data(denroot.links(), (d) => d.target.id);

      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
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

    if (showToolTips) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}
