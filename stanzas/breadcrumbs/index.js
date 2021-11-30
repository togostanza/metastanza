import Stanza from "togostanza/stanza";
import * as d3 from "d3";
// import loadData from "togostanza-utils/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import loadData from "togostanza-utils/load-data";

export default class Breadcrumbs extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "tree"),
      downloadPngMenuItem(this, "tree"),
    ];
  }
  handleEvent(event) {
    console.log(event);
  }

  async render() {
    const dispatcher = this.element.dispatchEvent;

    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width
    const width = this.params["width"];
    const height = this.params["height"];
    const isCoupledStanza = this.params["is-coupled"];

    let data;
    if (!isCoupledStanza) {
      data = await loadData(this.params["data-url"], this.params["data-type"]);
    } else {
      data = this.params["data"];
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

    const opts = {
      width,
      height,
    };
    renderElement(el, filteredData, opts, dispatcher);
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

  const hierarchyData = d3.hierarchy(nestedData);

  let currenData = hierarchyData.find((item) => {
    return item.data.data.id === 6;
  });

  const getCurrentData = (d) => {
    return hierarchyData
      .find((item) => {
        return item === d;
      })
      .ancestors()
      .reverse();
  };

  function showDropdown(e, datum) {
    if (showingD === datum) {
      container.selectAll(".node-dropdown-menu").remove();
      showingD = null;
      return;
    }

    showingD = datum;

    container.selectAll(".node-dropdown-menu").remove();

    const menuBack = container
      .append("div")
      .classed("node-dropdown-menu", true)
      .style("left", this.parentNode.offsetLeft + "px");

    const rows = menuBack
      .selectAll("div")
      .data(datum.parent.children.filter((d) => d !== datum))
      .join("div")
      .classed("node-dropdown-menu-item", true)
      .on("click", (e, d) => {
        container.selectAll(".node-dropdown-menu").remove();
        showingD = null;
        dispatcher(new CustomEvent("selectedDatumChanged", { detail: { d } }));
        return update(getCurrentData(d));
      });
    rows.append("span").text((d) => d.data.data.label);
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

    breadcrumbNode

      .append("div")
      .classed("node-label", true)
      .on("click", (e, d) => {
        return update(getCurrentData(d));
      })
      .text((d) => (d.data.data.label === "" ? "/" : d.data.data.label));

    // node dropdown icon
    breadcrumbNode
      .append("div")
      .classed("node-dropdown-container", true)
      .attr("style", (d) => (d.parent?.children ? null : "display:none"))
      .filter((d) => d.parent?.children)
      .on("click", showDropdown)
      .append("div")
      .classed("node-dropdown", true);

    // node forward icon
    breadcrumbNode
      .append("div")
      .classed("node-forward", true)
      .attr("style", (d) => (d.children ? null : "display:none"));

    // UPDATE

    breadcrumbNodes
      .selectAll("div.node-label")
      .text((d) => (d.data.data.label === "" ? "/" : d.data.data.label));

    let currentHeight = container.node().getBoundingClientRect().height;
    console.log("currentHeight", currentHeight);

    const minI = 1;
    let maxI = data.length - 1 - 2;
    if (maxI < minI) {
      maxI = minI;
    }

    let i = minI;

    // while (currentHeight > opts.height) {
    //   if (i > maxI) {
    //   }

    //   container
    //     .selectAll("div.breadcrumb-node")
    //     .filter((d) => d.depth === i)
    //     .select("div.node-label")
    //     .text("...");
    //   currentHeight = container.node().getBoundingClientRect().height;
    //   i++;
    // }
  }

  update(getCurrentData(currenData));
}
