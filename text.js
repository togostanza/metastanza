import { d as defineStanzaElement } from './stanza-element-b0afeab3.js';

async function text(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      greeting: `Hello, ${params["say-to"]}!`,
    },
  });
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "text",
	"stanza:label": "text",
	"stanza:definition": "text for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Text",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2020-12-02",
	"stanza:updated": "2020-12-02",
	"stanza:parameter": [
	{
		"stanza:key": "say-to",
		"stanza:example": "world",
		"stanza:description": "who to say hello to",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--greeting-color",
		"stanza:type": "color",
		"stanza:default": "#eb7900",
		"stanza:description": "text color of greeting"
	},
	{
		"stanza:key": "--greeting-align",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "text align of greeting"
	},
	{
		"stanza:key": "--text-width",
		"stanza:type": "text",
		"stanza:default": "800px",
		"stanza:description": "text width"
	},
	{
		"stanza:key": "--label-font",
		"stanza:type": "text",
		"stanza:default": "serif",
		"stanza:description": "font(e.g: serif,san serif,fantasy)"
	},
	{
		"stanza:key": "--dt-margin-bottom",
		"stanza:type": "text",
		"stanza:default": "8px",
		"stanza:description": "margin bottom of text header"
	},
	{
		"stanza:key": "--row-border-bottom",
		"stanza:type": "text",
		"stanza:default": "1px solid #ccc",
		"stanza:description": "border bottom of text row"
	},
	{
		"stanza:key": "--dt-font-color",
		"stanza:type": "color",
		"stanza:default": "#444444",
		"stanza:description": "font color of text header"
	},
	{
		"stanza:key": "--dd-font-color",
		"stanza:type": "color",
		"stanza:default": "#444444",
		"stanza:description": "font color of taext body"
	},
	{
		"stanza:key": "--dt-font-size",
		"stanza:type": "text",
		"stanza:default": "14px",
		"stanza:description": "font size of text header"
	},
	{
		"stanza:key": "--dd-font-size",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "font size of taext body"
	},
	{
		"stanza:key": "--dt-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "font weight of text header"
	},
	{
		"stanza:key": "--dd-font-weight",
		"stanza:type": "text",
		"stanza:default": "400",
		"stanza:description": "font weight of taext body"
	},
	{
		"stanza:key": "--dt-line-height",
		"stanza:type": "text",
		"stanza:default": "14px",
		"stanza:description": "line height of text header"
	},
	{
		"stanza:key": "--dd-line-height",
		"stanza:type": "tEXT",
		"stanza:default": "10px",
		"stanza:description": "line hight of taext body"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<table>\n  <tr>\n    <td>\n      <dl>\n        <dt>\n          Homozygous loss of function BRCA1 variant causing a Fanconi-anemia-like phenotype, a clinical report and review of previous patients.\n        </dt>\n        <dd>\n          Freire B.L., Funari M.F.A., Homma T.K., Jorge A.A.L., Leal A.M., Lerario A.M., Malaquias A.C., Velloso E.D.R.P.\nEur. J. Med. Genet. 61 130-133 (2018-01-01T00:00:00+09:00) https://pubmed.ncbi.nlm.nih.gov/29133208\n        </dd>\n      </dl>\n    </td>\n  </tr>\n  <tr>\n    <td>\n      <dl>\n        <dt>\n          Homozygous loss of function BRCA1 variant causing a Fanconi-anemia-like phenotype, a clinical report and review of previous patients.\n        </dt>\n        <dd>\n          Freire B.L., Funari M.F.A., Homma T.K., Jorge A.A.L., Leal A.M., Lerario A.M., Malaquias A.C., Velloso E.D.R.P.\nEur. J. Med. Genet. 61 130-133 (2018-01-01T00:00:00+09:00) https://pubmed.ncbi.nlm.nih.gov/29133208\n        </dd>\n      </dl>\n    </td>\n  </tr>\n  <tr>\n    <td>\n      <dl>\n        <dt>\n          Homozygous loss of function BRCA1 variant causing a Fanconi-anemia-like phenotype, a clinical report and review of previous patients.\n        </dt>\n        <dd>\n          Freire B.L., Funari M.F.A., Homma T.K., Jorge A.A.L., Leal A.M., Lerario A.M., Malaquias A.C., Velloso E.D.R.P.\nEur. J. Med. Genet. 61 130-133 (2018-01-01T00:00:00+09:00) https://pubmed.ncbi.nlm.nih.gov/29133208\n        </dd>\n      </dl>\n    </td>\n  </tr>\n</table>";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}\n\nsummary {\n  display: none;\n}\n\n* {\n  font-family: var(--label-font);\n  box-sizing: border-box;\n}\n\ntable {\n  width: var(--text-width);\n}\ntable dl {\n  margin: 0;\n  padding: 10px 0 15px 0;\n  border-bottom: var(--row-border-bottom);\n}\ntable dl dt {\n  color: var(--dt-font-color);\n  font-size: var(--dt-font-size);\n  font-weight: var(--dt-font-weight);\n  line-height: var(--dt-line-height);\n  margin-bottom: var(--dt-margin-bottom);\n}\ntable dl dd {\n  color: var(--dd-font-color);\n  font-size: var(--dd-font-size);\n  font-weight: var(--dd-font-weight);\n  line-height: var(--dd-line-height);\n  margin-inline-start: 0px;\n}";

defineStanzaElement(text, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=text.js.map
