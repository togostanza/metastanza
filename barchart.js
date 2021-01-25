import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';
import { e as embed } from './vega-embed.module-80d1ecde.js';
import './vega.module-5c1fb2a7.js';
import './timer-be811b16.js';

async function barchart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].values = [
    { category: "value1", amount: 1 },
    { category: "value2", amount: 7 },
    { category: "value3", amount: 5 },
    { category: "value4", amount: 9 },
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
  spec.axes[0] = {
    scale: "xscale",
    orient: params["xaxis-orient"],
    title: params["xaxis-title"],
    titleColor: "var(--title-color)",
    titlePadding:
      getComputedStyle(stanza.root.host).getPropertyValue("--title-padding") -
      0,
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
      axis: {
        update: {},
      },
      ticks: {
        update: {
          stroke: { value: "var(--tick-color)" },
        },
      },
      grids: {
        update: {
          zindex: { value: "0" },
        },
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
            ),
          },
        },
        hover: {
          fill: { value: "var(--emphasized-color)" },
        },
      },
      title: {
        update: {
          font: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--label-font"
            ),
          },
          fontSize: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--title-size"
            ),
          },
          fontWeight: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--title-weight"
            ),
          },
        },
      },
      domain: {
        update: {
          stroke: { value: "var(--axis-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--axis-width"
            ),
          },
          zindex: { value: "1" },
        },
      },
    },
  };

  spec.axes[1] = {
    scale: "yscale",
    orient: params["yaxis-orient"],
    title: params["yaxis-title"],
    titleColor: "var(--title-color)",
    titlePadding:
      getComputedStyle(stanza.root.host).getPropertyValue("--title-padding") -
      0,
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
    encode: {
      axis: {
        update: {},
      },
      ticks: {
        update: {
          stroke: { value: "var(--tick-color)" },
        },
      },
      grids: {
        update: {
          zindex: { value: "0" },
        },
      },
      labels: {
        interactive: true,
        update: {
          angle: { value: params["ylabel-angle"] },
          fill: { value: "var(--label-color)" },
          font: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--label-font"
            ),
          },
          fontSize: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--label-size"
            ),
          },
        },
        hover: {
          fill: { value: "var(--emphasized-color)" },
        },
      },
      title: {
        update: {
          font: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--label-font"
            ),
          },
          fontSize: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--title-size"
            ),
          },
          fontWeight: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--title-weight"
            ),
          },
        },
      },
      domain: {
        update: {
          stroke: { value: "var(--axis-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--axis-width"
            ),
          },
        },
      },
    },
  };

  spec.title = {
    text: params["figuretitle"], //"Title of this figure",
    orient: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-orient"
    ),
    anchor: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-anchor"
    ),
    color: getComputedStyle(stanza.root.host).getPropertyValue("--label-color"),
    dx:
      getComputedStyle(stanza.root.host).getPropertyValue(
        "--figuretitle-horizonal-offset"
      ) - 0,
    dy:
      getComputedStyle(stanza.root.host).getPropertyValue(
        "--figuretitle-vertical-offset"
      ) - 0,
    font: getComputedStyle(stanza.root.host).getPropertyValue("--label-font"),
    fontSize: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-font-size"
    ),
    fontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-font-weight"
    ),
  };

  //rect（棒）の描画について
  spec.marks[0] = {
    type: "rect",
    from: { data: "table" },
    encode: {
      enter: {
        x: { scale: "xscale", field: "category" },
        width: { scale: "xscale", band: params["bar-width"] },
        y: { scale: "yscale", field: "amount" },
        y2: { scale: "yscale", value: 0 },
      },
      update: {
        fill: { value: "var(--series-0-color)" },
        stroke: { value: "var(--stroke-color)" },
        strokeWidth: {
          value: getComputedStyle(stanza.root.host).getPropertyValue(
            "--stroke-width"
          ),
        },
      },
      hover: {
        fill: { value: "var(--emphasized-color)" },
      },
    },
  };

  spec.marks[1].encode = {
    enter: {
      align: { value: "center" },
      baseline: { value: "bottom" },
      fill: { value: "var(--emphasized-color)" },
      font: {
        value: getComputedStyle(stanza.root.host).getPropertyValue(
          "--label-font"
        ),
      },
      fontSize: {
        value: getComputedStyle(stanza.root.host).getPropertyValue(
          "--fontsize-value"
        ),
      },
      fontWeight: {
        value: getComputedStyle(stanza.root.host).getPropertyValue(
          "--fontweight-of-value"
        ),
      },
    },
    update: {
      x: { scale: "xscale", signal: "tooltip.category", band: 0.5 },
      y: { scale: "yscale", signal: "tooltip.amount", offset: -1 },
      text: { signal: "tooltip.amount" },
      fillOpacity: [{ test: "datum === tooltip", value: 0 }, { value: 1 }],
    },
  };
  // spec.marks[0].encode.update.fill.value = "var(--bar-color)"
  // spec.marks[0].encode.hover.fill.value = "var(--emphasized-color)"
  // spec.marks[1].encode.enter.fill.value = "var(--emphasized-color)"
  // spec.marks[1].encode.enter.fontSize = {value: params["fontsize-of-value"]}
  // spec.marks[1].encode.enter.fontWeight = {value: params["fontweight-of-value"]}

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
		"stanza:description": "title of X-axis"
	},
	{
		"stanza:key": "yaxis-title",
		"stanza:type": "string",
		"stanza:example": "title of Yaxis",
		"stanza:description": "title of Y-axis"
	},
	{
		"stanza:key": "xgrid",
		"stanza:example": false,
		"stanza:description": "display of X-grids.(true or false)"
	},
	{
		"stanza:key": "ygrid",
		"stanza:example": true,
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
		"stanza:type": "number",
		"stanza:example": "0.8",
		"stanza:description": "width of bars.This mast be in the range[0,1]"
	},
	{
		"stanza:key": "figuretitle",
		"stanza:type": "text",
		"stanza:example": "Figure 1 Title of the figure",
		"stanza:description": "figure title (If you blank here, it dosen't be shown)"
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
		"stanza:default": "#333",
		"stanza:description": "tick color"
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
		"stanza:key": "--title-color",
		"stanza:type": "color",
		"stanza:default": "#222",
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
		"stanza:key": "--axis-width",
		"stanza:type": "number",
		"stanza:default": "1",
		"stanza:description": "width of axis"
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
	},
	{
		"stanza:key": "--fontsize-value",
		"stanza:type": "number",
		"stanza:default": "18",
		"stanza:description": "font size of each value"
	},
	{
		"stanza:key": "--fontweight-value",
		"stanza:type": "text",
		"stanza:default": "bold",
		"stanza:description": "font weight of each value"
	},
	{
		"stanza:key": "--figuretitle-orient",
		"stanza:type": "text",
		"stanza:default": "bottom",
		"stanza:description": "orient of figure title.(top, bottom)"
	},
	{
		"stanza:key": "--figuretitle-anchor",
		"stanza:type": "text",
		"stanza:default": "middle",
		"stanza:description": "figure title placement.(left, right, middle)"
	},
	{
		"stanza:key": "--figuretitle-horizonal-offset",
		"stanza:type": "number",
		"stanza:default": "100",
		"stanza:description": "horizonal offset(X-offset) of figure title in pixel"
	},
	{
		"stanza:key": "--figuretitle-vertical-offset",
		"stanza:type": "number",
		"stanza:default": "250",
		"stanza:description": "vertical offset(Y-offset) of figure title in pixel"
	},
	{
		"stanza:key": "--figuretitle-font-size",
		"stanza:type": "text",
		"stanza:default": "12",
		"stanza:description": "font size of figure title in pixel"
	},
	{
		"stanza:key": "--figuretitle-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "font weight of figure title"
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

  return "<head>\n</head>\n\n<p class=\"greeting\">\n  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"greeting") || (depth0 != null ? lookupProperty(depth0,"greeting") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"greeting","hash":{},"data":data,"loc":{"start":{"line":5,"column":2},"end":{"line":5,"column":14}}}) : helper)))
    + "\n</p>\n\n<p class=\"table-title\">\n  Title of this Table\n</p>";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}\n\nsummary {\n  display: none;\n}";

defineStanzaElement(barchart, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=barchart.js.map
