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

//Create array of colors based on "togostanza-theme-series"
/**
 * @param {HTMLElement} self - Information of the stanza
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

//Parent class for stanza
class StanzaColorGenerator {
  /**
   * @param {HTMLElement} self - Information of the stanza
   * @return {object}  - Colors based on "togostanza them"
   */
  constructor(self) {
    this.self = self;
  }

  //Create object of colors based on "togostanza-theme-series"
  static getColorSeries(stanza) {
    const getPropertyValue = (key) =>
      window.getComputedStyle(stanza.element).getPropertyValue(key);
    const series = [];
    let index = 0;
    let color = getPropertyValue(`--togostanza-theme-series_${index}_color`);
    while (color) {
      series.push(color.trim());
      color = getPropertyValue(`--togostanza-theme-series_${++index}_color`);
    }
    return { stanzaColors: series, firstColor: series[0] };
  }
}

//CirculateColorGenerator class for stanza
export class StanzaCirculateColorGenerator extends StanzaColorGenerator {
  /**
   * @param {array} data - Array of data
   * @param {array} colorGroup - Array of specified color group
   * @param {array} colorKey - Array of specified color key
   * @return {function}  - Set color to data function
   */
  constructor(self, data, colorGroup, colorKey) {
    super(self);
    this.data = data;
    this.colorGroup = colorGroup;
    this.colorKey = colorKey;
  }

  //Generate color scheme for circulate pattern
  get series() {
    const stanza = this.self;
    const stanzaColor = StanzaColorGenerator.getColorSeries(stanza);
    const colorRange = stanzaColor.stanzaColors.slice(1, 6);
    const defaultColor = stanzaColor.firstColor;
    const data = this.data;
    const colorGroup = this.colorGroup;
    const colorKey = this.colorKey;

    //Create array for domain and define color scale
    const groupArray = [];
    data.forEach((d) =>
      d.data[colorGroup] ? groupArray.push(d.data[colorGroup]) : ""
    );
    const groupColor = d3.scaleOrdinal().domain(groupArray).range(colorRange);

    //Set color for each data
    const setColor = (d) => {
      if (d.data[colorKey]) {
        return d.data[colorKey];
      } else {
        return d.data[colorGroup]
          ? groupColor(d.data[colorGroup])
          : defaultColor;
      }
    };

    return setColor;
  }
}

//InterpolateColorGenerator class for stanza
export class StanzaInterpolateColorGenerator extends StanzaColorGenerator {
  /**
   * @param {array} colorRange - Array of minimum, middle and maximum colors
   * @return {function}  - Create color scale function
   */
  constructor(self, colorRange) {
    super(self);
    this.colorRange = colorRange;
  }

  //Generate color scheme for interpolate pattern
  get series() {
    const stanza = this.self;
    const stanzaColors =
      StanzaColorGenerator.getColorSeries(stanza).stanzaColors;
    const colorRange = this.colorRange.filter(Boolean);

    //With and without color specification
    let colors = stanzaColors;
    if (colorRange.length === 2 || colorRange.length === 3) {
      colors = colorRange;
    }

    //Define color scale
    const unit = 1 / (colors.length - 1);
    const domain = [...Array(colors.length)].map((_, index) => index * unit);
    const colorScale = d3.scaleLinear().domain(domain).range(colors);

    return colorScale;
  }
}
