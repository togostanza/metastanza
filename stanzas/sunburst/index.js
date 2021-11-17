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
  let {
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

  const formatNumber = d3.format(",d");

  const color = d3.scaleOrdinal(colorScale);

  const partition = (data) => {
    const root = d3
      .hierarchy(data)
      .sum((d) => d.data.n)
      .sort((a, b) => b.value - a.value)
      .each((d) => (d.value2 = transformValue(d.value, logScale)));
    return partitionLog().size([2 * Math.PI, root.height + 1])(root);
  };

  const root = partition(data);
  root.each((d) => (d.current = d));

  // if depthLim 0 of negative, show all levels
  if (depthLim <= 0) {
    depthLim = d3.max(root, (d) => d.depth);
  }

  const radius = width / (depthLim * 2);

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius((d) => d.y0 * radius)
    .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 2));

  const middleArcLabelLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [d.x0 - halfPi, d.x1 - halfPi];
    const r = Math.max(0, ((d.y0 + d.y1) * radius) / 2);

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
    const angles = [d.x0 - halfPi, d.x1 - halfPi];
    let r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 5) * radius);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 5) * radius);
      angles.reverse();
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  //@TODO: check if text fits
  function textFits(d, charWidth, text) {
    //const CHAR_SPACE = 6;

    const deltaAngle = d.x1 - d.x0;
    const r = Math.max(0, ((d.y0 + d.y1) * radius) / 2);
    const perimeter = r * deltaAngle;

    return text.length * charWidth < perimeter;
  }

  const svg = d3
    .select(el)
    .append("svg")
    .style("width", width)
    .style("height", height)
    .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);
  //.on("click", () => focusOn()); // Reset zoom on canvas click

  //Get character width
  const testText = svg
    .append("g")
    .attr("class", "labels")
    .append("text")
    .text("a");
  const CHAR_SPACE = testText.node().getComputedTextLength();
  testText.remove();

  const g = svg.append("g");
  //.attr("transform", `translate(${width / 2},${width / 2})`);

  const path = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
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
        .join("/")}\n${formatNumber(d.value)}`
  );

  //add hidden arcs for text
  const textArcs = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("class", "hidden-arc")
    .attr("id", (_, i) => `hiddenLabelArc${i}`)
    .attr("d", middleArcLabelLine);
  //For numbers
  const numArcs = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("class", "hidden-arc")
    .attr("id", (_, i) => `hiddenNumberArc${i}`)
    .attr("d", middleArcNumberLine);

  //Text labels
  const textLabels = g
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    .attr(
      "fill-opacity",
      (d) => +(labelVisible(d) && textFits(d, CHAR_SPACE, d.data.data.label))
    )
    // .attr("display", (d) => {
    //   return textFits(d, CHAR_SPACE, d.data.data.label) ? null : "none";
    // })
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("href", (_, i) => `#hiddenLabelArc${i}`)
    .text((d) => d.data.data.label);

  //Number labels
  const numLabels = g
    .append("g")
    .attr("class", "numbers")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    .attr(
      "fill-opacity",
      (d) => +(labelVisible(d) && textFits(d, CHAR_SPACE, d.data.data.label))
    )
    // .attr("display", (d) => {
    //   return textFits(d, NUM_CHAR_SPACE, formatNumber(d.value)) ? null : "none";
    // })
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("href", (_, i) => `#hiddenNumberArc${i}`)
    .text((d) => formatNumber(d.value));

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

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
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

    textLabels
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || +labelVisible(d.target);
      })
      .transition(t)
      // .attr("display", (d) => {
      //   return textFits(d.current, CHAR_SPACE, d.data.data.label)
      //     ? null
      //     : "none";
      // })
      .attr(
        "fill-opacity",
        (d) =>
          +(
            labelVisible(d.target) &&
            textFits(d.target, CHAR_SPACE, d.data.data.label)
          )
      );

    textArcs
      .transition(t)
      .attrTween("d", (d) => () => middleArcLabelLine(d.current));

    numLabels
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      })
      .transition(t)
      // .attr("display", (d) =>
      //   textFits(d.target, NUM_CHAR_SPACE, formatNumber(d.value))
      //     ? null
      //     : "none"
      // )
      .attr(
        "fill-opacity",
        (d) =>
          +(
            labelVisible(d.target) &&
            textFits(d.target, CHAR_SPACE, d.data.data.label)
          )
      );

    numArcs
      .transition(t)
      .attrTween("d", (d) => () => middleArcNumberLine(d.current));
  }

  function arcVisible(d) {
    return d.y1 <= depthLim && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= depthLim && d.y0 >= 1; //&& (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  // function update(cd, depthLim) {
  //   const slice = svg.selectAll("g.slice").data(
  //     partition(root)
  //       .descendants()
  //       .filter((d) => (depthLim !== 0 ? d.depth < cd + depthLim : true))
  //   );

  //   const t = d3
  //     .transition()
  //     .duration(750)
  //     .tween("scale", () => {
  //       //name of the tween might be anything. its not used anywhere
  //       const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
  //         yd = d3.interpolate(y.domain(), [d.y0, 1]);
  //       return (t) => {
  //         x.domain(xd(t));
  //         y.domain(yd(t));
  //       };
  //     });

  //   slice.exit().remove();

  //   const newSlice = slice.enter().append("g").attr("class", "slice");

  //   newSlice
  //     .append("title")
  //     .text((d) => d.data.data.label + "\n" + formatNumber(d.value));

  //   newSlice
  //     .append("path")
  //     .attr("class", "main-arc")
  //     .style("fill", (d) => color((d.children ? d : d.parent).data.data.label))
  //     .style("fill-opacity", (d) => (d.children ? 1 : 0.6))
  //     .attr("d", arc);

  //   newSlice
  //     .append("path")
  //     .attr("class", "hidden-arc label")
  //     .attr("id", (_, i) => `hiddenLabelArc${i}`)

  //     .attr("d", middleArcLabelLine);

  //   newSlice
  //     .append("path")
  //     .attr("class", "hidden-arc number")
  //     .attr("id", (_, i) => `hiddenNumberArc${i}`)
  //     .attr("d", middleArcNumberLine);

  //   newSlice
  //     .filter((d) => d.children)
  //     .attr("cursor", "pointer")
  //     .on("click", (e, d) => {
  //       e.stopPropagation();
  //       focusOn(d);
  //     });

  //   const text = newSlice
  //     .append("text")
  //     .attr("display", (d) => (textFits(d) ? null : "none"));

  //   text
  //     .append("textPath")
  //     .attr("startOffset", "50%")
  //     .attr("href", (_, i) => `#hiddenLabelArc${i}`)
  //     .text((d) => d.data.data.label);

  //   text
  //     .append("textPath")
  //     .attr("startOffset", "50%")
  //     .attr("href", (_, i) => `#hiddenNumberArc${i}`)
  //     .text((d) => formatNumber(d.value));
  // }
  // function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
  //   // Reset to top-level if no data point specified

  //   update(d.depth || 0, depthLim);

  //   const transition = svg
  //     .transition()
  //     .duration(750)
  //     .tween("scale", () => {
  //       const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
  //         yd = d3.interpolate(y.domain(), [d.y0, 1]);
  //       return (t) => {
  //         x.domain(xd(t));
  //         y.domain(yd(t));
  //       };
  //     });

  //   transition.selectAll("path.main-arc").attrTween("d", (d) => () => arc(d));

  //   transition
  //     .selectAll("path.hidden-arc:first-of-type")
  //     .attrTween("d", (d) => () => middleArcLabelLine(d));

  //   transition
  //     .selectAll("path.hidden-arc:last-of-type")
  //     .attrTween("d", (d) => () => middleArcNumberLine(d));

  //   transition
  //     .selectAll("text")
  //     .attrTween("display", (d) => () => textFits(d) ? null : "none");

  //   moveStackToFront(d);

  //   function moveStackToFront(elD) {
  //     svg
  //       .selectAll(".slice")
  //       .filter((d) => d === elD)
  //       .each(function (d) {
  //         this.parentNode.appendChild(this);
  //         if (d.parent) {
  //           moveStackToFront(d.parent);
  //         }
  //       });
  //   }
  // }
}
