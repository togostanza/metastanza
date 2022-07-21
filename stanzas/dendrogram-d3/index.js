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
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

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

    const padding = this.params["graph-padding"].trim().split(/\s+/);
    let paddingLeft, paddingRight, paddingTop, paddingBottom;
    switch (padding.length) {
      case 1:
        paddingLeft =
          paddingRight =
          paddingTop =
          paddingBottom =
            parseFloat(padding[0]) || 0;
        break;
      case 2:
        paddingTop = paddingBottom = parseFloat(padding[0]) || 0;
        paddingLeft = paddingRight = parseFloat(padding[1]) || 0;
        break;
      case 3:
        paddingTop = parseFloat(padding[0]) || 0;
        paddingLeft = paddingRight = parseFloat(padding[1]) || 0;
        paddingBottom = parseFloat(padding[2]) || 0;
        break;
      case 4:
        paddingTop = parseFloat(padding[0]) || 0;
        paddingLeft = parseFloat(padding[1]) || 0;
        paddingRight = parseFloat(padding[2]) || 0;
        paddingBottom = parseFloat(padding[3]) || 0;
        break;
      default:
        paddingLeft = paddingRight = paddingTop = paddingBottom = 0;
        break;
    }

    const direction = this.params["graph-direction"];
    const isLeafNodesAlign = this.params["graph-align_leaf_nodes"];
    const graphPath = this.params["graph-path"];
    const nodeKey = this.params["node-label-data_key"];
    const labelMargin = this.params["node-label-margin"];
    const sizeKey = this.params["node-size-data_key"];
    const minRangeNode = this.params["node-size-min_size"];
    const maxRangeNode = this.params["node-size-max_size"];
    const circleRadius = this.params["node-size-default"];
    const colorKey = this.params["node-color-data_key"];
    const tooltipKey = this.params["tooltips-data_key"];

    const showToolTips =
      !!tooltipKey && values.some((item) => item[tooltipKey]);
    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    // Setting color scale
    const togostanzaColors = getColorSeries(this);
    const color = togostanzaColors[0];
    const closedNodeColor = css("--togostanza-theme-series_1_color");

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

    const g = svg
      .append("g")
      .attr(
        "transform",
        direction === "horizontal"
          ? `translate(${
              rootLabelWidth + labelMargin + paddingLeft
            }, ${paddingTop})`
          : `translate(${paddingLeft}, ${
              rootLabelWidth + labelMargin + paddingTop
            })`
      );

    const gContent = g.append("g");

    const data = denroot.descendants().slice(1);
    const maxDepth = d3.max(data, (d) => d.depth);

    const isNodeSizeDataKey = data.some((d) => d.data[sizeKey]);

    const labelsarray = [];
    for (const n of data) {
      if (n.depth === maxDepth) {
        labelsarray.push(n.data[nodeKey] || "");
      }
    }

    const tempGroup = svg.append("g");
    tempGroup
      .selectAll("text")
      .data(labelsarray)
      .enter()
      .append("text")
      .text((d) => d);
    const maxLabelWidth = tempGroup.node().getBBox().width;
    tempGroup.remove();

    const toggle = (d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    };

    const nodeSizeMin = d3.min(data, (d) => d.data[sizeKey]);
    const nodeSizeMax = d3.max(data, (d) => d.data[sizeKey]);

    const nodeRadius = d3
      .scaleSqrt()
      .domain([nodeSizeMin, nodeSizeMax])
      .range([minRangeNode, maxRangeNode]);

    let graphType = d3.tree();
    if (isLeafNodesAlign) {
      graphType = d3.cluster();
    } else {
      graphType = d3.tree();
    }

    if (direction === "horizontal") {
      graphType.size([
        height - paddingTop - paddingBottom,
        width -
          rootLabelWidth -
          maxLabelWidth -
          labelMargin * 2 -
          paddingRight -
          paddingLeft,
      ]);
    } else {
      graphType.size([
        width - paddingTop - paddingBottom,
        height -
          rootLabelWidth -
          maxLabelWidth -
          labelMargin * 2 -
          paddingRight -
          paddingLeft,
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
        .classed("with-children", (d) => d.children);

      nodeEnter
        .append("text")
        .attr("x", (d) =>
          d.children || d._children ? -labelMargin : labelMargin
        )
        .attr("dy", "3")
        .attr(
          "transform",
          direction === "horizontal" ? "rotate(0)" : "rotate(90)"
        )
        .attr("text-anchor", (d) =>
          d.children || d._children ? "end" : "start"
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
            ? nodeRadius(d.data[sizeKey]) || nodeRadius(nodeSizeMin)
            : parseFloat(circleRadius)
        )
        .attr("fill", (d) =>
          d._children ? closedNodeColor : d.data[colorKey] || color
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

    if (showToolTips) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}
