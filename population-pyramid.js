import { d as defineStanzaElement } from './stanza-element-40ac9902.js';
import { e as embed } from './vega-embed.module-2e167ee9.js';
import { S as Stanza } from './stanza-7a5318fa.js';

class populationPyramid extends Stanza {
  async render() {
    //width,height,padding
    const width = this.params["width"],
      height = this.params["height"];

    const signals = [
      { name: "chartWidth", value: 300 },
      { name: "chartPad", value: 20 },
      { name: "width", update: "2 * chartWidth + chartPad" },
      {
        name: "year",
        value: 2000,
        bind: { input: "range", min: 1850, max: 2000, step: 10 },
      },
    ];

    const data = [
      {
        name: "population",
        url: "https://vega.github.io/vega/data/population.json",
      },
      {
        name: "popYear",
        source: "population",
        transform: [{ type: "filter", expr: "datum.year == year" }],
      },
      {
        name: "males",
        source: "popYear",
        transform: [{ type: "filter", expr: "datum.sex == 1" }],
      },
      {
        name: "females",
        source: "popYear",
        transform: [{ type: "filter", expr: "datum.sex == 2" }],
      },
      {
        name: "ageGroups",
        source: "population",
        transform: [{ type: "aggregate", groupby: ["age"] }],
      },
    ];

    const scales = [
      {
        name: "y",
        type: "band",
        range: [{ signal: "height" }, 0],
        round: true,
        domain: { data: "ageGroups", field: "age" },
      },
      {
        name: "c",
        type: "ordinal",
        domain: [1, 2],
        range: [
          "var(--stogozana-group2-color)",
          "var(--stogozana-group1-color)",
        ],
      },
    ];

    const text = {
      type: "text",
      interactive: false,
      from: { data: "ageGroups" },
      encode: {
        enter: {
          x: { signal: "chartWidth + chartPad / 2" },
          y: { scale: "y", field: "age", band: 0.5 },
          text: { field: "age" },
          baseline: { value: "middle" },
          align: { value: "center" },
          fill: { value: "#000" },
        },
      },
    };

    // Marks of Spec consist of 2 groups
    // Group specific Axes + Marks + Scales are set first -> then groups
    const groupAxes = (groupNum) => {
      const groupTitle = `group${groupNum}-title`;
      return {
        orient: "bottom",
        scale: "x",
        format: "s",
        title: this.params[groupTitle],
        titleFont: "var(--togostanza-font-family)",
        titleFontWeight: "var(--togostanza-title-font-weight)",
        titleColor: "var(--togostanza-title-font-color)",
      };
    };

    const groupMarks = (groupData) => {
      return {
        type: "rect",
        from: { data: groupData },
        encode: {
          enter: {
            x: { scale: "x", field: "people" },
            x2: { scale: "x", value: 0 },
            y: { scale: "y", field: "age" },
            height: { scale: "y", band: 1, offset: -1 },
            fill: { scale: "c", field: "sex" },
          },
        },
      };
    };

    const groupScales = (num) => {
      return {
        name: "x",
        type: "linear",
        range:
          num === 1
            ? [{ signal: "chartWidth" }, 0]
            : [0, { signal: "chartWidth" }],
        nice: true,
        zero: true,
        domain: { data: "population", field: "people" },
      };
    };

    const group1 = {
      type: "group",

      encode: {
        update: {
          x: { value: 0 },
          height: { signal: "height" },
        },
      },
      scales: [groupScales(1)],
      axes: [groupAxes(1)],
      marks: [groupMarks("females")],
    };

    const group2 = {
      type: "group",

      encode: {
        update: {
          x: { signal: "chartWidth + chartPad" },
          height: { signal: "height" },
        },
      },

      scales: [groupScales(2)],
      axes: [groupAxes(2)],
      marks: [groupMarks("males")],
    };

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding: 5,
      marks: [text, group1, group2],
      scales,
      signals,
      data,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await embed(el, spec, opts);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': populationPyramid
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "population-pyramid",
	"stanza:label": "Population Pyramid MetaStanza",
	"stanza:definition": "",
	"stanza:type": "Stanza",
	"stanza:display": "Graph",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "MarleenEliza",
	"stanza:address": "62828450+MarleenEliza@users.noreply.github.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-04-27",
	"stanza:updated": "2021-04-27",
	"stanza:parameter": [
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "group1-title",
		"stanza:type": "text",
		"stanza:example": "Females",
		"stanza:description": "Title of group 1"
	},
	{
		"stanza:key": "group2-title",
		"stanza:type": "text",
		"stanza:example": "Males",
		"stanza:description": "Title of group 2"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--stogozana-group1-color",
		"stanza:type": "color",
		"stanza:default": "#d5855a",
		"stanza:description": "Color of group 1"
	},
	{
		"stanza:key": "--stogozana-group2-color",
		"stanza:type": "color",
		"stanza:default": "#6c4e97",
		"stanza:description": "Color of group 2"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-title-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Font color"
	},
	{
		"stanza:key": "--togostanza-title-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "Font weight"
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
//# sourceMappingURL=population-pyramid.js.map
