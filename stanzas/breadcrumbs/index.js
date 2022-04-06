import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import * as FAIcons from "@fortawesome/free-solid-svg-icons";
import roundPathCorners from "./rounding.js";
import copyToClipbard from "./clipboard";

//convert kebab-case into camelCase
const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());

// FAIcons.library.add(FAIcons.faArrowRight);

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

export default class Breadcrumbs extends Stanza {
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
      d3.create("div").attr("id", "app-breadcrumbs").node()
    );

    if (showCopyButton) {
      const button = app.appendChild(
        d3.create("button").attr("id", "app-copy-button").node()
      );

      button.addEventListener("click", handleCopyToClipboard);

      button.setAttribute("height", height + "px");
      button.style["border-radius"] = breadcrumbsR + "px";

      try {
        button.appendChild(generateFAIcon(copyIcon, "copy-icon"));
      } catch (error) {
        button.innerText = "⧉";
      }

      d3.select(button).on("mouseenter", () => {
        if (showingMenu) {
          showingMenu.remove();
        }
      });
    }

    // button.innerText = "⧉";
    function generateFAIcon(iconName, className) {
      const camelizedIconName = FAIcons[`fa${camelize(iconName)}`]?.icon;

      const result = d3
        .create("svg")
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
      const svg = d3.create("svg");
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

      const svg = d3.create("svg");

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
            height - strokeWidth,
            breadcrumbsArrowLength
          );
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
            height - strokeWidth,
            breadcrumbsArrowLength
          );
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
            height - strokeWidth,
            breadcrumbsArrowLength
          );
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
            height - strokeWidth,
            breadcrumbsArrowLength
          );
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

      const parent = d3.select(parentElem);
      const path = parent.select("path");
      const label = parent.select("text");
      const neighbourNodes = getNeighbourNodes(id);

      const menuContainer = d3
        .create("div")
        .attr("class", "breadcrumb-menu-container");

      menuContainer.on("mouseenter", () => {
        d3.select(parentElem).on("mouseleave", null);

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
        d3.select(parentElem).on("mouseleave", (e) => {
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
      const selectBreadcrumb = d3
        .select(appBreadcrumbs)
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

      const popupNode = d3
        .create("div")
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
