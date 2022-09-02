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

export default class Tree extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "tree"),
      downloadPngMenuItem(this, "tree"),
      downloadJSONMenuItem(this, "tree", this._data),
      downloadCSVMenuItem(this, "tree", this._data),
      downloadTSVMenuItem(this, "tree", this._data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["misc-custom_css_url"]);

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
    const el = this.root.getElementById("tree-d3");

    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const orderKey = this.params["order-data_key"];
    const orderSort = this.params["order-sort"];
    const isLeafNodesAlign = this.params["graph-align_leaf_nodes"];
    const layout = this.params["layout"];
    const nodeKey = this.params["node-label-data_key"];
    const labelMargin = this.params["node-label-margin"];
    const sizeKey = this.params["node-size-data_key"];
    const minRadius = this.params["node-size-min"] / 2;
    const maxRadius = this.params["node-size-max"] / 2;
    const aveRadius = (minRadius + maxRadius) / 2;
    const colorKey = this.params["color-data_key"];
    const colorGroup = this.params["color-group"];
    const colorMode = this.params["color-blend"];

    let colorModeProperty;
    let colorModeValue;
    switch (colorMode) {
      case "translucent":
        colorModeProperty = "opacity";
        colorModeValue = "0.5";
        break;
      case "multiply":
        colorModeProperty = "mix-blend-mode";
        colorModeValue = "multiply";
        break;
      case "screen":
        colorModeProperty = "mix-blend-mode";
        colorModeValue = "screen";
        break;
      default:
        break;
    }

    const tooltipKey = this.params["tooltips-data_key"];

    const showToolTips =
      !!tooltipKey && values.some((item) => item[tooltipKey]);
    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const reorder = (a, b) => {
      if (a.data[orderKey] && b.data[orderKey]) {
        if (orderSort === "ascending") {
          return a.data[orderKey] > b.data[orderKey] ? 1 : -1;
        } else if (orderSort === "descending") {
          return a.data[orderKey] > b.data[orderKey] ? -1 : 1;
        }
      }
    };

    const denroot = d3
      .stratify()
      .parentId((d) => d.parent)(values)
      .sort(reorder);

    // const denroot = d3.stratify().parentId((d) => d.parent)(values);
    const data = denroot.descendants().slice(1);

    // const orderNum = (a, b) => {
    //   if (a.data[orderKey] && b.data[orderKey]) {
    //     if (orderSort === "ascending") {
    //       return a.data[orderKey] > b.data[orderKey] ? 1 : -1;
    //     } else if (orderSort === "descending") {
    //       return a.data[orderKey] > b.data[orderKey] ? -1 : 1;
    //     }
    //   }
    // };
    // const reorder = (a, b) => {
    //   if (a.data[nodeKey] && b.data[nodeKey]) {
    //     if (orderSort === "ascending") {
    //       return a.data[orderKey] > b.data[orderKey] ? 1 : -1;
    //     } else if (orderSort === "descending") {
    //       return a.data[orderKey] > b.data[orderKey] ? -1 : 1;
    //     }
    //   }
    // };
    // const reorder = () => {
    //   if (data.some((d) => d.data[orderKey])) {
    //     return orderNum;
    //   } else {
    //     return orderAbc;
    //   }
    // };
    // denroot.sort(reorder());

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

    const toggle = (d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    };

    // Setting color scale
    const togostanzaColors = getColorSeries(this);
    const defaultColor = togostanzaColors[0];

    const groupArray = [];
    denroot
      .descendants()
      .forEach((d) =>
        d.data[colorGroup] ? groupArray.push(d.data[colorGroup]) : ""
      );

    const groupColor = d3
      .scaleOrdinal()
      .domain(groupArray)
      .range(togostanzaColors.slice(1, 6));

    const setColor = (d) => {
      if (d.data[colorKey]) {
        return d.data[colorKey];
      } else {
        if (d.data[colorGroup]) {
          return groupColor(d.data[colorGroup]);
        } else {
          return defaultColor;
        }
      }
    };

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

    const gCircles = g.append("g").attr("class", "circles");
    const gLabels = g.append("g").attr("class", "labels");

    const draw = (
      MARGIN = {
        top: 0,
        right: maxLabelWidth + labelMargin,
        bottom: 0,
        left: rootLabelWidth + labelMargin,
      }
    ) => {
      if (layout === "horizontal") {
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
        layout === "radial"
          ? `translate(${Math.min(width / 2, height / 2)}, ${Math.min(
              width / 2,
              height / 2
            )})`
          : layout === "horizontal"
          ? `translate(${MARGIN.left}, ${MARGIN.top})`
          : `translate(${MARGIN.top}, ${MARGIN.left})`
      );

      let graphType = d3.tree();
      if (isLeafNodesAlign) {
        graphType = d3.cluster();
      } else {
        graphType = d3.tree();
      }

      const separation = (a, b) => {
        if (isLeafNodesAlign) {
          return a.parent === b.parent ? 1 : 2;
        } else {
          return (a.parent === b.parent ? 1 : 2) / a.depth;
        }
      };

      if (layout === "radial") {
        graphType
          .size([2 * Math.PI, Math.min(width / 2, height / 2) - MARGIN.right])
          .separation(separation)(denroot);
      } else {
        if (layout === "horizontal") {
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
      }

      graphType(denroot);

      denroot.x0 = data[0].parent.x;
      denroot.y0 = 0;

      const getLinkFn = () => {
        if (layout === "horizontal") {
          return d3.linkHorizontal();
        } else {
          return d3.linkVertical();
        }
      };

      if (layout === "vertical") {
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
      if (layout === "horizontal") {
        denroot.descendants().forEach((d) => {
          minY.push(
            MARGIN.left + d.y - (nodeRadius(d.data[sizeKey]) || aveRadius)
          );
          minX.push(
            MARGIN.top + d.x - (nodeRadius(d.data[sizeKey]) || aveRadius)
          );
          maxY.push(
            MARGIN.left + d.y + (nodeRadius(d.data[sizeKey]) || aveRadius)
          );
          maxX.push(
            MARGIN.top + d.x + (nodeRadius(d.data[sizeKey]) || aveRadius)
          );
        });
        deltas = {
          top: Math.min(...minX),
          bottom: height - Math.max(...maxX),
          left: Math.min(...minY),
          right: width - Math.max(...maxY),
        };
      } else {
        denroot.descendants().forEach((d) => {
          minY.push(
            MARGIN.top + d.y - (nodeRadius(d.data[sizeKey]) || aveRadius)
          );
          minX.push(
            MARGIN.left + d.x - (nodeRadius(d.data[sizeKey]) || aveRadius)
          );
          maxY.push(
            MARGIN.top + d.y + (nodeRadius(d.data[sizeKey]) || aveRadius)
          );
          maxX.push(
            MARGIN.left + d.x + (nodeRadius(d.data[sizeKey]) || aveRadius)
          );
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

        const nodeCirclesUpdate = gCircles
          .selectAll("g")
          .data(denroot.descendants(), (d) => d.id || (d.id = ++i));

        const nodeCirclesEnter = nodeCirclesUpdate
          .enter()
          .append("g")
          .attr(
            "transform",
            layout === "radial"
              ? `rotate(${(source.x0 * 180) / Math.PI - 90}) translate(${
                  source.y0
                }, 0)`
              : `translate(${source.y0}, ${source.x0})`
          )
          .on("click", (e, d) => {
            toggle(d);
            update(d);
          });

        nodeCirclesEnter
          .append("circle")
          .attr("data-tooltip", (d) => d.data[tooltipKey])
          .attr("stroke", setColor)
          .style(colorModeProperty, colorModeValue)
          .classed("with-children", (d) => d.children)
          .merge(nodeCirclesUpdate)
          .attr("r", (d) =>
            isNodeSizeDataKey
              ? nodeRadius(d.data[sizeKey])
              : parseFloat(aveRadius)
          )
          .attr("fill", (d) => (d._children ? "#fff" : setColor(d)));

        const nodeLabelsUpdate = gLabels
          .selectAll("g")
          .data(denroot.descendants(), (d) => d.id || (d.id = ++i));

        const nodeLabelsEnter = nodeLabelsUpdate
          .enter()
          .append("g")
          .attr(
            "transform",
            layout === "radial"
              ? `rotate(${(source.x0 * 180) / Math.PI - 90}) translate(${
                  source.y0
                }, 0)`
              : `translate(${source.y0}, ${source.x0})`
          );

        nodeLabelsEnter
          .append("text")
          .attr("x", (d) =>
            layout === "radial"
              ? d.x < Math.PI === !d.children
                ? labelMargin
                : -labelMargin
              : layout === "horizontal"
              ? d.children || d._children
                ? -labelMargin
                : labelMargin
              : d.children || d._children
              ? labelMargin
              : -labelMargin
          )
          .attr("dy", "3")
          .attr("transform", (d) =>
            layout === "radial"
              ? `rotate(${d.x >= Math.PI ? 180 : 0})`
              : layout === "horizontal"
              ? "rotate(0)"
              : "rotate(-90)"
          )
          .attr("text-anchor", (d) =>
            layout === "radial"
              ? d.x < Math.PI === !d.children
                ? "start"
                : "end"
              : layout === "horizontal"
              ? d.children || d._children
                ? "end"
                : "start"
              : d.children || d._children
              ? "start"
              : "end"
          )
          .text((d) => d.data[nodeKey] || "");

        const duration = 500;

        nodeCirclesEnter
          .merge(nodeCirclesUpdate)
          .transition()
          .duration(duration)
          .attr("transform", (d) =>
            layout === "radial"
              ? `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y}, 0)`
              : `translate(${d.y}, ${d.x})`
          );

        nodeLabelsEnter
          .merge(nodeLabelsUpdate)
          .transition()
          .duration(duration)
          .attr("transform", (d) =>
            layout === "radial"
              ? `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y}, 0)`
              : `translate(${d.y}, ${d.x})`
          );

        nodeCirclesUpdate
          .exit()
          .transition()
          .duration(duration)
          .attr(
            "transform",
            layout === "radial"
              ? `rotate(${(source.x * 180) / Math.PI - 90}) translate(${
                  source.y
                }, 0)`
              : `translate(${source.y}, ${source.x})`
          )
          .remove();

        nodeLabelsUpdate
          .exit()
          .transition()
          .duration(duration)
          .attr(
            "transform",
            layout === "radial"
              ? `rotate(${(source.x * 180) / Math.PI - 90}) translate(${
                  source.y
                }, 0)`
              : `translate(${source.y}, ${source.x})`
          )
          .remove();

        const link = g
          .selectAll(".link")
          .data(denroot.links(), (d) => d.target.id);

        const linkEnter = link
          .enter()
          .insert("path", "g")
          .classed("link", true)
          .attr(
            "d",
            layout === "radial"
              ? d3.linkRadial().angle(source.x).radius(source.y)
              : getLinkFn().x(source.y0).y(source.x0)
          );

        const linkUpdate = linkEnter.merge(link);
        linkUpdate
          .transition()
          .duration(duration)
          .attr(
            "d",
            layout === "radial"
              ? d3
                  .linkRadial()
                  .angle((d) => d.x)
                  .radius((d) => d.y)
              : getLinkFn()
                  .x((d) => d.y)
                  .y((d) => d.x)
          );

        link
          .exit()
          .transition()
          .duration(duration)
          .attr(
            "d",
            layout === "radial"
              ? d3.linkRadial().angle(source.x).radius(source.y)
              : getLinkFn().x(source.y).y(source.x)
          )
          .remove();

        nodeCirclesUpdate.each((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
        nodeLabelsUpdate.each((d) => {
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
