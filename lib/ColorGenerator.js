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

//Parent class for stanza
export class StanzaColorGenerator {
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
export class StanzaCirculateColorGenerator extends StanzaColorGenerator {
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
    this.groupColor = d3.scaleOrdinal().domain(groups).range(colorRange);
  }

  get defaultColor() {
    return this.firstColor;
  }

  getColor(datum) {
    return this.groupColor(datum);
  }
}

//Generate color scheme for gradation pattern
export function getGradationColor(self, colorRange) {
  /**
   * @param {HTMLElement} self - Information of the stanza
   * @param {array} colorRange - Array of minimum, middle and maximum colors
   */

  let colors = StanzaColorGenerator.getColorSeries(self).stanzaColors;
  //With and without color specification
  if (colorRange !== undefined) {
    colorRange = colorRange.filter(Boolean);
    if (colorRange.length === 2 || colorRange.length === 3) {
      colors = colorRange.filter(Boolean);
    }
  }

  // Define color scale
  // const unit = 1 / (colors.length - 1);
  // const domain = [...Array(colors.length)].map((_, index) => index * unit);

  // return d3.scaleLinear().domain(domain).range(colors);

  //cord-diagram用circulate
  return d3.scaleOrdinal().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).range(colors);

  //stanzaColorすべての場合 interpolate
  // const i0 = d3.interpolate(colors[0], colors[1]);
  // const i1 = d3.interpolate(colors[1], colors[2]);
  // const i2 = d3.interpolate(colors[2], colors[3]);
  // const i3 = d3.interpolate(colors[3], colors[4]);
  // const i4 = d3.interpolate(colors[4], colors[5]);
  // return d3
  //   .scaleSequential(function (t) {
  //     if (t < 1 / colors.length) {
  //       return i0(2 * t);
  //     } else if (t < (1 / colors.length) * 2) {
  //       return i1(2 * t - (1 / colors.length) * 2);
  //     } else if (t < (1 / colors.length) * 3) {
  //       return i2(2 * t - (1 / colors.length) * 3);
  //     } else if (t < (1 / colors.length) * 4) {
  //       return i3(2 * t - (1 / colors.length) * 4);
  //     } else {
  //       return i4(2 * t - 0.5);
  //     }
  //   })
  //   .domain([0, 10]);

  // rgb(101, 144, 230);
  // rgb(92, 155, 220);
  // rgb(65, 202, 173);
  // rgb(85, 207, 146);
  // rgb(184, 221, 63);
  // rgb(245, 188, 97);
  // rgb(245, 169, 95);
  // rgb(246, 112, 102);
  // rgb(246, 104, 107);
  // rgb(247, 97, 113);
  // rgb(247, 89, 118);

  //3色の場合 interpolate
  // const ti0 = d3.interpolate(colors[0], colors[3]);
  // const ti1 = d3.interpolate(colors[3], colors[5]);
  // return d3
  //   .scaleSequential(function (t) {
  //     return t < 0.5 ? ti0(2 * t) : ti1(2 * (t - 0.5));
  //   })
  //   .domain([0, 10]);

  // console.log(test(0));
  // console.log(test(1));
  // console.log(test(2));
  // console.log(test(3));
  // console.log(test(4));
  // console.log(test(5));
  // console.log(test(6));
  // console.log(test(7));
  // console.log(test(8));
  // console.log(test(9));
  // console.log(test(10));

  // rgb(101, 144, 230);
  // rgb(130, 159, 204);
  // rgb(159, 174, 178);
  // rgb(187, 188, 152);
  // rgb(216, 203, 126);
  // rgb(245, 218, 100);
  // rgb(245, 192, 104);
  // rgb(246, 166, 107);
  // rgb(246, 141, 111);
  // rgb(247, 115, 114);
  // rgb(247, 89, 118);
}

export function StanzaInterpolateColorGenerator(colorNum) {
  /**
   * @param {number} colorNum - Number of colors
   */
  //Generate color scheme for interpolate pattern
  return function (index) {
    return `hsl(${(1 / colorNum) * index}turn, 70%, 60%)`;
  };
}
