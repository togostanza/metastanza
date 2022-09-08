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
    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("tree-d3");

    //Define from params
    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      root
    );
    this._data = values;

    appendCustomCss(this, this.params["misc-custom_css_url"]);
    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const orderKey = this.params["order-data_key"];
    const orderSort = this.params["order-sort"];
    const ASCENDING = "ascending";
    const DESCENDING = "descending";
    const isLeafNodesAlign = this.params["graph-align_leaf_nodes"];
    const layout = this.params["layout"];
    const HORIZONTAL = "horizontal";
    const VERTICAL = "vertical";
    const RADIAL = "radial";
    const nodeKey = this.params["node-label-data_key"];
    const labelMargin = this.params["node-label-margin"];
    const sizeKey = this.params["node-size-data_key"];
    const minRadius = this.params["node-size-min"] / 2;
    const maxRadius = this.params["node-size-max"] / 2;
    const aveRadius = (minRadius + maxRadius) / 2;
    const colorKey = this.params["color-data_key"];
    const colorGroup = this.params["color-group"];
    const colorMode = this.params["color-blend"];
    const TRANSLUCENT = "translucent";
    const MULTIPLY = "multiply";
    const SCREEN = "screen";

    let colorModeProperty;
    let colorModeValue;
    switch (colorMode) {
      case TRANSLUCENT:
        colorModeProperty = "opacity";
        colorModeValue = "0.5";
        break;
      case MULTIPLY:
        colorModeProperty = "mix-blend-mode";
        colorModeValue = "multiply";
        break;
      case SCREEN:
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

    //Sorting by user keywords
    const reorder = (a, b) => {
      if (a.data[orderKey] && b.data[orderKey]) {
        switch (orderSort) {
          case ASCENDING:
            return a.data[orderKey] > b.data[orderKey] ? 1 : -1;
          case DESCENDING:
            return a.data[orderKey] > b.data[orderKey] ? -1 : 1;
        }
      }
    };

    //Hierarchize data
    const treeRoot = d3
      .stratify()
      .parentId((d) => d.parent)(values)
      .sort(reorder);

    const treeDescendants = treeRoot.descendants();
    const data = treeDescendants.slice(1);

    //Setting node size
    const nodeSizeMin = d3.min(data, (d) => d.data[sizeKey]);
    const nodeSizeMax = d3.max(data, (d) => d.data[sizeKey]);

    const d3RadiusScale = d3
      .scaleSqrt()
      .domain([nodeSizeMin, nodeSizeMax])
      .range([minRadius, maxRadius]);

    const nodeRadius = (size) => {
      return size ? d3RadiusScale(size) : d3RadiusScale(nodeSizeMin);
    };

    //Toggle display/hide of children
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
    treeDescendants.forEach((d) =>
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
        return d.data[colorGroup]
          ? groupColor(d.data[colorGroup])
          : defaultColor;
      }
    };

    //Setting svg area
    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //Get width of root label
    const rootGroup = svg
      .append("text")
      .text(treeDescendants[0].data[nodeKey] || "");
    const rootLabelWidth = rootGroup.node().getBBox().width;
    rootGroup.remove();

    //Get width of the largest label at the lowest level
    const maxDepth = d3.max(data, (d) => d.depth);
    const labels = [];
    for (const n of data) {
      n.depth === maxDepth ? labels.push(n.data[nodeKey] || "") : "";
    }
    const tempGroup = svg.append("g");
    tempGroup
      .selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .text((d) => d);
    const maxLabelWidth = tempGroup.node().getBBox().width;
    tempGroup.remove();

    //Create each group
    const g = svg.append("g");
    const gCircles = g.append("g").attr("class", "circles");
    const gLabels = g.append("g").attr("class", "labels");

    //Draw function
    const draw = (
      MARGIN = {
        top: 0,
        right: maxLabelWidth + labelMargin,
        bottom: 0,
        left: rootLabelWidth + labelMargin,
      }
    ) => {
      //Error handling
      switch (layout) {
        case HORIZONTAL:
          if (width - MARGIN.right - MARGIN.left < 0) {
            el.innerHTML = "<p>width is too small!</p>";
            throw new Error("width is too small!");
          }
          break;
        case VERTICAL:
          if (height - MARGIN.left - MARGIN.right < 0) {
            el.innerHTML = "<p>height is too small!</p>";
            throw new Error("height is too small!");
          }
          break;
      }
      if (
        Math.max(maxRadius, minRadius) * 2 >= width ||
        Math.max(maxRadius, minRadius) * 2 >= height
      ) {
        el.innerHTML = "<p>node size is too big for width and height!</p>";
        throw new Error("node size is too big for width and height!");
      }

      //Movement of drawing position
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

      //Align leaves or not
      let graphType = d3.tree();
      isLeafNodesAlign ? (graphType = d3.cluster()) : (graphType = d3.tree());

      //Gap between node
      const separation = (a, b) => {
        return (a.parent === b.parent ? 1 : 2) / isLeafNodesAlign ? 1 : a.depth;
      };

      //Setting the graph size for each layout
      switch (layout) {
        case HORIZONTAL:
          graphType.size([
            height - MARGIN.top - MARGIN.bottom,
            width - MARGIN.left - MARGIN.right,
          ]);
          break;
        case VERTICAL:
          graphType.size([
            width - MARGIN.top - MARGIN.bottom,
            height - MARGIN.left - MARGIN.right,
          ]);
          break;
        case RADIAL:
          graphType
            .size([2 * Math.PI, Math.min(width / 2, height / 2) - MARGIN.right])
            .separation(separation)(treeRoot);
          break;
      }

      graphType(treeRoot);

      //Start position of drawing
      treeRoot.x0 = data[0].parent.x;
      treeRoot.y0 = 0;

      //Setting the path for each direction
      const getLinkFn = () => {
        switch (layout) {
          case HORIZONTAL:
            return d3.linkHorizontal();
          case VERTICAL:
            return d3.linkVertical();
        }
      };

      if (layout === VERTICAL) {
        treeDescendants.forEach((node) => {
          const { x0, x, y0, y } = node;

          node.x0 = y0;
          node.x = y;
          node.y0 = x0;
          node.y = x;
        });
      }

      //Setting the width of margin
      const minY = [],
        maxY = [],
        minX = [],
        maxX = [];

      const circleRadius = [],
        aligns = [],
        depths = [];
      treeDescendants.forEach((d) => {
        circleRadius.push(nodeRadius(d.data[sizeKey]) || aveRadius);

        const Mapper = {
          horizontal: {
            alignmentDirection: MARGIN.top + d.x,
            depthDirection: MARGIN.left + d.y,
          },
          vertical: {
            alignmentDirection: MARGIN.left + d.x,
            depthDirection: MARGIN.top + d.y,
          },
        };

        switch (layout) {
          case HORIZONTAL:
            return (
              aligns.push(Mapper.horizontal["alignmentDirection"]),
              depths.push(Mapper.horizontal["depthDirection"])
            );
          case VERTICAL:
            return (
              aligns.push(Mapper.vertical["alignmentDirection"]),
              depths.push(Mapper.vertical["depthDirection"])
            );
          default:
            break;
        }
      });

      //Get all positions
      let deltas;
      treeDescendants.forEach((d, i) => {
        minX.push(aligns[i] - circleRadius[i]);
        minY.push(depths[i] - circleRadius[i]);
        maxX.push(aligns[i] + circleRadius[i]);
        maxY.push(depths[i] + circleRadius[i]);
      });

      //Find each max/min value
      switch (layout) {
        case HORIZONTAL:
          deltas = {
            top: Math.min(...minX),
            bottom: height - Math.max(...maxX),
            left: Math.min(...minY),
            right: width - Math.max(...maxY),
          };
          break;
        case VERTICAL:
          deltas = {
            top: Math.min(...minY),
            bottom: width - Math.max(...maxY),
            left: Math.min(...minX),
            right: height - Math.max(...maxX),
          };
          break;
        default:
          break;
      }

      // Update margin values
      const directions = ["top", "bottom", "right", "left"];
      switch (layout) {
        case HORIZONTAL:
        case VERTICAL:
          for (const dir of directions) {
            deltas[dir] < 0 ? (MARGIN[dir] += Math.abs(deltas[dir]) + 1) : "";
          }

          //Redraw
          if (
            deltas.top < 0 ||
            deltas.bottom < 0 ||
            deltas.left < 0 ||
            deltas.right < 0
          ) {
            draw(MARGIN);
          }
          break;
        default:
          break;
      }

      //Update graph values
      const update = (source) => {
        let i = 0;

        //Drawing circles
        const nodeCirclesUpdate = gCircles
          .selectAll("g")
          .data(treeRoot.descendants(), (d) => d.id || (d.id = ++i));

        //Circle enter
        const nodeCirclesEnter = nodeCirclesUpdate
          .enter()
          .append("g")
          .attr(
            "transform",
            layout === RADIAL
              ? `rotate(${(source.x0 * 180) / Math.PI - 90}) translate(${
                  source.y0
                }, 0)`
              : `translate(${source.y0}, ${source.x0})`
          )
          .on("click", (e, d) => {
            toggle(d);
            update(d);
          });

        //Decorate circle
        nodeCirclesEnter
          .append("circle")
          .attr("data-tooltip", (d) => d.data[tooltipKey])
          .attr("stroke", setColor)
          .style(colorModeProperty, colorModeValue)
          .classed("with-children", (d) => d.children)
          .attr("r", (d) =>
            data.some((d) => d.data[sizeKey])
              ? nodeRadius(d.data[sizeKey])
              : parseFloat(aveRadius)
          )
          .attr("fill", (d) => (d._children ? "#fff" : setColor(d)));

        //Drawing labels
        const nodeLabelsUpdate = gLabels
          .selectAll("g")
          .data(treeRoot.descendants(), (d) => d.id || (d.id = ++i));

        //Labels enter
        const nodeLabelsEnter = nodeLabelsUpdate
          .enter()
          .append("g")
          .attr(
            "transform",
            layout === RADIAL
              ? `rotate(${(source.x0 * 180) / Math.PI - 90}) translate(${
                  source.y0
                }, 0)`
              : `translate(${source.y0}, ${source.x0})`
          );

        //Decorate labels
        nodeLabelsEnter
          .append("text")
          .attr("x", (d) => {
            if (layout === RADIAL) {
              return d.x < Math.PI === !d.children ? labelMargin : -labelMargin;
            } else if (layout === HORIZONTAL) {
              return d.children || d._children ? -labelMargin : labelMargin;
            } else if (layout === VERTICAL) {
              return d.children || d._children ? labelMargin : -labelMargin;
            }
          })
          .attr("dy", "3")
          .attr("transform", (d) => {
            if (layout === RADIAL) {
              return `rotate(${d.x >= Math.PI ? 180 : 0})`;
            } else if (layout === HORIZONTAL) {
              return "rotate(0)";
            } else if (layout === VERTICAL) {
              return "rotate(-90)";
            }
          })
          .attr("text-anchor", (d) => {
            if (layout === RADIAL) {
              return d.x < Math.PI === !d.children ? "start" : "end";
            } else if (layout === HORIZONTAL) {
              return d.children || d._children ? "end" : "start";
            } else if (layout === VERTICAL) {
              return d.children || d._children ? "start" : "end";
            }
          })
          .text((d) => d.data[nodeKey] || "");

        const duration = 500;

        //Circle transition
        nodeCirclesEnter
          .transition()
          .duration(duration)
          .attr("transform", (d) =>
            layout === RADIAL
              ? `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y}, 0)`
              : `translate(${d.y}, ${d.x})`
          );

        //Labels transition
        nodeLabelsEnter
          .attr("transform", (d) =>
            layout === "radial"
              ? source.y === 0
                ? `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                    source.y
                  }, ${source.x})`
                : `rotate(${(source.x * 180) / Math.PI - 90}) translate(${
                    source.y
                  }, ${source.x})`
              : `translate(${source.y}, ${source.x})`
          )
          .transition()
          .duration(duration)
          .attr("transform", (d) =>
            layout === RADIAL
              ? `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y}, 0)`
              : `translate(${d.y}, ${d.x})`
          );

        //Circle exit
        nodeCirclesUpdate
          .exit()
          .transition()
          .duration(duration)
          .attr(
            "transform",
            layout === RADIAL
              ? `rotate(${(source.x * 180) / Math.PI - 90}) translate(${
                  source.y
                }, 0)`
              : `translate(${source.y}, ${source.x})`
          )
          .remove();

        //Labels exit
        nodeLabelsUpdate
          .exit()
          .attr("transform", (d) =>
            layout === RADIAL
              ? `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y}, 0)`
              : `translate(${d.y}, ${d.x})`
          )
          .transition()
          .duration(duration)
          .attr("transform", (d) =>
            layout === RADIAL
              ? source.y === 0
                ? `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                    source.y
                  }, 0)`
                : `rotate(${(source.x * 180) / Math.PI - 90}) translate(${
                    source.y
                  }, 0)`
              : `translate(${source.y}, ${source.x})`
          )
          .remove();

        //Drawing path
        const link = g
          .selectAll(".link")
          .data(treeRoot.links(), (d) => d.target.id);

        //Path Enter
        const linkEnter = link
          .enter()
          .insert("path", "g")
          .classed("link", true)
          .attr(
            "d",
            layout === RADIAL
              ? d3.linkRadial().angle(source.x).radius(source.y)
              : getLinkFn().x(source.y0).y(source.x0)
          );

        //Path transition
        const linkUpdate = linkEnter;
        linkUpdate
          .transition()
          .duration(duration)
          .attr(
            "d",
            layout === RADIAL
              ? d3
                  .linkRadial()
                  .angle((d) => d.x)
                  .radius((d) => d.y)
              : getLinkFn()
                  .x((d) => d.y)
                  .y((d) => d.x)
          );

        //Path exit
        link
          .exit()
          .transition()
          .duration(duration)
          .attr(
            "d",
            layout === RADIAL
              ? d3.linkRadial().angle(source.x).radius(source.y)
              : getLinkFn().x(source.y).y(source.x)
          )
          .remove();

        //Get current position for next action
        nodeCirclesUpdate.each((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      };
      update(treeRoot);
    };

    //Drawing
    draw();

    if (showToolTips) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}
