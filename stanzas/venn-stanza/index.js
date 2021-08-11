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

    //set common parameters and styles
    const width = this.params['width'];
    const height = this.params['height'];
    const colorScheme = [
      css('--togostanza-series-0-color'),
      css('--togostanza-series-1-color'),
      css('--togostanza-series-2-color'),
      css('--togostanza-series-3-color'),
      css('--togostanza-series-4-color'),
      css('--togostanza-series-5-color')
    ];

    // draw size-reflected venn diagram
    vennJs(this.root, this.params, css, sets, width, height, colorScheme, css);

    // draw fixed venn diagram
    const fixedArea = this.root.querySelector('#fixed');
    const fixedElement = this.root.querySelector('#venn-diagrams');
    const fixedSvg = d3.select(fixedElement);
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

    //get paths(=venn shapes) and texts(=venn labels), and these nodelists are listed in vennSet3Arr's orger
    const part3Paths = this.root.querySelectorAll('.part3-path');
    const part3Texts = this.root.querySelectorAll('.part3-text');
    const vennSet3Arr = ['3-0', '3-1', '3-2', '3-0_1', '3-0_2', '3-1_2', '3-0_1_2'];

    //set tooltip for fixed venn
    const tooltip = d3.select(fixedArea)
      .append('div')
      .attr('class', 'fixed-tooltip');

    //function: set highlight event which fire when hovered
    function highlightParts(targetElm, label, count) {
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
              <p>Count: ${count}</p>
              `);
          //highlight the selected part
          for (let i = 0; i < vennSet3Arr.length; i++) {
            if (targetElm.id === `venn-shape-set${vennSet3Arr[i]}` || targetElm.id === `venn-text-set${vennSet3Arr[i]}`) {
              part3Paths[i].dataset.highlight = "selected";
              part3Texts[i].dataset.highlight = "selected";
            } else {
              part3Paths[i].dataset.highlight = "unselected";
              part3Texts[i].dataset.highlight = "unselected";
            }
          }
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
          Array.from(part3Paths).forEach(path => {
            path.dataset.highlight = "default";
          });
          Array.from(part3Texts).forEach(text => {
            text.dataset.highlight = "default";
          });
        });
    }

    //set highlight event and count labels to each parts
    dataset.forEach(data => {
      const orgArray = data.orgs.split(', ');
      const hasLabel0 = orgArray.includes(LABEL0); //boolean
      const hasLabel1 = orgArray.includes(LABEL1); //boolean
      const hasLabel2 = orgArray.includes(LABEL2); //boolean

      if (hasLabel0 && hasLabel1 && hasLabel2) { //3-0_1_2 (=vennSet3Arr[6])
        highlightParts(part3Paths[6], data.orgs, data.count);
        highlightParts(part3Texts[6], data.orgs, data.count);
        part3Texts[6].textContent = data.count;
      } else if (hasLabel0 && hasLabel1) { //3-0_1 (=vennSet3Arr[3])
        highlightParts(part3Paths[3], data.orgs, data.count);
        highlightParts(part3Texts[3], data.orgs, data.count);
        part3Texts[3].textContent = data.count;
      } else if (hasLabel1 && hasLabel2) { //3-1_2 (=vennSet3Arr[5])
        highlightParts(part3Paths[5], data.orgs, data.count);
        highlightParts(part3Texts[5], data.orgs, data.count);
        part3Texts[5].textContent = data.count;
      } else if (hasLabel0 && hasLabel2) { //3-0_2 (=vennSet3Arr[4])
        highlightParts(part3Paths[4], data.orgs, data.count);
        highlightParts(part3Texts[4], data.orgs, data.count);
        part3Texts[4].textContent = data.count;
      } else if (hasLabel0) { //3-0 (=vennSet3Arr[0])
        highlightParts(part3Paths[0], data.orgs, data.count);
        highlightParts(part3Texts[0], data.orgs, data.count);
        part3Texts[0].textContent = data.count;
      } else if (hasLabel1) { //3-1 (=vennSet3Arr[1])
        highlightParts(part3Paths[1], data.orgs, data.count);
        highlightParts(part3Texts[1], data.orgs, data.count);
        part3Texts[1].textContent = data.count;
      } else if (hasLabel2) { //3-1 (=vennSet3Arr[2])
        highlightParts(part3Paths[2], data.orgs, data.count);
        highlightParts(part3Texts[2], data.orgs, data.count);
        part3Texts[2].textContent = data.count;
      };
    })
  }
}
