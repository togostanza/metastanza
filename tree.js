import { d as defineStanzaElement } from './stanza-element-6585decd.js';
import { e as embed } from './vega-embed.module-05baedf9.js';
import './vega.module-01b84c84.js';
import './timer-be811b16.js';

async function tree(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url ="https://vega.github.io/vega/data/flare.json";

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"]; 
  spec.height = params["height"];
  
  //stanzaのpadding
  spec.padding = params["padding"];

  //scales: カラースキームを指定
  spec.scales[0].type = "ordinal";

  spec.scales[0].range = [
    'var(--series-0-color)',
    'var(--series-1-color)',
    'var(--series-2-color)',
    'var(--series-3-color)',
    'var(--series-4-color)',
    'var(--series-5-color)'
  ];
  
  //legendを出す
  spec.legends =
  [
    {
      "fill": "color",
      "title": params["legend-title"],
      "orient": "top--left",
      "encode": {
        "title": {
          "update": {
            "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legend-font")},
            "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legendtitle-size")},
            "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legendtitle-weight")}
          }
        },
        "labels": {
          "interactive": true,
          "update": {
            "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legend-font")},
            "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legendlabel-size")}},
            "text": {"field": "value"}
          },
          "symbols": {
            "update": {
              "shape": {"value": params["symbol-shape"]},
              "stroke": {"value": "var(--stroke-color)"},
              "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
              "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--opacity")}
            }
          }
      }
    }
  ];

  //marks:描画について

  //（デフォルトのコントローラを削除） 
  for (let signal of spec.signals)
    { 
      delete(signal.bind); 
    } 

  spec.marks[0].encode ={
    "update": {
      "path": {"field": "path"},
      "stroke": {"value": "var(--branch-color)"}
    },
    "hover": {
      "stroke": {"value": "var(--emphasized-color)"}
    }
  };

  spec.marks[1].encode ={
    "enter": {
      "size": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--node-size")},
      "stroke": {"value": "var(--stroke-color)"}
    },
    "update": {
      "x": {"field": "x"},
      "y": {"field": "y"},
      "fill": {"scale": "color", "field": "depth"},
      "stroke": {"value": "var(--stroke-color)"},
      "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")}
    },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"},
      "stroke": {"value": "var(--hover-stroke-color)"},
      "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-stroke-width")}
    }
  };
  
  spec.marks[2].encode ={
    "enter": {
      "text": {"field": "name"},
      "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
      "fontSize": {"value": params["label-size"]},
      "baseline": {"value": "middle"},
    },
    "update": {
      "x": {"field": "x"},
      "y": {"field": "y"},
      "dx": {"signal": "datum.children ? -7 : 7"},
      "align": {"signal": "datum.children ? 'right' : 'left'"},
      "opacity": {"signal": "labels ? 1 : 0"},
      "fill": {"value": "var(--label-color)"}
      // hoverした時の文字色が薄い場合は文字にstrokecolorをつけたほうがよいかも？（検討）
      // "stroke": {"value": ""},
      // "strokeWidth": {"value": ""}
      // "stroke": {"value": "var(--stroke-color)"},
      // "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")}
    },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"},
      // "stroke": {"value": "var(--hover-stroke-color)"},
      // "strokeWidth": {"value": "0.5"}
      // "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-stroke-width")}
    }
  };


  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await embed(el, spec, opts);
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "tree",
	"stanza:label": "tree",
	"stanza:definition": "Vega wrapped tree for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Tree",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-26",
	"stanza:updated": "2020-11-26",
	"stanza:parameter": [
	{
		"stanza:key": "src-url",
		"stanza:example": "https://vega.github.io/vega/examples/tree-layout.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": "600",
		"stanza:description": "width of your stanza"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": "1600",
		"stanza:description": "height of your stanza"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": "5",
		"stanza:description": "padding around your stanza"
	},
	{
		"stanza:key": "legend-title",
		"stanza:type": "string",
		"stanza:example": "Title of this legend",
		"stanza:description": "title of legends"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#ec7d8d",
		"stanza:description": "emphasized color when you hover on text of each nodes"
	},
	{
		"stanza:key": "--label-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "text color of each nodes"
	},
	{
		"stanza:key": "--branch-color",
		"stanza:type": "color",
		"stanza:default": "#eee",
		"stanza:description": "color of branches"
	},
	{
		"stanza:key": "--node-size",
		"stanza:type": "number",
		"stanza:default": "100",
		"stanza:description": "size of each node"
	},
	{
		"stanza:key": "--stroke-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "color of stroke"
	},
	{
		"stanza:key": "--label-font",
		"stanza:type": "string",
		"stanza:default": "san serif",
		"stanza:description": "font style of labels.(e.g serif, san serif, fantasy)"
	},
	{
		"stanza:key": "--legend-font",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "font family of the legend title and legend labels"
	},
	{
		"stanza:key": "--legendtitle-size",
		"stanza:type": "number",
		"stanza:default": "12",
		"stanza:description": "font size of the legend title"
	},
	{
		"stanza:key": "--legendtitle-weight",
		"stanza:type": "number",
		"stanza:default": "400",
		"stanza:description": "font weight of the legend title"
	},
	{
		"stanza:key": "--legendtitle-color",
		"stanza:type": "color",
		"stanza:default": "#444",
		"stanza:description": "font color of the legend title"
	},
	{
		"stanza:key": "--legendlabel-size",
		"stanza:type": "number",
		"stanza:default": "10",
		"stanza:description": "font size of the legend label"
	},
	{
		"stanza:key": "--legendlabel-color",
		"stanza:type": "color",
		"stanza:default": "#444",
		"stanza:description": "font color of the legend label"
	},
	{
		"stanza:key": "--stroke-color",
		"stanza:type": "color",
		"stanza:default": "#fff",
		"stanza:description": "stroke color of plot."
	},
	{
		"stanza:key": "--hover-stroke-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "stroke color of plot when you hover."
	},
	{
		"stanza:key": "--stroke-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "stroke width"
	},
	{
		"stanza:key": "--hover-stroke-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "stroke width of plot when you hover."
	},
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#FFC39E",
		"stanza:description": "first color"
	},
	{
		"stanza:key": "--series-1-color",
		"stanza:type": "color",
		"stanza:default": "#FF8DB8",
		"stanza:description": "second color"
	},
	{
		"stanza:key": "--series-2-color",
		"stanza:type": "color",
		"stanza:default": "#C690C6",
		"stanza:description": "third color"
	},
	{
		"stanza:key": "--series-3-color",
		"stanza:type": "color",
		"stanza:default": "#6992D1",
		"stanza:description": "forth color"
	},
	{
		"stanza:key": "--series-4-color",
		"stanza:type": "color",
		"stanza:default": "#71B093",
		"stanza:description": "fifth color"
	},
	{
		"stanza:key": "--series-5-color",
		"stanza:type": "color",
		"stanza:default": "#94BC8A",
		"stanza:description": "sixth color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p class=\"greeting\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"greeting") || (depth0 != null ? lookupProperty(depth0,"greeting") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"greeting","hash":{},"data":data,"loc":{"start":{"line":1,"column":20},"end":{"line":1,"column":32}}}) : helper)))
    + "</p>\n";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}";

defineStanzaElement(tree, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=tree.js.map
