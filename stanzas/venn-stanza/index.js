import Stanza from 'togostanza/stanza';
import loadData from '@/lib/load-data';
import * as d3 from 'd3';
import Color from 'color';
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from '@/lib/metastanza_utils.js';

export default class VennStanza extends Stanza {

  colorSeries;
  data;
  dataLabels;
  numberOfData;

  menu() {
    return [
      downloadSvgMenuItem(this, 'vennstanza'),
      downloadPngMenuItem(this, 'vennstanza'),
    ];
  }

  async render() {
    // TODO: 'Venn' or 'Euler'

    appendCustomCss(this, this.params['custom-css-url']);
    this.colorSeries = this.getColorSeries();

    this.renderTemplate({ template: 'stanza.html.hbs' });

    //set common parameters and styles
    this.defineSizeOfDiagram(this.params['width'], this.params['height']);

    //get data
    this.data = await this.getData();
    this.dataLabels = Array.from(new Set(this.data.map(datum => datum.orgs).flat()));
    const setCounts = new Map(this.data.map(datum => [datum.orgs.map(org => this.dataLabels.indexOf(org)).join(','), datum.count]));
    this.numberOfData = this.dataLabels.length;
    console.log(this.data)
    console.log(this.dataLabels)
    console.log(setCounts)
    console.log(this.colorSeries)

    // show venn diagram corresponds to data(circle numbers to draw)
    const selectedDiagram = this.root.querySelector(`.venn-diagram[data-number-of-data="${this.numberOfData}"]`);
    selectedDiagram.classList.add('-current');
    selectedDiagram.querySelectorAll(':scope > g').forEach(part => {
      const targets1 = part.dataset.targets;
      // set count label
      part.querySelector(':scope > text').textContent = setCounts.get(targets1);
      // set color
      const targets2 = targets1.split(',').map(target => +target);
      const color = this.getBlendedColor(targets2);
      part.querySelector(':scope > .part').setAttribute('fill', color.toString());
    });

  }

  getColorSeries() {
    const getPropertyValue = (key) => window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map(variable => getPropertyValue(variable).trim());
  }

  defineSizeOfDiagram(width, height) {
    const vennElement = this.root.querySelector('#venn-diagrams');
    vennElement.setAttribute('width', width);
    vennElement.setAttribute('height', height);
    // TODO: svgのサイズしか定義できてない
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

  async getData() {
    const data = await loadData(this.params['data-url'], this.params['data-type']);
    // processing
    for (const datum of data) {
      datum.orgs = datum.orgs.split(', ');
      datum.count = Number(datum.count);
    }
    return data;
  }
}
