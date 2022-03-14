import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";
import * as FAIcons from "@fortawesome/free-solid-svg-icons";
import roundPathCorners from "./rounding.js";

//convert kebab-case into camelCase
const camelize = (s) => s.replace(/-./g, (x) => x[1].toUpperCase());

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

import copyToClipbard from "./clipboard";

let currentDataId;
let currentDropdownMenu;

export default class Breadcrumbs extends Stanza {
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
      currentDataId = event.detail.id;
      this.render();
    }
  }

  async render() {
    const dispatcher = this.element;

    appendCustomCss(this, this.params["custom-css-url"]);

    const width = this.params["width"];
    const height = this.params["height"];
    const showDropdown = this.params["show-dropdown"];
    const homeIcon = this.params["home-icon"] || "Home";
    const showingStyle = this.params["showing-style"];

    const values = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    this._data = values;

    if (!currentDataId && this.params["initinal-data-id"]) {
      currentDataId = this.params["initinal-data-id"];
    }

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const app = this.root.getElementById("breadcrumbs");
    const appBreadcrumbs = app.appendChild(
      d3.create("div").attr("id", "app-breadcrumbs").node()
    );
    const button = app.appendChild(
      d3.create("button").attr("id", "app-copy-button").node()
    );
    button.setAttribute("height", "20px");

    const idMap = new Map();

    addRoot();

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

    const initialId = "6";
    let showingMenu = null;

    function getById(id) {
      return idMap.get(id);
    }

    function getPolygon(width, height, arrowLength = 10) {
      if (width < arrowLength) {
        throw new Error("Width must be greater than arrow length");
      }

      const points = [
        [0, 0],
        [width - arrowLength, 0],
        [width, height / 2],
        [width - arrowLength, height],
        [0, height],
      ];

      const path = `M 0,0 L ${points[1].join(",")} L ${points[2].join(
        ","
      )} L ${points[3].join(",")} L ${points[4].join(",")} Z`;

      return path;
    }

    function generateSVGBreadcrumb(
      datum,
      height,
      strokeWidth = 1,
      arrowLength = 10,
      r = 3
    ) {
      let path;
      const svg = d3.create("svg");
      const text = svg.append("text");

      text.append("tspan").text(datum.label);

      app.appendChild(svg.node()); // TODO
      let textWidth = text.node().getBBox().width;
      text.remove();
      app.removeChild(svg.node()); //TODO

      if (!textWidth || textWidth < arrowLength) {
        textWidth = arrowLength + 10;
      }

      svg
        .attr("width", textWidth + arrowLength + strokeWidth + 4)
        .attr("height", height + strokeWidth);

      const g = svg.append("g");

      if (typeof r === "number" && r > 0) {
        path = roundPathCorners(
          getPolygon(
            textWidth - strokeWidth + arrowLength + 4,
            height - strokeWidth
          ),
          r,
          0
        );
      } else {
        path = getPolygon(
          textWidth - strokeWidth + arrowLength + 4,
          height - strokeWidth,
          arrowLength
        );
      }

      g.attr("transform", `translate(${strokeWidth / 2},${strokeWidth / 2})`);

      const breadcrumbPath = g
        .append("path")
        .attr("d", path)
        .attr("class", "breadcrumb-path");

      const label = g
        .append("text")
        .text(datum.label)
        .attr("y", 10)
        .attr("x", 4)
        .attr("alignment-baseline", "middle")
        .attr("opacity", 1);

      if (datum.id !== "root") {
        svg.on("mouseover", () => {
          breadcrumbPath.classed("breadcrumb-path-hover", true);
          label.classed("breadcrumb-label-hover", true);
        });

        svg.on("mouseleave", () => {
          breadcrumbPath.classed("breadcrumb-path-hover", false);
          label.classed("breadcrumb-label-hover", false);
        });
      }

      svg.on("click", () => {
        handleChange(datum.id);
      });

      return svg;
    }

    function getAscendants(id) {
      let currentNode = getById(id);
      const ascendants = [currentNode];

      while (currentNode?.parent) {
        ascendants.push(getById(currentNode.parent));
        currentNode = getById(currentNode.parent);
      }
      ascendants.reverse();
      return ascendants;
    }

    function getNeighbourNodes(id) {
      const currentNode = getById(id);
      if (!currentNode?.parent) {
        return [];
      }
      const parent = getById(currentNode.parent);
      if (!parent?.children) {
        return [];
      }
      return parent.children
        .filter((child) => child !== id)
        .map((id) => getById(id));
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
        .text((d) => d.label)
        .on("click", (e, d) => {
          handleChange(d.id);
        });

      return menuContainer;
    }

    function updateId(id = initialId) {
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
            const result = enter.append("div").attr("style", `height: 20px`);

            result.append((d) => generateSVGBreadcrumb(d, 20).node());
            result
              .on("mouseenter", function (e, d) {
                if (d.id === "root") {
                  return;
                }
                if (showingMenu) {
                  showingMenu.remove();
                }

                showingMenu = getMenuForId.call(this, d.id);
                const breadcrumbCoords = this.getBoundingClientRect();
                const appRect = app.getBoundingClientRect();
                // console.log("app rect", app.getBoundingClientRect());
                app.appendChild(showingMenu.node()); //TODO
                // console.log({ breadcrumbCoords });
                // console.log("e.pageX", e.pageX);
                // console.log("e.ClientX", e.clientX);
                // console.log("e", e);

                // console.log(
                //   "parent padding top",
                //   getComputedStyle(app.parentElement).paddingTop
                // );

                showingMenu.node().style.left = `${
                  breadcrumbCoords.left -
                  appRect.left +
                  parseFloat(getComputedStyle(app.parentElement).paddingLeft)
                }px`;
                showingMenu.node().style.top = `${
                  breadcrumbCoords.bottom -
                  4 -
                  appRect.top +
                  parseFloat(getComputedStyle(app.parentElement).paddingTop)
                }px`;
              })
              .on("mouseleave", (e) => {
                console.log(e.offsetY);
                if (e.offsetY <= 0) {
                  showingMenu.remove();
                }
              });
            return result;
          },
          (update) => update,
          (exit) => exit.remove()
        )
        .attr("class", "breadcrumb");
    }

    function addRoot() {
      const root = {
        id: "root",
        label: "Root",
        children: [],
      };

      values.forEach((node, i) => {
        if (!node.parent) {
          root.children.push(node.id);
          values[i].parent = "root";
        }
      });

      values.push(root);
    }

    function handleChange(id) {
      // emit events etc. here
      updateId(id);
    }

    updateId(initialId);
  }
}
