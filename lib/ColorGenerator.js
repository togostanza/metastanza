import * as d3 from "d3";

//Convert domain values between 0 and 1
const clamp = (num) => Math.min(Math.max(num, 0), 1);

//Parent class
class ColorGenerator {
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
  }

  // get length() {
  //   return this.colors.length;
  // }
}

//When params "type-of-color-circulation" is "interpolate"
export class InterpolateColorGenerator extends ColorGenerator {
  constructor(range, domain) {
    super(range, domain);

    //Set the color scale with reference to the value of "domain" and the color of "range"
    const unit = 1 / (this.colors.length - 1);
    this.colorScale = d3
      .scaleLinear()
      .domain(
        domain ?? [...Array(this.colors.length)].map((_, index) => index * unit)
      )
      .range(this.colors);
  }

  //Get color for each position
  get(position) {
    return this.colorScale(position);
  }
}

//When params "type-of-color-circulation" is "circulate"
export class CirculateColorGenerator extends ColorGenerator {
  /**
   * @param {number} numberOfMakeColor - Params "number-of-make-color"
   */
  constructor(range, domain, numberOfMakeColor) {
    super(range, domain);

    //Set the color scale with reference to the value of "domain" and the color of "range"
    if (domain) {
      //Create colors for params"number-of-make-color" values by params "color-range" "color-domain values"
      this.colorScale = d3.scaleLinear().domain(domain).range(this.colors);
      this.colors = [...Array(numberOfMakeColor)].map((_, index) => {
        return this.colorScale(index / (numberOfMakeColor - 1));
      });
    } else {
      //Repeat the color of params "color-range"
      this.colorScale = d3.scaleOrdinal().range(this.colors);
    }
  }

  //Get each index number for repeated drawings
  get(index) {
    return this.colors[index % this.colors.length];
  }

  //Get data and assign id
  // getById(data, id) {
  //   const uniqueData = Array.from(new Set(data));
  //   const colorMap = new Map();
  //   uniqueData.forEach((element, index) => {
  //     colorMap.set(element, this.colors[index % this.colors.length]);
  //   });
  //   return colorMap.get(id);
  // }
}

//Class CirculateColorGenerator for stanza
export class StanzaCirculateColorGenerator extends ColorGenerator {
  constructor(self, data, colorGroup) {
    super();
    this.self = self;
    this.data = data;
    this.colorGroup = colorGroup;
    // this.colorKey = colorKey;
  }

  // test() {
  //   return this.self;
  // }

  get colorGenerator() {
    const stanza = this.self;
    const data = this.data;
    const colorGroup = this.colorGroup;
    // const colorKey = this.colorKey;

    const getColorSeries = () => {
      const getPropertyValue = (key) =>
        window.getComputedStyle(stanza.element).getPropertyValue(key);
      const series = [];
      let index = 0;
      let color = getPropertyValue(`--togostanza-theme-series_${index}_color`);
      while (color) {
        series.push(color.trim());
        color = getPropertyValue(`--togostanza-theme-series_${++index}_color`);
      }
      return { togostanzaColors: series, defaultColor: series[0] };
    };
    const groupArray = [];
    data.forEach((d) =>
      d.data[colorGroup] ? groupArray.push(d.data[colorGroup]) : ""
    );

    //この行以降を確認する
    const groupColor = d3
      .scaleOrdinal()
      .domain(groupArray)
      .range(getColorSeries().togostanzaColors.slice(1, 6));

    const dataGroupColor = data.forEach((d) => groupColor(d.data[colorGroup]));
    console.log(groupColor);

    return {
      defaultColor: getColorSeries().defaultColor,
      dataGroup: dataGroupColor,
    };
  }
}

//Create an array of colors based on "togostanza-theme-series"
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

//Will be used in Heat map
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
