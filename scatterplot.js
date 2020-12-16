import { d as defineStanzaElement } from './stanza-element-6585decd.js';
import { e as embed } from './vega-embed.module-05baedf9.js';
import './vega.module-01b84c84.js';
import './timer-be811b16.js';

async function scatterplot(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url = params["your-data"];

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"]; 
  spec.height = params["height"];
  
  //stanzaのpadding
  spec.padding = params["padding"];

  //軸に関する設定
  spec.axes =[
    {
      "scale": "x",
      "orient": params["xaxis-orient"],
      "title": params["xaxis-title"],
      "titlePadding": getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")-0,
      "grid": params["xgrid"] === "true",
      "gridColor": "var(--grid-color)",
      "gridDash": getComputedStyle(stanza.root.host).getPropertyValue("--grid-dash"),
      "gridOpacity":getComputedStyle(stanza.root.host).getPropertyValue("--grid-opacity"),
      "gridWidth": getComputedStyle(stanza.root.host).getPropertyValue("--grid-width"),
      "ticks": params["xtick"] === "true",
      "tickCount": 5,
      "domain": false,
      "encode": {
          "ticks": {
            "update": {
            "stroke": {"value": "var(--tick-color)"}
            }
          },
          "grids": {
            "update": {
              "zindex": {"value": "0"}
            }
          },
          "labels": {
            "interactive": true,
            "update": {
              "angle": {"value": params["xlabel-angle"]},
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
              "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")},
              "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-weight")}
            }
          },
          "domain": {
            "update": {
              "stroke": {"value": "var(--axis-color)"},
              "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--axis-width")},
              "zindex": {"value": "1"}
            }
          }
        }
    },
    {
      "scale": "y",
      "orient": params["yaxis-orient"],
      "title": params["yaxis-title"],
      "titlePadding": getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")-0,
      "grid": params["ygrid"] === "true",
      "gridColor": "var(--grid-color)",
      "gridDash": getComputedStyle(stanza.root.host).getPropertyValue("--grid-dash"),
      "gridOpacity": getComputedStyle(stanza.root.host).getPropertyValue("--grid-opacity"),
      "gridWidth": getComputedStyle(stanza.root.host).getPropertyValue("--grid-width"),
      "ticks": params["ytick"] === "true",
      "domain": false,
      "encode": {
        "ticks": {
          "update": {
          "stroke": {"value": "var(--tick-color)"}
          }
        },
        "grids": {
          "update": {
            "zindex": {"value": "0"}
          }
        },
        "labels": {
          "interactive": true,
          "update": {
            "angle": {"value": params["ylabel-angle"]},
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
            "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")},
            "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-weight")}
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

// legendに関する設定
  spec.legends = [
    {
      "size": "size",
      "format": "s",
      "title": params["legend-title"],
      "titleColor": "var(--legendtitle-color)",
      "labelColor": "var(--legendlabel-color)",
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
              "fill": {"value": "var(--series-0-color)"},
              "stroke": {"value": "var(--stroke-color)"},
              "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
              "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--opacity")}
            }
          }
        }
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
        "shape": {"value": params["symbol-shape"]},
        "fill": {"value": "var(--series-0-color)"},
        "stroke": {"value": "var(--stroke-color)"},
        "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
        "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--opacity")}
      },
      "hover": {
        "fill": {"value": "var(--emphasized-color)"},
        "stroke": {"value": "var(--hover-stroke-color)"},
        "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-stroke-width")},
        "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-opacity")}   
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
		"stanza:example": "50",
		"stanza:description": "padding around your stanza"
	},
	{
		"stanza:key": "xaxis-orient",
		"stanza:type": "string",
		"stanza:example": "bottom",
		"stanza:description": "orient of X-axis.(please select top or bottom)"
	},
	{
		"stanza:key": "yaxis-orient",
		"stanza:type": "string",
		"stanza:example": "left",
		"stanza:description": "orient of Y-axis.(please select left or right)"
	},
	{
		"stanza:key": "xaxis-title",
		"stanza:type": "string",
		"stanza:example": "title of Xaxis",
		"stanza:description": "title of Xaxis"
	},
	{
		"stanza:key": "yaxis-title",
		"stanza:type": "string",
		"stanza:example": "title of Yaxis",
		"stanza:description": "title of Yaxis"
	},
	{
		"stanza:key": "legend-title",
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
		"stanza:key": "xtick",
		"stanza:example": false,
		"stanza:description": "display of X-ticks.(true or false)"
	},
	{
		"stanza:key": "ytick",
		"stanza:example": true,
		"stanza:description": "display of Y-ticks.(true or false)"
	},
	{
		"stanza:key": "xlabel-angle",
		"stanza:example": "0",
		"stanza:description": "angle of X-labels.(in degree)"
	},
	{
		"stanza:key": "ylabel-angle",
		"stanza:example": "0",
		"stanza:description": "angle of Y-labels.(in degree)"
	},
	{
		"stanza:key": "symbol-shape",
		"stanza:type": "string",
		"stanza:example": "circle",
		"stanza:description": "shape of plot.(circle, square, cross, diamond, triangle-up, triangle-down, triangle-right, triangle-left, stroke, arrow, wedge, or triangle"
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
		"stanza:key": "--grid-color",
		"stanza:type": "color",
		"stanza:default": "#eee",
		"stanza:description": "grid color"
	},
	{
		"stanza:key": "--grid-dash",
		"stanza:type": "number",
		"stanza:default": "",
		"stanza:description": "grid stroke dash.  Blank for solid lines."
	},
	{
		"stanza:key": "--grid-opacity",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "grid opacity.(0-1)"
	},
	{
		"stanza:key": "--grid-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "grid width in pixel"
	},
	{
		"stanza:key": "--tick-color",
		"stanza:type": "color",
		"stanza:default": "#444",
		"stanza:description": "tick color"
	},
	{
		"stanza:key": "--label-color",
		"stanza:type": "color",
		"stanza:default": "#444",
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
		"stanza:key": "--title-weight",
		"stanza:type": "number",
		"stanza:default": "400",
		"stanza:description": "font weight of titles"
	},
	{
		"stanza:key": "--title-padding",
		"stanza:type": "number",
		"stanza:default": "10",
		"stanza:description": "padding between axis labels and title.(in pixel)"
	},
	{
		"stanza:key": "--label-size",
		"stanza:type": "number",
		"stanza:default": "10",
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
		"stanza:default": "#333",
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
		"stanza:key": "--opacity",
		"stanza:type": "text",
		"stanza:default": "0.7",
		"stanza:description": "opacity of each plots"
	},
	{
		"stanza:key": "--hover-opacity",
		"stanza:type": "text",
		"stanza:default": "1",
		"stanza:description": "opacity of each plots when you hover"
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
