import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { s as select } from './index-847f2a80.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import { s as stratify, h as hierarchy } from './stratify-5205cf04.js';
import { l as linear } from './linear-af9e44cc.js';
import { f as format, o as ordinal, a as interpolate$1 } from './ordinal-0cb0fa8d.js';
import { b as treemap } from './index-beeea236.js';
import { s as sum } from './sum-44e7480e.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';
import './descending-63ef45b8.js';

var count = 0;

function uid (name) {
  return new Id("O-" + (name === null ? "" : name + "-") + ++count);
}

function Id(id) {
  this.id = id;
  this.href = new URL(`#${id}`, location) + "";
}

Id.prototype.toString = function () {
  return "url(" + this.href + ")";
};

//color darkening/lightening function

function shadeColor (color, percent) {
  const trimmedColor = color.trim();
  let R = parseInt(trimmedColor.substring(1, 3), 16);
  let G = parseInt(trimmedColor.substring(3, 5), 16);
  let B = parseInt(trimmedColor.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR =
    R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG =
    G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB =
    B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

//tiling function with log scale support
function treemapBinaryLog (parent, x0, y0, x1, y1) {
  const nodes = parent.children,
    n = nodes.length,
    sums = new Array(n + 1);

  let i, sum;

  for (sums[0] = sum = i = 0; i < n; ++i) {
    sums[i + 1] = sum += nodes[i].value2;
  }

  let nodeSum = 0;
  let kkk = -1;

  while (++kkk < n) {
    nodeSum += nodes[kkk].value2;
  }
  kkk = -1;

  partition(0, n, nodeSum, x0, y0, x1, y1);

  function partition(i, j, value, x0, y0, x1, y1) {
    if (i >= j - 1) {
      const node = nodes[i];
      (node.x0 = x0), (node.y0 = y0);
      (node.x1 = x1), (node.y1 = y1);
      return;
    }

    const valueOffset = sums[i],
      valueTarget = value / 2 + valueOffset;

    let k = i + 1,
      hi = j - 1;

    while (k < hi) {
      const mid = (k + hi) >>> 1;
      if (sums[mid] < valueTarget) {
        k = mid + 1;
      } else {
        hi = mid;
      }
    }

    if (valueTarget - sums[k - 1] < sums[k] - valueTarget && i + 1 < k) {
      --k;
    }

    const valueLeft = sums[k] - valueOffset,
      valueRight = value - valueLeft;

    if (x1 - x0 > y1 - y0) {
      const xk = value ? (x0 * valueRight + x1 * valueLeft) / value : x1;
      partition(i, k, valueLeft, x0, y0, xk, y1);
      partition(k, j, valueRight, xk, y0, x1, y1);
    } else {
      const yk = value ? (y0 * valueRight + y1 * valueLeft) / value : y1;
      partition(i, k, valueLeft, x0, y0, x1, yk);
      partition(k, j, valueRight, x0, yk, x1, y1);
    }
  }
}

class TreeMapStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "treemap"),
      downloadPngMenuItem(this, "treemap"),
      downloadJSONMenuItem(this, "treemap", this._data),
      downloadCSVMenuItem(this, "treemap", this._data),
      downloadTSVMenuItem(this, "treemap", this._data),
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
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = data;

    this.renderTemplate({ template: "stanza.html.hbs" });

    // filter out all elements with n=0
    const filteredData = data.filter(
      (item) => (item.children && !item.n) || (item.n && item.n > 0)
    );

    //Add root element if there are more than one elements without parent. D3 cannot process data with more than one root elements
    const rootElems = filteredData
      .map((d, i) => ({
        d,
        i,
      }))
      .filter((d) => !d.d.parent)
      .map((d) => d.i);

    if (rootElems.length > 1) {
      filteredData.push({ id: -1, value: "", label: "" });

      rootElems.forEach((index) => {
        filteredData[index].parent = -1;
      });
    }

    if (!filteredData.find((d) => d.id === -1)) {
      filteredData.push({ id: -1, value: "", label: "" });
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

  const nested = stratify()
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

  const x = linear().rangeRound([0, width]);
  const y = linear().rangeRound([0, adjustedHeight]);

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

  const format$1 = format(",d");

  const color = ordinal(colorScale);

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

  const treemap$1 = (data) =>
    treemap().tile(tile)(
      hierarchy(data)
        .sum((d) => d.data.n)
        .sort((a, b) => b.value - a.value)
        .each((d) => {
          d.value2 = transformValue(logScale, d.value);
        })
    );

  const svg = select(el)
    .append("div")
    .style("width", width + "px")
    .style("height", height + "px")
    .style("overflow", "hidden")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  let group = svg.append("g").call(render, treemap$1(nested), null);

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
                ? format$1(sum(d, (d) => d?.data?.data?.n || 0))
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
      .attr("x", "1em")
      .text((d) => {
        if (d === root) {
          return name(d);
        } else {
          return `${d.data.data.label}`;
        }
      });

    //adjust rectangles positions
    group.call(position, root, true, zoomInOut);
  }

  //function to wrap long text in svg
  function wrap(root, isFirstRender, zoomInOut, d, i, nodes) {
    // on positioning elements that are about to display

    if (isFirstRender) {
      let lineSeparator;

      //nodes[i] is rect
      const text = select(nodes[i].parentNode).select("text");

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
              .attr("x", "1em")
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
        .attr("x", "1.6em")
        .text((d) => format$1(sum(d, (d) => d?.data?.data?.n || 0)));
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
          .attrTween("opacity", () => interpolate$1(0, 1))
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
          .attrTween("opacity", () => interpolate$1(1, 0))
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

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': TreeMapStanza
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "treemap",
	"stanza:label": "Treemap",
	"stanza:definition": "Treemap MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Tree",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-10-25",
	"stanza:updated": "2021-10-25",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/tree-data.json",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "log-scale",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Log scale for values",
		"stanza:required": true
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 300,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "gap-width",
		"stanza:type": "number",
		"stanza:example": 2,
		"stanza:description": "Gap width"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "#eeeeee",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-label-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Label font family"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "string",
		"stanza:default": "11px",
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-label-font-weight",
		"stanza:type": "string",
		"stanza:default": "normal",
		"stanza:description": "Label font weight"
	},
	{
		"stanza:key": "--togostanza-number-label-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Number label font family"
	},
	{
		"stanza:key": "--togostanza-number-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Number label font color"
	},
	{
		"stanza:key": "--togostanza-number-label-font-size",
		"stanza:type": "string",
		"stanza:default": "7px",
		"stanza:description": "Number label font size"
	},
	{
		"stanza:key": "--togostanza-number-label-font-weight",
		"stanza:type": "string",
		"stanza:default": "normal",
		"stanza:description": "Number label font weight"
	},
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Color 1"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Color 2"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Color 3"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Color 4"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Color 5"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Color 6"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"treemap\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=treemap.js.map
