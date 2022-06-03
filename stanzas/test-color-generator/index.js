import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import Color from "color";
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
    this.colorSeries = this.getColorSeries();

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

  // drawVennDiagram() {
  //   return;
  //   // set common parameters and styles
  //   const container = this.root.querySelector("#venn-diagrams");
  //   const svgWidth = this.params["width"];
  //   const svgHeight = this.params["height"];
  //   container.style.width = svgWidth + "px";
  //   container.style.height = svgHeight + "px";

  //   // show venn diagram corresponds to data(circle numbers to draw)
  //   const selectedDiagram = this.root.querySelector(
  //     `.venn-diagram[data-number-of-data="${this.numberOfData}"]`
  //   );
  //   if (!selectedDiagram) {
  //     console.error(
  //       "Venn diagrams with more than six elements are not supported. Please try using Euler diagrams."
  //     );
  //     return;
  //   }
  //   selectedDiagram.classList.add("-current");
  //   this.venn.set("node", selectedDiagram);

  //   // set scale
  //   const containerRect = this.root
  //     .querySelector("main")
  //     .getBoundingClientRect();
  //   const rect = selectedDiagram.getBoundingClientRect();
  //   const margin = Math.max(rect.x - containerRect.x, rect.y - containerRect.y);
  //   const scale = Math.min(
  //     svgWidth / (rect.width + margin * 2),
  //     svgHeight / (rect.height + margin * 2)
  //   );
  //   selectedDiagram.setAttribute("transform", `scale(${scale})`);
  //   const labelFontSize = +window
  //     .getComputedStyle(this.element)
  //     .getPropertyValue("--togostanza-label-font-size")
  //     .trim();
  //   selectedDiagram.querySelectorAll("text").forEach((text) => {
  //     text.style.fontSize = labelFontSize / scale + "px";
  //   });

  //   // shapes
  //   selectedDiagram.querySelectorAll(":scope > g").forEach((group) => {
  //     const targets = group.dataset.targets.split(",").map((target) => +target);
  //     const labels = targets.map((target) => this.dataLabels[target]);
  //     const count =
  //       this.data.find((datum) => {
  //         return (
  //           datum.set.length === labels.length &&
  //           labels.every((label) =>
  //             datum.set.find((label2) => label === label2)
  //           )
  //         );
  //       })?.size ?? "";
  //     // set color
  //     const color = this.getBlendedColor(targets);
  //     group
  //       .querySelector(":scope > .part")
  //       .setAttribute("fill", color.toString());
  //     // set label
  //     group.querySelector(":scope > text.label").textContent = labels.join(",");
  //     group.querySelector(":scope > text.value").textContent = count;
  //   });

  // }

  getColorSeries() {
    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map((variable) => getPropertyValue(variable).trim());
  }

  // getBlendedColor(targets) {
  //   let blendedColor = Color(this.colorSeries[targets[0]]);
  //   targets.forEach((target, index) => {
  //     if (index > 0) {
  //       blendedColor = blendedColor.mix(
  //         Color(this.colorSeries[target]),
  //         1 / (index + 1)
  //       );
  //     }
  //   });
  //   const ratio = (targets.length - 1) / (this.numberOfData - 1);
  //   switch (this.params["blend-mode"]) {
  //     case "multiply":
  //       blendedColor = blendedColor.saturate(ratio);
  //       blendedColor = blendedColor.darken(ratio * 0.5);
  //       break;
  //     case "screen":
  //       blendedColor = blendedColor.saturate(ratio);
  //       blendedColor = blendedColor.lighten(ratio * 0.5);
  //       break;
  //   }
  //   return blendedColor;
  // }

  // async getData() {
  //   const data = await loadData(
  //     this.params["data-url"],
  //     this.params["data-type"],
  //     this.root.querySelector("main")
  //   );
  //   // // processing
  //   // for (const datum of data) {
  //   //   datum.orgs = datum.orgs.split(', ');
  //   //   datum.count = Number(datum.count);
  //   // }
  //   return data;
  // }
}
