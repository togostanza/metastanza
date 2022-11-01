import './transform-0e5d4876.js';
import { l as linear } from './linear-919165bc.js';
import { o as ordinal } from './ordinal-e772a8c0.js';

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

//When params "type-of-color-circulation" is "circulate"
class CirculateColorGenerator extends ColorGenerator {
  /**
   * @param {number} numberOfMakeColor - Params "number-of-make-color"
   */
  constructor(range, domain, numberOfMakeColor) {
    super(range, domain);

    //Set the color scale with reference to the value of "domain" and the color of "range"
    if (domain) {
      //Create colors for params"number-of-make-color" values by params "color-range" "color-domain values"
      this.colorScale = linear().domain(domain).range(this.colors);
      this.colors = [...Array(numberOfMakeColor)].map((_, index) => {
        return this.colorScale(index / (numberOfMakeColor - 1));
      });
    } else {
      //Repeat the color of params "color-range"
      this.colorScale = ordinal().range(this.colors);
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

//When params "type-of-color-circulation" is "interpolate"
class InterpolateColorGenerator extends ColorGenerator {
  constructor(range, domain) {
    super(range, domain);

    //Set the color scale with reference to the value of "domain" and the color of "range"
    const unit = 1 / (this.colors.length - 1);
    this.colorScale = linear()
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

  //Get stanzaColor
  get stanzaColor() {
    const stanza = this.self;
    return StanzaColorGenerator.getColorSeries(stanza).stanzaColors;
  }
}

//CirculateColorGenerator class for stanza
class StanzaCirculateColorGenerator extends StanzaColorGenerator {
  /**
   * @param {array} data - Array of data
   * @param {array} colorGroup - Array of specified color group
   */
  constructor(self, data, colorGroup) {
    super(self);
    const stanza = this.self;
    const stanzaColor = StanzaColorGenerator.getColorSeries(stanza);
    const colorRange = stanzaColor.stanzaColors.slice(1, 6);
    this.firstColor = stanzaColor.firstColor;

    //Create array for domain and define color scale
    const groups = Array.from(
      new Set(data.flatMap((d) => d[colorGroup])).delete(undefined)
    );
    this.groupColor = ordinal().domain(groups).range(colorRange);
  }

  get defaultColor() {
    return this.firstColor;
  }

  getColor(datum) {
    return this.groupColor(datum);
  }
}

//Generate color scheme for gradation pattern
function getGradationColor(self, colorRange, colorDomain) {
  /**
   * @param {HTMLElement} self - Information of the stanza
   * @param {array} colorRange - [minColor, midColor, maxColor]
   * @param {array} colorDomain - [minNumber, midNumber, maxNumber]
   */

  colorRange = colorRange.filter(Boolean);
  let colors = colorRange;
  let domain = colorDomain;

  if (colorRange.length === 1 || colorRange.length === 0) {
    colors = StanzaColorGenerator.getColorSeries(self).stanzaColors;

    const delta = (colorDomain[2] - colorDomain[0]) / (colors.length - 1);
    domain = [...Array(colors.length)].map(
      (_, index) => colorDomain[0] + index * delta
    );
  }

  return linear().domain(domain).range(colors).clamp(true);
}

//Generate color scheme for StanzaInterpolateColor pattern
function getStanzaInterpolateColor(self, colorNum) {
  /**
   * @param {HTMLElement} self - Information of the stanza
   * @param {number} colorNum - Number of colors
   */

  const stazaColors = StanzaColorGenerator.getColorSeries(self).stanzaColors;
  const domains = [];
  for (let i = 0; i < stazaColors.length; i++) {
    domains.push((colorNum / stazaColors.length) * i);
  }

  return linear().domain(domains).range(stazaColors);
}

export { CirculateColorGenerator as C, InterpolateColorGenerator as I, StanzaColorGenerator as S, getGradationColor as a, StanzaCirculateColorGenerator as b, getStanzaInterpolateColor as g };
//# sourceMappingURL=ColorGenerator-697f5146.js.map
