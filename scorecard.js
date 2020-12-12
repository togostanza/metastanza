import { d as defineStanzaElement } from './stanza-element-6585decd.js';

async function scorecard(stanza, params) {
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
      greeting: `Hello, ${params['say-to']}!`
    }
  });
}

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "scorecard",
	"stanza:label": "scorecard",
	"stanza:definition": "scorecard for MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Image",
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
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#94d0da",
		"stanza:description": "basic fill color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "\n<style>\n</style>\n\n<svg width=\"200\" height=\"200\">\n  <text x=\"30\" y=\"30\" font-family=\"sans-serif\" font-size=\"30px\" fill=\"var(--series-0-color)\">Hello!</text>\n</svg>\n      \n";
},"useData":true}]
];

var css = "/*\n\nYou can set up a global style here that is commonly used in each stanza.\n\nExample:\n\nh1 {\n  font-size: 24px;\n}\n\n*/\nmain {\n  padding: 1rem 2rem;\n}\n\np.greeting {\n  margin: 0;\n  font-size: 24px;\n  color: var(--greeting-color);\n  text-align: var(--greeting-align);\n}";

defineStanzaElement(scorecard, {metadata, templates, css, url: import.meta.url});
//# sourceMappingURL=scorecard.js.map
