import Stanza from 'togostanza/stanza';
import loadData from '@/lib/load-data';
import * as d3 from 'd3';
import venn from 'venn.js';
import Color from 'color';
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from '@/lib/metastanza_utils.js';

export default class VennStanza extends Stanza {

  // colorSeries;
  // data;
  // dataLabels;
  // setCounts;
  // numberOfData;

  menu() {
    return [
      downloadSvgMenuItem(this, 'vennstanza'),
      downloadPngMenuItem(this, 'vennstanza'),
    ];
  }

  async render() {

    appendCustomCss(this, this.params['custom-css-url']);
    this.colorSeries = this.getColorSeries();

    this.renderTemplate({ template: 'stanza.html.hbs' });

    //get data
    this.data = await this.getData();
    console.log(this.data)
    this.dataLabels = Array.from(new Set(this.data.map(datum => datum.set).flat()));
    this.setCounts = new Map(this.data.map(datum => [datum.set.map(set => this.dataLabels.indexOf(set)).join(','), datum.size]));
    this.numberOfData = this.dataLabels.length;
    console.log(this.dataLabels)
    console.log(this.setCounts)
    console.log(this.colorSeries)

    // draw
    switch (this.params['chart-type']) {
      case 'Venn diagram':
        this.drawVennDiagram();
        break;
      case 'Euler diagram':
        this.drawEulerDiagram();
        break;
    }
  }

  drawVennDiagram() {
    // set common parameters and styles
    const container = this.root.querySelector('#venn-diagrams');
    const svgWidth = this.params['width'];
    const svgHeight = this.params['height'];
    container.style.width = svgWidth + 'px';
    container.style.height = svgHeight + 'px';

    // show venn diagram corresponds to data(circle numbers to draw)
    const selectedDiagram = this.root.querySelector(`.venn-diagram[data-number-of-data="${this.numberOfData}"]`);
    if (!selectedDiagram) {
      console.error('Venn diagrams with more than six elements are not supported. Please try using Euler diagrams.');
      return;
    }
    selectedDiagram.classList.add('-current');

    // set scale
    const containerRect = this.root.querySelector('main').getBoundingClientRect();
    const rect = selectedDiagram.getBoundingClientRect();
    const margin = Math.max(rect.x - containerRect.x, rect.y - containerRect.y);
    const scale = Math.min(
      svgWidth / (rect.width + margin * 2),
      svgHeight / (rect.height + margin * 2)
    );
    selectedDiagram.setAttribute('transform', `scale(${scale})`);
    const labelFontSize = +window.getComputedStyle(this.element).getPropertyValue('--togostanza-label-font-size').trim();
    selectedDiagram.querySelectorAll('text').forEach(text => {
      text.style.fontSize = (labelFontSize / scale) + 'px';
    })

    // shapes
    selectedDiagram.querySelectorAll(':scope > g').forEach(group => {
      const targets1 = group.dataset.targets;
      // set color
      const targets2 = targets1.split(',').map(target => +target);
      const color = this.getBlendedColor(targets2);
      group.querySelector(':scope > .part').setAttribute('fill', color.toString());
      // set label
      group.querySelector(':scope > text.label').textContent = targets2.map(target => this.dataLabels[target]).join(',');
      group.querySelector(':scope > text.value').textContent = this.setCounts.get(targets1);
    });

    // legends
    this.makeLegend(
      this.data.map(datum => {
        const color = this.getBlendedColor(datum.set.map(item => this.dataLabels.indexOf(item)));
        return Object.fromEntries([
          ['label', datum.set.map(item => item).join('∩')],
          ['color', color.toString()],
          ['value', datum.size],
        ]);
      }),
      this.root.querySelector('main')
    );
  }

  drawEulerDiagram() {

    const container = this.root.querySelector('#euler-diagram');
    container.style.width = this.params['width'] + 'px';
    container.style.height = this.params['height'] + 'px';
    const d3Container = d3.select(container);
    const convertedData = this.data.map(datum => Object.fromEntries([
      ['sets', datum.set],
      ['size', datum.size]
    ]));
    const euler = venn.VennDiagram()
      .width(this.params['width'])
      .height(this.params['height']);
    d3Container.datum(convertedData).call(euler);

    // path
    d3Container.selectAll('.venn-circle path')
      .style('fill', (d, i) => this.colorSeries[i])
      .style('stroke', (d, i) => this.colorSeries[i]);

    // d3.selectAll("#rings .venn-circle text")
    //   .style("fill", function(d,i) { return colours[i]})
    //   .style("font-size", "24px")
    //   .style("font-weight", "100");
  }

  getColorSeries() {
    const getPropertyValue = (key) => window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map(variable => getPropertyValue(variable).trim());
  }

  getBlendedColor(targets) {
    let blendedColor = Color(this.colorSeries[targets[0]]);
    targets.forEach((target, index) => {
      if (index > 0) {
        blendedColor = blendedColor.mix(Color(this.colorSeries[target]), 1 / (index + 1));
      }
    });
    return blendedColor;
  }

  /**
   * 
   * @param {*} data 
   * @param {Node} container 
   * @param {String} direction 'vertical' or 'horizontal'
   * @param {*} position 
   */
  makeLegend(data, container, direction = 'vertical', positions = ['top', 'right']) {
    const div = document.createElement('div');
    div.className = 'legends';
    div.innerHTML = `
    <table>
      <tbody>
      ${data.map(datum => {
        return `
        <tr data-targets="">
          <td><span class="marker" style="background-color: ${datum.color}"></span>${datum.label}</td>
          ${datum.value ? `<td class="${(typeof datum.value).toLowerCase()}">${datum.value}</td>` : ''}
        </tr>`;
      }).join('')}
      </tbody>
    <table>`;
    positions.forEach(position => div.style[position] = 0);
    container.append(div);
  }

  async getData() {
    const data = await loadData(this.params['data-url'], this.params['data-type']);
    // // processing
    // for (const datum of data) {
    //   datum.orgs = datum.orgs.split(', ');
    //   datum.count = Number(datum.count);
    // }
    return data;
  }
}
