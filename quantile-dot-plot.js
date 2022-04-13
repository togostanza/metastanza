import { d as defineStanzaElement } from './stanza-element-f1811bb2.js';
import { S as Stanza } from './timer-1ca7e150.js';
import { e as embed } from './vega-embed.module-07804790.js';
import './linear-af9e44cc.js';
import './ordinal-0cb0fa8d.js';
import './descending-63ef45b8.js';
import './dsv-cd3740c6.js';
import './max-2c042256.js';
import './min-4a3f8e4e.js';
import './range-e15c6861.js';
import './arc-49333d16.js';
import './constant-c49047a5.js';
import './path-a78af922.js';
import './array-89f97098.js';
import './line-620615aa.js';
import './basis-0dde91c7.js';
import './sum-44e7480e.js';
import './manyBody-15224179.js';
import './stratify-5205cf04.js';
import './index-beeea236.js';
import './partition-2c1b5971.js';

class quantileDotPlot extends Stanza {
  async render() {
    //width,height,padding
    const width = Number(this.params["width"]);
    const height = Number(this.params["height"]);
    const padding = Number(this.params["padding"]);

    const vegaJson = await fetch(
      "https://vega.github.io/vega/examples/quantile-dot-plot.vg.json"
    ).then((res) => res.json());

    const signals = [
      {
        name: "quantiles",
        value: 20,
        bind: { input: "range", min: 10, max: 200, step: 1 },
      },
      { name: "mean", update: "log(11.4)" },
      { name: "sd", value: 0.2 },
      { name: "step", update: "1.25 * sqrt(20 / quantiles)" },
      { name: "size", update: "scale('x', step) - scale('x', 0)" },
      { name: "area", update: "size * size" },
      {
        name: "select",
        init: "quantileLogNormal(0.05, mean, sd)",
        on: [
          {
            events: "click, [mousedown, window:mouseup] > mousemove",
            update: "clamp(invert('x', x()), 0.0001, 30)",
          },
          {
            events: "dblclick",
            update: "0",
          },
        ],
      },
    ];

    const data = [
      {
        name: "quantiles",
        transform: [
          {
            type: "sequence",
            as: "p",
            start: { signal: "0.5 / quantiles" },
            step: { signal: "1 / quantiles" },
            stop: 1,
          },
          {
            type: "formula",
            as: "value",
            expr: "quantileLogNormal(datum.p, mean, sd)",
          },
          {
            type: "dotbin",
            field: "value",
            step: { signal: "step" },
          },
          {
            type: "stack",
            groupby: ["bin"],
          },
          {
            type: "extent",
            field: "y1",
            signal: "ext",
          },
        ],
      },
    ];

    // objects for marks
    const getSignalByColor = (color, color2 = "transparant") => {
      return `select ? '${color}': '${color2}'`;
    };

    const scales = [
      {
        name: "x",
        domain: [this.params["x-domain-start"], this.params["x-domain-end"]],
        range: "width",
      },
      {
        name: "y",
        domain: { signal: "[0, height / size]" },
        range: "height",
      },
    ];

    const symbol = {
      type: "symbol",
      from: { data: "quantiles" },
      encode: {
        enter: {
          x: { scale: "x", field: "bin" },
          y: { scale: "y", signal: "datum.y0 + 0.5" },
          size: { signal: "area" },
        },
        update: {
          fill: {
            signal:
              "datum.bin <" +
              getSignalByColor(
                "var(--togostanza-fill-selected)",
                "var(--togostanza-fill-unselected)"
              ),
          },
        },
      },
    };

    const rule = {
      type: "rule",
      interactive: false,
      encode: {
        update: {
          x: { scale: "x", signal: "select" },
          y: { value: 0 },
          y2: { signal: "height" },
          stroke: {
            signal: getSignalByColor("var(--togostanza-stroke-signal)"),
          },
        },
      },
    };

    const text = {
      type: "text",
      interactive: false,
      encode: {
        enter: {
          baseline: { value: "top" },
          dx: { value: 3 },
          y: { value: 3 },
        },
        update: {
          x: { scale: "x", signal: "select" },
          text: {
            signal: "format(cumulativeLogNormal(select, mean, sd), '.1%')",
          },
          fill: { signal: getSignalByColor("#002559") },
        },
      },
    };

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      signals,
      axes: vegaJson.axes,
      data,
      scales,
      marks: [symbol, rule, text],
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    console.log(this.params["x-domain-start"]);
    await embed(el, spec, opts);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': quantileDotPlot
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "quantile-dot-plot",
	"stanza:label": "Quantile dot plot",
	"stanza:definition": "Quantile dot plot MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Graph",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2021-04-27",
	"stanza:updated": "2021-04-27",
	"stanza:parameter": [
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 500,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 180,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "padding",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Padding"
	},
	{
		"stanza:key": "x-domain-start",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "start of x axes"
	},
	{
		"stanza:key": "x-domain-end",
		"stanza:type": "number",
		"stanza:example": 20,
		"stanza:description": "end of x axes"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-stroke-signal",
		"stanza:type": "color",
		"stanza:default": "#C2E3F2",
		"stanza:description": "Color of Stroke Signal"
	},
	{
		"stanza:key": "--togostanza-fill-selected",
		"stanza:type": "color",
		"stanza:default": "#ED707E",
		"stanza:description": "Color of Stroke Signal"
	},
	{
		"stanza:key": "--togostanza-fill-unselected",
		"stanza:type": "color",
		"stanza:default": "#3D6589",
		"stanza:description": "Color of Stroke Signal"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
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
    + "</p>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=quantile-dot-plot.js.map
