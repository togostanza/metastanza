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
    // // venn.js usable data
    // var sets = [
    //   { sets: ['サイトA'], size: 12 },
    //   { sets: ['サイトB'], size: 12 },
    //   { sets: ['サイトC'], size: 11 },
    //   { sets: ['サイトD'], size: 10 },
    //   { sets: ['サイトA', 'サイトB'], size: 2 },
    //   { sets: ['サイトB', 'サイトC'], size: 2 },
    //   { sets: ['サイトA', 'サイトC'], size: 2 },
    //   { sets: ['サイトB', 'サイトD'], size: 2 },
    // ];

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
    const sets = json;

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
        console.log('d',d);
        return colorScheme[i];
      })
      .style('stroke-width', css('--togostanza-border-width'))
      .style('stroke-opacity', css('--togostanza-border-opacity'))
      .style('stroke', function (d, i) {
        return colorScheme[i];
      });

    //text
    originalSvg
      .selectAll('#venn .venn-circle text')
      .style('fill', function (d, i) {
        return css('--togostanza-label-font-color');
      })
      .style('font-family', css('--togostanza-font-family'))
      .style('font-size', css('--togostanza-label-font-size') + 'px')
      .style('font-weight', '100');


    // // add a tooltip
    // const body = this.root.querySelector('body');
    // let tooltip = d3.select(body).append("div")
    //   .attr("class", "venntooltip");

    // // add listeners to all the groups to display tooltip on mouseover
    // originalSvg.selectAll("g")
    //   .data(sets)
    //   .on("mouseover", function (d, i) {
    //     console.log('d',d);
    //     console.log('sets',sets)
    //     // sort all the areas relative to the current item
    //     // venn.sortAreas(originalSvg, d);
    //     // Display a tooltip with the current size
    //     tooltip.transition().duration(400).style("opacity", .9);
    //     tooltip.text(d.size + " users");
    //     // highlight the current path
    //     let selection = d3.select(this).transition("tooltip").duration(400);
    //     selection.select("path")
    //       .style("stroke-width", 3)
    //       // .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
    //       .style("stroke-opacity", 1);
    //   })
    //   .on("mousemove", function () {
    //     tooltip.style("left", (d3.event.pageX) + "px")
    //       .style("top", (d3.event.pageY - 28) + "px");
    //   })
    //   .on("mouseout", function (d, i) {
    //     tooltip.transition().duration(400).style("opacity", 0);
    //     let selection = d3.select(this).transition("tooltip").duration(400);
    //     selection.select("path")
    //       .style("stroke-width", 0)
    //       // .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
    //       .style("stroke-opacity", 0);
    //   });


    //rings
    const ringsElement = this.root.querySelector('#rings');
    const ringsSvg =
      d3.select(ringsElement)
        .append('svg')
        .attr('width', 800)
        .attr('height', 380)
        .datum(sets)
        .call(chart);

    ringsSvg
      .selectAll('.venn-circle path')
      .data(sets)
      .style('fill-opacity', 0)
      .style('stroke-width', 10)
      .style('stroke-opacity', 0.5)
      .style('stroke', function (d, i) {
        return colorScheme[i];
      });
    ringsSvg
      .selectAll('#rings .venn-circle text')
      .style('fill', function (d, i) {
        return colorScheme[i];
      })
      .style('font-size', '24px')
      .style('font-weight', '100');

    //inverted Venn diagram
    const invertedElement = this.root.querySelector('#inverted');
    const invertedSvg =
      d3.select(invertedElement)
        .append('svg')
        .attr('width', 800)
        .attr('height', 400)
        .datum(sets)
        .call(chart);
    invertedSvg
      .selectAll('#inverted .venn-circle path')
      .style('fill-opacity', .8);
    invertedSvg
      .selectAll('#inverted text')
      .style('fill', '#FFF');

    //monochart
    const monoElement = this.root.querySelector('#mono');
    const monoSvg =
      d3.select(monoElement)
        .append('svg')
        .attr('width', 800)
        .attr('height', 400)
        .datum(sets)
        .call(chart);

    monoSvg
      .selectAll('#mono .venn-circle path')
      .style('fill-opacity', 0)
      .style('stroke-width', 2)
      .style('stroke', '#444');
    monoSvg
      .selectAll('#mono text')
      .style('fill', '#444');
  }
}
