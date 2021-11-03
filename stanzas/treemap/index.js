import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import uid from "./uid";
import loadData from "@/lib/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "@/lib/metastanza_utils.js";

import expandSvg from "./assets/expand-solid.svg";

export default class TreeMapStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "treeMapstanza"),
      downloadPngMenuItem(this, "treeMapstanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const width = this.params["width"];
    const height = this.params["height"];
    const colorScale = this.params["color-scale"];
    const logScale = this.params["log-scale"];
    const edgeWidth = css("--togostanza-edge-width");
    const borderWidth = css("--togostanza-border-width");

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this.renderTemplate({ template: "stanza.html.hbs" });

    // filter out all elements with n=0

    const filteredData = data.filter(
      (item) => (item.children && !item.n) || (item.n && item.n > 0)
    );

    // if (logScale) {
    //   filteredData = filteredData.map((item) => {
    //     if (item.n) {
    //       return { ...item, n: transformValue(logScale, item.n) };
    //     }
    //     return item;
    //   });
    // }
    //Add root element if there are more than one elements without parent. D3 cannot process data with more than one root elements
    const rootElemIndexes = [];
    for (let i = 0; i < filteredData.length - 1; i++) {
      if (!filteredData[i]?.parent) {
        rootElemIndexes.push(i);
      }
    }
    if (rootElemIndexes.length > 1) {
      filteredData.push({ id: -1, value: "", label: "" });

      rootElemIndexes.forEach((index) => {
        filteredData[index].parent = -1;
      });
    }

    const treeMapElement = this.root.querySelector("#treemap");

    const opts = {
      width,
      height,
      colorScale,
      logScale,
      edgeWidth,
      borderWidth,
      styles: {
        "background-color": css("--togostanza-background-color"),
      },
    };

    //draw(treeMapElement, data, width, height, colorScale);
    draw(treeMapElement, filteredData, opts);
  }
}

function transformValue(logScale, value) {
  if (!value || value <= 0) {
    return null;
  }

  if (logScale) {
    return Math.log10(value);
  }
  return value;
}

function transformValueBack(logScale, value) {
  if (!value) {
    return null;
  }
  if (logScale) {
    return Math.exp(value);
  }
  return value;
}

