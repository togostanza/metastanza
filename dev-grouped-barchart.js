import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { e as embed } from './vega-embed.module-529d62fa.js';
import './vega.module-1945ca45.js';
import './timer-b826f0a9.js';

async function devGroupedBarchart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  // width,hight,padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];

  const labelVariable = params["label-variable"]; //category
  const valueVariable = params["value-variable"]; //value
  const groupVariable = params["group-variable"]; //position?

  spec.data = [
    {
      name: "table",
      url: params["your-data"]
      // "values": [
      //   {"category":"A", "position":0, "value":0.1},
      //   {"category":"A", "position":1, "value":0.6},
      //   {"category":"A", "position":2, "value":0.9},
      //   {"category":"A", "position":3, "value":0.4},
      //   {"category":"B", "position":0, "value":0.7},
      //   {"category":"B", "position":1, "value":0.2},
      //   {"category":"B", "position":2, "value":1.1},
      //   {"category":"B", "position":3, "value":0.8},
      //   {"category":"C", "position":0, "value":0.6},
      //   {"category":"C", "position":1, "value":0.1},
      //   {"category":"C", "position":2, "value":0.2},
      //   {"category":"C", "position":3, "value":0.7}
      // ]
    }
  ];

  //scales
  spec.scales = [
    {
      name: "yscale",
      type: "band",
      domain: {"data": "table", "field": labelVariable},
      range: "height",
      padding: 0.2
    },
    {
      name: "xscale",
      type: "linear",
      domain: {"data": "table", "field": valueVariable},
      range: "width",
      round: true,
      zero: true,
      nice: true
    },
    {
      name: "color",
      type: "ordinal",
      domain: {"data": "table", "field": groupVariable},
      range:[
        "var(--series-0-color)",
        "var(--series-1-color)",
        "var(--series-2-color)",
        "var(--series-3-color)",
        "var(--series-4-color)",
        "var(--series-5-color)"
      ]
    }
  ];

  spec.scales[0].paddingInner = 0.1;
  spec.scales[0].paddingOuter = 0.4;

//axes
  spec.axes = [
    {
      orient: params["yaxis-orient"],
      scale: "yscale",
      tickSize: 0,
      labelPadding: 4,
      zindex: 1,
      title: labelVariable,
      titleColor: "var(--title-color)",
      titlePadding:
        Number(getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      ticks: params["ytick"] === "true",
      zindex: 1,
      encode: {
        ticks: {
          update: {
            stroke: { value: "var(--tick-color)" },
          }
        },
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font"
              )
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-size"
              )
            }
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          }
        },
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font"
              )
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-size"
              )
            },
            fontWeight: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-weight"
              )
            }
          }
        },
        domain: {
          update: {
            stroke: { value: "var(--axis-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--axis-width"
              )
            }
          }
        }
      }
    },
    {
      scale: "xscale",
      orient: params["xaxis-orient"],
      title: valueVariable,
      titleColor: "var(--title-color)",
      titlePadding:
        Number(getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      ticks: params["xtick"] === "true",
      encode: {
        ticks: {
          update: {
            stroke: { value: "var(--tick-color)" },
          }
        },
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-size"
              )
            }
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          }
        },
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font"
              )
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-size"
              )
            },
            fontWeight: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-weight"
              )
            }
          }
        },
        domain: {
          update: {
            stroke: { value: "var(--axis-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--axis-width"
              )
            }
          }
        }
      }
    }
  ];

    // legend
    spec.legends = [
      {
        fill: "color",
        orient: "none",
        legendX: 840,
        legendY: "0",
        title: groupVariable,
        titleColor: "var(--legendtitle-color)",
        labelColor: "var(--legendlabel-color)",
        encode: {
          title: {
            update: {
              font: {
                value: getComputedStyle(stanza.root.host).getPropertyValue(
                  "--legend-font"
                )
              },
              fontSize: {
                value: getComputedStyle(stanza.root.host).getPropertyValue(
                  "--legendtitle-size"
                )
              },
              fontWeight: {
                value: getComputedStyle(stanza.root.host).getPropertyValue(
                  "--legendtitle-weight"
                )
              }
            }
          },
          labels: {
            interactive: true,
            update: {
              font: {
                value: getComputedStyle(stanza.root.host).getPropertyValue(
                  "--legend-font"
                )
              },
              fontSize: {
                value: getComputedStyle(stanza.root.host).getPropertyValue(
                  "--legendlabel-size"
                )
              }
            },
            text: { field: "value" },
          }
        }
      }
    ];

