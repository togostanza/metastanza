import * as d3 from "d3";
import Stanza from "togostanza/stanza";
import {
  InterpolateColorGenerator,
  CirculateColorGenerator,
  StanzaColorGenerator,
} from "@/lib/ColorGenerator";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
  downloadTSVMenuItem,
  appendCustomCss,
} from "togostanza-utils";

const CIRCULATE = "circulate";
const INTERPOLATE = "interpolate";

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

    const colorChips = this.root.querySelector("#color-chips");

    // get parameters
    const numOfGradation = this.params["number-of-gradation"];
    const colorCirculation = this.params["type-of-color-circulation"];
    const colorDomain = this.params["color-domain"]
      ? this.params["color-domain"].split(",").map((pos) => +pos)
      : "";
    const colorRange = this.params["color-range"].split(",");
    const numOfMakeColor = this.params["number-of-make-color"];
    let d3ColorScheme = this.params["color-scheme"];
    let colors = [],
      colorGenerator;

    if (d3ColorScheme.indexOf("(") !== -1) {
      d3ColorScheme = d3ColorScheme.substr(0, d3ColorScheme.indexOf(" ("));
    }

    const USER_SPECIFIED =
      colorDomain.length !== 1 &&
      colorRange.length !== 1 &&
      colorDomain.length === colorRange.length;
    const RANGE_HAS_CHARACTER = colorRange[0].length;
    const SCHEME_IS_CATEGORICAL = d3ColorScheme.indexOf("Categorical-") !== -1;
    const SCHEME_IS_CONTINUOUS = d3ColorScheme.indexOf("Continuous-") !== -1;
    const CUSTOM = d3ColorScheme === "Custom";
    const stanzaColors = new StanzaColorGenerator(this).stanzaColor;

    const circulateColorGenerate = (prefix, pattern) => {
      d3ColorScheme = d3ColorScheme.replace(`${prefix}-`, "");
      colors = getColorsWithD3PresetColor(
        `${pattern}${d3ColorScheme}`,
        numOfGradation
      );
      colorGenerator = new CirculateColorGenerator(colors);
    };

    //Switching color patterns based on params "color-scheme" "number-of-gradation"
    function getColorsWithD3PresetColor(d3PresetColor, numberOfGradation) {
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

    //Switch between when colorCirculation is "circulate" and when it is "interpolate"
    switch (colorCirculation) {
      case CIRCULATE:
        switch (true) {
          case USER_SPECIFIED:
            colorGenerator = new CirculateColorGenerator(
              colorRange,
              colorDomain,
              numOfMakeColor
            );
            break;

          case RANGE_HAS_CHARACTER:
            colorGenerator = new CirculateColorGenerator(colorRange);
            break;

          case SCHEME_IS_CATEGORICAL:
            circulateColorGenerate("Categorical", "scheme");
            if (CUSTOM) {
              colors = stanzaColors;
              colorGenerator = new CirculateColorGenerator(colors);
            }
            break;

          case SCHEME_IS_CONTINUOUS:
            circulateColorGenerate("Continuous", "interpolate");
        }
        break;

      case INTERPOLATE:
        switch (true) {
          case USER_SPECIFIED:
            colorGenerator = new InterpolateColorGenerator(
              colorRange,
              colorDomain
            );
            break;

          case SCHEME_IS_CATEGORICAL:
            d3ColorScheme = d3ColorScheme.replace("Categorical-", "");
            if (CUSTOM) {
              colors = stanzaColors;
              colorGenerator = new InterpolateColorGenerator(colors);
            } else {
              colors = getColorsWithD3PresetColor(
                `scheme${d3ColorScheme}`,
                numOfGradation
              );
              colorGenerator = new InterpolateColorGenerator(colors);
            }
            break;

          case SCHEME_IS_CONTINUOUS:
            d3ColorScheme = d3ColorScheme.replace("Continuous-", "");
            colors = getColorsWithD3PresetColor(
              `interpolate${d3ColorScheme}`,
              numOfGradation
            );
            colorGenerator = new InterpolateColorGenerator(colors);
            break;
        }
        break;
    }

    switch (colorCirculation) {
      case CIRCULATE:
        colorChips.innerHTML = [...Array(numOfGradation)]
          .map((_, index) => {
            return `<li data-pos="${index}" style="background: ${colorGenerator.get(
              index
            )}"></li>`;
          })
          .join("");
        break;

      case INTERPOLATE:
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

  // getColorSeries() {
  //   const getPropertyValue = (key) =>
  //     window.getComputedStyle(this.element).getPropertyValue(key);
  //   const series = Array(6);
  //   for (let i = 0; i < series.length; i++) {
  //     series[i] = `--togostanza-series-${i}-color`;
  //   }
  //   return series.map((variable) => getPropertyValue(variable).trim());
  // }
}
