import * as d3 from "d3";

export class ColorGenerator {

  /**
   * @param {string|array|object} scheme
   * @param {('interpolate'|'circulate')} type , 'interpolate' or 'circulate'
   * @param {number} numberOfGradation
   * @return {function} カラー生成関数
   */
  constructor(scheme, type, numberOfGradation) {

    this._type = type;

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
          this.colors = scheme.range;
        }
        break;

    }

    const unit = 1 / (this.colors.length - 1);
    switch(type) {
      case 'circulate':
        this.colorScale = d3.scaleOrdinal()
          .domain(scheme.domain ?? [...Array(this.colors.length)].map((_, index) => index * unit))
          .range(this.colors);
        break;
      case 'interpolate':
        this.colorScale = d3.scaleLinear()
          .domain(scheme.domain ?? [...Array(this.colors.length)].map((_, index) => index * unit))
          .range(this.colors);
        break;
    }

  }

  get(position) {
    switch (this._type) {
      case 'circulate':
        return this.colors[position % this.colors.length];

      case 'interpolate':
        return this.colorScale(position);
    }
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
