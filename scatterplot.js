import { d as defineStanzaElement } from './stanza-element-d1cc4290.js';
import { e as embed } from './vega-embed.module-11351afc.js';
import './timer-be811b16.js';

async function scatterplot(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url = params["your-data"];

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"]; 
  spec.height = params["height"];
  
  //stanzaのpadding
  spec.padding = params["padding"];

  //スケールに関する設定
  spec.scales[0].paddingInner = params["padding-inner"];
  spec.scales[0].paddingOuter = params["padding-outer"];

  //軸に関する設定
  spec.axes =[
    {
      "scale": "x",
      "grid" : true,
      // "grid": getComputedStyle(stanza.root.host).getPropertyValue(params["xgrid"]),
      "domain": false,
      "orient": params["orient-of-xaxis"],
      "tickCount": 5,
      "title": params["title-of-xaxis"],
      "encode": {
          "ticks": {
            "update": {
            "stroke": {"value": "var(--axis-color)"}
            }
          },
          "labels": {
            "interactive": true,
            "update": {
              "fill": {"value": "var(--label-color)"},
              "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
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
        }
    },
    {
      "scale": "y",
      "grid" : true,
      // "grid": getComputedStyle(stanza.root.host).getPropertyValue(params["ygrid"]),
      "domain": false,
      "orient": params["orient-of-yaxis"],
      "titlePadding": 5,
      "title": params["title-of-yaxis"],
      "encode": {
        "ticks": {
          "update": {
          "stroke": {"value": "var(--tick-color)"}
          }
        },
        "labels": {
          "interactive": true,
          "update": {
            "fill": {"value": "var(--label-color)"},
            "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
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
      }
    }
  ];

  spec.legends = [
    {
      "size": "size",
      "title": params["title-of-legend"],
      "format": "s",
      "symbolStrokeColor": "var(--stroke-color)",
      "symbolStrokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
      "symbolOpacity": getComputedStyle(stanza.root.host).getPropertyValue("--opacity"),
      "symbolType": params["symbol-type"],
      "symbolFillColor": {"value": "var(--series-0-color)"},
      "labelFont": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
      "labelFontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")},
      "titleFont": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")}
    }
  ];

  spec.marks= [
    {
    "name": "marks",
    "type": "symbol",
    "from": {"data": "source"},
    "encode": {
      "update": {
        "x": {"scale": "x", "field": "Horsepower"},
        "y": {"scale": "y", "field": "Miles_per_Gallon"},
        "size": {"scale": "size", "field": "Acceleration"},
        "shape": {"value": params["symbol-type"]},
        "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
        "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--opacity")},
        "stroke": {"value": "var(--stroke-color)"},
        "fill": {"value": "var(--series-0-color)"}
      },
      "hover": {
        "fill": {"value": "var(--emphasized-color)"},
      }
      }
    }
  ];

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
	"@id": "scatterplot",
	"stanza:label": "scatterplot",
	"stanza:definition": "Vega wrapped scatterplot for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Graph",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-06",
	"stanza:updated": "2020-11-06",
	"stanza:parameter": [
	{
		"stanza:key": "src-url",
		"stanza:example": "https://vega.github.io/vega/examples/scatter-plot.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "your-data",
		"stanza:example": "https://vega.github.io/vega-lite/data/cars.json",
		"stanza:description": "JSON data url which you want to draw",
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
		"stanza:description": "title of Xaxis"
	},
	{
		"stanza:key": "title-of-yaxis",
		"stanza:type": "string",
		"stanza:example": "title of Yaxis",
		"stanza:description": "title of Yaxis"
	},
	{
		"stanza:key": "title-of-legend",
		"stanza:type": "string",
		"stanza:example": "Acceleration",
		"stanza:description": "title of legends"
	},
	{
		"stanza:key": "xgrid",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "display of X-grids"
	},
	{
		"stanza:key": "ygrid",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "display of Y-grids"
	},
	{
		"stanza:key": "symbol-type",
		"stanza:type": "string",
		"stanza:example": "circle",
		"stanza:description": "symbol type of plot."
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#4682b4",
		"stanza:description": "color of plot"
	},
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#ec7d8d",
		"stanza:description": "emphasized color when you hover on labels and rects"
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
		"stanza:default": "san serif",
		"stanza:description": "font style of labels.(e.g serif, san serif, fantasy)"
	},
	{
		"stanza:key": "--axis-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "width of axis"
	},
	{
		"stanza:key": "--stroke-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "symbol type of plot."
	},
	{
		"stanza:key": "--stroke-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "stroke width"
	},
	{
		"stanza:key": "--opacity",
		"stanza:type": "text",
		"stanza:default": "0.7",
		"stanza:description": "opacity of each plots"
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

defineStanzaElement(scatterplot, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=scatterplot.js.map
