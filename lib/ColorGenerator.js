import * as d3 from "d3";
import { reduce } from "d3";

export class InterpolateColorGenerator {

  /**
   * @param {string|array|object} scheme
   * @return {function} カラー生成関数
   */
  constructor(scheme, data) {
    const numberOfGradation = 10;
    switch (typeof scheme) {

      case 'string':
        switch (true) {
          case scheme.startsWith('scheme'):
            this.colors = [...d3[scheme]];
            break;
          case scheme.startsWith('interpolate'): {
            const colorFunc = d3[scheme];
            this.colors = [...Array(numberOfGradation)].map((_, index) => colorFunc(index / (numberOfGradation - 1)));
          }
            break;
        }
        break;

      case 'object':
        if (Array.isArray(scheme)) {
          // case array
          this.colors = scheme;
        } else {
          // case domain & range
          const min = 0;
          const max = 1;
          const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
          scheme.domain = scheme.domain.map(num => clamp(num, min, max));
          this.colors = scheme.range;
        }
        break;

    }

    const unit = 1 / (this.colors.length - 1);
    this.colorScale = d3.scaleLinear()
      .domain(scheme.domain ?? [...Array(this.colors.length)].map((_, index) => index * unit))
      .range(this.colors);

      if(data.length) {
        const minNum = Math.min(...data);
        const maxNum = Math.max(...data);
        const normalize = (min, max, num) => {
            return (num - min) / (max - min);
          }
        const normData = [...data].map(num => normalize(minNum, maxNum, num));
        const colorSets = [...normData].map((num) => {
            return this.colorScale(num);
          })
        console.log('colorSets: ',colorSets);
      }
  }

  get(position) {
    return this.colorScale(position);
  }

  get length() {
    return this.colors.length;
  }

}

const clamp = num => Math.min(Math.max(num, 0), 1);

export class CirculateColorGenerator {

  /**
   * @param {array} range
   * @param {array} domain
   * @param {array} data
   * @param {number} numberOfMakeColor
   * @return {function} カラー生成関数
   */
  constructor(range, domain, data, numberOfMakeColor) {

    this.colors = range;
    const unit = 1 / (this.colors.length - 1);
    if (domain) {
      domain = domain.map(num => clamp(num));
      this.colorScale = d3.scaleLinear()
        .domain(domain)
        .range(this.colors);
      this.colors = [...Array(numberOfMakeColor)].map((_, index) => {
        return this.colorScale(index / (numberOfMakeColor - 1))
      });
    } else {
      this.colorScale = d3.scaleOrdinal()
        .domain([...Array(this.colors.length)].map((_, index) => index * unit))
        .range(this.colors);
    }

    const uniqueData = Array.from(new Set(data));
    const colorMap = new Map();
    uniqueData.forEach((element, index) => {
      colorMap.set(element, this.colors[index % this.colors.length]);
    })
    console.log(colorMap);
    console.log(colorMap.get('apple'));

  }

  get(index) {
    return this.colors[index % this.colors.length];
  }
  getById(id) {
    return this.colorMap.get(id);
  }

  get length() {
    return this.colors.length;
  }

}

/**
 * @param {HTMLElement} self
 * @return {string[]}
 */
export function getColorSeries(self) {

  const getPropertyValue = (key) => window.getComputedStyle(self.element).getPropertyValue(key);
  const series = [];
  let index = 0;
  let color = getPropertyValue(`--togostanza-series-${index}-color`);
  while (color) {
    series.push(color.trim());
    color = getPropertyValue(`--togostanza-series-${++index}-color`);
  }
  return series;
}

export function getColorsWithD3PresetColor(d3PresetColor, numberOfGradation) {
  switch (true) {
    case d3PresetColor.startsWith('scheme'):
      return [...d3[d3PresetColor]];
    case d3PresetColor.startsWith('interpolate'): {
      const colorFunc = d3[d3PresetColor];
      return [...Array(numberOfGradation)].map((_, index) => colorFunc(index / (numberOfGradation - 1)));
    }
  }
}