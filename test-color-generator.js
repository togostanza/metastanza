import { S as Stanza, d as defineStanzaElement } from './transform-54fb0dda.js';
import { I as InterpolateColorGenerator, g as getColorSeries, a as getColorsWithD3PresetColor, C as CirculateColorGenerator } from './ColorGenerator-40e743fe.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as downloadJSONMenuItem, c as downloadCSVMenuItem, e as downloadTSVMenuItem, f as appendCustomCss } from './index-29de360d.js';
import './ordinal-876d0728.js';
import './drag-b359a604.js';
import './step-1a05dba1.js';
import './manyBody-67c659cf.js';
import './range-e15c6861.js';
import './stratify-5205cf04.js';
import './index-c54c7661.js';
import './linear-96081af8.js';
import './descending-63ef45b8.js';
import './max-2c042256.js';
import './min-4a3f8e4e.js';
import './array-80a7907a.js';
import './constant-c49047a5.js';
import './line-17666ef1.js';
import './path-a78af922.js';
import './arc-06a68a59.js';
import './basis-0dde91c7.js';
import './group-b85b018d.js';
import './extent-14a1e8e9.js';
import './dsv-ac31b097.js';
import './sum-44e7480e.js';
import './axis-3dba94d9.js';
import './ribbon-bbaf0468.js';
import './partition-2c1b5971.js';
import './band-e7ca2641.js';
import './create-2353c16e.js';
import './stack-322237e7.js';

