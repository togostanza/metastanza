import Stanza from 'togostanza/stanza';
import loadData from "@/lib/load-data";
import { vennJs } from "./vennJs.js";
import * as d3 from "d3";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "@/lib/metastanza_utils.js";

export default class VennStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "vennstanza"),
      downloadPngMenuItem(this, "vennstanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);
    // // TogoGenome's data structure exclusive
    // let sets = [
    //   { sets: ['A'], size: 52 },
    //   { sets: ['B'], size: 73 },
    //   { sets: ['C'], size: 183 },
    //   { sets: ['A', 'B'], size: 9 },
    //   { sets: ['B', 'C'], size: 20 },
    //   { sets: ['A', 'C'], size: 591 },
    //   { sets: ['A','B', 'C'], size: 5568 },
    // ];

    // Venn.js usable data
    let sets = [
      { sets: ['A'], size: 6241 },
      { sets: ['B'], size: 5670 },
      { sets: ['C'], size: 6362 },
      { sets: ['A', 'B'], size: 9 + 5568 },
      { sets: ['B', 'C'], size: 20 + 5568 },
      { sets: ['A', 'C'], size: 591 + 5568 },
      { sets: ['A', 'B', 'C'], size: 5568 },
    ];

    //get data
    let dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    //convert data to use venn.js
    let str = JSON.stringify(dataset).replace(/\"orgs\":/g, "\"sets\":").replace(/\"count\":/g, "\"size\":");
    let json = JSON.parse(str);
    for (let i = 0; i < json.length; i++) {
      json[i].sets = json[i].sets.split(', ');
      json[i].size = Number(json[i].size);
    }
    // const sets = json;

    this.renderTemplate(
      {
        template: 'stanza.html.hbs',
        parameters: {
          greeting: `Hello, ${this.params['say-to']}!`
        }
      }
    );

    const width = this.params['width'];
    const height = this.params['height'];

    //set color scheme
    const colorScheme = [
      css('--togostanza-series-0-color'),
      css('--togostanza-series-1-color'),
      css('--togostanza-series-2-color'),
      css('--togostanza-series-3-color'),
      css('--togostanza-series-4-color'),
      css('--togostanza-series-5-color')
    ];

    vennJs(this.root, this.params, css, sets, width, height, colorScheme, css);

    // const fixedChart = venn.VennDiagram();
    const fixedArea = this.root.querySelector('#fixed');
    const fixedElement = this.root.querySelector('#venn-diagrams');
    const fixedSvg = d3.select(fixedElement);

    // draw fixed venn diagram svg
    fixedSvg
      .attr('width', width)
      .attr('height', height);

    // get how many circles to draw
    let setsNums = [];
    for (let i = 0; i < sets.length; i++) {
      setsNums.push(sets[i].sets.length);
    }
    const aryMax = function (a, b) { return Math.max(a, b); }
    let circleNum = setsNums.reduce(aryMax);

    // show venns corresponds to data(circle numbers to draw)
    const vennDiagrams = this.root.querySelectorAll('.venn-diagram');
    Array.from(vennDiagrams).forEach((vennDiagram, i) => {
      vennDiagram.getAttribute('id') === `venn-diagram${circleNum}` ? vennDiagram.style.display = "block" : vennDiagram.style.display = "none";
    })

    // assign labels to each circles
    const LABEL0 = "10090"; // set as parameter by user: required
    const LABEL1 = "7955"; // set as parameter by user: required
    const LABEL2 = "9606"; // set as parameter by user: required

    const vennTextSet3_0 = this.root.querySelector('#venn-text-set3-0');
    const vennTextSet3_1 = this.root.querySelector('#venn-text-set3-1');
    const vennTextSet3_2 = this.root.querySelector('#venn-text-set3-2');
    const vennTextSet3_0_1 = this.root.querySelector('#venn-text-set3-0_1');
    const vennTextSet3_0_2 = this.root.querySelector('#venn-text-set3-0_2');
    const vennTextSet3_1_2 = this.root.querySelector('#venn-text-set3-1_2');
    const vennTextSet3_0_1_2 = this.root.querySelector('#venn-text-set3-0_1_2');

    const vennShapeSet3_0 = this.root.querySelector('#venn-shape-set3-0');
    const vennShapeSet3_1 = this.root.querySelector('#venn-shape-set3-1');
    const vennShapeSet3_2 = this.root.querySelector('#venn-shape-set3-2');
    const vennShapeSet3_0_1 = this.root.querySelector('#venn-shape-set3-0_1');
    const vennShapeSet3_0_2 = this.root.querySelector('#venn-shape-set3-0_2');
    const vennShapeSet3_1_2 = this.root.querySelector('#venn-shape-set3-1_2');
    const vennShapeSet3_0_1_2 = this.root.querySelector('#venn-shape-set3-0_1_2');
    
    const tooltip = d3.select(fixedArea)
      .append('div')
      .attr('class', 'fixed-tooltip');

    const vennDiagram3Group = this.root.querySelector('#venn-diagram3');
    console.log('vennDiagram3Group',vennDiagram3Group)
    console.log("d3.select(vennDiagram3Group)",d3.select(vennDiagram3Group));
    // console.log("d3.select(vennDiagram3Group).selectorAll('.part3')",d3.select(vennDiagram3Group).selectAll('.part3').append('text'));

    function showTooltip(target, label, count){
      d3.select(target)
        // .selectAll('.part3')
        .on("mouseover", function (e) {
          tooltip
            .style("display", "block")
            .style("left", `${d3.pointer(e)[0] + 8}px`)
            .style(
              "top",
              `${d3.pointer(e)[1]}px`
            ).html(`
              <p>Organisms: ${label}</p>
              <p>Label: ${count}</p>
              `);
        })
        .on("mousemove", function (e) {
          tooltip
            .style("left", `${d3.pointer(e)[0] + 8}px`)
            .style(
              "top",
              `${d3.pointer(e)[1]}px`
            )
        })
        .on("mouseout", function () {
          tooltip.style("display", "none");
        });
    }

    dataset.forEach(data => {
      const orgArray = data.orgs.split(', ');
      const doesIncludeLabel0 = orgArray.includes(LABEL0);
      const doesIncludeLabel1 = orgArray.includes(LABEL1);
      const doesIncludeLabel2 = orgArray.includes(LABEL2);
      if (doesIncludeLabel0 && doesIncludeLabel1 && doesIncludeLabel2) {
        showTooltip(vennShapeSet3_0_1_2, data.orgs, data.count);
        showTooltip(vennTextSet3_0_1_2, data.orgs, data.count);
        vennTextSet3_0_1_2.textContent = data.count;
      } else if (doesIncludeLabel0 && doesIncludeLabel1) {
        showTooltip(vennShapeSet3_0_1, data.orgs, data.count);
        showTooltip(vennTextSet3_0_1, data.orgs, data.count);
        vennTextSet3_0_1.textContent = data.count;
      } else if (doesIncludeLabel1 && doesIncludeLabel2) {
        showTooltip(vennShapeSet3_1_2, data.orgs, data.count);
        showTooltip(vennTextSet3_1_2, data.orgs, data.count);
        vennTextSet3_0_2.textContent = data.count;
      } else if (doesIncludeLabel0 && doesIncludeLabel2) {
        showTooltip(vennShapeSet3_0_2, data.orgs, data.count);
        showTooltip(vennTextSet3_0_2, data.orgs, data.count);
        vennTextSet3_1_2.textContent = data.count;
      } else if (doesIncludeLabel0) {
        showTooltip(vennShapeSet3_0, data.orgs, data.count);
        showTooltip(vennTextSet3_0, data.orgs, data.count);
        vennTextSet3_0.textContent = data.count;
      } else if (doesIncludeLabel1) {
        showTooltip(vennShapeSet3_1, data.orgs, data.count);
        showTooltip(vennTextSet3_1, data.orgs, data.count);
        vennTextSet3_1.textContent = data.count;
      } else if (doesIncludeLabel2) {
        showTooltip(vennShapeSet3_2, data.orgs, data.count);
        showTooltip(vennTextSet3_2, data.orgs, data.count);
        vennTextSet3_2.textContent = data.count;
      };
    })
  }
}
