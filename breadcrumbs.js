import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { s as select, c as creator } from './index-847f2a80.js';
import { l as loadData } from './load-data-03ddc67c.js';
import { F as FAIcons } from './index.es-5d65738a.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-d2bbc90f.js';
import './dsv-cde6fd06.js';
import './dsv-cd3740c6.js';

function create(name) {
  return select(creator(name).call(document.documentElement));
}

/* eslint-disable */
/*****************************************************************************
 *                                                                            *
 *  SVG Path Rounding Function                                                *
 *  Copyright (C) 2014 Yona Appletree                                         *
 *                                                                            *
 *  Licensed under the Apache License, Version 2.0 (the "License");           *
 *  you may not use this file except in compliance with the License.          *
 *  You may obtain a copy of the License at                                   *
 *                                                                            *
 *      http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                            *
 *  Unless required by applicable law or agreed to in writing, software       *
 *  distributed under the License is distributed on an "AS IS" BASIS,         *
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 *  See the License for the specific language governing permissions and       *
 *  limitations under the License.                                            *
 *                                                                            *
 *****************************************************************************/

/**
 * SVG Path rounding function. Takes an input path string and outputs a path
 * string where all line-line corners have been rounded. Only supports absolute
 * commands at the moment.
 *
 * @param pathString The SVG input path
 * @param radius The amount to round the corners, either a value in the SVG
 *               coordinate space, or, if useFractionalRadius is true, a value
 *               from 0 to 1.
 * @param useFractionalRadius If true, the curve radius is expressed as a
 *               fraction of the distance between the point being curved and
 *               the previous and next points.
 * @returns A new SVG path string with the rounding
 */