class TestColorGenerator extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "TestColorGenerator"),
      downloadPngMenuItem(this, "TestColorGenerator"),
      downloadJSONMenuItem(this, "TestColorGenerator", this.data),
      downloadCSVMenuItem(this, "TestColorGenerator", this.data),
      downloadTSVMenuItem(this, "TestColorGenerator", this.data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    this.renderTemplate({ template: "stanza.html.hbs" });

    const colorChips = this.root.querySelector("#color-chips");

    // get parameters
    const numOfGradation = this.params["number-of-gradation"];
    const colorCirculation = this.params["type-of-color-circulation"];
    const colorDomain = this.params["color-domain"]
      ? this.params["color-domain"].split(",").map((pos) => +pos)
      : "";
    const colorRange = this.params["color-range"].split(",");
    const NumOfMakeColor = this.params["number-of-make-color"];
    let d3ColorScheme = this.params["color-scheme"];
    let colors = [],
      colorGenerator;

    if (d3ColorScheme.indexOf("(") !== -1) {
      d3ColorScheme = d3ColorScheme.substr(0, d3ColorScheme.indexOf(" ("));
    }

    if (colorCirculation === "interpolate") {
      if (
        colorDomain.length !== 1 &&
        colorRange.length !== 1 &&
        colorDomain.length === colorRange.length
      ) {
        colorGenerator = new InterpolateColorGenerator(colorRange, colorDomain);
      } else if (d3ColorScheme.indexOf("Categorical-") !== -1) {
        // categorical
        d3ColorScheme = d3ColorScheme.replace("Categorical-", "");
        if (d3ColorScheme === "Custom") {
          colors = getColorSeries(this);
          colorGenerator = new InterpolateColorGenerator(colors, undefined);
        } else {
          const colors = getColorsWithD3PresetColor(
            `scheme${d3ColorScheme}`,
            numOfGradation
          );
          colorGenerator = new InterpolateColorGenerator(colors, undefined);
        }
      } else {
        // continuous
        d3ColorScheme = d3ColorScheme.replace("Continuous-", "");
        const colors = getColorsWithD3PresetColor(
          `interpolate${d3ColorScheme}`,
          numOfGradation
        );
        colorGenerator = new InterpolateColorGenerator(colors, undefined);
      }
    } else {
      if (
        colorDomain.length !== 1 &&
        colorRange.length !== 1 &&
        colorDomain.length === colorRange.length
      ) {
        colorGenerator = new CirculateColorGenerator(
          colorRange,
          colorDomain,
          NumOfMakeColor
        );
      } else if (colorRange[0].length) {
        colorGenerator = new CirculateColorGenerator(colorRange, undefined);
      } else if (d3ColorScheme.indexOf("Categorical-") !== -1) {
        // categorical
        d3ColorScheme = d3ColorScheme.replace("Categorical-", "");
        if (d3ColorScheme === "Custom") {
          colors = getColorSeries(this);
          colorGenerator = new CirculateColorGenerator(colors, undefined);
        } else {
          const colors = getColorsWithD3PresetColor(
            `scheme${d3ColorScheme}`,
            numOfGradation
          );
          colorGenerator = new CirculateColorGenerator(colors, undefined);
        }
      } else {
        // continuous
        d3ColorScheme = d3ColorScheme.replace("Continuous-", "");
        const colors = getColorsWithD3PresetColor(
          `interpolate${d3ColorScheme}`,
          numOfGradation
        );
        colorGenerator = new CirculateColorGenerator(colors, undefined);
      }
    }

    switch (colorCirculation) {
      case "circulate":
        colorChips.innerHTML = [...Array(numOfGradation)]
          .map((_, index) => {
            return `<li data-pos="${index}" style="background: ${colorGenerator.get(
              index
            )}"></li>`;
          })
          .join("");
        break;

      case "interpolate":
        {
          const unit = 1 / (numOfGradation - 1);
          colorChips.innerHTML = [...Array(numOfGradation)]
            .map((_, index) => {
              return `<li data-pos="${
                index * unit
              }" style="background: ${colorGenerator.get(index * unit)}"></li>`;
            })
            .join("");
        }
        break;
    }
  }

  getColorSeries() {
    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map((variable) => getPropertyValue(variable).trim());
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': TestColorGenerator
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "test-color-generator",
	"stanza:label": "Test Color Genarator",
	"stanza:definition": "Test Color Genarator MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Image",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "DBCLS",
	"stanza:address": "https://github.com/togostanza/metastanza",
	"stanza:contributor": [
	"PENQE"
],
	"stanza:created": "2022-05-22",
	"stanza:updated": "2022-01-23",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/3sets-data.json",
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
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 800,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 380,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "number-of-gradation",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Number of Gradation"
	},
	{
		"stanza:key": "number-of-make-color",
		"stanza:type": "number",
		"stanza:example": 5,
		"stanza:description": "Number of make color (Only circulate with range and domain)"
	},
	{
		"stanza:key": "type-of-color-circulation",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"circulate",
			"interpolate"
		],
		"stanza:example": "circulate",
		"stanza:description": "How the color circulations (by categorical colors)"
	},
	{
		"stanza:key": "color-scheme",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"Categorical-Custom (6)",
			"Categorical-Category10 (10)",
			"Categorical-Accent (8)",
			"Categorical-Dark2 (8)",
			"Categorical-Paired (12)",
			"Categorical-Pastel1 (9)",
			"Categorical-Pastel2 (8)",
			"Categorical-Set1 (9)",
			"Categorical-Set2 (8)",
			"Categorical-Set3 (12)",
			"Categorical-Tableau10 (10)",
			"Continuous-BrBG",
			"Continuous-PRGn",
			"Continuous-PiYG",
			"Continuous-PuOr",
			"Continuous-RdBu",
			"Continuous-RdGy",
			"Continuous-RdYlBu",
			"Continuous-RdYlGn",
			"Continuous-Spectral",
			"Continuous-Blues",
			"Continuous-Greens",
			"Continuous-Greys",
			"Continuous-Oranges",
			"Continuous-Purples",
			"Continuous-Reds",
			"Continuous-Turbo",
			"Continuous-Viridis",
			"Continuous-Inferno",
			"Continuous-Magma",
			"Continuous-Plasma",
			"Continuous-Cividis",
			"Continuous-Warm",
			"Continuous-Cool",
			"Continuous-CubehelixDefault",
			"Continuous-BuGn",
			"Continuous-BuPu",
			"Continuous-GnBu",
			"Continuous-OrRd",
			"Continuous-PuBuGn",
			"Continuous-PuBu",
			"Continuous-PuRd",
			"Continuous-RdPu",
			"Continuous-YlGnBu",
			"Continuous-YlGn",
			"Continuous-YlOrBr",
			"Continuous-YlOrRd",
			"Continuous-Rainbow",
			"Continuous-Sinebow"
		],
		"stanza:example": "Categorical-Custom (6)",
		"stanza:description": "\"Custom\" uses user-defined colors"
	},
	{
		"stanza:key": "color-range",
		"stanza:type": "string",
		"stanza:example": "red,blue,yellow",
		"stanza:description": "Color set"
	},
	{
		"stanza:key": "color-domain",
		"stanza:type": "string",
		"stanza:example": "0,0.25,1",
		"stanza:description": "Color range"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Label font size"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"drawArea\">\n\n  <ul id=\"color-chips\"></ul>\n\n</div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=test-color-generator.js.map
