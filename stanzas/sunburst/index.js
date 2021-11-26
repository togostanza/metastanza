import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "togostanza-utils"; //"@/lib/metastanza_utils.js"; //

export default class Sunburst extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "sunburstStanza"),
      downloadPngMenuItem(this, "sunburstStanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    // get value of css vars
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const width = this.params["width"];
    const height = this.params["height"];
    const colorScale = [];

    const borderWidth = this.params["gap-width"] || 2;
    const nodesGapWidth = this.params["nodes-gap-width"] || 8;
    const cornerRadius = this.params["nodes-corner-radius"] || 0;
    const showNumbers = this.params["show-numbers"];
    const depthLim = +this.params["max-depth"] || 0;
    const scalingMethod = this.params["scaling"];

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    for (let i = 1; i <= 6; i++) {
      colorScale.push("--togostanza-colorscheme-color" + i);
    }

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

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
      css,
      width,
      height,
      colorScale,
      borderWidth,
      nodesGapWidth,
      cornerRadius,
      showNumbers,
      depthLim,
      scalingMethod,
    };

    draw(sunburstElement, filteredData, opts);
  }
}

function draw(el, dataset, opts) {
  let { depthLim } = opts;

  const {
    css,
    width,
    height,
    colorScale,
    borderWidth,
    nodesGapWidth,
    cornerRadius,
    showNumbers,
    scalingMethod,
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
    const root = d3.hierarchy(data);
    switch (scalingMethod) {
      case "Natural":
        root.sum((d) => d.data.n);
        break;
      case "Equal children":
        root.sum((d) => (d.children ? 0 : 1));
        break;
      case "Equal parents":
        root.each(
          (d) =>
            (d.value = d.parent ? d.parent.value / d.parent.children.length : 1)
        );
        break;
    }

    root
      .sort((a, b) => b.value - a.value)
      // store real values for number labels in d.value2
      .each((d) => (d.value2 = d3.sum(d, (dd) => dd.data.data.n)));
    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
  };

  const root = partition(data);

  root.each((d) => (d.current = d));

  // if depthLim 0 of negative, show all levels
  const maxDepth = d3.max(root, (d) => d.depth);
  if (depthLim <= 0 || depthLim > maxDepth) {
    depthLim = maxDepth;
  }

  const radius = width / ((depthLim + 1) * 2);

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, nodesGapWidth / 500))
    .padRadius(radius * 1.5)
    .innerRadius((d) => d.y0 * radius)
    .outerRadius((d) =>
      Math.max(d.y0 * radius, d.y1 * radius - borderWidth / 2)
    )
    .cornerRadius(cornerRadius);

  const middleArcLabelLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [d.x0 - halfPi, d.x1 - halfPi];
    let r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 2.5) * radius);
      angles.reverse();
    }

    if (Math.abs(angles[1] - angles[0]) > Math.PI && d.y0 < 1) {
      angles[0] = middleAngle + Math.PI / 2;
      angles[1] = middleAngle - Math.PI / 2;

      r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 5) * radius);
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  const middleArcNumberLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [d.x0 - halfPi, d.x1 - halfPi];
    let r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 2.5) * radius);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);

      angles.reverse();
    }

    if (Math.abs(angles[1] - angles[0]) > Math.PI && d.y0 < 1) {
      r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  function textFits(d, charWidth, text) {
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

  //Get character width
  const testText = svg
    .append("g")
    .attr("class", "labels")
    .append("text")
    .text("a");
  const CHAR_SPACE = testText.node().getComputedTextLength();
  testText.remove();

  const g = svg.append("g");

  const path = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", (d) => {
      while (d.depth > 1) {
        d = d.parent;
      }
      return css(color(d.data.data.label));
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
        .join("/")}\n${formatNumber(d.value2)}`
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

  // Center circle
  const parent = g
    .append("circle")
    .datum(root)
    .attr("r", radius - borderWidth / 2)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

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
    //Show only if label is supposed to be shown, label text fits into node and showNumbers =true
    .attr(
      "fill-opacity",
      (d) =>
        +(
          labelVisible(d) &&
          textFits(d, CHAR_SPACE, d.data.data.label) &&
          showNumbers
        )
    )
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("href", (_, i) => `#hiddenNumberArc${i}`)
    .text((d) => formatNumber(d.value2));

  function clicked(event, p) {
    if (!arcVisible(p.current) && p.current.y1 > 1) {
      return;
    }

    parent.datum(p.parent || root);

    parent.attr("cursor", (d) => (d === root ? "auto" : "pointer"));

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
      .attr("cursor", (d) =>
        d.children && arcVisible(d.target) ? "pointer" : "auto"
      )

      .attrTween("d", (d) => () => arc(d.current));

    parent.transition(t).attr("fill", () => {
      let b = p;
      while (b.depth > 1) {
        b = b.parent;
      }

      return b.data?.data?.label
        ? css(color(b.data.data.label))
        : "rgba(0,0,0,0)";
    });

    textLabels
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || +labelVisible(d.target);
      })
      .transition(t)
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
      .attr(
        "fill-opacity",
        (d) =>
          +(
            labelVisible(d.target) &&
            textFits(d.target, CHAR_SPACE, d.data.data.label) &&
            showNumbers
          )
      );

    numArcs
      .transition(t)
      .attrTween("d", (d) => () => middleArcNumberLine(d.current));
  }

  function arcVisible(d) {
    return d.y1 <= depthLim + 1 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= depthLim + 1 && d.y0 >= 0;
  }
}
