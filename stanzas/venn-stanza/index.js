import Stanza from 'togostanza/stanza';
import loadData from '@/lib/load-data';
import * as d3 from 'd3';
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

    // show venn diagram corresponds to data(circle numbers to draw)
    const selectedDiagram = this.root.querySelector(`.venn-diagram[data-number-of-data="${this.numberOfData}"]`);
    selectedDiagram.classList.add('-current');
    selectedDiagram.querySelectorAll(':scope > g').forEach(part => {
      part.querySelector(':scope > text').textContent = setCounts.get(part.dataset.target);
    });

    // get paths(=venn shapes) and texts(=venn labels), and these nodelists are listed in vennSet3Arr's order
    const part1Paths = this.root.querySelectorAll('.part1-path');

    const part2Paths = this.root.querySelectorAll('.part2-path');

    const part3Paths = this.root.querySelectorAll('.part3-path');

    const part4Paths = this.root.querySelectorAll('.part4-path');

    const part5Paths = this.root.querySelectorAll('.part5-path');

    //set venn diagram depends on circle numbers //TODO: check and adjust opacity value
    switch (this.numberOfData) {
      case 1:
        part1Paths[0].setAttribute('fill',this.colorSeries[0].trim());
        break;
      case 2:
        const part2ColorScheme = [
          this.colorSeries[0].trim(),
          this.colorSeries[1].trim(),
          '#FFFFFF'
        ];
        part2Paths.forEach((path, i) => {path.setAttribute('fill', part2ColorScheme[i]);})
        break;
      case 3:
        const part3ColorScheme = [
          this.colorSeries[0].trim(),
          this.colorSeries[1].trim(),
          this.colorSeries[2].trim(),
          rgb2hex(blendRgb(.8, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()))),
          rgb2hex(blendRgb(.8, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[2].trim()))),
          rgb2hex(blendRgb(.8, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()))),
          '#FFFFFF'
        ];
        part3Paths.forEach((path, i) => {path.setAttribute('fill', part3ColorScheme[i]);})
        break;
      case 4:
        const part4ColorScheme = [
          this.colorSeries[0].trim(),
          this.colorSeries[1].trim(),
          this.colorSeries[2].trim(),
          this.colorSeries[3].trim(),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()))),
          '#FFFFFF'
        ];
        part4Paths.forEach((path, i) => {path.setAttribute('fill', part4ColorScheme[i]);})
        break;
      case 5:
        const part5ColorScheme = [
          this.colorSeries[0].trim(),
          this.colorSeries[1].trim(),
          this.colorSeries[2].trim(),
          this.colorSeries[3].trim(),
          this.colorSeries[4].trim(),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[3].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[3].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[3].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[3].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[0].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()), hex2rgb(this.colorSeries[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(this.colorSeries[1].trim()), hex2rgb(this.colorSeries[2].trim()), hex2rgb(this.colorSeries[3].trim()), hex2rgb(this.colorSeries[4].trim()))),
          '#FFFFFF'
        ];
        part5Paths.forEach((path, i) => {path.setAttribute('fill', part5ColorScheme[i]);})
        break;
      default:
        console.log(`Circle number(${this.numberOfData}) is invalid. Please set from 1 to 5 circles.`);
    }

    //convert hex to rgb (retrun [red, green, blue])
    function hex2rgb(colorCode){
      const red = parseInt(colorCode.substring(1, 3), 16);
      const green = parseInt(colorCode.substring(3, 5), 16);
      const blue = parseInt(colorCode.substring(5, 7), 16);
      return [red,green,blue];
    }
    
    //convert hex to rgb (retrun [red, green, blue])
    function rgb2hex(rgb) {
      return '#' + rgb.map(  value => {
        return ('0' + value.toString(16)).slice(-2);
      } ).join( '' ) ;
    }

    //blend two colors to draw overlapping color
    //rgbArr is supporsed to be like [red, green, blue]
    function blendRgb(opacity, rgbArr1, rgbArr2, rgbArr3, rgbArr4){
      rgbArr3 ? rgbArr3 : rgbArr3 = [0,0,0];
      rgbArr4 ? rgbArr4 : rgbArr4 = [0,0,0];

      let red = Math.round((rgbArr1[0] + rgbArr2[0] + rgbArr3[0] + rgbArr4[0]) * opacity);
      let green = Math.round((rgbArr1[1] + rgbArr2[1] + rgbArr3[1] + rgbArr4[1]) * opacity);
      let blue = Math.round((rgbArr1[2] + rgbArr2[2] + rgbArr3[2] + rgbArr4[2]) * opacity);

      red > 255 ? red = 255 : red; 
      green > 255 ? green = 255 : green; 
      blue > 255 ? blue = 255 : blue;       
      
      return [red, green, blue];
    }

  }

  getColorSeries() {
    const getPropertyValue = (key) => window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map(variable => getPropertyValue(variable));
  }

  defineSizeOfDiagram(width, height) {
    // const drawArea = this.root.querySelector('#drawArea'); //TODO: set to use tooltip
    const vennElement = this.root.querySelector('#venn-diagrams');
    vennElement.setAttribute('width', width);
    vennElement.setAttribute('height', height);
    // TODO: svgのサイズしか定義できてない
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
