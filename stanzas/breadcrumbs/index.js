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

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width
    const width = this.params["width"];

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

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
    };
    renderElement(el, filteredData, opts);
  }
}

let showingD;

function renderElement(el, data, opts) {
  const nestedData = d3
    .stratify()
    .id((d) => d.id)
    .parentId((d) => d.parent)(data);

  const container = d3
    .select(el)
    .append("div")
    .attr("style", "width:" + opts.width + "px");

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
    //get all opened dropdowns and close them
    if (showingD === datum) {
      d3.select(this.parentNode.parentNode)
        .selectAll(".node-dropdown-menu")
        .remove();
      showingD = null;
      return;
    }

    showingD = datum;

    d3.select(this.parentNode.parentNode)
      .selectAll(".node-dropdown-menu")
      .remove();

    const menuBack = d3
      .select(this.parentNode.parentNode)
      .append("div")
      .classed("node-dropdown-menu", true);

    const rows = menuBack
      .selectAll("div")
      .data(datum.parent.children.filter((d) => d !== datum))
      // .filter((d) => d !== datum)
      .join("div")
      .classed("node-dropdown-menu-item", true)
      .on("click", (e, d) => {
        // console.log("clicked: ", d);
        d3.select(this.parentNode.parentNode)
          .selectAll(".node-dropdown-menu")
          .remove();
        showingD = null;
        return update(getCurrentData(d));
      });
    rows.append("span").text((d) => d.data.data.label);
  }

  function update(data) {
    // console.log("update:", data);
    const breadcrumbNodes = container
      .selectAll("div.breadcrumb-node")
      .data(data, (d) => d.data.data.id);

    // REMOVE
    breadcrumbNodes.exit().remove();

    // ADD
    const breadcrumbNode = breadcrumbNodes
      .enter()
      .append("div")
      //.attr("style", "display:inline-block; background-color:red;")
      .classed("breadcrumb-node", true);

    breadcrumbNode
      .append("div")
      .classed("node-label", true)
      .on("click", (e, d) => {
        return update(getCurrentData(d));
      })
      .text((d) => (d.data.data.label === "" ? "/" : d.data.data.label));

    breadcrumbNode
      .append("div")
      .classed("node-dropdown", true)
      .attr("style", (d) => (d.parent?.children ? null : "display:none"))
      .filter((d) => d.parent?.children)
      .on("click", showDropdown);

    breadcrumbNode
      .append("div")
      .classed("node-forward", true)
      .attr("style", (d) => (d.children ? null : "display:none"));

    // UPDATE

    breadcrumbNodes
      .selectAll("div.node-label")
      .text((d) => (d.data.data.label === "" ? "/" : d.data.data.label));
  }

  update(getCurrentData(currenData));
}
