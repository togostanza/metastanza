import { d as defineStanzaElement } from './stanza-element-40ac9902.js';
import { S as Stanza } from './stanza-7a5318fa.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as copyHTMLSnippetToClipboardMenuItem, g as appendCustomCss, s as select } from './index-1e0b4ea1.js';
import { l as loadData } from './load-data-0be92417.js';
import { s as stratify, h as hierarchy } from './stratify-8f602319.js';

var homeIcon = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20494.59%20375.12%22%3E%3Cg%20id%3D%22%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC_2%22%20data-name%3D%22%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%202%22%3E%3Cg%20id%3D%22%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC_1-2%22%20data-name%3D%22%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%201%22%3E%3Cpath%20d%3D%22M244.37%2C103.9l-142.57%2C103V360.12a15%2C15%2C0%2C0%2C0%2C15%2C15h77a15%2C15%2C0%2C0%2C0%2C15-15v-92a15%2C15%2C0%2C0%2C1%2C15-15h48a15%2C15%2C0%2C0%2C1%2C15%2C15v92a15%2C15%2C0%2C0%2C0%2C15%2C15h76a15%2C15%2C0%2C0%2C0%2C15-15V206.87l-142.58-103A5%2C5%2C0%2C0%2C0%2C244.37%2C103.9Z%22%2F%3E%3Cpath%20d%3D%22M488%2C162.13%2C392.8%2C93.38V15.12a15%2C15%2C0%2C0%2C0-15-15h-24a15%2C15%2C0%2C0%2C0-15%2C15V54.38L276.63%2C9.48a50.13%2C50.13%2C0%2C0%2C0-58.67%2C0L6.61%2C162.13A15.94%2C15.94%2C0%2C0%2C0%2C3%2C184.39l20.55%2C28.46a16%2C16%2C0%2C0%2C0%2C22.27%2C3.59L238%2C77.69a15.93%2C15.93%2C0%2C0%2C1%2C18.67%2C0L448.75%2C216.44A16%2C16%2C0%2C0%2C0%2C471%2C212.85l20.55-28.46A15.94%2C15.94%2C0%2C0%2C0%2C488%2C162.13Z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";

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

let currentDataId;
let currentDropdownMenu;

class Breadcrumbs extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "breadcrumbs"),
      downloadPngMenuItem(this, "breadcrumbs"),
      downloadJSONMenuItem(this, "breadcrumbs", this._data),
      downloadCSVMenuItem(this, "breadcrumbs", this._data),
      downloadTSVMenuItem(this, "breadcrumbs", this._data),
      copyHTMLSnippetToClipboardMenuItem(this),
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
      this.params["data-type"],
      this.root.querySelector("main")
    );
    this._data = data;

    if (!currentDataId && this.params["initinal-data-id"]) {
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
        select(currentDropdownMenu).remove();
      }
    });

    const opts = {
      width,
      height,
      showDropdown,
    };
    renderElement(el, filteredData, opts, dispatcher);
  }
}

let showingD;

function renderElement(el, data, opts, dispatcher = null) {
  const nestedData = stratify()
    .id((d) => d.id)
    .parentId((d) => d.parent)(data);

  const container = select(el)
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

  const hierarchyData = hierarchy(nestedData);

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
	"stanza:author": "Anton Zhuravlev",
	"stanza:address": "anton@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-11-26",
	"stanza:updated": "2021-11-26",
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
		"stanza:key": "initinal-data-id",
		"stanza:type": "number",
		"stanza:description": "Initial node id",
		"stanza:example": 6,
		"stanza:required": true
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Width",
		"stanza:required": true
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 40,
		"stanza:description": "Height",
		"stanza:required": true
	},
	{
		"stanza:key": "show-dropdown",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show dropdown menu for sibling nodes",
		"stanza:required": false
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
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
		"stanza:default": "#c5c5c5",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-label-background-color-hover",
		"stanza:type": "color",
		"stanza:default": "#fdfdfd",
		"stanza:description": "Color the labels on mouseover"
	},
	{
		"stanza:key": "--togostanza-label-font-color-hover",
		"stanza:type": "color",
		"stanza:default": "#2c2c2c",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-dropdown-triangle-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Color of dropdown menu triangle"
	},
	{
		"stanza:key": "--togostanza-dropdown-triangle-color-hover",
		"stanza:type": "color",
		"stanza:default": "#e2e2e2",
		"stanza:description": "Color of dropdown menu triangle on mouseover"
	},
	{
		"stanza:key": "--togostanza-forward-triangle-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Color of path delimiter triangle"
	},
	{
		"stanza:key": "--togostanza-dropdown-menu-item-font-family",
		"stanza:type": "string",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Dropdown menu item font family"
	},
	{
		"stanza:key": "--togostanza-dropdown-menu-item-font-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Dropdown menu item font color"
	},
	{
		"stanza:key": "--togostanza-dropdown-menu-item-font-size",
		"stanza:type": "number",
		"stanza:default": 8,
		"stanza:description": "Dropdown menu item font size"
	},
	{
		"stanza:key": "--togostanza-dropdown-menu-item-font-color-hover",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Font color of dropdown menu item"
	},
	{
		"stanza:key": "--togostanza-dropdown-menu-item-background-color",
		"stanza:type": "color",
		"stanza:default": "#c5c5c5",
		"stanza:description": "Color of dropdown menu background"
	},
	{
		"stanza:key": "--togostanza-dropdown-menu-item-color-hover",
		"stanza:type": "color",
		"stanza:default": "#e6e6e6",
		"stanza:description": "Color of highlighted dropdown menu item"
	},
	{
		"stanza:key": "--togostanza-dropdown-menu-separator-color",
		"stanza:type": "color",
		"stanza:default": "#555555",
		"stanza:description": "Color of highlighted dropdown menu item"
	},
	{
		"stanza:key": "--togostanza-context-menu-background-color",
		"stanza:type": "color",
		"stanza:default": "#f5f5f5",
		"stanza:description": "Context menu background color"
	},
	{
		"stanza:key": "--togostanza-context-menu-background-color-hover",
		"stanza:type": "color",
		"stanza:default": "#ffffff",
		"stanza:description": "Context menu background color on mousever"
	},
	{
		"stanza:key": "--togostanza-context-menu-item-font-family",
		"stanza:type": "string",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Context menu item font family"
	},
	{
		"stanza:key": "--togostanza-context-menu-item-font-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Context menu item font color"
	},
	{
		"stanza:key": "--togostanza-context-menu-item-font-size",
		"stanza:type": "number",
		"stanza:default": 8,
		"stanza:description": "Context menu item font size"
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
