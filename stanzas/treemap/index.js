import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "@/lib/metastanza_utils.js";

export default class TreeMapStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "treeMapstanza"),
      downloadPngMenuItem(this, "treeMapstanza"),
    ];
  }

  async render() {
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);
    // const url =
    //   "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json";

    // const json = await fetch(url);

    // const dataSet = await json.json();

    // console.log(dataSet);
    const data = {
      name: "A",
      children: [
        { name: "B", value: 25 },
        {
          name: "C",
          children: [
            { name: "D", value: 10 },
            { name: "E", value: 15 },
            { name: "F", value: 10 },
          ],
        },
        { name: "G", value: 15 },
        {
          name: "H",
          children: [
            { name: "I", value: 20 },
            { name: "J", value: 10 },
          ],
        },
        { name: "K", value: 10 },
      ],
    };
    this.renderTemplate({ template: "stanza.html.hbs" });

    let treeMapElement = this.root.querySelector("#treemap");

    const width = 300;
    const height = 200;
    draw(treeMapElement, data, width, height);
  }
}

function draw(el, dataset, width, height) {
  let svg = d3
    .select(el)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let root = d3.hierarchy(dataset).sum((d) => d.value);
  let treeMapLayout = d3.treemap().size([width, height]);
  treeMapLayout(root);

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => "translate(" + d.x0 + "," + d.y0 + ")")

    .append("rect")
    .attr("class", "tile")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return d3.schemeCategory10[parseInt(d.value % 7)];
    })
    .attr("data-name", (d) => d.data.name)
    .attr("data-value", (d) => d.data.value);

  svg
    .selectAll("g")
    .append("text")
    .attr("text-anchor", "start")
    .attr("x", 5)
    .attr("dy", 30)
    .attr("font-size", "60%")
    .attr("color", "white")
    .text((d) => {
      return d.data.name + ":" + d.value;
    });
}
