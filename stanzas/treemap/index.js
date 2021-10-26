import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import * as d3Collection from "d3-collection";
import uid from "./uid";
import data from "./sampleData2";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
} from "@/lib/metastanza_utils.js";

export default class TreeMapStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "treeMapstanza"),
      downloadPngMenuItem(this, "treeMapstanza"),
    ];
  }

  async render() {
    this.renderTemplate({ template: "stanza.html.hbs" });

    let treeMapElement = this.root.querySelector("#treemap");

    const width = 300;
    const height = 200;

    data.push({ id: 0, value: "", label: "" });
    for (let i = 0; i < data.length - 1; i++) {
      if (!data[i]?.parent) {
        data[i].parent = 0;
      }
    }

    draw(treeMapElement, data, width, height);
  }
}

function draw(el, dataset, width, height) {
  const nested = d3
    .stratify()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parent;
    })(dataset);

  const x = d3.scaleLinear().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([0, height]);
  const name = (d) => {
    return d
      .ancestors()
      .reverse()
      .map((d) => {
        return d.data.data.label;
      })
      .join("/");
  };

  const format = d3.format(",d");
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  function tile(node, x0, y0, x1, y1) {
    d3.treemapBinary(node, 0, 0, width, height);
    for (const child of node.children) {
      child.x0 = x0 + (child.x0 / width) * (x1 - x0);
      child.x1 = x0 + (child.x1 / width) * (x1 - x0);
      child.y0 = y0 + (child.y0 / height) * (y1 - y0);
      child.y1 = y0 + (child.y1 / height) * (y1 - y0);
    }
  }

  const treemap = (data) =>
    d3.treemap().tile(tile)(
      d3.hierarchy(data).sum((d) => 1)
      //.sort((a, b) => b?.children?.length || 0 - a?.children?.length || 0)
    );

  const svg = d3
    .select(el)
    .append("svg")
    .attr("viewBox", [0.5, -30.5, width, height + 30])
    .style("font", "10px sans-serif");

  let group = svg.append("g").call(render, treemap(nested));

  function render(group, root) {
    // function to wrap text
    function wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", dy + "em");
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    }
    const dMax = d3.max(root, (d) => d?.children?.length || 1);
    const dMin = d3.min(root, (d) => d?.children?.length || 1);

    const node = group
      .selectAll("g")
      .data(root.children.concat(root))
      .join("g");

    node
      .filter((d) => (d === root ? d.parent : d.children))
      .attr("cursor", "pointer")
      .on("click", (event, d) => (d === root ? zoomout(root) : zoomin(d)));

    node
      .append("title")
      .text((d) => `${name(d)}\n${format(d?.children?.length || 0)}`);

    node
      .append("rect")
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)
      .attr("fill", (d) =>
        d === root ? "#fff" : color((d.value - dMin) / (dMax - dMin))
      ) //d.children ? "#ccc" : "#ddd"))
      .attr("stroke", "#fff");

    node
      .append("clipPath")
      .attr("id", (d) => (d.clipUid = uid("clip")).id)
      .append("use")
      .attr("href", (d) => d.leafUid.href);

    node

      .append("text")
      .attr("clip-path", (d) => d.clipUid)
      .attr("font-weight", (d) => (d === root ? "bold" : null))
      .attr("y", (d) => `${d.y0 + 10}px`)
      .attr("x", "0.1em")
      //.selectAll("tspan")
      // .data((d) => {
      //   return d === root ? name(d) : d.data.data.label;
      //   // .split(/(?=[A-Z][^A-Z])/g)
      //   // .concat(format(d.value));
      // })
      // .join("tspan")
      // .attr("x", 3)
      // .attr(
      //   "y",
      //   (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
      // )
      // .attr("fill-opacity", (d, i, nodes) =>
      //   i === nodes.length - 1 ? 0.7 : null
      // )
      // .attr("font-weight", (d, i, nodes) =>
      //   i === nodes.length - 1 ? "normal" : null
      // )
      .text((d) => d.data.data.label)
      .append("tspan")
      .attr("dy", "1.1em")
      .attr("x", "0.1em")
      .text((d) => {
        if (d === root) return "";
        else {
          if (d?.children?.length) {
            return d?.children?.length;
          }
          return "";
        }
      });

    //.call(wrap, (d) => d.x1 - d.x0);

    group.call(position, root);
  }

  //place elements according to data
  function position(group, root) {
    group
      .selectAll("g")
      .attr("transform", (d) =>
        d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`
      )
      .select("rect")
      .attr("width", (d) => (d === root ? width : x(d.x1) - x(d.x0)))
      .attr("height", (d) => (d === root ? 30 : y(d.y1) - y(d.y0)));
  }

  // When zooming in, draw the new nodes on top, and fade them in.
  function zoomin(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.append("g").call(render, d));

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    svg
      .transition()
      .duration(750)
      .call((t) => group0.transition(t).remove().call(position, d.parent))
      .call((t) =>
        group1
          .transition(t)
          .attrTween("opacity", () => d3.interpolate(0, 1))
          .call(position, d)
      );
  }

  // When zooming out, draw the old nodes on top, and fade them out.
  function zoomout(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.insert("g", "*").call(render, d.parent));

    x.domain([d.parent.x0, d.parent.x1]);
    y.domain([d.parent.y0, d.parent.y1]);

    svg
      .transition()
      .duration(750)
      .call((t) =>
        group0
          .transition(t)
          .remove()
          .attrTween("opacity", () => d3.interpolate(1, 0))
          .call(position, d)
      )
      .call((t) => group1.transition(t).call(position, d.parent));
  }
}
