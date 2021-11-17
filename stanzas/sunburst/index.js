import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "@/lib/load-data";
import partitionLog from "./partitionLog";
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
    const showNumbers = this.params["show-numbers"];
    const depthLim = this.params["max-depth"];
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
      showNumbers,
      depthLim,
    };

    draw(sunburstElement, filteredData, opts);
  }
}
function transformValue(value, logScale) {
  if (logScale) {
    return Math.log10(value);
  }
  return value;
}

function draw(el, dataset, opts) {
  const {
    width,
    height,
    colorScale,
    logScale,
    borderWidth,
    showNumbers,
    depthLim,
  } = opts;

  const data = d3
    .stratify()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parent;
    })(dataset);

  const radius = width / 6;

  const maxRadius = Math.min(width, height) / 2 - 5;

  const formatNumber = d3.format(",d");

  const x = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);

  const y = d3.scaleSqrt().range([maxRadius * 0.1, maxRadius]);

  const color = d3.scaleOrdinal(colorScale);

  const partition = partitionLog();

  const arc = d3
    .arc()
    .startAngle((d) => x(d.x0))
    .endAngle((d) => x(d.x1))
    .padAngle((d) => Math.min((x(d.x1) - x(d.x0)) / 2, 0.01))
    .padRadius(radius * 1.5)
    .innerRadius((d) => Math.max(0, y(d.y0)))
    .outerRadius((d) => Math.max(y(d.y0), y(d.y1)) - 2);

  const middleArcLabelLine = (d) => {
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
  const middleArcNumberLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    let r = Math.max(0, y(d.y0) + (y(d.y1) - y(d.y0)) / 5);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      r = Math.max(0, y(d.y1) - (y(d.y1) - y(d.y0)) / 5);
      angles.reverse();
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  //@TODO: check if text fits
  function textFits(d) {
    //const CHAR_SPACE = 6;

    const deltaAngle = x(d.x1) - x(d.x0);
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    const perimeter = r * deltaAngle;

    return d.data.data.label.length * CHAR_SPACE < perimeter;
  }

  const svg = d3
    .select(el)
    .append("svg")
    .style("width", width)
    .style("height", height)
    .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
    .on("click", () => focusOn()); // Reset zoom on canvas click

  //Get character width
  const testText = svg
    .append("g")
    .attr("class", "slice")
    .append("text")
    .text("a");
  const CHAR_SPACE = testText.node().getComputedTextLength();
  testText.remove();

  const root = d3.hierarchy(data);

  root.sum((d) => d.data.n);

  root.each((d) => (d.value2 = transformValue(d.value, logScale)));

  let currentDepth = 0;

  update(currentDepth, depthLim);

  function update(cd, depthLim) {
    const slice = svg.selectAll("g.slice").data(
      partition(root)
        .descendants()
        .filter((d) => (depthLim !== 0 ? d.depth < cd + depthLim : true))
    );

    const t = d3
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

    console.log(
      partition(root)
        .descendants()
        .filter((d) => (depthLim !== 0 ? d.depth < cd + depthLim : true))
    );

    slice.exit().remove();

    const newSlice = slice.enter().append("g").attr("class", "slice");

    newSlice
      .append("title")
      .text((d) => d.data.data.label + "\n" + formatNumber(d.value));

    newSlice
      .append("path")
      .attr("class", "main-arc")
      .style("fill", (d) => color((d.children ? d : d.parent).data.data.label))
      .style("fill-opacity", (d) => (d.children ? 1 : 0.6))
      .attr("d", arc);

    newSlice
      .append("path")
      .attr("class", "hidden-arc label")
      .attr("id", (_, i) => `hiddenLabelArc${i}`)

      .attr("d", middleArcLabelLine);

    newSlice
      .append("path")
      .attr("class", "hidden-arc number")
      .attr("id", (_, i) => `hiddenNumberArc${i}`)
      .attr("d", middleArcNumberLine);

    newSlice
      .filter((d) => d.children)
      .attr("cursor", "pointer")
      .on("click", (e, d) => {
        e.stopPropagation();
        focusOn(d);
      });

    const text = newSlice
      .append("text")
      .attr("display", (d) => (textFits(d) ? null : "none"));

    text
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("href", (_, i) => `#hiddenLabelArc${i}`)
      .text((d) => d.data.data.label);

    text
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("href", (_, i) => `#hiddenNumberArc${i}`)
      .text((d) => formatNumber(d.value));
  }
  function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
    // Reset to top-level if no data point specified

    console.log("d.depth: ", d.depth);
    console.log(d);

    update(d.depth || 0, depthLim);

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
      .selectAll("path.hidden-arc:first-of-type")
      .attrTween("d", (d) => () => middleArcLabelLine(d));

    transition
      .selectAll("path.hidden-arc:last-of-type")
      .attrTween("d", (d) => () => middleArcNumberLine(d));

    transition
      .selectAll("text")
      .attrTween("display", (d) => () => textFits(d) ? null : "none");

    moveStackToFront(d);

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
}
