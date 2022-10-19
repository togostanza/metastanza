import Stanza from "togostanza/stanza";
import * as d3 from "d3";
import loadData from "togostanza-utils/load-data";

import { StanzaInterpolateColorGenerator } from "@/lib/ColorGenerator";

export default class ChordDiagram extends Stanza {
  async render() {
    // geometry
    // window.getComputedStyle(this.element).getPropertyValue('--width')
    const [width, height] = [this.params["width"], this.params["height"]];
    const innerRadius = Math.min(width, height) * 0.5 - 20;
    const outerRadius = innerRadius + 6;
    const formatValue = (x) => `${x.toFixed(0)}B`;

    //Drawing area
    const _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.root.querySelector("main").append(_svg);
    const svg = d3.select(_svg);
    svg.attr("width", width).attr("height", height);

    // data
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"],
      this.root.querySelector("main")
    );

    //Create a unique array of data keys
    const names = Array.from(
      new Set(data.flatMap((d) => [d.source, d.target]))
    );

    //Immediate function to create a matrix for values between source and target
    const matrix = (() => {
      const index = new Map(names.map((name, i) => [name, i]));
      const matrix = Array.from(index, () => new Array(names.length).fill(0));
      for (const { source, target, value } of data) {
        matrix[index.get(source)][index.get(target)] += value;
      }
      return matrix;
    })();

    const setColor = StanzaInterpolateColorGenerator(this, names.length);

    //Create arrow ribbon generator with radius and padding angle
    const ribbon = d3
      .ribbonArrow()
      .radius(innerRadius - this.params["edge-offset"])
      .padAngle(1 / innerRadius);

    //Create outer arc generator
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    //Generate directed chord with matrix
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
      .attr("fill", (d) => setColor(d.target.index))
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
          .attr("fill", (d) => setColor(d.index))
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
