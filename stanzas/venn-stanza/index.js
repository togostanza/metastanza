import Stanza from 'togostanza/stanza';
import loadData from "@/lib/load-data";
// import { fixedVenn } from "./fixedVenn.js";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "@/lib/metastanza_utils.js";

import * as d3 from "d3";
import * as venn from "venn.js";
import { id } from 'vega';

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

    const interactiveChart = venn.VennDiagram();
    const interactiveElement = this.root.querySelector('#interactive');
    const interactiveSvg = d3.select(interactiveElement);

    // draw interactive venn diagram svg
    interactiveSvg
      .attr('width', width)
      .attr('height', height)
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

    // const fixedChart = venn.VennDiagram();
    const fixedElement = this.root.querySelector('#venn-diagrams');
    const fixedSvg = d3.select(fixedElement);

    // draw fixed venn diagram svg
    fixedSvg
      .attr('width', width)
      .attr('height', height);

  // get how many circles to draw
  let setsNums =[];  
  for (let i = 0; i < sets.length; i++) {
      setsNums.push(sets[i].sets.length);
    }
    const aryMax = function (a, b) { return Math.max(a, b); }
    let circleNum = setsNums.reduce(aryMax);

  // show venns corresponds to data(circle numbers to draw)
  const vennDiagrams = this.root.querySelectorAll('.venn-diagram');
  Array.from(vennDiagrams).forEach((vennDiagram,i) =>{
    vennDiagram.getAttribute('id') === `venn-diagram${circleNum}` ? vennDiagram.style.display = "block" : vennDiagram.style.display = "none";
  })

  // assign labels to each circles
  const LABEL0 = "10090"; // set as parameter by user: required
  const LABEL1 = "7955"; // set as parameter by user: required
  const LABEL2 = "9606"; // set as parameter by user: required

  const vennTextSet3_0 = this.root.querySelector('#venn-text-set3-0');
  const vennTextSet3_1 = this.root.querySelector('#venn-text-set3-1');
  const vennTextSet3_2 = this.root.querySelector('#venn-text-set3-2');
  const vennTextSet3_0_1 = this.root.querySelector('#venn-text-set3-0_1');
  const vennTextSet3_0_2 = this.root.querySelector('#venn-text-set3-0_2');
  const vennTextSet3_1_2 = this.root.querySelector('#venn-text-set3-1_2');
  const vennTextSet3_0_1_2 = this.root.querySelector('#venn-text-set3-0_1_2');

  dataset.forEach( data =>{
    const orgArray = data.orgs.split(', ');
    const doesIncludeLabel0 = orgArray.includes(LABEL0);
    const doesIncludeLabel1 = orgArray.includes(LABEL1);
    const doesIncludeLabel2 = orgArray.includes(LABEL2);
    if(doesIncludeLabel0 && doesIncludeLabel1 && doesIncludeLabel2){
      vennTextSet3_0_1_2.textContent = data.count;
    }else if(doesIncludeLabel0 && doesIncludeLabel1){
      vennTextSet3_0_1.textContent = data.count;
    }else if(doesIncludeLabel1 && doesIncludeLabel2){
      vennTextSet3_0_2.textContent = data.count;
    }else if(doesIncludeLabel0 && doesIncludeLabel2){
      vennTextSet3_1_2.textContent = data.count;
    }else if(doesIncludeLabel0){
      vennTextSet3_0.textContent = data.count;
    }else if(doesIncludeLabel1){
      vennTextSet3_1.textContent = data.count;
    }else if(doesIncludeLabel2){
      vennTextSet3_2.textContent = data.count;
    };
  })
  
}

}
