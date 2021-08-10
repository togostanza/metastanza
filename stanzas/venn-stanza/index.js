import Stanza from 'togostanza/stanza';
import loadData from "@/lib/load-data";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "@/lib/metastanza_utils.js";

import * as d3 from "d3";
import * as venn from "venn.js";

export default class VennStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "vennstanza"),
      downloadPngMenuItem(this, "vennstanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);
    // // TogoGenome's data structure exclusive
    // let sets = [
    //   { sets: ['A'], size: 52 },
    //   { sets: ['B'], size: 73 },
    //   { sets: ['C'], size: 183 },
    //   { sets: ['A', 'B'], size: 9 },
    //   { sets: ['B', 'C'], size: 20 },
    //   { sets: ['A', 'C'], size: 591 },
    //   { sets: ['A','B', 'C'], size: 5568 },
    // ];

    // Venn.js usable data
    let sets = [
      { sets: ['A'], size: 6241 },
      { sets: ['B'], size: 5670 },
      { sets: ['C'], size: 6362 },
      { sets: ['A', 'B'], size: 9 + 5568 },
      { sets: ['B', 'C'], size: 20 + 5568 },
      { sets: ['A', 'C'], size: 591 + 5568 },
      { sets: ['A', 'B', 'C'], size: 5568 },
    ];

    //get data
    let dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    //convert data to use venn.js
    let str = JSON.stringify(dataset).replace(/\"orgs\":/g, "\"sets\":").replace(/\"count\":/g, "\"size\":");
    let json = JSON.parse(str);
    for (let i = 0; i < json.length; i++) {
      json[i].sets = json[i].sets.split(', ');
      json[i].size = Number(json[i].size);
    }
    // const sets = json;

    this.renderTemplate(
      {
        template: 'stanza.html.hbs',
        parameters: {
          greeting: `Hello, ${this.params['say-to']}!`
        }
      }
    );

    const width = this.params['width'];
    const height = this.params['height'];

    //set color scheme
    const colorScheme = [
      css('--togostanza-series-0-color'),
      css('--togostanza-series-1-color'),
      css('--togostanza-series-2-color'),
      css('--togostanza-series-3-color'),
      css('--togostanza-series-4-color'),
      css('--togostanza-series-5-color')
    ];

    // original Venn diagram
    const chart = venn.VennDiagram();
    const vennElement = this.root.querySelector('#venn');
    const originalSvg =
      d3.select(vennElement)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .datum(sets)
        .call(chart);

    //path
    originalSvg
      .selectAll('.venn-circle path')
      .data(sets)
      .style('fill-opacity', css('--togostanza-opacity'))
      .style('fill', function (d, i) {
        console.log('d', d);
        return colorScheme[i];
      })
      .style('stroke-width', css('--togostanza-border-width'))
      .style('stroke-opacity', css('--togostanza-border-opacity'))
      .style('stroke', function (d, i) {
        return colorScheme[i];
      });

    //text
    // originalSvg
    //   .selectAll('#venn .venn-circle text')
    //   .style('fill', function (d, i) {
    //     return css('--togostanza-label-font-color');
    //   })
    //   .style('font-family', css('--togostanza-font-family'))
    //   .style('font-size', css('--togostanza-label-font-size') + 'px')
    //   .style('font-weight', '100');


    const interactiveChart = venn.VennDiagram();
    const interactiveElement = this.root.querySelector('#interactive');
    const interactiveSvg = d3.select(interactiveElement);

    // draw interactive venn diagram svg
    interactiveSvg
      .datum(sets)
      .call(interactiveChart);

    //tooltip
    const main = this.root.querySelector('main');
    const tooltip =
      d3.select(main)
        .append('div')
        .attr('class', 'venntooltip');
    //path
    interactiveSvg
      .selectAll('path')
      .style('fill', function (d, i) {
        return colorScheme[i];
      })     
      .style('stroke-opacity', 0)
      .style('stroke', '#333')
      .style('stroke-width', 3);

    //text
    interactiveSvg
      .selectAll('#venn .venn-circle text')
      // .style('fill', function (d, i) {
      //   return css('--togostanza-label-font-color');
      // })
      .style('fill', function (d, i) {
        return colorScheme[i];
      })   
      .style('font-family', css('--togostanza-font-family'))
      .style('font-size', css('--togostanza-label-font-size') + 'px')
      .style('font-weight', '100');

    interactiveSvg.selectAll('g')
      .data(sets)
      .on('mouseover', function (e, d) {
        // sort all the areas relative to the current item
        venn.sortAreas(interactiveSvg, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(100).style('opacity', .9);
        console.log('d.size', d.size)
        tooltip.text(d.size + ' genes');

        // highlight the current path
        let selection = d3.select(this).transition('tooltip').duration(400);
        selection.select('path')
          .style('fill-opacity', d.sets.length == 1 ? .4 : .1)
          .style('stroke-opacity', 1);
      })
      .on('mousemove', function () {
        tooltip.style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function (d, i) {
        tooltip.transition().duration(400).style('opacity', 0);
        let selection = d3.select(this).transition('tooltip').duration(400);
        selection.select('path')
          // .style('fill-opacity', .5)
          // .style('fill-opacity', d.sets.length == 1 ? .25 : .0)
          .style('stroke-opacity', 0);
      });
  }
}
