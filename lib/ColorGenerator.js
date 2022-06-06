
export default class ColorGenerator {

  /**
   * @param {string|array|object} scheme
   * @param {('interpolate'|'circulate')} type , 'interpolate' or 'circulate'
   * @param {number} numberOfGradation
   * @return {function} カラー生成関数
   */
  constructor(scheme, type, numberOfGradation) {

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
