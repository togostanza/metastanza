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
        return a.data[this.params["node-label-data_key"]].localeCompare(
          b.data[this.params["node-label-data_key"]]
        );
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
      .text(denroot.descendants()[0].data.name);

    const rootLabelWidth = rootGroup.node().getBBox().width;
    rootGroup.remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${rootLabelWidth + 8},0)`);

    const tempGroup = svg.append("g");

    const nodesMap = new Map();
    denroot.descendants().forEach((node) => {
      nodesMap.set(node.id, node);
    });

    function toggleChildren(id) {
      if (nodesMap.get(id).children) {
        nodesMap.get(id)._children = nodesMap.get(id).children;
        nodesMap.get(id).children = null;
      } else if (nodesMap.get(id)._children) {
        nodesMap.get(id).children = nodesMap.get(id)._children;
        nodesMap.get(id)._children = null;
      }
    }

    const update = () => {
      const data = denroot.descendants().slice(1);
      const maxDepth = d3.max(data, (d) => d.depth);
      const labelsarray = [];
      for (const n of data) {
        if (n.depth === maxDepth) {
          labelsarray.push(n.data.name);
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

      const tree = d3
        .tree()
        .size([
          height,
          width - maxLabelWidth - rootLabelWidth - labelMargin * 2,
        ]);

      tree(denroot);

      const linkUpdate = g.selectAll(".link").data(data, (d) => d.id);

      const linkEnter = linkUpdate
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", (d) => diagonalFlat(d));

      const linkExit = linkUpdate.exit().remove();

      linkEnter
        .merge(linkUpdate)
        .transition()
        .attr("d", (d) => diagonal(d));

      // const nodeUpdate = g
      //   .selectAll(".node")
      //   .data(denroot.descendants(), (d) => d.id);

      // const nodeEnter = nodeUpdate
      //   .enter()
      //   .append("circle")
      //   .attr("r", 0)
      //   .attr("cy", (d) => (d.parent ? d.parent.x : d.x))
      //   .attr("cx", (d) => (d.parent ? d.parent.y : d.y));

      // const nodeExit = nodeUpdate
      //   .exit()
      //   .transition()
      //   .attr("r", 0)
      //   .attr("cy", (d) => (d.parent ? d.parent.x : d.x))
      //   .attr("cx", (d) => (d.parent ? d.parent.y : d.y))
      //   .remove();

      // nodeEnter
      //   .merge(nodeUpdate)
      //   .attr("class", "node")
      //   .attr("fill", "gray")
      //   .on("click", (_, d) => {
      //     toggleChildren(d.id);
      //     update();
      //   })
      //   .transition()
      //   .attr("r", 5)
      //   .attr("cy", (d) => d.x)
      //   .attr("cx", (d) => d.y);

      const nodeUpdate = g
        .selectAll("g.node")
        .data(denroot.descendants(), (d) => d.id);

      console.log(denroot.descendants());
      const nodeEnter = nodeUpdate
        .enter()
        .append("g")
        .on("click", (_, d) => {
          toggleChildren(d.id);
          update();
        });

      nodeEnter.append("text");
      nodeEnter.append("circle");

      nodeUpdate
        .merge(nodeEnter)
        .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")");

      nodeUpdate.merge(nodeEnter).select("circle").attr("r", 5);

      nodeUpdate
        .merge(nodeEnter)
        .select("text")
        .text((d) => d.data.name);

      // mergedG.select("text").text((d) => d.data.name);
      // mergedG.select("circle").attr("r", 5);

      nodeUpdate.exit().remove();

      // if (showToolTips) {
      //   node.attr(
      //     "data-tooltip",
      //     (d) => d.data[this.params["tooltips-data_key"]]
      //   );
      // }

      // node
      //   .append("circle")
      //   .attr("r", 4)
      //   .attr("fill", (d) => color(d.depth));

      // node
      //   .append("text")
      //   .attr("dy", 3)
      //   .attr("x", (d) => (d.children ? -labelMargin : labelMargin))
      //   .style("text-anchor", (d) => (d.children ? "end" : "start"))
      //   .text((d) => d.data[this.params["node-label-data_key"]] || "");
    };
    update();

    function diagonal(d) {
      return (
        "M" +
        d.y +
        "," +
        d.x +
        "C" +
        (d.parent.y + 50) +
        "," +
        d.x +
        " " +
        (d.parent.y + 50) +
        "," +
        d.parent.x +
        " " +
        d.parent.y +
        "," +
        d.parent.x
      );
    }

    function diagonalFlat(d) {
      return (
        "M" +
        d.parent.y +
        "," +
        d.parent.x +
        "C" +
        (d.parent.y + 50) +
        "," +
        d.parent.x +
        " " +
        (d.parent.y + 50) +
        "," +
        d.parent.x +
        " " +
        d.parent.y +
        "," +
        d.parent.x
      );
    }
    if (showToolTips) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}