function roundPathCorners(
  pathString,
  radius,
  useFractionalRadius
) {
  function moveTowardsLength(movingPoint, targetPoint, amount) {
    var width = targetPoint.x - movingPoint.x;
    var height = targetPoint.y - movingPoint.y;

    var distance = Math.sqrt(width * width + height * height);

    return moveTowardsFractional(
      movingPoint,
      targetPoint,
      Math.min(1, amount / distance)
    );
  }
  function moveTowardsFractional(movingPoint, targetPoint, fraction) {
    return {
      x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
      y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction,
    };
  }

  // Adjusts the ending position of a command
  function adjustCommand(cmd, newPoint) {
    if (cmd.length > 2) {
      cmd[cmd.length - 2] = newPoint.x;
      cmd[cmd.length - 1] = newPoint.y;
    }
  }

  // Gives an {x, y} object for a command's ending position
  function pointForCommand(cmd) {
    return {
      x: parseFloat(cmd[cmd.length - 2]),
      y: parseFloat(cmd[cmd.length - 1]),
    };
  }

  // Split apart the path, handing concatonated letters and numbers
  var pathParts = pathString.split(/[,\s]/).reduce(function (parts, part) {
    var match = part.match("([a-zA-Z])(.+)");
    if (match) {
      parts.push(match[1]);
      parts.push(match[2]);
    } else {
      parts.push(part);
    }

    return parts;
  }, []);

  // Group the commands with their arguments for easier handling
  var commands = pathParts.reduce(function (commands, part) {
    if (parseFloat(part) == part && commands.length) {
      commands[commands.length - 1].push(part);
    } else {
      commands.push([part]);
    }

    return commands;
  }, []);

  // The resulting commands, also grouped
  var resultCommands = [];

  if (commands.length > 1) {
    var startPoint = pointForCommand(commands[0]);

    // Handle the close path case with a "virtual" closing line
    var virtualCloseLine = null;
    if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
      virtualCloseLine = ["L", startPoint.x, startPoint.y];
      commands[commands.length - 1] = virtualCloseLine;
    }

    // We always use the first command (but it may be mutated)
    resultCommands.push(commands[0]);

    for (var cmdIndex = 1; cmdIndex < commands.length; cmdIndex++) {
      var prevCmd = resultCommands[resultCommands.length - 1];

      var curCmd = commands[cmdIndex];

      // Handle closing case
      var nextCmd =
        curCmd == virtualCloseLine ? commands[1] : commands[cmdIndex + 1];

      // Nasty logic to decide if this path is a candidite.
      if (
        nextCmd &&
        prevCmd &&
        prevCmd.length > 2 &&
        curCmd[0] == "L" &&
        nextCmd.length > 2 &&
        nextCmd[0] == "L"
      ) {
        // Calc the points we're dealing with
        var prevPoint = pointForCommand(prevCmd);
        var curPoint = pointForCommand(curCmd);
        var nextPoint = pointForCommand(nextCmd);

        // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
        var curveStart, curveEnd;

        if (useFractionalRadius) {
          curveStart = moveTowardsFractional(
            curPoint,
            prevCmd.origPoint || prevPoint,
            radius
          );
          curveEnd = moveTowardsFractional(
            curPoint,
            nextCmd.origPoint || nextPoint,
            radius
          );
        } else {
          curveStart = moveTowardsLength(curPoint, prevPoint, radius);
          curveEnd = moveTowardsLength(curPoint, nextPoint, radius);
        }

        // Adjust the current command and add it
        adjustCommand(curCmd, curveStart);
        curCmd.origPoint = curPoint;
        resultCommands.push(curCmd);

        // The curve control points are halfway between the start/end of the curve and
        // the original point
        var startControl = moveTowardsFractional(curveStart, curPoint, 0.5);
        var endControl = moveTowardsFractional(curPoint, curveEnd, 0.5);

        // Create the curve
        var curveCmd = [
          "C",
          startControl.x,
          startControl.y,
          endControl.x,
          endControl.y,
          curveEnd.x,
          curveEnd.y,
        ];
        // Save the original point for fractional calculations
        curveCmd.origPoint = curPoint;
        resultCommands.push(curveCmd);
      } else {
        // Pass through commands that don't qualify
        resultCommands.push(curCmd);
      }
    }

    // Fix up the starting point and restore the close path if the path was orignally closed
    if (virtualCloseLine) {
      var newStartPoint = pointForCommand(
        resultCommands[resultCommands.length - 1]
      );
      resultCommands.push(["Z"]);
      adjustCommand(resultCommands[0], newStartPoint);
    }
  } else {
    resultCommands = commands;
  }

  return resultCommands.reduce(function (str, c) {
    return str + c.join(" ") + " ";
  }, "");
}

/**
 * multi browser clipboard copy - ypetya@gmail.com
 * */
/***
 * This function uses multiple methods for copying data to clipboard
 * 1. document.execCommand('copy') can be supported only for user initiated contexts
 *   - that means we can only determine it on the fly
 *   - d3 eventDispatch is not working this way
 * 2. ClipboardEvent constructor is only defined for Firefox (see MDN)
 *   - for FF, d3 selector uses input's value property instead of selection.text()
 * */
function copyToClipbard (inputNode, action) {
  // Chrome
  if (
    document.queryCommandSupported &&
    document.queryCommandSupported(action)
  ) {
    inputNode.select();
    document.execCommand(action);
  } else {
    // FF
    const event = new ClipboardEvent(action);
    const text = inputNode.value;
    event.clipboardData.setData("text/plain", text);
    event.preventDefault();
    document.dispatchEvent(event);
  }
}

//convert kebab-case into camelCase
const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());

class Breadcrumbs extends Stanza {
  constructor(...args) {
    super(...args);
    this.state = {
      currentId: null,
    };
  }
  menu() {
    return [
      downloadSvgMenuItem(this, "breadcrumbs"),
      downloadPngMenuItem(this, "breadcrumbs"),
      downloadJSONMenuItem(this, "breadcrumbs", this._data),
      downloadCSVMenuItem(this, "breadcrumbs", this._data),
      downloadTSVMenuItem(this, "breadcrumbs", this._data),
    ];
  }

  handleEvent(event) {
    event.stopPropagation();
    if (event.target !== this.element) {
      this.state.currentId = "" + event.detail.id;
    }
  }

