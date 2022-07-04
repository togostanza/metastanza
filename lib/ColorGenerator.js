import * as d3 from "d3";

export class InterpolateColorGenerator {
  /**
   * @param {array} range
   * @param {array} domain
   * @return {function} カラー生成関数
   */
  constructor(range, domain) {
    this.colors = range;
    if (domain) {
      domain = domain.map((num) => clamp(num));
      this.colors = range;
    }

    const unit = 1 / (this.colors.length - 1);
    this.colorScale = d3
      .scaleLinear()
      .domain(
        domain ?? [...Array(this.colors.length)].map((_, index) => index * unit)
      )
      .range(this.colors);
  }

  get(position) {
    return this.colorScale(position);
  }

  get length() {
    return this.colors.length;
  }
}

const clamp = (num) => Math.min(Math.max(num, 0), 1);

export class CirculateColorGenerator {
  /**
   * @param {array} range
   * @param {array} domain
   * @param {number} numberOfMakeColor
   * @return {function} カラー生成関数
   */
  constructor(range, domain, numberOfMakeColor) {
    this.colors = range;
    const unit = 1 / (this.colors.length - 1);
    if (domain) {
      domain = domain.map((num) => clamp(num));
      this.colorScale = d3.scaleLinear().domain(domain).range(this.colors);
      this.colors = [...Array(numberOfMakeColor)].map((_, index) => {
        return this.colorScale(index / (numberOfMakeColor - 1));
      });
    } else {
      this.colorScale = d3
        .scaleOrdinal()
        .domain([...Array(this.colors.length)].map((_, index) => index * unit))
        .range(this.colors);
    }
  }

  get(index) {
    return this.colors[index % this.colors.length];
  }
  getById(data, id) {
    const uniqueData = Array.from(new Set(data));
    const colorMap = new Map();
    uniqueData.forEach((element, index) => {
      colorMap.set(element, this.colors[index % this.colors.length]);
    });
    return colorMap.get(id);
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
  const getPropertyValue = (key) =>
    window.getComputedStyle(self.element).getPropertyValue(key);
  const series = [];
  let index = 0;
  let color = getPropertyValue(`--togostanza-series-${index}-color`);
  while (color) {
    series.push(color.trim());
    color = getPropertyValue(`--togostanza-series-${++index}-color`);
  }
  return series;
}

/**
 * @param {HTMLElement} self
 * @param {array} gradationColors
 * @return {function} カラー生成関数
 */
export function getGradationColor(self, gradationColors) {
  let colors = getColorSeries(self);
  gradationColors = gradationColors.filter(Boolean);
  if (gradationColors.length === 2 || gradationColors.length === 3) {
    colors = gradationColors;
  }
  const unit = 1 / (colors.length - 1);
  const domain = [...Array(colors.length)].map((_, index) => index * unit);
  const colorScale = d3.scaleLinear().domain(domain).range(colors);
  return colorScale;
}

export function getColorsWithD3PresetColor(d3PresetColor, numberOfGradation) {
  switch (true) {
    case d3PresetColor.startsWith("scheme"):
      return [...d3[d3PresetColor]];
    case d3PresetColor.startsWith("interpolate"): {
      const colorFunc = d3[d3PresetColor];
      return [...Array(numberOfGradation)].map((_, index) =>
        colorFunc(index / (numberOfGradation - 1))
      );
    }
  }
}