function draw(el, dataset, opts) {
  const iconWidth = 10;
  const iconHeight = 10;

  const {
    width,
    height,
    logScale,
    colorScale,
    styles,
    edgeWidth,
    borderWidth,
  } = opts;
  // create nested structure by item.parent
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

  // make path-like string for node
  const name = (d) => {
    if (d.data.data.id === -1) {
      return "/";
    }
    return d
      .ancestors()
      .reverse()
      .map((d) => {
        return d.data.data.label;
      })
      .join("/");
  };

  const format = d3.format(",d");

  const color = d3.scaleOrdinal(d3[colorScale]);

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
      d3
        .hierarchy(data)
        .sum((d) => transformValue(logScale, d.data.n))
        .sort((a, b) => b.value - a.value)
    );
  //create svg and add outline
  const svg = d3
    .select(el)
    .append("svg")
    .attr("viewBox", [0, -30, width, height + 30]);
  // .style("font-family", styles["--togostanza-font-family"])
  // .attr(
  //   "style",
  //   `outline: ${styles["border-width"]}px solid ${styles["edge-color"]};`
  // );

  //create g insige svg and generate all contents inside
  let group = svg.append("g").call(render, treemap(nested));
  // svg
  //   .append("rect")
  //   .attr("width", width)
  //   .attr("height", height + 30)
  //   .attr("class", "svg-border");

  function render(group, root) {
    const dMax = d3.max(root, (d) => d.value || 1);
    const dMin = d3.min(root, (d) => d.value || 1);

    //add g's for every node
    const node = group
      .selectAll("g")
      .data(root.children.concat(root))
      .join("g");

    node
      .filter((d) => {
        return d === root ? d.parent : d.children;
      })
      .attr("cursor", "pointer")
      .on("click", (event, d) => (d === root ? zoomout(root) : zoomin(d)));

    //add popup description
    node
      .append("title")
      .text((d) =>
        d === root
          ? ""
          : `${name(d)}\n${
              d?.children
                ? format(d3.sum(d, (d) => d?.data?.data?.n || 0))
                : d.data.data.n
            }`
      );

    //add rectangle for every node
    node
      .append("rect")
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)
      .attr("fill", (d) =>
        d === root
          ? styles["background-color"]
          : color((d.value - dMin) / (dMax - dMin))
      );

    // //add expand icons
    // node
    //   .filter((d) => d !== root || !d.children)
    //   .append("image")
    //   .attr("x", (d, i, nodes) => {
    //     console.log(
    //       d3.select(nodes[i].parentNode).select("rect")
    //     );
    //     return x((d.x1 - d.x0) / 2) - iconWidth / 2;
    //   })
    //   .attr("y", (d) => y((d.y1 - d.y0) / 2) - iconHeight / 2)
    //   .attr("width", 10)
    //   .attr("height", 10)
    //   .attr("href", expandSvg);

    //add clip paths to nodes to trim text
    node
      .append("clipPath")
      .attr("id", (d) => (d.clipUid = uid("clip")).id)
      .append("use")
      .attr("href", (d) => d.leafUid.href);

    //add text contents
    const txt = node
      .append("text")
      .attr("clip-path", (d) => d.clipUid)
      .attr("font-weight", (d) => (d === root ? "bold" : null))
      .attr("y", (d) => `${d.y0 + 10}px`)
      .attr("x", "0.5em")

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
      .text((d) => {
        if (d === root) {
          return name(d);
        } else {
          return `${d.data.data.label}: ${format(
            d3.sum(d, (d) => d?.data?.data?.n || 0)
          )}`;
        }
        //return `${d.data.label} : ${d?.value}`;
      });

    //adjust rectangles positions
    group.call(position, root);
  }

  //function to wrap long text in svg
  function wrap(ii, d, i, nodes) {
    // on positioning elements that are about to display

    if (!ii) {
      let lineSeparator;

      //nodes[i] is rect
      const text = d3.select(nodes[i].parentNode).select("text");

      let rectWidth = nodes[i].width.animVal.value; //d3.select(nodes[i]).select("rect").attr("width");

      // here is d before animation. animVal - is d in animation
      //get to know if this is a root element (white bar at the top)
      const isRoot = Math.round(rectWidth) === Math.round(width);

      if (isRoot) {
        lineSeparator = /(?=[\/])|(?<=[\/])/g;
      } else {
        console.log(text.text());
        console.log(nodes[i].width.animVal.value);
        lineSeparator = /\s+/;
      }
      let words = text.text().split(lineSeparator).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x") || 0,
        y = text.attr("y") || 0,
        dy = 0,
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(isRoot ? "" : " "));
        if (tspan.node().getComputedTextLength() > rectWidth - 5) {
          //   text.style("display", "none");
          //   break;
          // }
          line.pop();
          tspan.text(line.join(isRoot ? "" : " "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    }
  }

  //place elements according to data
  function position(group, root, ii) {
    group
      .selectAll("g")
      .attr("transform", (d) =>
        d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`
      )
      .select("rect")
      .attr("width", (d) => (d === root ? width : x(d.x1) - x(d.x0)))
      .attr("height", (d) => (d === root ? 30 : y(d.y1) - y(d.y0)))
      .each(wrap.bind(this, ii));

    //console.log("position called: ", ii);
    //.select((d, i, nodes) => d3.select(nodes[i].parentNode));
    // .select("image")
    // .attr("x", (d) => x(d.x1 - d.x0) / 2)
    // .attr("y", (d) => y(d.y1 - d.y0) / 2)
    // .attr("width", 10)
    // .attr("height", 10)
    // .attr("href", expandSvg);
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
      .call((t) => {
        return group0.transition(t).remove().call(position, d.parent, 1);
      })
      .call((t) =>
        group1
          .transition(t)
          .attrTween("opacity", () => d3.interpolate(0, 1))
          .call(position, d, 2)
      );
    //.on("end", wrap);
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
          .call(position, d, 2)
      )
      .call((t) => group1.transition(t).call(position, d.parent, 1));
    //.on("end", wrap);
  }
}
