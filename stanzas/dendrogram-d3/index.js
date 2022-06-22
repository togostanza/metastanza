import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
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

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    // Setting color scale
    const togostanzaColors = [];
    for (let i = 0; i < 6; i++) {
      togostanzaColors.push(css(`--togostanza-theme-series_${i}_color`));
    }

    const color = d3.scaleOrdinal().range(togostanzaColors);

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("dendrogram-d3");

    const existingSvg = root.getElementsByTagName("svg")[0];
    if (existingSvg) {
      existingSvg.remove();
    }

    const denroot = d3
      .stratify()
      .parentId((d) => d.parent)(values)
      .sort(function (a, b) {
        return a.height - b.height || a.id.localeCompare(b.id);
      });

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

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
      .size([height, width - maxLabelWidth - rootLabelWidth - 8 * 2]);

    tree(denroot);

    g.selectAll(".link")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d) => diagonal(d));

    const node = g
      .selectAll(".node")
      .data(denroot.descendants())
      .enter()
      .append("g")
      .attr(
        "class",
        (d) => "node" + (d.children ? " node--internal" : " node--leaf")
      )
      .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")");

    node
      .append("circle")
      .attr("r", 4)
      .attr("fill", (d) => color(d.depth));

    node
      .append("text")
      .attr("dy", 3)
      .attr("x", (d) => (d.children ? -8 : 8))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name);

    function diagonal(d) {
      return (
        "M" +
        d.y +
        "," +
        d.x +
        "C" +
        (d.parent.y + 100) +
        "," +
        d.x +
        " " +
        (d.parent.y + 100) +
        "," +
        d.parent.x +
        " " +
        d.parent.y +
        "," +
        d.parent.x
      );
    }
  }
}
