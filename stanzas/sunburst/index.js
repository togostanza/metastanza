import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "@/lib/load-data";

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
    //const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const width = this.params["width"];
    const height = this.params["height"];
    const colorScale = [];
    const logScale = this.params["log-scale"];
    const borderWidth = this.params["gap-width"];

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    for (let i = 1; i <= 6; i++) {
      colorScale.push(this.params["color-" + i]);
    }

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

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

    const sunburstElement = this.root.querySelector("#sunburst");

    const opts = {
      width,
      height,
      colorScale,
      logScale,
      borderWidth,
    };

    draw(sunburstElement, filteredData, opts);
  }
}
function transformValue(logScale, value) {
  if (logScale) {
    return Math.log10(value);
  }
  return value;
}

function draw(el, dataset, opts) {
  const { width, height, colorScale, logScale, borderWidth } = opts;

  const data = d3
    .stratify()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parent;
    })(dataset);

  const maxRadius = Math.min(width, height) / 2 - 5;

  const radius = width / 6;

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => 0.009)
    .padRadius(radius * 1.5)
    .innerRadius((d) => d.y0 * radius)
    .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const format = d3.format(",d");

  // const color = d3.scaleOrdinal(
  //   d3.quantize(d3.interpolateRainbow, data.children.length + 1)
  // );

  const color = d3.scaleOrdinal(colorScale);

  const partition = (data) => {
    const root = d3
      .hierarchy(data)
      .sum((d) => d.data.n)
      .sort((a, b) => b.data.n - a.data.n);
    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
  };

  const middleArcLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [d.x0 - halfPi, d.x1 - halfPi];
    const r = Math.max(0, (d.y0 * radius + d.y1 * radius) / 2);

    const middleAngle = (angles[1] + angles[0]) / 2;

    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      angles.reverse();
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  const textFits = (d, currentTarget) => {
    let p;
    const CHAR_SPACE = 6;
    if (currentTarget === "current") {
      p = d.current;
    } else {
      p = d.target;
    }
    const deltaAngle = p.x1 - p.x0;
    const r = Math.max(0, (radius * (p.y0 + p.y1)) / 2);
    const perimeter = r * deltaAngle;

    return d.data.data.label.length * CHAR_SPACE < perimeter;
  };

  const root = partition(data);

  root.each((d) => (d.current = d));

  const svg = d3
    .select(el)
    .append("svg")
    .style("width", width)
    .style("height", height);

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);

  const sliceGroup = g
    .append("g")
    .selectAll("g")
    .data(root.descendants().slice(1))
    .enter()
    .append("g");

  const path = sliceGroup

    .append("path")
    .attr("fill", (d) => {
      while (d.depth > 1) {
        d = d.parent;
      }
      return color(d.data.data.label);
    })
    .attr("fill-opacity", (d) =>
      arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
    )
    .attr("d", (d) => arc(d.current));

  path
    .filter((d) => d.children)
    .style("cursor", "pointer")
    .on("click", clicked);

  path.append("title").text(
    (d) =>
      `${d
        .ancestors()
        .map((d) => d.data.data.label)
        .reverse()
        .join("/")}\n${format(d.value)}`
  );

  // hidden arc
  const hiddenArc = sliceGroup
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "none")
    .attr("id", (_, i) => `hiddenArc${i}`)
    .attr("d", middleArcLine);

  const label = g
    .append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    .attr(
      "fill-opacity",
      (d) => +labelVisible(d.current) && +textFits(d, "current")
    )
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("href", (_, i) => `#hiddenArc${i}`)
    .text((d) => d.data.data.label);

  const parent = g
    .append("circle")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

  function clicked(event, p) {
    parent.datum(p.parent || root);

    root.each(
      (d) =>
        (d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        })
    );
    const t = g.transition().duration(750);

    path
      .transition(t)
      .tween("data", (d) => {
        const i = d3.interpolate(d.current, d.target);
        return (t) => (d.current = i(t));
      })
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attrTween("d", (d) => () => arc(d.current));

    hiddenArc
      .transition(t)
      .tween("data", (d) => {
        const i = d3.interpolate(d.current, d.target);
        return (t) => (d.current = i(t));
      })
      .attrTween("d", (d) => () => middleArcLine(d.current));

    label

      .transition(t)
      .attr(
        "fill-opacity",
        (d) => +labelVisible(d.target) && +textFits(d, "target")
      );
  }
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }
}
