import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import ToolTip from "@/lib/ToolTip";
import { getColorSeries } from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Dendrogram extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "dendrogram"),
      downloadPngMenuItem(this, "dendrogram"),
      downloadJSONMenuItem(this, "dendrogram", this._data),
      downloadCSVMenuItem(this, "dendrogram", this._data),
      downloadTSVMenuItem(this, "dendrogram", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    // const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //data
    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = values;

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("dendrogram-d3");

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const direction = this.params["graph-direction"];
    const isLeafNodesAlign = this.params["graph-align_leaf_nodes"];
    const graphPath = this.params["shape"];
    const nodeKey = this.params["node-label-data_key"];
    const labelMargin = this.params["node-label-margin"];
    const sizeKey = this.params["node-size-data_key"];
    const minRadius = this.params["node-size-min"] / 2;
    const maxRadius = this.params["node-size-max"] / 2;
    const aveRadius = (minRadius + maxRadius) / 2;
    const colorKey = this.params["node-color-data_key"];
    const tooltipKey = this.params["tooltips-data_key"];

    const showToolTips =
      !!tooltipKey && values.some((item) => item[tooltipKey]);
    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const denroot = d3
      .stratify()
      .parentId((d) => d.parent)(values)
      .sort((a, b) => {
        if (a.data[nodeKey] && b.data[nodeKey]) {
          return a.data[nodeKey].localeCompare(b.data[nodeKey]);
        } else {
          return 0;
        }
      });

    const data = denroot.descendants().slice(1);
    const isNodeSizeDataKey = data.some((d) => d.data[sizeKey]);

    const maxDepth = d3.max(data, (d) => d.depth);
    const labelsarray = [];
    for (const n of data) {
      if (n.depth === maxDepth) {
        labelsarray.push(n.data[nodeKey] || "");
      }
    }

    const nodeSizeMin = d3.min(data, (d) => d.data[sizeKey]);
    const nodeSizeMax = d3.max(data, (d) => d.data[sizeKey]);

    const toggle = (d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    };

    const d3RadiusScale = d3
      .scaleSqrt()
      .domain([nodeSizeMin, nodeSizeMax])
      .range([minRadius, maxRadius]);

    const nodeRadius = (size) => {
      if (size) {
        return d3RadiusScale(size);
      }
      return d3RadiusScale(nodeSizeMin);
    };

    // Setting color scale
    const togostanzaColors = getColorSeries(this);
    const defaultColor = togostanzaColors[0];

    const groupArray = [];
    denroot
      .descendants()
      .forEach((d) =>
        d.data[colorKey] ? groupArray.push(d.data[colorKey]) : ""
      );

    const groupColor = d3
      .scaleOrdinal()
      .domain(groupArray)
      .range(togostanzaColors.slice(1, 6));

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const rootGroup = svg
      .append("text")
      .text(denroot.descendants()[0].data[nodeKey] || "");

    const rootLabelWidth = rootGroup.node().getBBox().width;
    rootGroup.remove();

    const tempGroup = svg.append("g");
    tempGroup
      .selectAll("text")
      .data(labelsarray)
      .enter()
      .append("text")
      .text((d) => d);
    const maxLabelWidth = tempGroup.node().getBBox().width;
    tempGroup.remove();

    const g = svg.append("g");
    const gContent = g.append("g");

    const draw = (
      MARGIN = {
        top: 0,
        right: maxLabelWidth + labelMargin,
        bottom: 0,
        left: rootLabelWidth + labelMargin,
      }
    ) => {
      if (direction === "horizontal") {
        if (width - MARGIN.right - MARGIN.left < 0) {
          el.innerHTML = "<p>width is too small!</p>";
          throw new Error("width is too small!");
        }
      } else {
        if (height - MARGIN.left - MARGIN.right < 0) {
          el.innerHTML = "<p>height is too small!</p>";
          throw new Error("height is too small!");
        }
      }

      if (
        Math.max(maxRadius, minRadius) * 2 >= width ||
        Math.max(maxRadius, minRadius) * 2 >= height
      ) {
        el.innerHTML = "<p>node size is too big for width and height!</p>";
        throw new Error("node size is too big for width and height!");
      }

      g.attr(
        "transform",
        direction === "horizontal"
          ? `translate(${MARGIN.left}, ${MARGIN.top})`
          : `translate(${MARGIN.top}, ${MARGIN.left})`
      );

      let graphType = d3.tree();
      if (isLeafNodesAlign) {
        graphType = d3.cluster();
      } else {
        graphType = d3.tree();
      }

      if (direction === "horizontal") {
        graphType.size([
          height - MARGIN.top - MARGIN.bottom,
          width - MARGIN.left - MARGIN.right,
        ]);
      } else {
        graphType.size([
          width - MARGIN.top - MARGIN.bottom,
          height - MARGIN.left - MARGIN.right,
        ]);
      }

      graphType(denroot);

      denroot.x0 = data[0].parent.x;
      denroot.y0 = 0;

      const getLinkFn = () => {
        if (direction === "horizontal") {
          return d3.linkHorizontal();
        } else {
          return d3.linkVertical();
        }
      };

      if (direction === "vertical") {
        denroot.descendants().forEach((node) => {
          const x0 = node.x0;
          const x = node.x;
          const y0 = node.y0;
          const y = node.y;

          node.x0 = y0;
          node.x = y;
          node.y0 = x0;
          node.y = x;
        });
      }

      const minY = [];
      const maxY = [];
      const minX = [];
      const maxX = [];

      let deltas;

      if (direction === "horizontal") {
        denroot.descendants().forEach((d) => {
          minY.push(MARGIN.left + d.y - nodeRadius(d.data[sizeKey]));
          minX.push(MARGIN.top + d.x - nodeRadius(d.data[sizeKey]));
          maxY.push(MARGIN.left + d.y + nodeRadius(d.data[sizeKey]));
          maxX.push(MARGIN.top + d.x + nodeRadius(d.data[sizeKey]));
        });
        deltas = {
          top: Math.min(...minX),
          bottom: height - Math.max(...maxX),
          left: Math.min(...minY),
          right: width - Math.max(...maxY),
        };
      } else {
        denroot.descendants().forEach((d) => {
          minY.push(MARGIN.top + d.y - nodeRadius(d.data[sizeKey]));
          minX.push(MARGIN.left + d.x - nodeRadius(d.data[sizeKey]));
          maxY.push(MARGIN.top + d.y + nodeRadius(d.data[sizeKey]));
          maxX.push(MARGIN.left + d.x + nodeRadius(d.data[sizeKey]));
        });
        deltas = {
          left: Math.min(...minX),
          right: height - Math.max(...maxX),
          top: Math.min(...minY),
          bottom: width - Math.max(...maxY),
        };
      }

      if (deltas.left < 0) {
        MARGIN.left += Math.abs(deltas.left) + 1;
      }
      if (deltas.right < 0) {
        MARGIN.right += Math.abs(deltas.right) + 1;
      }
      if (deltas.top < 0) {
        MARGIN.top += Math.abs(deltas.top) + 1;
      }
      if (deltas.bottom < 0) {
        MARGIN.bottom += Math.abs(deltas.bottom) + 1;
      }

      if (
        deltas.top < 0 ||
        deltas.bottom < 0 ||
        deltas.left < 0 ||
        deltas.right < 0
      ) {
        draw(MARGIN);
      }

      const update = (source) => {
        let i = 0;
        const node = gContent
          .selectAll(".node")
          .data(denroot.descendants(), (d) => d.id || (d.id = ++i));

        const nodeEnter = node
          .enter()
          .append("g")
          .classed("node", true)
          .attr("transform", `translate(${source.y0}, ${source.x0})`)
          .on("click", (e, d) => {
            toggle(d);
            update(d);
          });

        nodeEnter
          .append("circle")
          .attr("data-tooltip", (d) => d.data[tooltipKey])
          .attr("stroke", (d) =>
            d.data[colorKey] ? groupColor(d.data[colorKey]) : defaultColor
          )
          .classed("with-children", (d) => d.children);

        nodeEnter
          .append("text")
          .attr("x", (d) =>
            direction === "horizontal"
              ? d.children || d._children
                ? -labelMargin
                : labelMargin
              : d.children || d._children
              ? labelMargin
              : -labelMargin
          )
          .attr("dy", "3")
          .attr(
            "transform",
            direction === "horizontal" ? "rotate(0)" : "rotate(-90)"
          )
          .attr("text-anchor", (d) =>
            direction === "horizontal"
              ? d.children || d._children
                ? "end"
                : "start"
              : d.children || d._children
              ? "start"
              : "end"
          )
          .text((d) => d.data[nodeKey] || "");

        const nodeUpdate = nodeEnter.merge(node);
        const duration = 500;

        nodeUpdate
          .transition()
          .duration(duration)
          .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

        nodeUpdate
          .select("circle")
          .attr("r", (d) =>
            isNodeSizeDataKey
              ? nodeRadius(d.data[sizeKey])
              : parseFloat(aveRadius)
          )
          .attr("fill", (d) =>
            d._children
              ? "#fff"
              : d.data[colorKey]
              ? groupColor(d.data[colorKey])
              : defaultColor
          );

        node
          .exit()
          .transition()
          .duration(duration)
          .attr("transform", `translate(${source.y}, ${source.x})`)
          .remove();

        const link = gContent
          .selectAll(".link")
          .data(denroot.links(), (d) => d.target.id);

        const linkEnter = link
          .enter()
          .insert("path", "g")
          .classed("link", true)
          .attr(
            "d",
            graphPath === "curve"
              ? getLinkFn().x(source.y0).y(source.x0)
              : d3.link(d3.curveStep).x(source.y0).y(source.x0)
          );

        const linkUpdate = linkEnter.merge(link);
        linkUpdate
          .transition()
          .duration(duration)
          .attr(
            "d",
            graphPath === "curve"
              ? getLinkFn()
                  .x((d) => d.y)
                  .y((d) => d.x)
              : direction === "horizontal"
              ? d3
                  .link(d3.curveStep)
                  .x((d) => d.y)
                  .y((d) => d.x)
              : (d) =>
                  `M${d.source.y},${d.source.x} L${d.source.y},${
                    (d.target.x + d.source.x) / 2
                  }  L${d.target.y},${(d.target.x + d.source.x) / 2} L${
                    d.target.y
                  },${d.target.x}`
          );

        link
          .exit()
          .transition()
          .duration(duration)
          .attr(
            "d",
            graphPath === "curve"
              ? getLinkFn().x(source.y).y(source.x)
              : d3.link(d3.curveStep).x(source.y).y(source.x)
          )
          .remove();

        node.each((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      };
      update(denroot);
    };

    draw();

    if (showToolTips) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}
