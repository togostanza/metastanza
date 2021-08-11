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

    // const part3Texts = this.root.querySelectorAll('.part3'); //TODO vennTextSet3_0〜をこちらの配列に置き換えてもいいかも（要順番）
    const part3Paths = this.root.querySelectorAll('.part3'); //TODO vennShapeSet3_0〜をこちらの配列に置き換えてもいいかも（要順番）
    const vennSet3Arr = ['3-0','3-1','3-2','3-0_1','3-0_2','3-1_2','3-0_1_2' ];
    
    const tooltip = d3.select(fixedArea)
      .append('div')
      .attr('class', 'fixed-tooltip');

    function highlightParts(targetElm, label, count){
      d3.select(targetElm)
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
          Array.from(part3Paths).forEach((path,i) =>{
            targetElm.id === `venn-shape-set${vennSet3Arr[i]}` ? path.dataset.highlight = "selected" :  path.dataset.highlight = "unselected";
          });
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
          Array.from(part3Paths).forEach(path =>{
            path.dataset.highlight = "default";
          });
        });
    }

    dataset.forEach(data => {
      const orgArray = data.orgs.split(', ');
      const doesIncludeLabel0 = orgArray.includes(LABEL0); //boolean
      const doesIncludeLabel1 = orgArray.includes(LABEL1); //boolean
      const doesIncludeLabel2 = orgArray.includes(LABEL2); //boolean

      if (doesIncludeLabel0 && doesIncludeLabel1 && doesIncludeLabel2) {
        highlightParts(vennShapeSet3_0_1_2, data.orgs, data.count);
        highlightParts(vennTextSet3_0_1_2, data.orgs, data.count);
        vennTextSet3_0_1_2.textContent = data.count;
      } else if (doesIncludeLabel0 && doesIncludeLabel1) {
        highlightParts(vennShapeSet3_0_1, data.orgs, data.count);
        highlightParts(vennTextSet3_0_1, data.orgs, data.count);
        vennTextSet3_0_1.textContent = data.count;
      } else if (doesIncludeLabel1 && doesIncludeLabel2) {
        highlightParts(vennShapeSet3_1_2, data.orgs, data.count);
        highlightParts(vennTextSet3_1_2, data.orgs, data.count);
        vennTextSet3_0_2.textContent = data.count;
      } else if (doesIncludeLabel0 && doesIncludeLabel2) {
        highlightParts(vennShapeSet3_0_2, data.orgs, data.count);
        highlightParts(vennTextSet3_0_2, data.orgs, data.count);
        vennTextSet3_1_2.textContent = data.count;
      } else if (doesIncludeLabel0) {
        highlightParts(vennShapeSet3_0, data.orgs, data.count);
        highlightParts(vennTextSet3_0, data.orgs, data.count);
        vennTextSet3_0.textContent = data.count;
      } else if (doesIncludeLabel1) {
        highlightParts(vennShapeSet3_1, data.orgs, data.count);
        highlightParts(vennTextSet3_1, data.orgs, data.count);
        vennTextSet3_1.textContent = data.count;
      } else if (doesIncludeLabel2) {
        highlightParts(vennShapeSet3_2, data.orgs, data.count);
        highlightParts(vennTextSet3_2, data.orgs, data.count);
        vennTextSet3_2.textContent = data.count;
      };
    })
  }
}
