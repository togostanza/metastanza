import Stanza from "togostanza/stanza";
import * as d3 from "d3";

export default class ChordDiagram extends Stanza {
  async render() {
    // this.renderTemplate(
    //   {
    //     template: 'stanza.html.hbs',
    //     parameters: {
    //       greeting: `Hello, ${this.params['say-to']}!`
    //     }
    //   }
    // );

    // geometry
    // window.getComputedStyle(this.element).getPropertyValue('--width')
    const [width, height] = [this.params["width"], this.params["height"]];
    const innerRadius = Math.min(width, height) * 0.5 - 20;
    const outerRadius = innerRadius + 6;
    const formatValue = (x) => `${x.toFixed(0)}B`;

    const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.root.querySelector("main").append(_svg);
    const svg = d3.select(_svg);
    svg.attr("width", width).attr("height", height);

    // data
    const data = await (() => {
      switch (this.params["data-type"]) {
        case "json":
          return d3.json(this.params["data-url"], (data) => data);
        case "tsv":
          return d3.tsv(this.params["data-url"], (data) => data);
      }
    })();
    const names = Array.from(
      new Set(data.flatMap((d) => [d.source, d.target]))
    );
    const matrix = (() => {
      const index = new Map(names.map((name, i) => [name, i]));
      const matrix = Array.from(index, () => new Array(names.length).fill(0));
      for (const { source, target, value } of data) {
        matrix[index.get(source)][index.get(target)] += value;
      }
      return matrix;
    })();

    // prepare some D3 objects
    const color = {
      count: names.length,
      hue(index) {
        return (1 / this.count) * index;
      },
      hsl(index) {
        return `hsl(${this.hue(index)}turn, 50%, 50%)`;
      },
    };

    // const color = d3.scaleOrdinal(names, d3.schemeCategory10)
    const ribbon = d3
      .ribbonArrow()
      .radius(innerRadius - this.params["edge-offset"])
      .padAngle(1 / innerRadius);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const chord = d3
      .chordDirected()
      .padAngle(this.params["arcs-gap"] / innerRadius)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);
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
        d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI })
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
          owes ${formatValue(d3.sum(matrix[d.index]))}
          is owed ${formatValue(d3.sum(matrix, (row) => row[d.index]))}`
        )
      );
  }
}
