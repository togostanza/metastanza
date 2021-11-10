import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "@/lib/load-data";
import uid from "./uid";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "@/lib/metastanza_utils.js";

export default class Sunburst extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "sunburstStanza"),
      downloadPngMenuItem(this, "sunburstStanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const width = this.params["width"];
    const height = this.params["height"];
    const colorScale = this.params["color-scale"];

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    //Add root element if there are more than one elements without parent. D3 cannot precess data with more than one root elements
    let rootElemIndexes = [];
    for (let i = 0; i < data.length - 1; i++) {
      if (!data[i]?.parent) {
        rootElemIndexes.push(i);
      }
    }
    if (rootElemIndexes.length > 1) {
      data.push({ id: -1, value: "", label: "" });

      rootElemIndexes.forEach((index) => {
        data[index].parent = -1;
      });
    }

    const sunburstElement = this.root.querySelector("#chart");

    const opts = {
      width,
      height,
      colorScale,
      styles: {
        "font-family": css("--togostanza-font-family"),
        "label-font-color": css("--togostanza-label-font-color"),
        "label-font-size": css("--togostanza-label-font-size"),
        "border-color": css("--togostanza-border-color"),
        "border-width": css("--togostanza-border-width"),
        "edge-color": css("--togostanza-edge-color"),
        "background-color": css("--togostanza-background-color"),
      },
    };

    draw(sunburstElement, data, opts);
  }
}

