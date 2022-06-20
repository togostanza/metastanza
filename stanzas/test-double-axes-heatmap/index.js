import Stanza from "togostanza/stanza";
import {
  InterpolateColorGenerator,
  CirculateColorGenerator,
  getColorSeries,
  getColorsWithD3PresetColor,
} from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import * as d3 from "d3";
import p5 from 'p5';

export default class TestColorGenerator extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "TestColorGenerator"),
      downloadPngMenuItem(this, "TestColorGenerator"),
      downloadJSONMenuItem(this, "TestColorGenerator", this.data),
      downloadCSVMenuItem(this, "TestColorGenerator", this.data),
      downloadTSVMenuItem(this, "TestColorGenerator", this.data),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const data = await d3.json(
      './test-double-axes-heatmap/assets/climate.json', 
      (data) => data);
    console.log(data)

    // data
    const temperatures = [], rainfalls = [], sunshineHours = [];
    data.forEach(classification => {
      classification.climates.forEach(climate => {
        temperatures.push(...climate.temperatures);
        rainfalls.push(...climate.rainfalls);
        sunshineHours.push(...climate.sunshine_hours);
      })
    });
    // console.log(temperatures)
    // console.log(rainfalls)
    // console.log(sunshineHours)
    const temperatureScale = d3
      .scaleLinear()
      .range([240, 0])
      .domain(d3.extent(temperatures));
    const rainfallScale = d3
      .scaleLinear()
      .range([100, 25])
      .domain(d3.extent(rainfalls));
    const sunshineHoursScale = d3
      .scaleLinear()
      .range([25, 100])
      .domain(d3.extent(sunshineHours));

    this.renderTemplate({ template: 'stanza.html.hbs' });

    // draw
    const p = new p5();
    this.root.querySelector('#table').innerHTML = `
      ${data.map(classification => {
        const th = `<th rowspan="${classification.climates.length}">${classification.label}</th>`;
        return `<tbody>
          ${classification.climates.map((climate, index) => {
            return `<tr>
              ${index === 0 ? th : ''}
              <th>${climate.city}</th>
              ${climate.temperatures.map((_, index) => {
                console.log(climate.temperatures[index], climate.rainfalls[index], climate.sunshine_hours[index])
                const color = `hsb(${
                  Math.round(temperatureScale(climate.temperatures[index]))
                  // hue
                }, ${
                  rainfallScale(climate.rainfalls[index])
                }%, ${
                  sunshineHoursScale(climate.sunshine_hours[index])
                }%)`;
                return `<td style="background: ${
                  p.color(color).toString()
                }"></td>`;
              }).join('')}
            </tr>`;
          }).join('')}
        </tbody>`;
      }).join('')}
    `;

    return;

    const colorChips = this.root.querySelector("#color-chips");

    // get parameters
    const numOfGradation = this.params["number-of-gradation"];
    const colorCirculation = this.params["type-of-color-circulation"];
    const colorDomain = this.params["color-domain"]
      ? this.params["color-domain"].split(",").map((pos) => +pos)
      : "";
    const colorRange = this.params["color-range"].split(",");
    const NumOfMakeColor = this.params["number-of-make-color"];
    let d3ColorScheme = this.params["color-scheme"];
    let colors = [],
      colorGenerator;

    if (d3ColorScheme.indexOf("(") !== -1) {
      d3ColorScheme = d3ColorScheme.substr(0, d3ColorScheme.indexOf(" ("));
    }

    if (colorCirculation === "interpolate") {
      if (
        colorDomain.length !== 1 &&
        colorRange.length !== 1 &&
        colorDomain.length === colorRange.length
      ) {
        colorGenerator = new InterpolateColorGenerator(colorRange, colorDomain);
      } else if (d3ColorScheme.indexOf("Categorical-") !== -1) {
        // categorical
        d3ColorScheme = d3ColorScheme.replace("Categorical-", "");
        if (d3ColorScheme === "Custom") {
          colors = getColorSeries(this);
          colorGenerator = new InterpolateColorGenerator(colors, undefined);
        } else {
          const colors = getColorsWithD3PresetColor(
            `scheme${d3ColorScheme}`,
            numOfGradation
          );
          colorGenerator = new InterpolateColorGenerator(colors, undefined);
        }
      } else {
        // continuous
        d3ColorScheme = d3ColorScheme.replace("Continuous-", "");
        const colors = getColorsWithD3PresetColor(
          `interpolate${d3ColorScheme}`,
          numOfGradation
        );
        colorGenerator = new InterpolateColorGenerator(colors, undefined);
      }
    } else {
      if (
        colorDomain.length !== 1 &&
        colorRange.length !== 1 &&
        colorDomain.length === colorRange.length
      ) {
        colorGenerator = new CirculateColorGenerator(
          colorRange,
          colorDomain,
          NumOfMakeColor
        );
      } else if (colorRange[0].length) {
        colorGenerator = new CirculateColorGenerator(colorRange, undefined);
      } else if (d3ColorScheme.indexOf("Categorical-") !== -1) {
        // categorical
        d3ColorScheme = d3ColorScheme.replace("Categorical-", "");
        if (d3ColorScheme === "Custom") {
          colors = getColorSeries(this);
          colorGenerator = new CirculateColorGenerator(colors, undefined);
        } else {
          const colors = getColorsWithD3PresetColor(
            `scheme${d3ColorScheme}`,
            numOfGradation
          );
          colorGenerator = new CirculateColorGenerator(colors, undefined);
        }
      } else {
        // continuous
        d3ColorScheme = d3ColorScheme.replace("Continuous-", "");
        const colors = getColorsWithD3PresetColor(
          `interpolate${d3ColorScheme}`,
          numOfGradation
        );
        colorGenerator = new CirculateColorGenerator(colors, undefined);
      }
    }

    switch (colorCirculation) {
      case "circulate":
        colorChips.innerHTML = [...Array(numOfGradation)]
          .map((_, index) => {
            return `<li data-pos="${index}" style="background: ${colorGenerator.get(
              index
            )}"></li>`;
          })
          .join("");
        break;

      case "interpolate":
        {
          const unit = 1 / (numOfGradation - 1);
          colorChips.innerHTML = [...Array(numOfGradation)]
            .map((_, index) => {
              return `<li data-pos="${
                index * unit
              }" style="background: ${colorGenerator.get(index * unit)}"></li>`;
            })
            .join("");
        }
        break;
    }
  }

}