//marks
  spec.marks = [
    {
      type: "group",
      from: {
        facet: {
          data: "table",
          name: "facet",
          groupby: labelVariable
        }
      },
      encode: {
        enter: {
          y: {scale: "yscale", "field": labelVariable}
        }
      },
      signals: [
        {name: "height", update: "bandwidth('yscale')"}
      ],
      scales: [
        {
          name: "pos",
          type: "band",
          range: "height",
          domain: {data: "facet", field: groupVariable}
        }
      ],
      marks: [
        {
          name: "bars",
          from: {"data": "facet"},
          type: "rect",
          encode: {
            enter: {
              y: {scale: "pos", field: groupVariable},
              height: {scale: "pos", band: 1},
              x: {scale: "xscale", field: valueVariable},
              x2: {scale: "xscale", value: 0},
              fill: {scale: "color", field: groupVariable}
            }
          },
          update: {
            fill: { value: "var(--series-0-color)" },
            stroke: { value: "var(--stroke-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--stroke-width"
              )
            }
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          }
        },
        {
          type: "text",
          from: {data: "bars"},
          encode: {
            enter: {
              x: {field: "x2", offset: -5},
              y: {field: "y", offset: {field: "height", mult: 0.5}},
              fill: [
                {test: "contrast('white', datum.fill) > contrast('black', datum.fill)", "value": "white"},
                {value: "black"}
              ],
              align: {value: "right"},
              baseline: {value: "middle"},
              // text: {field: `datum[${valueVariable}]`}
            }
          }
        }
      ]
    }
  ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await embed(el, spec, opts);
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dev-grouped-barchart",
	"stanza:label": "dev grouped barchart",
	"stanza:definition": "Vega wrapped linechart for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-01-28",
	"stanza:updated": "2021-01-28",
	"stanza:parameter": [
	{
		"stanza:key": "src-url",
		"stanza:example": "https://vega.github.io/vega/examples/grouped-bar-chart.vg.json",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "your-data",
		"stanza:example": "http://togostanza.org/sparqlist/api/metastanza_multi_data_chart",
		"stanza:description": "source url which returns Vega specification compliant JSON",
		"stanza:required": true
	},
	{
		"stanza:key": "label-variable",
		"stanza:example": "chromosome",
		"stanza:description": "variable to be assigned as label",
		"stanza:required": true
	},
	{
		"stanza:key": "value-variable",
		"stanza:example": "count",
		"stanza:description": "variable to be assigned as value",
		"stanza:required": true
	},
	{
		"stanza:key": "group-variable",
		"stanza:example": "category",
		"stanza:description": "variable to be assigned as an identifier of a group",
		"stanza:required": true
	},
	{
		"stanza:key": "width",
		"stanza:example": "800",
		"stanza:description": "width of your stanza"
	},
	{
		"stanza:key": "height",
		"stanza:example": "600",
		"stanza:description": "height of your stanza"
	},
	{
		"stanza:key": "padding",
		"stanza:example": "50",
		"stanza:description": "padding around your stanza"
	},
	{
		"stanza:key": "xaxis-orient",
		"stanza:example": "bottom",
		"stanza:description": "orient of X-axis.(please select top or bottom)"
	},
	{
		"stanza:key": "yaxis-orient",
		"stanza:example": "left",
		"stanza:description": "orient of Y-axis.(please select left or right)"
	},
	{
		"stanza:key": "xaxis-title",
		"stanza:example": "title of Xaxis",
		"stanza:description": "title of X-axis"
	},
	{
		"stanza:key": "yaxis-title",
		"stanza:example": "title of Yaxis",
		"stanza:description": "title of Y-axis"
	},
	{
		"stanza:key": "xgrid",
		"stanza:example": true,
		"stanza:description": "display of X-grids.(true or false)"
	},
	{
		"stanza:key": "ygrid",
		"stanza:example": false,
		"stanza:description": "display of Y-grids.(true or false)"
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
		"stanza:key": "bar-width",
		"stanza:example": "0.8",
		"stanza:description": "width of bars.This mast be in the range[0,1]"
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
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
	},
	{
		"stanza:key": "--emphasized-color",
		"stanza:type": "color",
		"stanza:default": "#ec7d8d",
		"stanza:description": "emphasized color when you hover on labels and rects"
	},
	{
		"stanza:key": "--padding",
		"stanza:type": "text",
		"stanza:dafault": "top: 0, right: 0, bottom: 50, left: 150",
		"stanza:description": "padding between each bars.This mast be in the range[0,1]"
	},
	{
		"stanza:key": "--padding-inner",
		"stanza:type": "text",
		"stanza:dafault": "0.1",
		"stanza:description": "padding between each bars.This mast be in the range[0,1]"
	},
	{
		"stanza:key": "--padding-outer",
		"stanza:type": "text",
		"stanza:dafault": "0.3",
		"stanza:description": "padding between each bars.This mast be in the range[0,1]"
	},
	{
		"stanza:key": "--grid-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
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
		"stanza:default": "0.1",
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
		"stanza:default": "#333333",
		"stanza:description": "tick color"
	},
	{
		"stanza:key": "--axis-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "color of axis"
	},
	{
		"stanza:key": "--axis-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "width of axis"
	},
	{
		"stanza:key": "--title-size",
		"stanza:type": "number",
		"stanza:default": "12",
		"stanza:description": "font size of titles"
	},
	{
		"stanza:key": "--title-color",
		"stanza:type": "color",
		"stanza:default": "#222222",
		"stanza:description": "font color of title"
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
		"stanza:key": "--label-color",
		"stanza:type": "color",
		"stanza:default": "#333",
		"stanza:description": "label color"
	},
	{
		"stanza:key": "--label-font",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "font family of labels."
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
		"stanza:default": "#333333",
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
		"stanza:default": "#333333",
		"stanza:description": "font color of the legend label"
	},
	{
		"stanza:key": "--stroke-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "color of stroke"
	},
	{
		"stanza:key": "--stroke-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "width of stroke"
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

defineStanzaElement(devGroupedBarchart, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=dev-grouped-barchart.js.map
