import * as d3 from "d3";
import * as venn from "venn.js";

export const vennJs = async function (shadowRoot, params, css, sets, width, height, colorScheme) {

  const interactiveChart = venn.VennDiagram();
  const interactiveElement = shadowRoot.querySelector('#interactive');
  const interactiveSvg = d3.select(interactiveElement);

  // draw interactive venn diagram svg
  interactiveSvg
    .attr('width', width)
    .attr('height', height)
    .datum(sets)
    .call(interactiveChart);

  //tooltip
  // const main = shadowRoot.querySelector('main');
  const tooltip =
    d3.select(interactiveElement)
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
      tooltip.text(d.size);

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

};