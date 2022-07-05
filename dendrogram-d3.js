import { S as Stanza, s as select, d as defineStanzaElement } from './transform-00c6a3f0.js';
import { l as loadData } from './load-data-365f579c.js';
import { T as ToolTip } from './ToolTip-78117830.js';
import { g as getColorSeries, l as linkHorizontal } from './ColorGenerator-dcae3706.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-a8e92823.js';
import { o as ordinal } from './ordinal-0f1f3120.js';
import { s as stratify } from './stratify-5205cf04.js';
import { m as max } from './max-2c042256.js';
import { aG as tree, aH as cluster } from './step-62d13b16.js';
import './dsv-ac31b097.js';
import './drag-0808ec57.js';
import './linear-57125633.js';
import './descending-63ef45b8.js';
import './group-eecd34be.js';
import './extent-14a1e8e9.js';
import './min-4a3f8e4e.js';
import './range-e15c6861.js';
import './sum-44e7480e.js';
import './axis-3dba94d9.js';
import './ribbon-bbaf0468.js';
import './path-a78af922.js';
import './manyBody-15c617bc.js';
import './partition-2c1b5971.js';
import './index-c54c7661.js';
import './band-3f9d7931.js';
import './create-1fd2a96a.js';
import './arc-06a68a59.js';
import './constant-c49047a5.js';
import './line-17666ef1.js';
import './array-80a7907a.js';
import './basis-0dde91c7.js';
import './stack-322237e7.js';

class Dendrogram extends Stanza {
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
      ? this.params["node-label-margin"]
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

    const color = ordinal().range(togostanzaColors);

    const root = this.root.querySelector("main");
    const el = this.root.getElementById("dendrogram-d3");

    const denroot = stratify()
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

    const svg = select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.tooltip = new ToolTip();
    root.append(this.tooltip);

    const rootGroup = svg
      .append("text")
      .attr("x", 5)
      .attr("y", 10)
      .text(
        denroot.descendants()[0].data[this.params["node-label-data_key"]] || ""
      );

    const rootLabelWidth = rootGroup.node().getBBox().width;
    rootGroup.remove();

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${rootLabelWidth + this.params["node-label-margin"]},0)`
      );

    const tempGroup = svg.append("g");

    const data = denroot.descendants().slice(1);
    const maxDepth = max(data, (d) => d.depth);

    const labelsarray = [];
    for (const n of data) {
      if (n.depth === maxDepth) {
        labelsarray.push(n.data[this.params["node-label-data_key"]] || "");
      }
    }

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

    let graphType = tree();

    if (this.params["graph-type"] === "tree") {
      graphType = tree();
    } else {
      graphType = cluster();
    }

    denroot.x0 = height / 2;
    denroot.y0 = 0;

    const update = (source) => {
      graphType.size([
        height,
        width - maxLabelWidth - rootLabelWidth - labelMargin * 2,
      ]);

      let i = 0;

      graphType(denroot);

      const node = g
        .selectAll(".node")
        .data(denroot.descendants(), (d) => d.id || (d.id = ++i));

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", `translate(${source.y0}, ${source.x0})`)
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
        .attr("text-anchor", (d) =>
          d.children || d._children ? "end" : "start"
        )
        .text((d) => d.data[this.params["node-label-data_key"]] || "");

      const nodeUpdate = nodeEnter.merge(node);
      const duration = 500;

      nodeUpdate
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

      nodeUpdate
        .select("circle")
        .attr("r", parseFloat(this.params["node-size-fixed_size"] / 2))
        .attr("fill", (d) => (d._children ? "#fff" : color(d.depth)));

      node
        .exit()
        .transition()
        .duration(duration)
        .attr("transform", `translate(${source.y}, ${source.x})`)
        .remove();

      const link = g
        .selectAll(".link")
        .data(denroot.links(), (d) => d.target.id);

      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", linkHorizontal().x(source.y0).y(source.x0));

      const linkUpdate = linkEnter.merge(link);
      linkUpdate
        .transition()
        .duration(duration)
        .attr(
          "d",
          linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x)
        );

      link
        .exit()
        .transition()
        .duration(duration)
        .attr("d", linkHorizontal().x(source.y).y(source.x))
        .remove();

      node.each((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };
    update(denroot);

    if (showToolTips) {
      this.tooltip.setup(el.querySelectorAll("[data-tooltip]"));
    }
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Dendrogram
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dendrogram-d3",
	"stanza:label": "Dendrogram-D3",
	"stanza:definition": "Dendrogram-D3 MetaStanza",
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
		"stanza:example": "https://vega.github.io/vega/data/flare.json",
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
		"stanza:key": "node-label-data_key",
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
		"stanza:key": "node-size-fixed_size",
		"stanza:type": "number",
		"stanza:example": 8,
		"stanza:description": "node circle size in px",
		"stanza:required": false
	},
	{
		"stanza:key": "tooltips-data_key",
		"stanza:type": "text",
		"stanza:example": "name",
		"stanza:description": "Data key to use as tooltip text",
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
		"stanza:key": "graph-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"tree",
			"cluster"
		],
		"stanza:example": "tree",
		"stanza:description": "Graph type"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-theme-series_0_color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-theme-series_1_color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-theme-series_2_color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-theme-series_3_color",
		"stanza:type": "color",
		"stanza:default": "#E6BB1A",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-theme-series_4_color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-theme-series_5_color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-fonts-font_family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-fonts-font_color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color"
	},
	{
		"stanza:key": "--togostanza-fonts-font_size_primary",
		"stanza:type": "number",
		"stanza:default": 9,
		"stanza:description": "Primary font size in px"
	},
	{
		"stanza:key": "--togostanza-outline-padding",
		"stanza:type": "number",
		"stanza:default": 20,
		"stanza:description": "Padding in px"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#AEB3BF",
		"stanza:description": "Border color for everything that have a border"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0.5,
		"stanza:description": "Border width in px"
	},
	{
		"stanza:key": "--togostanza-theme-background_color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"dendrogram-d3\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=dendrogram-d3.js.map
