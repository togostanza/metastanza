import { S as Stanza, s as select, d as defineStanzaElement } from './transform-8254f1d1.js';
import { l as loadData } from './load-data-8104e001.js';
import { d as descending } from './descending-63ef45b8.js';
import { s as sum } from './sum-44e7480e.js';
import { r as ribbonArrow, c as chordDirected } from './ribbon-bbaf0468.js';
import { a as arc$2 } from './arc-06a68a59.js';
import './dsv-ac31b097.js';
import './path-a78af922.js';
import './constant-c49047a5.js';

class ChordDiagram extends Stanza {
  async render() {
    // geometry
    // window.getComputedStyle(this.element).getPropertyValue('--width')
    const [width, height] = [this.params["width"], this.params["height"]];
    const innerRadius = Math.min(width, height) * 0.5 - 20;
    const outerRadius = innerRadius + 6;
    const formatValue = (x) => `${x.toFixed(0)}B`;

    const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.root.querySelector("main").append(_svg);
    const svg = select(_svg);
    svg.attr("width", width).attr("height", height);

    // data
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    const names = Array.from(
      new Set(data.flatMap((d) => [d.source, d.target]))
    );
    console.log(data);
    const matrix = (() => {
      const index = new Map(names.map((name, i) => [name, i]));
      const matrix = Array.from(index, () => new Array(names.length).fill(0));
      for (const { source, target, value } of data) {
        matrix[index.get(source)][index.get(target)] += value;
      }
      return matrix;
    })();
    // console.log(matrix)

    // prepare some D3 objects
    const color = {
      count: names.length,
      hue(index) {
        return (1 / this.count) * index;
      },
      hsl(index) {
        return `hsl(${this.hue(index)}turn, 70%, 60%)`;
      },
    };

    // const color = d3.scaleOrdinal(names, d3.schemeCategory10)
    const ribbon = ribbonArrow()
      .radius(innerRadius - this.params["edge-offset"])
      .padAngle(1 / innerRadius);
    const arc = arc$2().innerRadius(innerRadius).outerRadius(outerRadius);
    const chord = chordDirected()
      .padAngle(this.params["arcs-gap"] / innerRadius)
      .sortSubgroups(descending)
      .sortChords(descending);
    const chords = chord(matrix);

    const fullsircleId = `fullsircle${new Date().getTime()}`;

    const rootGroup = svg
      .append("g")
      .attr("transform", `translate(${[width * 0.5, height * 0.5]})`);

    rootGroup
      .append("path")
      .classed("fullsircle", true)
      .attr("id", fullsircleId)
      .attr(
        "d",
        arc$2()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI })
      );

    rootGroup
      .append("g")
      .classed("ribbons", true)
      .selectAll("g")
      .data(chords)
      .join("path")
      .attr("d", ribbon)
      // .attr('fill', d => color(names[d.target.index]))
      .attr("fill", (d) => color.hsl(d.target.index))
      .append("title")
      .text(
        (d) =>
          `${names[d.source.index]} owes ${names[d.target.index]} ${formatValue(
            d.source.value
          )}`
      );

    rootGroup
      .append("g")
      .classed("arcs", true)
      .selectAll("g")
      .data(chords.groups)
      .join("g")
      .call((g) =>
        g
          .append("path")
          .attr("d", arc)
          // .attr('fill', d => color(names[d.index]))
          .attr("fill", (d) => color.hsl(d.index))
          .attr("stroke", "#fff")
      )
      .call((g) =>
        g
          .append("text")
          .attr("dy", -3)
          .append("textPath")
          // .attr('xlink:href', textId.href)
          .attr("xlink:href", () => `#${fullsircleId}`)
          .attr("startOffset", (d) => d.startAngle * outerRadius)
          .text((d) => names[d.index])
      )
      .call((g) =>
        g.append("title").text(
          (d) => `${names[d.index]}
          owes ${formatValue(sum(matrix[d.index]))}
          is owed ${formatValue(sum(matrix, (row) => row[d.index]))}`
        )
      );
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ChordDiagram
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "chord-diagram",
	"stanza:label": "Chord diagram",
	"stanza:definition": "",
	"stanza:license": "MIT",
	"stanza:author": "永野 朗夫",
	"stanza:contributor": [
],
	"stanza:created": "2021-11-12",
	"stanza:updated": "2021-11-12",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/directed-graph-data.json",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
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
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Width",
		"stanza:required": true
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Height",
		"stanza:required": true
	},
	{
		"stanza:key": "arcs-gap",
		"stanza:type": "number",
		"stanza:example": 10,
		"stanza:description": "Gap between arcs",
		"stanza:required": true
	},
	{
		"stanza:key": "edge-offset",
		"stanza:type": "number",
		"stanza:example": 0.5,
		"stanza:description": "Gap between arc and edge",
		"stanza:required": true
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--font-size",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Font size"
	},
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
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=chord-diagram.js.map
