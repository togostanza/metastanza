import * as d3 from "d3";

//Function for converting each vaue of domain
const clamp = (num) => Math.min(Math.max(num, 0), 1);

//When params "type-of-color-circulation" is "interpolate"
export class InterpolateColorGenerator {
  /**
   * @param {array} range - Params "color-range"
   * @param {array} domain - Params "color-domain"
   * @return {function} - Color generation function
   */
  constructor(range, domain) {
    this.colors = range;
    if (domain) {
      domain = domain.map((num) => clamp(num));
    }

    //Set the color scale with reference to the value of "domain" and the color of "range"
    // const unit = 1 / (this.colors.length - 1);
    this.colorScale = d3
      .scaleLinear()
      .domain(
        // domain ?? [...Array(this.colors.length)].map((_, index) => index * unit)
        domain ?? [0, 0.5, 1]
        // domain ?? []
      )
      .range(this.colors);
  }

  //Get color for each position
  get(position) {
    return this.colorScale(position);
  }

  // get length() {
  //   return this.colors.length;
  // }
}

//When params "type-of-color-circulation" is "circulate"
export class CirculateColorGenerator {
  /**
   * @param {array} range - Params "color-range"
   * @param {array} domain - Params "color-domain"
   * @param {number} numberOfMakeColor - Params "number-of-make-color"
   * @return {function} - Color generation function
   */
  constructor(range, domain, numberOfMakeColor) {
    this.colors = range;

    //Set the color scale with reference to the value of "domain" and the color of "range"
    // const unit = 1 / (this.colors.length - 1);
    if (domain) {
      //Create colors for params"number-of-make-color" values by params "color-range" "color-domain values"
      domain = domain.map((num) => clamp(num));
      this.colorScale = d3.scaleLinear().domain(domain).range(this.colors);
      this.colors = [...Array(numberOfMakeColor)].map((_, index) => {
        return this.colorScale(index / (numberOfMakeColor - 1));
      });
    } else {
      //Repeat the color of params "color-range"
      this.colorScale = d3
        .scaleOrdinal()
        // .domain([...Array(this.colors.length)].map((_, index) => index * unit))
        .range(this.colors);
    }
  }

  //indexはparams"number-of-gradation"の数だけ表示
  //this.colorsはparams"number-of-make-color"の数だけ生成されるrgb

  //Get each index number for repeated drawings
  get(index) {
    return this.colors[index % this.colors.length];
  }

  // getById(data, id) {
  //   const uniqueData = Array.from(new Set(data));
  //   const colorMap = new Map();
  //   uniqueData.forEach((element, index) => {
  //     colorMap.set(element, this.colors[index % this.colors.length]);
  //   });
  //   return colorMap.get(id);
  // }

  // get length() {
  //   return this.colors.length;
  // }
}

//Create an array of colors based on "togostanza-theme-series".
/**
 * @param {HTMLElement} self - Stanza elements to apply
 * @return {string[]}
 */
export function getColorSeries(self) {
  const getPropertyValue = (key) =>
    window.getComputedStyle(self.element).getPropertyValue(key);
  const series = [];
  let index = 0;
  let color = getPropertyValue(`--togostanza-theme-series_${index}_color`);
  while (color) {
    series.push(color.trim());
    color = getPropertyValue(`--togostanza-theme-series_${++index}_color`);
  }
  return series;
}

//Switching color patterns based on params "color-scheme" "number-of-gradation"
export function getColorsWithD3PresetColor(d3PresetColor, numberOfGradation) {
  switch (true) {
    case d3PresetColor.startsWith("scheme"):
      return [...d3[d3PresetColor]];
    case d3PresetColor.startsWith("interpolate"): {
      return [...Array(numberOfGradation)].map((_, index) =>
        d3[d3PresetColor](index / (numberOfGradation - 1))
      );
    }
  }
}

//This function is not used
/**
 * @param {HTMLElement} self
 * @param {array} gradationColors
 * @return {function}  - Color generation function
 */
// export function getGradationColor(self, gradationColors) {
//   let colors;
//   gradationColors = gradationColors.filter(Boolean);
//   if (gradationColors.length === 2 || gradationColors.length === 3) {
//     colors = gradationColors;
//   } else {
//     colors = getColorSeries(self);
//   }
//   const unit = 1 / (colors.length - 1);
//   const domain = [...Array(colors.length)].map((_, index) => index * unit);
//   const colorScale = d3.scaleLinear().domain(domain).range(colors);
//   return colorScale;
// }