  async render() {
    this.state = new Proxy(this.state, {
      set(target, key, value) {
        if (key === "currentId") {
          updateId(value);
        }
        return Reflect.set(...arguments);
      },
      get: Reflect.get,
    });

    const dispatchEvent = (value) => {
      dispatcher.dispatchEvent(
        new CustomEvent("selectedDatumChanged", {
          detail: { id: parseInt(value) },
        })
      );
    };

    const state = this.state;

    const dispatcher = this.element;

    let showingMenu = null;

    appendCustomCss(this, this.params["custom-css-url"]);

    const width = this.params["width"];
    const height = this.params["height"];
    const showDropdown = this.params["show-dropdown"];
    const rootIcon = camelize(this.params["root-node-label-icon"]);
    const rootLabel = this.params["root-node-label-text"];
    const copyIcon = camelize(this.params["copy-icon"]);
    const initialId = this.params["initial-data-id"];
    const labelsDataKey = this.params["labels-data-key"];
    const breadcrumbsR = this.params["breadcrumbs-corner-radius"];
    const breadcrumbsArrowLength = this.params["breadcrumbs-arrow-length"];
    const showCopyButton = this.params["show-copy-button"];

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    if (!values.some((d) => d[labelsDataKey])) {
      console.error(
        "BREADCRUMBS_STANZA: No data found with the key '" + labelsDataKey + "'"
      );
    }

    this._data = values;

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const root = this.root;
    const app = this.root.getElementById("breadcrumbs");
    app.style.maxWidth = width + "px";
    app.style.height = height + "px";

    const appBreadcrumbs = app.appendChild(
      create("div").attr("id", "app-breadcrumbs").node()
    );

    if (showCopyButton) {
      const button = app.appendChild(
        create("button").attr("id", "app-copy-button").node()
      );

      button.addEventListener("click", handleCopyToClipboard);

      button.setAttribute("height", height + "px");
      button.style["border-radius"] = breadcrumbsR + "px";

      try {
        button.appendChild(generateFAIcon(copyIcon, "copy-icon"));
      } catch (error) {
        button.innerText = "⧉";
      }

      select(button).on("mouseenter", () => {
        if (showingMenu) {
          showingMenu.remove();
        }
      });
    }

    // button.innerText = "⧉";
    function generateFAIcon(iconName, className) {
      const camelizedIconName = FAIcons[`fa${camelize(iconName)}`]?.icon;

      const result = create("svg")
        .attr("class", className)
        .attr("viewBox", `0 0 ${camelizedIconName[0]} ${camelizedIconName[1]}`);
      result.append("path").attr("d", camelizedIconName[4]);
      return result.node();
    }

    const idMap = new Map();

    addRoot(values);

    values.forEach((node) => {
      node.id = "" + node.id;
      if (node?.children) {
        node.children = node.children.map((child) => "" + child);
      }
      if (node?.parent) {
        node.parent = "" + node.parent;
      }
      idMap.set(node.id, node);
    });

    function getPolygon(width, height) {
      if (width < breadcrumbsArrowLength) {
        throw new Error("Width must be greater than arrow length");
      }

      const points = [
        [0, 0],
        [width - breadcrumbsArrowLength, 0],
        [width, height / 2],
        [width - breadcrumbsArrowLength, height],
        [0, height],
      ];

      const path = `M 0,0 L ${points[1].join(",")} L ${points[2].join(
        ","
      )} L ${points[3].join(",")} L ${points[4].join(",")} Z`;

      return path;
    }

    function getTextRect(app, text) {
      const svg = create("svg");
      const textEl = svg.append("text");

      textEl.append("tspan").text(text);

      app.appendChild(svg.node()); // TODO
      const textWidth = textEl.node().getBBox().width;
      const textHeight = textEl.node().getBBox().height;
      textEl.remove();
      app.removeChild(svg.node()); //TODO
      svg.remove();

      return { textWidth, textHeight };
    }

    function generateSVGBreadcrumb(datum, height, strokeWidth = 1, r = 3) {
      let path;

      const svg = create("svg");

      const labelText = datum[labelsDataKey];

      const camelizedIconName = FAIcons[`fa${camelize(rootIcon)}`]?.icon;

      const innerMargin = 6;
      let textRect, iconLeft, labelLeft, iconTop;
      const labelTop = (height + strokeWidth) / 2;
      let textWidth = 0;
      let textHeight = 0;
      let iconWidth = 0;
      let svgBreadcrumbWidth = 0;

      if (
        labelText &&
        labelText.length > 0 &&
        camelizedIconName &&
        datum.id === "-1"
      ) {
        // text + icon
        textRect = getTextRect(app, labelText);
        textWidth = textRect.textWidth;
        textHeight = textRect.textHeight;
        iconWidth = textHeight;

        labelLeft = innerMargin * 2 + iconWidth;

        svgBreadcrumbWidth = Math.max(
          breadcrumbsArrowLength + textWidth + 3 * innerMargin + iconWidth,
          breadcrumbsArrowLength + 10
        );
        iconLeft = -svgBreadcrumbWidth / 2 + iconWidth / 2 + innerMargin;
        iconTop = height / 2 - iconWidth / 2;
        svg
          .attr("width", svgBreadcrumbWidth)
          .attr("height", height + strokeWidth);
        const g = svg.append("g");

        if (typeof r === "number" && r > 0) {
          path = roundPathCorners(
            getPolygon(svgBreadcrumbWidth - strokeWidth, height - strokeWidth),
            r,
            0
          );
        } else {
          path = getPolygon(
            svgBreadcrumbWidth - strokeWidth,
            height - strokeWidth);
        }
        g.attr("transform", `translate(${strokeWidth / 2},${strokeWidth / 2})`);
        g.append("path").attr("d", path).attr("class", "breadcrumb-path");

        const icon = g
          .append("svg")
          .attr("x", iconLeft)
          .attr("y", iconTop)
          .attr(
            "viewBox",
            `0 0 ${camelizedIconName[0]} ${camelizedIconName[1]}`
          )
          .attr("class", "home-icon");
        icon.append("path").attr("d", camelizedIconName[4]);
        icon.attr("height", textHeight);

        g.append("text")
          .text(rootLabel || datum[labelsDataKey])
          .attr("y", labelTop)
          .attr("x", labelLeft)
          .attr("alignment-baseline", "middle")
          .attr("opacity", 1);

        svg.on("click", () => {
          // handleChange(datum.id);
          state.currentId = datum.id;
          dispatchEvent(datum.id);
        });

        return svg;
      } else if (camelizedIconName && datum.id === "-1") {
        textHeight = getTextRect(app, "W").textHeight;
        iconWidth = textHeight;
        svgBreadcrumbWidth = Math.max(
          breadcrumbsArrowLength + iconWidth + 2 * innerMargin,
          breadcrumbsArrowLength + 10
        );
        iconLeft = -svgBreadcrumbWidth / 2 + iconWidth / 2 + innerMargin;

        svg
          .attr("width", svgBreadcrumbWidth)
          .attr("height", height + strokeWidth);
        const g = svg.append("g");
        if (typeof r === "number" && r > 0) {
          path = roundPathCorners(
            getPolygon(svgBreadcrumbWidth - strokeWidth, height - strokeWidth),
            r,
            0
          );
        } else {
          path = getPolygon(
            svgBreadcrumbWidth - strokeWidth,
            height - strokeWidth);
        }
        g.attr("transform", `translate(${strokeWidth / 2},${strokeWidth / 2})`);
        g.append("path").attr("d", path).attr("class", "breadcrumb-path");

        const icon = g
          .append("svg")
          .attr("x", iconLeft)
          .attr("y", iconTop)
          .attr(
            "viewBox",
            `0 0 ${camelizedIconName[0]} ${camelizedIconName[1]}`
          );
        icon.append("path").attr("d", camelizedIconName[4]);
        icon.attr("height", textHeight);

        svg.on("click", () => {
          // handleChange(datum.id);
          state.currentId = datum.id;
          dispatchEvent(datum.id);
        });

        return svg;
      } else if (labelText && labelText.length > 0) {
        textRect = getTextRect(app, labelText);
        textWidth = textRect.textWidth;
        textHeight = textRect.textHeight;
        svgBreadcrumbWidth = Math.max(
          breadcrumbsArrowLength + textWidth + 2 * innerMargin,
          breadcrumbsArrowLength + 10
        );
        labelLeft = innerMargin;
        svg
          .attr("width", svgBreadcrumbWidth)
          .attr("height", height + strokeWidth);

        const g = svg.append("g");
        if (typeof r === "number" && r > 0) {
          path = roundPathCorners(
            getPolygon(svgBreadcrumbWidth - strokeWidth, height - strokeWidth),
            r,
            0
          );
        } else {
          path = getPolygon(
            svgBreadcrumbWidth - strokeWidth,
            height - strokeWidth);
        }
        g.attr("transform", `translate(${strokeWidth / 2},${strokeWidth / 2})`);
        g.append("path").attr("d", path).attr("class", "breadcrumb-path");

        g.append("text")
          .text(labelText)
          .attr("y", labelTop)
          .attr("x", labelLeft)
          .attr("alignment-baseline", "middle")
          .attr("opacity", 1);

        svg.on("click", () => {
          // handleChange(datum.id);
          state.currentId = datum.id;
          dispatchEvent(datum.id);
        });

        return svg;
      } else {
        // no icon and no text
        svgBreadcrumbWidth = breadcrumbsArrowLength + 10;
        svg
          .attr("width", svgBreadcrumbWidth)
          .attr("height", height + strokeWidth);

        const g = svg.append("g");
        if (typeof r === "number" && r > 0) {
          path = roundPathCorners(
            getPolygon(svgBreadcrumbWidth - strokeWidth, height - strokeWidth),
            r,
            0
          );
        } else {
          path = getPolygon(
            svgBreadcrumbWidth - strokeWidth,
            height - strokeWidth);
        }
        g.attr("transform", `translate(${strokeWidth / 2},${strokeWidth / 2})`);

        g.append("path").attr("d", path).attr("class", "breadcrumb-path");

        svg.on("click", () => {
          // handleChange(datum.id);
          state.currentId = datum.id;
          dispatchEvent(datum.id);
        });

        return svg;
      }
    }

    function getAscendants(id) {
      let currentNode = idMap.get(id);
      const ascendants = [currentNode];

      while (currentNode?.parent) {
        ascendants.push(idMap.get(currentNode.parent));
        currentNode = idMap.get(currentNode.parent);
      }
      ascendants.reverse();
      return ascendants;
    }

    function getNeighbourNodes(id) {
      const currentNode = idMap.get(id);

      if (!currentNode?.parent) {
        return [];
      }
      const parent = idMap.get(currentNode.parent);

      if (!parent?.children) {
        return [];
      }
      return parent.children
        .filter((child) => child !== id)
        .map((id) => idMap.get(id));
    }

    function getMenuForId(id) {
      const parentElem = this;

      const parent = select(parentElem);
      const path = parent.select("path");
      const label = parent.select("text");
      const neighbourNodes = getNeighbourNodes(id);

      const menuContainer = create("div")
        .attr("class", "breadcrumb-menu-container");

      menuContainer.on("mouseenter", () => {
        select(parentElem).on("mouseleave", null);

        path.classed("breadcrumb-path-hover", true);
        label.classed("breadcrumb-label-hover", true);
      });

      const menuTriangle = menuContainer
        .append("div")
        .attr("class", "menu-triangle");

      const menuTriangle2 = menuContainer
        .append("div")
        .attr("class", "menu-triangle menu-triangle-overlay");

      menuTriangle.node().style.left =
        parentElem.getBoundingClientRect().width / 2 + "px";

      menuTriangle2.node().style.left =
        parentElem.getBoundingClientRect().width / 2 + "px";

      const menu = menuContainer.append("div").attr("class", "breadcrumb-menu");
      menu.node().style["border-radius"] = breadcrumbsR + "px";

      const menuData = menu.selectAll("div").data(neighbourNodes, (d) => d.id);

      menuContainer.on("mouseleave", () => {
        select(parentElem).on("mouseleave", (e) => {
          if (e.offsetY <= 0) {
            showingMenu.remove();
          }
        });

        path.classed("breadcrumb-path-hover", false);
        label.classed("breadcrumb-label-hover", false);

        if (showingMenu) {
          showingMenu.remove();
        }
      });

      menuData
        .join("div")
        .attr("class", "breadcrumb-menu-item")
        .text((d) => d[labelsDataKey])
        .on("click", (e, d) => {
          state.currentId = d.id;
          dispatchEvent(d.id);
        });

      return menuContainer;
    }

    function updateId(id) {
      if (!idMap.get(id)) {
        console.error(`BREADCRUMB STANZA: id not found: ${id}`);
        console.error(`BREADCRUMB STANZA: id type is: ${typeof id}`);
        return;
      }

      if (showingMenu) {
        showingMenu.remove();
      }
      const data = getAscendants(id);
      const selectBreadcrumb = select(appBreadcrumbs)
        .selectAll("div")
        .data(data, (d) => d.id);

      selectBreadcrumb
        .join(
          (enter) => {
            const result = enter
              .append("div")
              .attr("style", `height: ${height}px`);

            result.append((d) =>
              generateSVGBreadcrumb(d, height, 1, breadcrumbsR).node()
            );
            if (showDropdown) {
              result
                .on("mouseenter", function (e, d) {
                  if (d.id === "-1") {
                    return;
                  }
                  if (showingMenu) {
                    showingMenu.remove();
                  }

                  showingMenu = getMenuForId.call(this, d.id);
                  const breadcrumbCoords = this.getBoundingClientRect();
                  const appRect = app.getBoundingClientRect();
                  app.appendChild(showingMenu.node()); //TODO

                  showingMenu.node().style.left = `${
                    breadcrumbCoords.left -
                    appRect.left +
                    parseFloat(getComputedStyle(app.parentElement).paddingLeft)
                  }px`;
                  showingMenu.node().style.top = `${
                    breadcrumbCoords.bottom -
                    2 -
                    appRect.top +
                    parseFloat(getComputedStyle(app.parentElement).paddingTop)
                  }px`;
                })
                .on("mouseleave", (e) => {
                  if (e.offsetY <= 0) {
                    showingMenu.remove();
                  }
                });
            }
            return result;
          },
          (update) => update,
          (exit) => exit.remove()
        )
        .attr("class", "breadcrumb");
    }

    /**
     * Checks if the given hierarchy has a single root node. If no, adds it in-place
     *
     * @param {Array} values Array of hierarchy nodes
     * @param {string} rootId id to use for the root node
     * @returns {Array} Array of hierarchy nodes with a single root node
     */
    function addRoot(values, rootId = "-1") {
      if (values.filter((node) => !node?.parent).length > 1) {
        const rootNode = {
          id: "" + rootId,
          label: "" + rootLabel,
          children: [],
        };

        values.forEach((node) => {
          if (!node.parent) {
            rootNode.children.push(node.id);
            node.parent = "-1";
          }
        });

        values.push(rootNode);
      }
      return values;
    }

    /**
     * Copy to clipboard handler
     *
     * @param {e} event
     *
     * @returns {void}
     */
    function handleCopyToClipboard() {
      const textArea = document.createElement("textarea");
      const text = getAscendants(state.currentId)
        .map((d) => d.label)
        .join(" > ");
      textArea.value = text;
      document.body.appendChild(textArea);
      copyToClipbard(textArea, "copy");
      textArea.remove();

      const right =
        root.getRootNode().host.getClientRects()[1].right -
        this.getClientRects()[0].right;

      const popupNode = create("div")
        .attr("class", "popup")
        .style("border-radius", breadcrumbsR + "px")
        .style("right", right + "px")
        .text("Copied!")
        .node();

      const popup = app.appendChild(popupNode);

      popup.animate(
        [
          { transform: "translateY(-100%)", opacity: 0 },
          { transform: "translateY(0px)", opacity: 0.8 },
        ],
        { duration: 500 }
      );

      setTimeout(() => {
        popup
          .animate([{ opacity: 0.8 }, { opacity: 0 }], { duration: 100 })
          .finished.then(() => {
            popup.remove();
          });
      }, 800);
    }

    // Set currentId to render
    if (initialId) {
      state.currentId = initialId;
    } else {
      state.currentId = "-1";
    }
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Breadcrumbs
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "breadcrumbs",
	"stanza:label": "Breadcrumbs",
	"stanza:definition": "Breadcrumbs MetaStanza ",
	"stanza:type": "Stanza",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE",
	"Enishi Tech"
],
	"stanza:created": "2022-04-07",
	"stanza:updated": "2022-04-07",
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
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 420,
		"stanza:description": "Width in px",
		"stanza:required": true
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 20,
		"stanza:description": "Height in px",
		"stanza:required": true
	},
	{
		"stanza:key": "initial-data-id",
		"stanza:type": "string",
		"stanza:description": "Initial node id",
		"stanza:example": "6",
		"stanza:required": false
	},
	{
		"stanza:key": "root-node-label-text",
		"stanza:type": "string",
		"stanza:description": "Root node label text",
		"stanza:example": "Home",
		"stanza:required": false
	},
	{
		"stanza:key": "root-node-label-icon",
		"stanza:type": "string",
		"stanza:description": "Root node label icon (Font Awesome icon name)",
		"stanza:example": "Home",
		"stanza:required": false
	},
	{
		"stanza:key": "copy-icon",
		"stanza:type": "string",
		"stanza:description": "Copy icon (Font Awesome icon name)",
		"stanza:example": "Copy",
		"stanza:required": true
	},
	{
		"stanza:key": "labels-data-key",
		"stanza:type": "string",
		"stanza:description": "Data key for labels",
		"stanza:example": "label",
		"stanza:required": true
	},
	{
		"stanza:key": "breadcrumbs-corner-radius",
		"stanza:type": "number",
		"stanza:description": "Corner radius of breadcrumbs, in px",
		"stanza:example": 3,
		"stanza:required": false
	},
	{
		"stanza:key": "breadcrumbs-arrow-length",
		"stanza:type": "number",
		"stanza:description": "Corner radius of breadcrumbs, in px",
		"stanza:example": 10,
		"stanza:required": true
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "show-dropdown",
		"stanza:type": "boolean",
		"stanza:example": false,
		"stanza:description": "Show dropdown menu for sibling nodes",
		"stanza:required": false
	},
	{
		"stanza:key": "show-copy-button",
		"stanza:type": "boolean",
		"stanza:example": false,
		"stanza:description": "Show copy button",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-home-icon-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Home icon color"
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
		"stanza:type": "number",
		"stanza:default": 11,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "#f9f9fa",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#e0e0e1",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-scrollbar-color",
		"stanza:type": "color",
		"stanza:default": "#e0e0e1",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-scrollbar-color-hover",
		"stanza:type": "color",
		"stanza:default": "#d0d0d1",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-label-background-color-hover",
		"stanza:type": "color",
		"stanza:default": "#16ADE3",
		"stanza:description": "Color the labels on mouseover"
	},
	{
		"stanza:key": "--togostanza-label-font-color-hover",
		"stanza:type": "color",
		"stanza:default": "#f9f9fa",
		"stanza:description": "Label font color on hover"
	}
],
	"stanza:incomingEvent": [
	{
		"stanza:key": "selectedDatumChanged",
		"stanza:description": "An event, wich dispatches when user selects some node in other stanza"
	}
],
	"stanza:outgoingEvent": [
	{
		"stanza:key": "selectedDatumChanged",
		"stanza:description": "An event, wich dispatches when user selects some node in this stanza"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"breadcrumbs\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=breadcrumbs.js.map
