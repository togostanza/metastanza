import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import uid from "./uid";
import loadData from "togostanza-utils/load-data"; //"@/lib/load-data";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "togostanza-utils"; // from "@/lib/metastanza_utils.js"; //
import shadeColor from "./shadeColor";
import treemapBinaryLog from "./treemapBinaryLog";

export default class TreeMapStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "treeMapstanza"),
      downloadPngMenuItem(this, "treeMapstanza"),
    ];
  }

  async render() {
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    appendCustomCss(this, this.params["custom-css-url"]);

    const width = this.params["width"];
    const height = this.params["height"];
    const logScale = this.params["log-scale"];
    const borderWidth = this.params["gap-width"];

    const colorScale = [];

    // in metadata.json there is 6 colors for color scheme
    for (let i = 0; i < 6; i++) {
      colorScale.push(css(`--togostanza-series-${i}-color`));
    }

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this.renderTemplate({ template: "stanza.html.hbs" });

    // filter out all elements with n=0
    const filteredData = data.filter(
      (item) => (item.children && !item.n) || (item.n && item.n > 0)
    );

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
      borderWidth,
    };

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

function draw(el, dataset, opts) {
  const { width, height, logScale, colorScale, borderWidth } = opts;

  const nested = d3
    .stratify()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parent;
    })(dataset);

  // Height of upper "root" element tile
  const rootHeight = getLineHeight(el) * 1.3;

  // Height of the rest chart
  let adjustedHeight = height - rootHeight;

  if (adjustedHeight < 0) {
    adjustedHeight = 10;
  }

  const x = d3.scaleLinear().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([0, adjustedHeight]);

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

  const color = d3.scaleOrdinal(colorScale);

  //move and scale children nodes to fit into parent nodes
  function tile(node, x0, y0, x1, y1) {
    treemapBinaryLog(node, 0, 0, width, adjustedHeight);
    for (const child of node.children) {
      child.x0 = x0 + (child.x0 / width) * (x1 - x0);
      child.x1 = x0 + (child.x1 / width) * (x1 - x0);
      child.y0 = y0 + (child.y0 / adjustedHeight) * (y1 - y0);
      child.y1 = y0 + (child.y1 / adjustedHeight) * (y1 - y0);
    }
  }

  const treemap = (data) =>
    d3.treemap().tile(tile)(
      d3
        .hierarchy(data)
        .sum((d) => d.data.n)
        .sort((a, b) => b.value - a.value)
        .each((d) => {
          d.value2 = transformValue(logScale, d.value);
        })
    );

  const svg = d3
    .select(el)
    .append("div")
    .style("width", width + "px")
    .style("height", height + "px")
    .style("overflow", "hidden")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  let group = svg.append("g").call(render, treemap(nested), null);

  function render(group, root, zoomInOut) {
    group
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", `${width}px`)
      .attr("height", `${height}px`)
      .attr("style", "fill: var(--togostanza-background-color)");

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

    node
      .append("rect")
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)

      .attr("style", (d) => {
        return `fill: ${
          d === root
            ? "var(--togostanza-background-color)"
            : color(d.data.data.label)
        }`;
      });

    //Add inner nodes to show that it's a zoomable tile
    const innerNode = node
      .filter((d) => {
        return d !== root && d.children;
      })
      .selectAll("g")
      .data((d) => d.children)
      .join("g");

    innerNode
      .append("rect")
      .attr("id", (d) => (d.leafUid = uid("leaf")).id)
      .attr("fill", "none")
      .attr("stroke-width", 1)
      .attr("stroke", (d) => shadeColor(color(d.parent.data.data.label), -15));

    innerNode
      .append("clipPath")
      .attr("id", (d) => (d.clipUid = uid("clip")).id)
      .append("use")
      .attr("href", (d) => d.leafUid.href);

    //add clip paths to nodes to trim text
    node
      .append("clipPath")
      .attr("id", (d) => (d.clipUid = uid("clip")).id)
      .append("use")
      .attr("href", (d) => d.leafUid.href);

    //add text contents
    node
      .append("text")
      .attr("clip-path", (d) => d.clipUid)
      .attr("y", "1.5em")
      .attr("x", "0.5rem")
      .text((d) => {
        if (d === root) {
          return name(d);
        } else {
          return `${d.data.data.label}`;
        }
      });

    // append expand icon
    // node
    //   .filter((d) => d !== root && d.children)
    //   .append("image")
    //   .attr("width", 10)
    //   .attr("height", 10)
    //   .attr("href", expandSvg);

    //adjust rectangles positions
    group.call(position, root, true, zoomInOut);
  }

  //function to wrap long text in svg
  function wrap(root, isFirstRender, zoomInOut, d, i, nodes) {
    // on positioning elements that are about to display

    if (isFirstRender) {
      let lineSeparator;

      //nodes[i] is rect
      const text = d3.select(nodes[i].parentNode).select("text");

      if (text.empty()) {
        return;
      }

      const isRoot = d === root;

      let maxWidth;
      if (isRoot) {
        lineSeparator = /(?=[/])/g;
        maxWidth = width;
      } else {
        lineSeparator = /\s+/;
        maxWidth = width / 6;
      }

      const words = text.text().split(lineSeparator).reverse();

      let word,
        line = [],
        lineNumber = 0;
      const lineHeight = 1.15, // rems
        x = text.attr("x") || 0,
        y = text.attr("y") || 0,
        dy = 0;

      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);

        tspan.text(line.join(isRoot ? "" : " "));
        if (tspan.node().getComputedTextLength() > maxWidth - 5) {
          if (isRoot) {
            line.shift();
            line[0] = `..${line[0]}`;
            tspan.text(line.join(""));
          } else {
            if (line.length < 2) {
              continue;
            }
            line.pop();
            tspan.text(line.join(" "));
            line = [word];

            //set tspan to last added tspan and append word that didnt fit
            tspan = text
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      }

      text
        .append("tspan")
        .attr("class", "number-label")
        .attr("dy", "1.6em")
        .attr("x", "0.5rem")
        .text((d) => format(d3.sum(d, (d) => d?.data?.data?.n || 0)));
    }
  }

  //place elements according to data
  function position(group, root, isFirstRender, zoomInOut) {
    const a = group.selectAll("g").attr("transform", (d) => {
      if (d === root) {
        return `translate(0,0)`;
      } else if (d.parent !== root) {
        return `translate(${x(d.x0) - x(d.parent.x0)},${
          y(d.y0) - y(d.parent.y0)
        })`;
      } else {
        return `translate(${x(d.x0) + borderWidth},${
          y(d.y0) + rootHeight + borderWidth
        })`;
      }
    });

    // Placing icons in the middle of nodes
    // group
    //   .selectAll("image")
    //   .attr("x", (d) => {
    //     if (x(d.x0) === width) {
    //       return (
    //         (x(d.x0) + x(d.x1)) / 2 - x(d.x0) - iconWidth / 2 - 2 * borderWidth
    //       );
    //     } else {
    //       return (
    //         (x(d.x0) + x(d.x1)) / 2 - x(d.x0) - iconWidth / 2 - borderWidth
    //       );
    //     }
    //   })
    //   .attr("y", (d) => {
    //     if (y(d.y0) === height) {
    //       return (
    //         (y(d.y0) + y(d.y1) - 2 * borderWidth) / 2 - y(d.y0) - iconHeight / 2
    //       );
    //     } else {
    //       return (
    //         (y(d.y0) + y(d.y1) - borderWidth) / 2 - y(d.y0) - iconHeight / 2
    //       );
    //     }
    //   });

    a.select("rect")
      .attr("width", (d) => {
        if (d === root) {
          return width;
        } else if (x(d.x1) === width) {
          if (x(d.x1) - x(d.x0) - 2 * borderWidth < 0) {
            return 0;
          }
          return x(d.x1) - x(d.x0) - 2 * borderWidth;
        } else {
          if (x(d.x1) - x(d.x0) - borderWidth < 0) {
            return 0;
          }
          return x(d.x1) - x(d.x0) - borderWidth;
        }
      })
      .attr("height", (d) => {
        if (d === root) {
          return rootHeight;
        } else if (y(d.y1) === adjustedHeight) {
          if (y(d.y1) - y(d.y0) - 2 * borderWidth < 0) {
            return 0;
          }
          return y(d.y1) - y(d.y0) - 2 * borderWidth;
        } else {
          if (y(d.y1) - y(d.y0) - borderWidth < 0) {
            return 0;
          }
          return y(d.y1) - y(d.y0) - borderWidth;
        }
      })
      .each(wrap.bind(this, root, isFirstRender, zoomInOut));
  }

  // When zooming in, draw the new nodes on top, and fade them in.
  function zoomin(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.append("g").call(render, d, "zoomin"));

    //re-define domain for scaling

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    svg
      .transition()
      .duration(750)
      .call((t) => {
        return group0.transition(t).remove().call(position, d.parent, false);
      })

      .call((t) =>
        group1
          .transition(t)
          .attrTween("opacity", () => d3.interpolate(0, 1))
          .call(position, d, false)
      );
  }

  // When zooming out, draw the old nodes on top, and fade them out.
  function zoomout(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg
      .insert("g", "*")
      .call(render, d.parent, "zoomout"));

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
          .call(position, d, false)
      )
      .call((t) => group1.transition(t).call(position, d.parent, false));
  }
}

// Get text line height
function getLineHeight(el) {
  var temp = document.createElement(el.nodeName),
    ret;
  temp.setAttribute(
    "style",
    "margin:0; padding:0; " +
      "font-family:" +
      (el.style.fontFamily || "inherit") +
      "; " +
      "font-size:" +
      (el.style.fontSize || "inherit")
  );
  temp.innerHTML = "A";

  el.parentNode.appendChild(temp);
  ret = temp.clientHeight;
  temp.parentNode.removeChild(temp);

  return ret;
}
