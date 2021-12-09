import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import homeIcon from "./assets/home.svg";
import loadData from "togostanza-utils/load-data";

import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "togostanza-utils";

import copyToClipbard from "./clipboard";

let currentDataId;
let currentDropdownMenu;

export default class Breadcrumbs extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "tree"),
      downloadPngMenuItem(this, "tree"),
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

    // const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width
    const width = this.params["width"];
    const height = this.params["height"];
    const showDropdown = this.params["show-dropdown"];
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    if (!currentDataId && this.props["initinal-data-id"]) {
      currentDataId = this.params["initinal-data-id"];
    }

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const filteredData = data.filter(
      (item) => (item.children && !item.n) || (item.n && item.n > 0)
    );

    //Add root element if there are more than one elements without parent.
    const rootElemIndexes = [];
    for (let i = 0; i < filteredData.length - 1; i++) {
      if (!filteredData[i]?.parent) {
        rootElemIndexes.push(i);
      }
    }
    if (rootElemIndexes.length > 1) {
      filteredData.push({ id: -1, value: "", label: "" });

      rootElemIndexes.forEach((index) => {
        filteredData[index].parent = -1;
      });
    }

    const el = this.root.querySelector("#breadcrumbs");

    // Hide dropdown menu on scroll if any
    window.document.addEventListener("scroll", () => {
      if (currentDropdownMenu) {
        d3.select(currentDropdownMenu).remove();
      }
    });

    const opts = {
      width,
      height,
      showDropdown,
    };
    renderElement(el, filteredData, opts, dispatcher, currentDataId);
  }
}

let showingD;

function renderElement(el, data, opts, dispatcher = null) {
  const nestedData = d3
    .stratify()
    .id((d) => d.id)
    .parentId((d) => d.parent)(data);

  const container = d3
    .select(el)
    .attr("style", `width:${opts.width}px;height:${opts.height}px;`)
    .append("div")
    .classed("container", true);

  //Context menu substrate to capture left click without dispatching unnecessary events
  const subDiv = container
    .append("div")
    .classed("context-menu-substrate", true)
    .style("height", container);

  const contextMenu = subDiv.append("div");

  contextMenu
    .classed("right-click-menu", true)
    .append("ul")
    .append("li")
    .text("Copy path");

  subDiv.on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    subDiv.style("display", "none");
    contextMenu.style("display", "none");
  });

  container.on("contextmenu", function (e) {
    e.stopPropagation();
    e.preventDefault();
    const rect = this.getBoundingClientRect();

    subDiv.style("display", "block");

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    contextMenu
      .style("display", "block")
      .style("left", `${x}px`)
      .style("top", `${y}px`);
  });

  contextMenu.on("click", function (e) {
    e.stopPropagation();
    const textarea = container
      .append("textarea")
      .classed("path-selection", true);

    const currentPath = getCurrentData(currentDataId)
      .map((item) => item.data.data.label)
      .join("/");

    textarea.text(currentPath);

    copyToClipbard(textarea.node(), "copy");

    textarea.remove();
    subDiv.style("display", "none");
    contextMenu.style("display", "none");
  });

  const hierarchyData = d3.hierarchy(nestedData);

  const getCurrentData = (id) => {
    return hierarchyData
      .find((item) => {
        return item.data.data.id === id;
      })
      .ancestors()
      .reverse();
  };

  function showDropdown(e, datum) {
    if (showingD === datum) {
      container.selectAll(".node-dropdown-menu").remove();
      showingD = null;
      currentDropdownMenu = null;
      return;
    }

    showingD = datum;

    container.selectAll(".node-dropdown-menu").remove();

    const menuBack = container
      .append("div")
      .classed("node-dropdown-menu", true)
      .style("left", this.parentNode.getBoundingClientRect().left + "px")
      .style(
        "top",
        this.parentNode.getBoundingClientRect().top +
          this.parentNode.getBoundingClientRect().height +
          "px"
      );

    currentDropdownMenu = menuBack.node();

    const rows = menuBack
      .selectAll("div")
      .data(datum.parent.children.filter((d) => d !== datum));

    const rowContainer = rows
      .join("div")
      .classed("node-dropdown-menu-item-container", true);

    const row = rowContainer
      .append("div")
      .classed("node-dropdown-menu-item", true);

    row
      .filter((d) => d.children)
      .on("click", (e, d) => {
        container.selectAll(".node-dropdown-menu").remove();
        showingD = null;
        currentDropdownMenu = null;
        dispatcher.dispatchEvent(
          new CustomEvent("selectedDatumChanged", {
            detail: { id: d.data.data.id },
          })
        );
        currentDataId = d.data.data.id;
        return update(getCurrentData(d.data.data.id));
      });

    row
      .append("span")
      .text((d) => d.data.data.label)
      .classed("disabled", (d) => !d.children);

    //Separator
    rowContainer.filter((d, i, nodes) => i < nodes.length - 1).append("hr");
  }

  function update(data) {
    const breadcrumbNodes = container
      .selectAll("div.breadcrumb-node")
      .data(data, (d) => d.data.data.id);

    // REMOVE
    breadcrumbNodes.exit().remove();

    // ADD
    const breadcrumbNode = breadcrumbNodes
      .enter()
      .append("div")
      .classed("breadcrumb-node", true);

    const label = breadcrumbNode
      .append("div")
      .classed("node-label", true)
      .on("click", (e, d) => {
        dispatcher.dispatchEvent(
          new CustomEvent("selectedDatumChanged", {
            detail: { id: d.data.data.id },
          })
        );
        currentDataId = d.data.data.id;
        return update(getCurrentData(currentDataId));
      });

    label.filter((d) => d.parent).text((d) => d.data.data.label);

    label
      .filter((d) => !d.parent)
      .append("img")
      .attr("src", homeIcon);

    if (opts.showDropdown) {
      // node dropdown icon
      breadcrumbNode
        .append("div")
        .classed("node-dropdown-container", true)
        .attr("style", (d) => {
          if (d.parent && d.parent.children.length > 1) {
            return null;
          }
          return "display:none";
        })
        .filter((d) => d.parent && d.parent.children.length > 1)
        .on("click", showDropdown)
        .append("div")
        .classed("node-dropdown", true);
    }

    // node forward icon
    breadcrumbNode
      .append("div")
      .classed("node-forward", true)
      .attr("style", (d) =>
        d.children
          ? opts.showDropdown
            ? null
            : "margin-left:0.4em"
          : "display:none"
      );

    // UPDATE

    breadcrumbNodes
      .filter((d) => d.depth > 0)
      .selectAll("div.node-label")
      .text((d) => d.data.data.label);
  }

  if (!currentDataId) {
    currentDataId = hierarchyData.find((data) => data.depth === 0).data.data.id;
  }

  update(getCurrentData(currentDataId));
}
