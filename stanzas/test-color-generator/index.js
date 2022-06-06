import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import Color from "color";
import { ColorGenerator, getColorSeries } from "@/lib/ColorGenerator";
import * as d3 from "d3";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";
// import ToolTip from "@/lib/ToolTip";
// import Legend from "@/lib/Legend";

export default class TestColorGenerator extends Stanza {
  // colorSeries;
  // data;
  // totals;
  // dataLabels;
  // numberOfData;
  // venn;

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
    this.colorSeries = getColorSeries(this);
    console.log(this.colorSeries)

    this.renderTemplate({ template: "stanza.html.hbs" });

    const colorChips = this.root.querySelector('#color-chips');

    // get parameters
    const numOfGradation = this.params['number-of-gradation'];
    const colorCirculation = this.params['type-of-color-circulation'];
    let d3ColorScheme = this.params['color-scheme'];
    let colors = [];
    if (d3ColorScheme.indexOf("(") !== -1) {
      d3ColorScheme = d3ColorScheme.substr(0, d3ColorScheme.indexOf(" ("));
    }
    
    if (d3ColorScheme.indexOf("Categorical-") !== -1){
      d3ColorScheme= d3ColorScheme.replace("Categorical-", "");
      if (d3ColorScheme === 'Custom') {
        for (let i = 0; i < 6; i++) {
          colors.push(
            window.getComputedStyle(this.element).getPropertyValue(`--togostanza-series-${i}-color`).trim()
          )
        }
      } else {
        colors = [...d3[ `scheme${d3ColorScheme}` ]];
      }
    } else {
      d3ColorScheme = d3ColorScheme.replace("Continuous-", "");
      const makeColor = d3[`interpolate${d3ColorScheme}`];
      for (let i = 0; i < numOfGradation; i++){
        colors.push(makeColor(i / (numOfGradation - 1)));
      }
    }

    let domain, colorScale;
    const unit = 1 / colors.length;
    switch(colorCirculation) {
      case 'circulate':
        domain = [...Array(colors.length)].map((_, index) => index * unit);
        colorScale = d3.scaleOrdinal()
          .domain(domain)
          .range(colors);
        break;
      case 'interpolate':
        domain = [...Array(colors.length)].map((_, index) =>  numOfGradation / colors.length * index * unit);
        colorScale = d3.scaleLinear()
          .domain(domain)
          .range(colors);
        break;
    }

    colorChips.innerHTML = [...Array(numOfGradation)].map((_, index) => {
      return `<li style="background: ${colorScale(index * unit)}"></li>`
    }).join('');
  }

  getColorSeries() {
    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map((variable) => getPropertyValue(variable).trim());
  }


}
