import Stanza from "togostanza/stanza";
import { ColorGenerator, getColorSeries } from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

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

    this.renderTemplate({ template: "stanza.html.hbs" });

    const colorChips = this.root.querySelector('#color-chips');

    // get parameters
    const numOfGradation = this.params['number-of-gradation'];
    const colorCirculation = this.params['type-of-color-circulation'];
    const colorDomain = this.params['color-domain'].split(',').map(pos => +pos);
    const colorRange = this.params['color-range'].split(',');

    let d3ColorScheme = this.params['color-scheme'];

    let colors = [], colorGenerator;
    // 括弧を取り去る
    if (d3ColorScheme.indexOf("(") !== -1) {
      d3ColorScheme = d3ColorScheme.substr(0, d3ColorScheme.indexOf(" ("));
    }

    if (colorDomain.length && colorDomain.length === colorRange.length) {
      colorGenerator = new ColorGenerator({
        domain: colorDomain,
        range: colorRange
      }, colorCirculation, numOfGradation);
    } else if (d3ColorScheme.indexOf("Categorical-") !== -1){
      // categorical
      d3ColorScheme = d3ColorScheme.replace("Categorical-", "");
      if (d3ColorScheme === 'Custom') {
        colors = getColorSeries(this);
        colorGenerator = new ColorGenerator(colors, colorCirculation, numOfGradation);
      } else {
        colorGenerator = new ColorGenerator(`scheme${d3ColorScheme}`, colorCirculation, numOfGradation);
      }
    } else {
      // continuous
      d3ColorScheme = d3ColorScheme.replace("Continuous-", "");
      colorGenerator = new ColorGenerator(`interpolate${d3ColorScheme}`, colorCirculation, numOfGradation);
    }

    switch (colorCirculation) {
      case 'circulate':
        colorChips.innerHTML = [...Array(numOfGradation)].map((_, index) => {
          return `<li data-pos="${index}" style="background: ${colorGenerator.get(index)}"></li>`
        }).join('');
        break;

      case 'interpolate': {
        const unit = 1 / (numOfGradation - 1);
        colorChips.innerHTML = [...Array(numOfGradation)].map((_, index) => {
          return `<li data-pos="${index * unit}" style="background: ${colorGenerator.get(index * unit)}"></li>`
        }).join('');
      }
        break;
    }

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
