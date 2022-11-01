import { S as Stanza, s as select, d as defineStanzaElement } from './transform-0e5d4876.js';
import { l as loadData } from './load-data-ad9ea040.js';
import { T as ToolTip } from './ToolTip-2d9a3bec.js';
import { b as StanzaCirculateColorGenerator } from './ColorGenerator-697f5146.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-75ea921b.js';
import { m as min } from './min-4a3f8e4e.js';
import { s as stratify } from './stratify-7050dfd9.js';
import { m as max } from './max-2c042256.js';
import { s as sqrt, t as tree, c as cluster } from './pow-43a0d612.js';
import { c as linkRadial, b as linkVertical, a as linkHorizontal } from './link-3796f00e.js';
import './dsv-ac31b097.js';
import './linear-919165bc.js';
import './ordinal-e772a8c0.js';
import './array-80a7907a.js';
import './constant-c49047a5.js';
import './point-7945b9d0.js';
import './path-a78af922.js';

//Declaring constants
const ASCENDING = "ascending",
  DESCENDING = "descending",
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
  RADIAL = "radial",
  TRANSLUCENT = "translucent",
  MULTIPLY = "multiply",
  SCREEN = "screen";

class Tree extends Stanza {
  //Stanza download menu contents
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
    const width = parseInt(this.params["width"]),
      height = parseInt(this.params["height"]),
      sortKey = this.params["sort-key"],
      sortOrder = this.params["sort-order"],
      isLeafNodesAlign = this.params["graph-align_leaf_nodes"],
      layout = this.params["layout"],
      nodeKey = this.params["node-label-key"],
      labelMargin = this.params["node-label-margin"],
      sizeKey = this.params["node-size-key"],
      minRadius = this.params["node-size-min"] / 2,
      maxRadius = this.params["node-size-max"] / 2,
      aveRadius = (minRadius + maxRadius) / 2,
      colorKey = this.params["color-key"],
      colorGroup = this.params["color-group"],
      colorMode = this.params["color-blend"];