function draw(el, dataset, opts) {
  const { width, height, colorScale: customColorScale, styles } = opts;

  const radius = Math.min(width, height) / 2;

  const data = d3
    .stratify()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parent;
    })(dataset);

  const maxRadius = Math.min(width, height) / 2 - 5;

  const formatNumber = d3.format(",d");

  const x = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);

  const y = d3.scaleSqrt().range([maxRadius * 0.1, maxRadius]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const partition = d3.partition();

  const arc = d3
    .arc()
    .startAngle((d) => x(d.x0))
    .endAngle((d) => x(d.x1))
    .innerRadius((d) => Math.max(0, y(d.y0)))
    .outerRadius((d) => Math.max(0, y(d.y1)));

  const middleArcLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      angles.reverse();
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  const textFits = (d) => {
    const CHAR_SPACE = 6;

    const deltaAngle = x(d.x1) - x(d.x0);
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    const perimeter = r * deltaAngle;

    return d.data.data.label.length * CHAR_SPACE < perimeter;
  };

  const svg = d3
    .select(el)
    .append("svg")
    .style("width", width)
    .style("height", height)
    .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
    .on("click", () => focusOn()); // Reset zoom on canvas click

  const root = d3.hierarchy(data);
  root.sum((d) => d.data.n);

  const slice = svg.selectAll("g.slice").data(partition(root).descendants());

  slice.exit().remove();

  const newSlice = slice
    .enter()
    .append("g")
    .attr("class", "slice")
    .on("click", (e, d) => {
      console.log(d);
      e.stopPropagation();
      focusOn(d);
    });

  newSlice
    .append("title")
    .text((d) => d.data.data.label + "\n" + formatNumber(d.value));

  newSlice
    .append("path")
    .attr("class", "main-arc")
    .style("fill", (d) => color((d.children ? d : d.parent).data.data.label))
    .attr("d", arc);

  //textPath
  newSlice
    .append("path")
    .attr("class", "hidden-arc")
    .attr("id", (_, i) => `hiddenArc${i}`)
    .attr("d", middleArcLine);

  const text = newSlice
    .append("text")
    .attr("display", (d) => (textFits(d) ? null : "none"));

  // Add white contour
  // text
  //   .append("textPath")
  //   .attr("startOffset", "50%")
  //   .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
  //   .text((d) => d.data.data.label)
  //   .style("fill", "none")
  //   .style("stroke", "#fff")
  //   .style("stroke-width", 0.5)
  //   .style("stroke-linejoin", "round");

  text
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
    .text((d) => d.data.data.label);

  function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
    // Reset to top-level if no data point specified

    const transition = svg
      .transition()
      .duration(750)
      .tween("scale", () => {
        const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]);
        return (t) => {
          x.domain(xd(t));
          y.domain(yd(t));
        };
      });

    transition.selectAll("path.main-arc").attrTween("d", (d) => () => arc(d));

    transition
      .selectAll("path.hidden-arc")
      .attrTween("d", (d) => () => middleArcLine(d));

    transition
      .selectAll("text")
      .attrTween("display", (d) => () => textFits(d) ? null : "none");

    moveStackToFront(d);

    //

    function moveStackToFront(elD) {
      svg
        .selectAll(".slice")
        .filter((d) => d === elD)
        .each(function (d) {
          this.parentNode.appendChild(this);
          if (d.parent) {
            moveStackToFront(d.parent);
          }
        });
    }
  }
  // const svg = d3
  //   .select(el)
  //   .append("svg")
  //   .attr("width", width)
  //   .attr("height", height);

  // const defs = svg.append("defs");
  // const g = svg
  //   .append("g")
  //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // const colorScale = d3.scaleOrdinal(d3[customColorScale]);

  // const rScale = d3.scaleLinear().domain([0, radius]).range([0, radius]);

  // const root = d3.hierarchy(data);

  // root.each((d) => (d.current = d));

  // root
  //   .sum(function (d) {
  //     return d.data.n;
  //     // return d?.children ? 0 : 1;
  //   })
  //   .sort(function (a, b) {
  //     return b.value - a.value;
  //   });

  // const partition = d3.partition().size([2 * Math.PI, radius]);

  // partition(root);

  // const arc = d3
  //   .arc()
  //   .startAngle(function (d) {
  //     return d.x0;
  //   })
  //   .endAngle(function (d) {
  //     return d.x1;
  //   })
  //   .innerRadius(function (d) {
  //     return rScale(d.y0);
  //   })
  //   .outerRadius(function (d) {
  //     return rScale(d.y1);
  //   });

  // // div for tooltips
  // const div = d3
  //   .select("#chart")
  //   .append("div")
  //   .style("position", "absolute")
  //   .style("visibility", "hidden")

  //   .attr("class", "tooltip")
  //   .style("opacity", 0);

  // const innerG = g.selectAll("g").data(root.descendants()).enter().append("g");

  // innerG
  //   .append("path")
  //   .attr("d", arc)
  //   .attr("id", (d) => (d.leafUid = uid("leaf")).id)
  //   .attr("stroke", "#fff")
  //   .attr("fill", function (d) {
  //     while (d.depth > 1) d = d.parent;
  //     if (d.depth == 0) return "lightgray";
  //     return colorScale(d.value);
  //   })
  //   .attr("opacity", 0.8)
  //   .append("title")
  //   .text(function (d) {
  //     return d.data.data.label + "\n" + d.value;
  //   });

  // innerG
  //   .append("clipPath")
  //   .attr("id", (d) => (d.clipUid = uid("clip")).id)
  //   .append("use")
  //   .attr("href", (d) => d.leafUid.href);

  // innerG
  //   .append("path")
  //   .attr("d", (d) => {
  //     const context = d3.path();

  //     let startAngle = d.x0 - Math.PI / 2,
  //       endAngle = d.x1 - Math.PI / 2,
  //       sweep = 0;

  //     if (
  //       (d.x1 + d.x0) / 2 > (90 * Math.PI) / 180 &&
  //       (d.x1 + d.x0) / 2 < (270 * Math.PI) / 180
  //     ) {
  //       startAngle = d.x1 - Math.PI / 2;
  //       endAngle = d.x0 - Math.PI / 2;
  //       sweep = 1;
  //     }

  //     context.arc(0, 0, (d.y1 + d.y0) / 2, startAngle, endAngle, sweep);

  //     return context.toString();
  //   })
  //   .attr("id", (d) => (d.guideId = uid("guide")).id)
  //   .style("display", "none");
  // // .style("fill", "none")
  // // .style("stroke", "#000")
  // // .style("stroke-width", "1px");

  // const labels = g
  //   .selectAll("text")
  //   .data(root.descendants())
  //   .enter()
  //   .append("text")
  //   .append("textPath")
  //   .attr("clip-path", (d) => d.clipUid)
  //   .attr("href", (d) => {
  //     return d.guideId.href;
  //   })
  //   .attr("fill", "black")
  //   .attr("dy", "5px")
  //   .style("font-size", "6px")
  //   .attr("text-anchor", "middle")
  //   .attr("startOffset", "50%")

  //   .text(function (d) {
  //     return d.data.data.label;
  //   });

  // labels.each(wrap);

  // // function labelTransform(d) {
  // //   const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
  // //   const y = (d.y0 + d.y1) / 2;

  // //   return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  // // }

  // function wrap(d, i, nodes) {
  //   const maxWidthTangential = ((d.x1 - d.x0) * (d.y0 + d.y1)) / 2;

  //   const text = d3.select(nodes[i]);
  //   let words = d.data.data.label.split(/\s+/).reverse(),
  //     word,
  //     line = [],
  //     lineNumber = 0,
  //     lineHeight = 0.9, // ems
  //     x = text.attr("x") || 0,
  //     y = text.attr("y") || 0,
  //     dy = 0,
  //     tspan = text
  //       .text(null)
  //       .append("tspan")
  //       .attr("x", x)
  //       .attr("y", y)
  //       .attr("dy", dy + "em");

  //   while ((word = words.pop())) {
  //     line.push(word);
  //     tspan.text(line.join(" "));

  //     if (tspan.node().getComputedTextLength() > maxWidthTangential - 5) {
  //       if (line.length === 1) {
  //         // if there is only one word in line and its not fitting then hide it all
  //         tspan.attr("display", "none");
  //         text.attr("display", "none");
  //         break;
  //       }

  //       line.pop();
  //       tspan.text(line.join(" "));
  //       line = [word];
  //       tspan = text
  //         .append("tspan")
  //         .attr("x", x)
  //         .attr("y", y)
  //         .attr("dy", ++lineNumber * lineHeight + dy + "em")
  //         .text(word);
  //     }
  //   }
  //   console.log("text length:", text.node().getComputedTextLength());
  // }
}
