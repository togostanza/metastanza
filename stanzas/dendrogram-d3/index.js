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

    //data
    const width = parseInt(this.params["width"]);
    const height = parseInt(this.params["height"]);
    const labelMargin = !isNaN(parseFloat(this.params["node-label-margin"]))
      ? parseFloat(this.params["node-label-margin"])
      : 5;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = values;

    const showToolTips =
      !!this.params["tooltips-data_key"] &&
      values.some((item) => item[this.params["tooltips-data_key"]]);

    // Setting color scale
    const togostanzaColors = getColorSeries(this);
    const color = togostanzaColors[0];

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("dendrogram-d3");

    const denroot = d3
      .stratify()
      .parentId((d) => d.parent)(values)
      .sort((a, b) => {
        if (
          a.data[this.params["node-label-data_key"]] &&
          b.data[this.params["node-label-data_key"]]
        ) {
          return a.data[this.params["node-label-data_key"]].localeCompare(
            b.data[this.params["node-label-data_key"]]
          );
        } else {
          return 0;
        }
      });

    const svg = d3
      .select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const rootGroup = svg
      .append("text")
      .text(
        denroot.descendants()[0].data[this.params["node-label-data_key"]] || ""
      );

    const rootLabelWidth = rootGroup.node().getBBox().width;
    rootGroup.remove();

    const g = svg
      .append("g")
      .attr(
        "transform",
        this.params["graph-direction"] === "horizontal"
          ? `translate(${rootLabelWidth + this.params["node-label-margin"]}, ${
              this.params["user-y-margin"]
            })`
          : `translate(${this.params["user-y-margin"]}, ${
              rootLabelWidth + this.params["node-label-margin"]
            })`
      );

    const gContent = g.append("g");

    const data = denroot.descendants().slice(1);
    const maxDepth = d3.max(data, (d) => d.depth);

    const isNodeSizeDataKey = data.some(
      (d) => d.data[this.params["node-size-data_key"]]
    );

    const labelsarray = [];
    for (const n of data) {
      if (n.depth === maxDepth) {
        labelsarray.push(n.data[this.params["node-label-data_key"]] || "");
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

    const nodeSizeMin = d3.min(data, (d) => d["data"]["size"]);
    const nodeSizeMax = d3.max(data, (d) => d["data"]["size"]);

    const nodeRadius = d3
      .scaleSqrt()
      .domain([nodeSizeMin, nodeSizeMax])
      .range([
        this.params["node-size-min_size"],
        this.params["node-size-max_size"],
      ]);

    let nodeSizeSum = 0;
    let num = 0;
    data.forEach((d) => {
      if (!isNaN(parseFloat(d.data[this.params["node-size-data_key"]]))) {
        nodeSizeSum += nodeRadius(d.data[this.params["node-size-data_key"]]);
        num++;
      }
    });

    let spaceBetweenNode;
    if (isNodeSizeDataKey) {
      spaceBetweenNode = nodeSizeSum / num;
    } else {
      spaceBetweenNode = this.params["node-size-default"];
    }

    let graphType = d3.tree();
    if (this.params["graph-align_leaf_nodes"]) {
      graphType = d3.cluster();
    } else {
      graphType = d3.tree();
    }

    if (this.params["graph-fit_to_area_size"]) {
      if (this.params["graph-direction"] === "horizontal") {
        graphType.size([
          height - 2 * this.params["user-y-margin"],
          width - rootLabelWidth - maxLabelWidth - labelMargin * 2,
        ]);
      } else {
        graphType.size([
          width - 2 * this.params["user-y-margin"],
          height - rootLabelWidth - maxLabelWidth - labelMargin * 2,
        ]);
      }
    } else {
      graphType.nodeSize([
        spaceBetweenNode * 2 + this.params["node-space_between"],
        this.params["node-layer_distance"],
      ]);
    }

    graphType(denroot);

    if (this.params["graph-fit_to_area_size"]) {
      denroot.x0 = data[0].parent.x;
      denroot.y0 = 0;
    } else {
      denroot.x0 = 0;
      denroot.y0 = 0;
    }

    const getLinkFn = () => {
      if (this.params["graph-direction"] === "vertical") {
        return d3.linkVertical();
      } else {
        return d3.linkHorizontal();
      }
    };

    if (this.params["graph-direction"] === "vertical") {
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
        .attr(
          "transform",
          this.params["graph-fit_to_area_size"]
            ? `translate(${source.y0}, ${source.x0})`
            : this.params["graph-direction"] === "horizontal"
            ? `translate(${source.y0}, ${source.x0 + height / 2})`
            : `translate(${source.y0 + width / 2}, ${source.x0})`
        )
        .on("click", (e, d) => {
          toggle(d);
          update(d);
        });

      nodeEnter
        .append("circle")
        .attr("data-tooltip", (d) => d.data[this.params["tooltips-data_key"]])
        .classed("with-children", (d) => d.children);

      nodeEnter
        .append("text")
        .attr("x", (d) =>
          d.children || d._children ? -labelMargin : labelMargin
        )
        .attr("dy", "3")
        .attr(
          "transform",
          this.params["graph-direction"] === "vertical"
            ? "rotate(90)"
            : "rotate(0)"
        )
        .attr("text-anchor", (d) =>
          d.children || d._children ? "end" : "start"
        )
        .text((d) => d.data[this.params["node-label-data_key"]] || "");

      const nodeUpdate = nodeEnter.merge(node);
      const duration = 500;

      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", (d) =>
          this.params["graph-fit_to_area_size"]
            ? `translate(${d.y}, ${d.x})`
            : this.params["graph-direction"] === "horizontal"
            ? `translate(${d.y}, ${d.x + height / 2})`
            : `translate(${d.y + width / 2}, ${d.x})`
        );

      nodeUpdate
        .select("circle")
        .attr("r", (d) =>
          isNodeSizeDataKey
            ? nodeRadius(d.data[this.params["node-size-data_key"]]) ||
              nodeRadius(nodeSizeMin)
            : parseFloat(this.params["node-size-default"])
        )
        .attr("fill", (d) =>
          d._children
            ? "#fff"
            : d.data[this.params["node-color-data_key"]] || color
        );

      node
        .exit()
        .transition()
        .duration(duration)
        .attr(
          "transform",
          this.params["graph-fit_to_area_size"]
            ? `translate(${source.y}, ${source.x})`
            : this.params["graph-direction"] === "horizontal"
            ? `translate(${source.y}, ${source.x + height / 2})`
            : `translate(${source.y + width / 2}, ${source.x})`
        )
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
          this.params["graph-path"] === "curve"
            ? this.params["graph-fit_to_area_size"]
              ? getLinkFn().x(source.y0).y(source.x0)
              : this.params["graph-direction"] === "horizontal"
              ? getLinkFn()
                  .x(source.y0)
                  .y(source.x0 + height / 2)
              : getLinkFn()
                  .x(source.y0 + width / 2)
                  .y(source.x0)
            : this.params["graph-fit_to_area_size"]
            ? d3.link(d3.curveStep).x(source.y0).y(source.x0)
            : this.params["graph-direction"] === "horizontal"
            ? d3
                .link(d3.curveStep)
                .x(source.y0)
                .y(source.x0 + height / 2)
            : d3
                .link(d3.curveStep)
                .x(source.y0 + width / 2)
                .y(source.x0)
        );

      const linkUpdate = linkEnter.merge(link);
      linkUpdate
        .transition()
        .duration(duration)
        .attr(
          "d",
          this.params["graph-path"] === "curve"
            ? this.params["graph-fit_to_area_size"]
              ? getLinkFn()
                  .x((d) => d.y)
                  .y((d) => d.x)
              : this.params["graph-direction"] === "horizontal"
              ? getLinkFn()
                  .x((d) => d.y)
                  .y((d) => d.x + height / 2)
              : getLinkFn()
                  .x((d) => d.y + width / 2)
                  .y((d) => d.x)
            : this.params["graph-fit_to_area_size"]
            ? this.params["graph-direction"] === "horizontal"
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
            : this.params["graph-direction"] === "horizontal"
            ? d3
                .link(d3.curveStep)
                .x((d) => d.y)
                .y((d) => d.x + height / 2)
            : (d) =>
                `M${d.source.y + width / 2},${d.source.x} L${
                  d.source.y + width / 2
                },${(d.target.x + d.source.x) / 2}  L${
                  d.target.y + width / 2
                },${(d.target.x + d.source.x) / 2} L${d.target.y + width / 2},${
                  d.target.x
                }`
        );

      link
        .exit()
        .transition()
        .duration(duration)
        .attr(
          "d",
          this.params["graph-path"] === "curve"
            ? this.params["graph-fit_to_area_size"]
              ? getLinkFn().x(source.y).y(source.x)
              : this.params["graph-direction"] === "horizontal"
              ? getLinkFn()
                  .x(source.y)
                  .y(source.x + height / 2)
              : getLinkFn()
                  .x(source.y + width / 2)
                  .y(source.x)
            : this.params["graph-fit_to_area_size"]
            ? d3.link(d3.curveStep).x(source.y).y(source.x)
            : this.params["graph-direction"] === "horizontal"
            ? d3
                .link(d3.curveStep)
                .x(source.y)
                .y(source.x + height / 2)
            : d3
                .link(d3.curveStep)
                .x(source.y + width / 2)
                .y(source.x)
        )
        .remove();

      node.each((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };
    update(denroot);

    const maxX = d3.max(data, (d) => d.y);
    const minX = d3.min(data, (d) => d.y);
    const maxY = d3.max(data, (d) => d.x);
    const minY = d3.min(data, (d) => d.x);
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 10])
      .translateExtent([
        [-dataWidth + dataWidth / 5, -dataHeight + dataHeight / 5],
        [dataWidth * 2 - dataWidth / 5, dataHeight * 2 - dataHeight / 5],
      ])

      .on("zoom", (e) => {
        zoomed(e);
      });

    if (!this.params["graph-fit_to_area_size"]) {
      svg.call(zoom);
      svg.on("dblclick.zoom", resetted);
    }

    function zoomed(e) {
      gContent.attr("transform", e.transform);
    }

    function resetted() {
      gContent.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    }

    if (showToolTips) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}