    let colorModeProperty, colorModeValue;
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
    }

    const tooltipKey = this.params["tooltips-data_key"];
    const showToolTips =
      !!tooltipKey && values.some((item) => item[tooltipKey]);
    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    //Sorting by user keywords
    const orderSym = Symbol("order");
    values.forEach((value, index) => {
      value[orderSym] = index;
    });

    const reorder = (a, b) => {
      if (a.data[sortKey] && b.data[sortKey]) {
        switch (sortOrder) {
          case ASCENDING:
            return a.data[sortKey] > b.data[sortKey] ? 1 : -1;
          case DESCENDING:
            return a.data[sortKey] > b.data[sortKey] ? -1 : 1;
        }
      } else {
        if (sortOrder === DESCENDING) {
          return b.data[orderSym] - a.data[orderSym];
        }
      }
    };

    //Hierarchize data
    const treeRoot = stratify()
      .parentId((d) => d.parent)(values)
      .sort(reorder);

    const treeDescendants = treeRoot.descendants();
    const data = treeDescendants.slice(1);

    //Setting node size
    const nodeSizeMin = min(data, (d) => d.data[sizeKey]);
    const nodeSizeMax = max(data, (d) => d.data[sizeKey]);

    const d3RadiusScale = sqrt()
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

    //Setting color scale
    const colorDatas = [];
    treeDescendants.forEach((d) => {
      colorDatas.push(d.data);
    });

    const colorGenerator = new StanzaCirculateColorGenerator(
      this,
      colorDatas,
      colorGroup
    );

    const setColor = (d) => {
      if (d.data[colorKey]) {
        return d.data[colorKey];
      } else {
        return d.data[colorGroup]
          ? colorGenerator.getColor(d.data[colorGroup])
          : colorGenerator.defaultColor;
      }
    };

    //Setting svg area
    const svg = select(el)
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
    const maxDepth = max(data, (d) => d.depth);
    const labels = [];
    for (const n of data) {
      n.depth === maxDepth ? labels.push(n.data[nodeKey] || "") : "";
    }
    const maxLabelGroup = svg.append("g");
    maxLabelGroup
      .selectAll("text")
      .data(labels)
      .enter()
      .append("text")
      .text((d) => d);
    const maxLabelWidth = maxLabelGroup.node().getBBox().width;
    maxLabelGroup.remove();

    //Create each group
    const g = svg.append("g");
    const gCircles = g.append("g").attr("class", "circles");
    const gLabels = g.append("g").attr("class", "labels");

    //Draw function
    const draw = (
      margin = {
        top: 0,
        right: maxLabelWidth + labelMargin,
        bottom: 0,
        left: rootLabelWidth + labelMargin,
      }
    ) => {
      //Error handling
      switch (layout) {
        case HORIZONTAL:
          if (width - margin.right - margin.left < 0) {
            el.innerHTML = "<p>width is too small!</p>";
            throw new Error("width is too small!");
          }
          break;
        case VERTICAL:
          if (height - margin.left - margin.right < 0) {
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
      g.attr("transform", () => {
        switch (layout) {
          case HORIZONTAL:
            return `translate(${margin.left}, ${margin.top})`;
          case VERTICAL:
            return `translate(${margin.top}, ${margin.left})`;
          case RADIAL:
            return `translate(${Math.min(width / 2, height / 2)}, ${Math.min(
              width / 2,
              height / 2
            )})`;
        }
      });

      //Align leaves or not
      let graphType = tree();
      isLeafNodesAlign ? (graphType = cluster()) : (graphType = tree());

      //Gap between node
      const separation = (a, b) => {
        return (a.parent === b.parent ? 1 : 2) / isLeafNodesAlign ? 1 : a.depth;
      };

      //Setting the graph size for each layout
      switch (layout) {
        case HORIZONTAL:
          graphType.size([
            height - margin.top - margin.bottom,
            width - margin.left - margin.right,
          ]);
          break;
        case VERTICAL:
          graphType.size([
            width - margin.top - margin.bottom,
            height - margin.left - margin.right,
          ]);
          break;
        case RADIAL:
          graphType
            .size([2 * Math.PI, Math.min(width / 2, height / 2) - margin.right])
            .separation(separation)(treeRoot);
          break;
      }

      graphType(treeRoot);

      //Start position of drawing
      treeRoot.x0 = data[0].parent.x;
      treeRoot.y0 = 0;

      //Change values during vertical
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

        const mapper = {
          horizontal: {
            alignmentDirection: margin.top + d.x,
            depthDirection: margin.left + d.y,
          },
          vertical: {
            alignmentDirection: margin.left + d.x,
            depthDirection: margin.top + d.y,
          },
        };

        switch (layout) {
          case HORIZONTAL:
            return (
              aligns.push(mapper.horizontal["alignmentDirection"]),
              depths.push(mapper.horizontal["depthDirection"])
            );
          case VERTICAL:
            return (
              aligns.push(mapper.vertical["alignmentDirection"]),
              depths.push(mapper.vertical["depthDirection"])
            );
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
      }

      // Update margin values
      const directions = ["top", "bottom", "right", "left"];
      switch (layout) {
        case HORIZONTAL:
        case VERTICAL:
          for (const dir of directions) {
            deltas[dir] < 0 ? (margin[dir] += Math.abs(deltas[dir]) + 1) : "";
          }

          //Redraw
          if (
            deltas.top < 0 ||
            deltas.bottom < 0 ||
            deltas.left < 0 ||
            deltas.right < 0
          ) {
            draw(margin);
          }
          break;
      }

      //Update graph values
      const update = (source) => {
        let i = 0;

        //Drawing circles
        const nodeCirclesUpdate = gCircles
          .selectAll("g")
          .data(treeRoot.descendants(), (d) => d.id || (d.id = ++i));

        //Generate new elements of circle
        const nodeCirclesEnter = nodeCirclesUpdate
          .enter()
          .append("g")
          .attr("transform", () => {
            switch (layout) {
              case HORIZONTAL:
              case VERTICAL:
                return `translate(${source.y0}, ${source.x0})`;
              case RADIAL:
                return `rotate(${(source.x0 * 180) / Math.PI - 90}) translate(${
                  source.y0
                }, 0)`;
            }
          })
          .on("click", (e, d) => {
            toggle(d);
            update(d);
          });

        //Update circle color when opening and closing
        nodeCirclesUpdate
          .filter((d) => d === source)
          .select("circle")
          .attr("fill", (d) => (d._children ? "#fff" : setColor(d)));

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
          .attr("fill", setColor);

        //Drawing labels
        const nodeLabelsUpdate = gLabels
          .selectAll("g")
          .data(treeRoot.descendants(), (d) => d.id || (d.id = ++i));

        //Generate new elements of Labels
        const nodeLabelsEnter = nodeLabelsUpdate
          .enter()
          .append("g")
          .attr("transform", () => {
            switch (layout) {
              case HORIZONTAL:
              case VERTICAL:
                return `translate(${source.y0}, ${source.x0})`;
              case RADIAL:
                return `rotate(${(source.x0 * 180) / Math.PI - 90}) translate(${
                  source.y0
                }, 0)`;
            }
          });

        //Decorate labels
        nodeLabelsEnter
          .append("text")
          .attr("x", (d) => {
            switch (layout) {
              case HORIZONTAL:
                return d.children || d._children ? -labelMargin : labelMargin;
              case VERTICAL:
                return d.children || d._children ? labelMargin : -labelMargin;
              case RADIAL:
                return d.x < Math.PI === !d.children
                  ? labelMargin
                  : -labelMargin;
            }
          })
          .attr("dy", "3")
          .attr("transform", (d) => {
            switch (layout) {
              case HORIZONTAL:
                return "rotate(0)";
              case VERTICAL:
                return "rotate(-90)";
              case RADIAL:
                return `rotate(${d.x >= Math.PI ? 180 : 0})`;
            }
          })
          .attr("text-anchor", (d) => {
            switch (layout) {
              case HORIZONTAL:
                return d.children || d._children ? "end" : "start";
              case VERTICAL:
                return d.children || d._children ? "start" : "end";
              case RADIAL:
                return d.x < Math.PI === !d.children ? "start" : "end";
            }
          })
          .text((d) => d.data[nodeKey] || "");

        const duration = 500;

        //Circle transition
        nodeCirclesEnter
          .transition()
          .duration(duration)
          .attr("transform", (d) => {
            switch (layout) {
              case HORIZONTAL:
              case VERTICAL:
                return `translate(${d.y}, ${d.x})`;
              case RADIAL:
                return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                  d.y
                }, 0)`;
            }
          });

        //Labels transition
        nodeLabelsEnter
          .attr("transform", (d) => {
            switch (layout) {
              case HORIZONTAL:
              case VERTICAL:
                return `translate(${source.y}, ${source.x})`;
              case RADIAL:
                if (source.y === 0) {
                  return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                    source.y
                  }, ${source.x})`;
                } else {
                  return `rotate(${
                    (source.x * 180) / Math.PI - 90
                  }) translate(${source.y}, ${source.x})`;
                }
            }
          })
          .transition()
          .duration(duration)
          .attr("transform", (d) => {
            switch (layout) {
              case HORIZONTAL:
              case VERTICAL:
                return `translate(${d.y}, ${d.x})`;
              case RADIAL:
                return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                  d.y
                }, 0)`;
            }
          });

        //Remove extra elements of circle
        nodeCirclesUpdate
          .exit()
          .transition()
          .duration(duration)
          .attr("transform", () => {
            switch (layout) {
              case HORIZONTAL:
              case VERTICAL:
                return `translate(${source.y}, ${source.x})`;
              case RADIAL:
                return `rotate(${(source.x * 180) / Math.PI - 90}) translate(${
                  source.y
                }, 0)`;
            }
          })
          .remove();

        //Remove extra elements of Labels
        nodeLabelsUpdate
          .exit()
          .attr("transform", (d) => {
            switch (layout) {
              case HORIZONTAL:
              case VERTICAL:
                return `translate(${d.y}, ${d.x})`;
              case RADIAL:
                return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                  d.y
                }, 0)`;
            }
          })
          .transition()
          .duration(duration)
          .attr("transform", (d) => {
            switch (layout) {
              case HORIZONTAL:
              case VERTICAL:
                return `translate(${source.y}, ${source.x})`;
              case RADIAL:
                if (source.y === 0) {
                  return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
                    source.y
                  }, 0)`;
                } else {
                  return `rotate(${
                    (source.x * 180) / Math.PI - 90
                  }) translate(${source.y}, 0)`;
                }
            }
          })
          .remove();

        //Drawing path
        const link = g
          .selectAll(".link")
          .data(treeRoot.links(), (d) => d.target.id);

        //Setting the path for each direction
        const getLinkFn = () => {
          switch (layout) {
            case HORIZONTAL:
              return linkHorizontal();
            case VERTICAL:
              return linkVertical();
          }
        };

        //Generate new elements of Path
        const linkEnter = link
          .enter()
          .insert("path", "g")
          .classed("link", true)
          .attr(
            "d",
            layout === RADIAL
              ? linkRadial().angle(source.x).radius(source.y)
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
              ? linkRadial()
                  .angle((d) => d.x)
                  .radius((d) => d.y)
              : getLinkFn()
                  .x((d) => d.y)
                  .y((d) => d.x)
          );

        //Remove extra elements of path
        link
          .exit()
          .transition()
          .duration(duration)
          .attr(
            "d",
            layout === RADIAL
              ? linkRadial().angle(source.x).radius(source.y)
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

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Tree
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "tree-d3",
	"stanza:label": "Tree-D3",
	"stanza:definition": "Tree-D3 MetaStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2022-06-30",
	"stanza:updated": "2022-06-30",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/tree-d3.json",
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
		"stanza:key": "misc-custom_css_url",
		"stanza:example": "",
		"stanza:description": "Custom CSS URL",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 600,
		"stanza:description": "Width in px"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 1800,
		"stanza:description": "Height in px"
	},
	{
		"stanza:key": "sort-key",
		"stanza:type": "text",
		"stanza:example": "id",
		"stanza:description": "sort data points by this data key",
		"stanza:required": false
	},
	{
		"stanza:key": "sort-order",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"ascending",
			"descending"
		],
		"stanza:example": "ascending",
		"stanza:description": "sorting order"
	},
	{
		"stanza:key": "graph-align_leaf_nodes",
		"stanza:type": "boolean",
		"stanza:example": false,
		"stanza:description": "align leaf nodes"
	},
	{
		"stanza:key": "layout",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"horizontal",
			"vertical",
			"radial"
		],
		"stanza:example": "horizontal",
		"stanza:description": "Tree layout"
	},
	{
		"stanza:key": "node-label-key",
		"stanza:type": "text",
		"stanza:example": "name",
		"stanza:description": "Data key in data to map labels",
		"stanza:required": false
	},
	{
		"stanza:key": "node-label-margin",
		"stanza:type": "number",
		"stanza:example": 8,
		"stanza:description": "Margin in px from node to label",
		"stanza:required": false
	},
	{
		"stanza:key": "node-size-key",
		"stanza:type": "text",
		"stanza:example": "size",
		"stanza:description": "Sets the size of the node circle based on the data key. If not set, the sizes will be the same.",
		"stanza:required": false
	},
	{
		"stanza:key": "node-size-min",
		"stanza:type": "number",
		"stanza:example": 8,
		"stanza:description": "Minimum node diameter in px",
		"stanza:required": false
	},
	{
		"stanza:key": "node-size-max",
		"stanza:type": "number",
		"stanza:example": 8,
		"stanza:description": "Maximum node diameter in px",
		"stanza:required": false
	},
	{
		"stanza:key": "color-key",
		"stanza:type": "text",
		"stanza:example": "color",
		"stanza:description": "Set color on the node circle based on the data key.",
		"stanza:required": false
	},
	{
		"stanza:key": "color-group",
		"stanza:type": "text",
		"stanza:example": "group",
		"stanza:description": "Set color on the node circle based on the group.",
		"stanza:required": false
	},
	{
		"stanza:key": "color-blend",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"normal",
			"translucent",
			"multiply",
			"screen"
		],
		"stanza:example": "normal",
		"stanza:description": "Blend mode for overlaying nodes"
	},
	{
		"stanza:key": "tooltips-key",
		"stanza:type": "text",
		"stanza:example": "name",
		"stanza:description": "Data key to use as tooltip text",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-theme-series_0_color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Node circle color. Valid when node-color-data_key does not exist."
	},
	{
		"stanza:key": "--togostanza-theme-series_1_color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Node circle color. Valid when node-color-data_key exists."
	},
	{
		"stanza:key": "--togostanza-theme-series_2_color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Node circle color. Valid when node-color-data_key exists."
	},
	{
		"stanza:key": "--togostanza-theme-series_3_color",
		"stanza:type": "color",
		"stanza:default": "#E6BB1A",
		"stanza:description": "Node circle color. Valid when node-color-data_key exists."
	},
	{
		"stanza:key": "--togostanza-theme-series_4_color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Node circle color. Valid when node-color-data_key exists."
	},
	{
		"stanza:key": "--togostanza-theme-series_5_color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Node circle color. Valid when node-color-data_key exists."
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#CDCDCD",
		"stanza:description": "Path color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 9,
		"stanza:description": "Primary font size in px"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0.5,
		"stanza:description": "Border width in px"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"tree-d3\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=tree-d3.js.map
