import { d as defineStanzaElement } from './stanza-element-6585decd.js';
import { e as embed } from './vega-embed.module-05baedf9.js';
import './vega.module-01b84c84.js';
import './timer-be811b16.js';

async function barchart(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].values = [
    {"category": "value1", "amount": 1},
    {"category": "value2", "amount": 7},
    {"category": "value3", "amount": 5},
    {"category": "value4", "amount": 9},
  ];

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"];
  spec.height = params["height"];

  //stanzaのpadding
  spec.padding = params["padding"];

  //イベントなど設定できるかと思ったができない
  // spec.signals[0].on[0].events = "click"
  // spec.signals[0].on[1].events = "click"

  //棒・スケールに関する設定
  spec.scales[0].paddingInner = params["padding-inner"];
  spec.scales[0].paddingOuter = params["padding-outer"];

  //軸に関する設定
  spec.axes[0].orient = params["orient-of-xaxis"];
  // gridを表示させたいが、できない
  // spec.axis[0].grid = true;
  spec.axes[1].orient = params["orient-of-yaxis"];
  spec.axes[0].title = params["title-of-xaxis"];
  spec.axes[1].title = params["title-of-yaxis"];
  spec.axes[0].encode = {
    "ticks": {
      "update": {
      "stroke": {"value": "var(--label-color)"}
      }
    },
    "labels": {
      "interactive": true,
      "update": {
        "fill": {"value": "var(--label-color)"},
        "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
        "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-size")}
      },
      "hover": {
        "fill": {"value": "var(--emphasized-color)"}
      }
    },
    "title": {
      "update": {
        "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
        "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")}
      }
    },
    "domain": {
      "update": {
        "stroke": {"value": "var(--axis-color)"},
        "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--axis-width")}
      }
    }
  };

  spec.axes[1].encode = {
    "ticks": {
      "update": {
      "stroke": {"value": "var(--axis-color)"}
      }
    },
    "labels": {
      "interactive": true,
      "update": {
        "fill": {"value": "var(--label-color)"},
        "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
        "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-size")}
      },
      "hover": {
        "fill": {"value": "var(--emphasized-color)"}
      }
    },
    "title": {
      "update": {
        "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
        "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")}
      }
    },
    "domain": {
      "update": {
        "stroke": {"value": "var(--axis-color)"},
        "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--axis-width")}
      }
    }
  };

  //rect（棒）の描画について
  spec.marks[0].encode ={
    "enter": {
      "x": {"scale": "xscale", "field": "category"},
      "width": {"scale": "xscale", "band": params["bar-width"]},
      "y": {"scale": "yscale", "field": "amount"},
      "y2": {"scale": "yscale", "value": 0}
    },
    "update": {
      "fill": {"value": "var(--series-0-color)"},
      },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"}
    }
  };

  spec.marks[1].encode ={
    "enter": {
      "align": {"value": "center"},
      "baseline": {"value": "bottom"},
      "fill": {"value": "var(--emphasized-color)"},
      "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
      "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--fontsize-of-value")},
      "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--fontweight-of-value")}
    },
    "update": {
      "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
      "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -1},
      "text": {"signal": "tooltip.amount"},
      "fillOpacity": [
        {"test": "datum === tooltip", "value": 0},
        {"value": 1}
      ]
    }
  };
  // spec.marks[0].encode.update.fill.value = "var(--bar-color)"
  // spec.marks[0].encode.hover.fill.value = "var(--emphasized-color)"
  // spec.marks[1].encode.enter.fill.value = "var(--emphasized-color)"
  // spec.marks[1].encode.enter.fontSize = {value: params["fontsize-of-value"]}
  // spec.marks[1].encode.enter.fontWeight = {value: params["fontweight-of-value"]}

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
	"@id": "barchart",
	"stanza:label": "barchart",
	"stanza:definition": "Vega wrapped barchart for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c_nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-06",
	"stanza:updated": "2020-11-06",
	"stanza:parameter": [
	{
		"stanza:key": "src-url",
		"stanza:example": "https://vega.github.io/vega/examples/bar-chart.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": "200",
		"stanza:description": "width of your stanza"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": "200",
		"stanza:description": "height of your stanza"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": "20",
		"stanza:description": "padding around your stanza"
	},
	{
		"stanza:key": "orient-of-xaxis",
		"stanza:type": "string",
		"stanza:example": "bottom",
		"stanza:description": "orient of X-axis.(please select top or bottom)"
	},
	{
		"stanza:key": "orient-of-yaxis",
		"stanza:type": "string",
		"stanza:example": "left",
		"stanza:description": "orient of Y-axis.(please select left or right)"
	},
	{
		"stanza:key": "title-of-xaxis",
		"stanza:type": "string",
		"stanza:example": "title of Xaxis",
		"stanza:description": "title of X-axis"
	},
	{
		"stanza:key": "title-of-yaxis",
		"stanza:type": "string",
		"stanza:example": "title of Yaxis",
		"stanza:description": "title of Y-axis"
	},
	{
		"stanza:key": "bar-width",
		"stanza:type": "number",
		"stanza:example": "0.8",
		"stanza:description": "width of bars.This mast be in the range[0,1]"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#94d0da",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#ec7d8d",
		"stanza:description": "emphasized color when you hover on labels and rects"
	},
	{
		"stanza:key": "--padding-inner",
		"stanza:type": "number",
		"stanza:dafault": "0.1",
		"stanza:description": "padding between each bars.This mast be in the range[0,1]"
	},
	{
		"stanza:key": "--padding-outer",
		"stanza:type": "number",
		"stanza:dafault": "0.1",
		"stanza:description": "padding between each bars.This mast be in the range[0,1]"
	},
	{
		"stanza:key": "--tick-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "tick color"
	},
	{
		"stanza:key": "--label-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "label color"
	},
	{
		"stanza:key": "--axis-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "color of axis"
	},
	{
		"stanza:key": "--title-size",
		"stanza:type": "number",
		"stanza:default": "12",
		"stanza:description": "font size of titles"
	},
	{
		"stanza:key": "--label-size",
		"stanza:type": "number",
		"stanza:default": "12",
		"stanza:description": "emphasized color when you hover on labels and rects"
	},
	{
		"stanza:key": "--label-font",
		"stanza:type": "string",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "font family of labels."
	},
	{
		"stanza:key": "--axis-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "width of axis"
	},
	{
		"stanza:key": "--fontsize-of-value",
		"stanza:type": "number",
		"stanza:default": "18",
		"stanza:description": "font size of each value"
	},
	{
		"stanza:key": "--fontweight-of-value",
		"stanza:type": "string",
		"stanza:default": "bold",
		"stanza:description": "font weight of each value"
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

  return "<head>\n</head>\n\n<p class=\"greeting\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"greeting") || (depth0 != null ? lookupProperty(depth0,"greeting") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"greeting","hash":{},"data":data,"loc":{"start":{"line":4,"column":20},"end":{"line":4,"column":32}}}) : helper)))
    + "</p>\n";
},"useData":true}],
["style-like-togovar.css", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return ":root{\n  --series-0-color : #ff00ff;\n  --emphasized-color : #00ff00;\n}";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}";

defineStanzaElement(barchart, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=barchart.js.map
