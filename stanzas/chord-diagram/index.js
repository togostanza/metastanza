import Stanza from 'togostanza/stanza';
import * as d3 from 'd3';

export default class ChordDiagram extends Stanza {
  async render() {
    console.log( d3.chord() )
    this.renderTemplate(
      {
        template: 'stanza.html.hbs',
        parameters: {
          greeting: `Hello, ${this.params['say-to']}!`
        }
      }
    );

    const _svg_ = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    console.log(_svg_)
    this.root.querySelector('main').append(_svg_)

    const [width, height] = [200, 200];
    const innerRadius = Math.min(width, height) * 0.5 - 20
    const outerRadius = innerRadius + 6
    const formatValue = x => `${x.toFixed(0)}B`
    console.log(formatValue)

    const data = await d3.csv('http://localhost:8080/chord-diagram/assets/debt.csv', (data, i) => data);
    const names = Array.from(new Set(data.flatMap(d => [d.source, d.target])))
    const matrix = (() => {
      const index = new Map(names.map((name, i) => [name, i]));
      const matrix = Array.from(index, () => new Array(names.length).fill(0));
      for (const {source, target, value} of data) matrix[index.get(source)][index.get(target)] += value;
      return matrix;
    })();
    console.log(names)

    const color = d3.scaleOrdinal(names, d3.schemeCategory10)
    const ribbon = d3.ribbonArrow()
      .radius(innerRadius - 0.5)
      .padAngle(1 / innerRadius)
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
    const chord = d3.chordDirected()
      .padAngle(12 / innerRadius)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending)

    const chords = chord(matrix);
    console.log(chords)
  



    const svg = d3.select(_svg_);

    svg.attr('viewBox', [-width / 2, -height / 2, width, height]);

    svg.append('path')
      .attr('fill', 'none')
      .attr('d', d3.arc()({outerRadius, startAngle: 0, endAngle: 2 * Math.PI}));

    svg.append('g')
        .attr('fill-opacity', 0.75)
      .selectAll('g')
      .data(chords)
      .join('path')
        .attr('d', ribbon)
        .attr('fill', d => color(names[d.target.index]))
        .style('mix-blend-mode', 'multiply')
      .append('title')
      .text(d => `${names[d.source.index]} owes ${names[d.target.index]} ${formatValue(d.source.value)}`);

    svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
      .selectAll('g')
      .data(chords.groups)
      .join('g')
        .call(g => g.append('path')
          .attr('d', arc)
          .attr('fill', d => color(names[d.index]))
          .attr('stroke', '#fff'))
        .call(g => g.append('text')
          .attr('dy', -3)
        .append('textPath')
          // .attr('xlink:href', textId.href)
          .attr('startOffset', d => d.startAngle * outerRadius)
          .text(d => names[d.index]))
        .call(g => g.append('title')
          .text(d => `${names[d.index]}
          owes ${formatValue(d3.sum(matrix[d.index]))}
          is owed ${formatValue(d3.sum(matrix, row => row[d.index]))}`));
  }

}
