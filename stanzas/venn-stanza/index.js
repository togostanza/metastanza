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
      { sets: ['10090'], size: 6241 },
      { sets: ['7955'], size: 5670 },
      { sets: ['9606'], size: 6362 },
      { sets: ['10090', '7955'], size: 9 + 5568 },
      { sets: ['7955', '9606'], size: 20 + 5568 },
      { sets: ['10090', '9606'], size: 591 + 5568 },
      { sets: ['10090', '7955', '9606'], size: 5568 },
    ];

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

    //get data
    let dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    // //convert data to use venn.js
    // let str = JSON.stringify(dataset).replace(/\"orgs\":/g, "\"sets\":").replace(/\"count\":/g, "\"size\":");
    // let json = JSON.parse(str);
    // for (let i = 0; i < json.length; i++) {
    //   json[i].sets = json[i].sets.split(', ');
    //   json[i].size = Number(json[i].size);
    // }

    //convert data to use fixed venn diagram
    for (let i = 0; i < dataset.length; i++) {
      dataset[i].orgs = dataset[i].orgs.split(', ');
      dataset[i].count = Number(dataset[i].count);
    }
    console.log('dataset', dataset);

    // get how many circles to draw
    let datasetNums = [];
    for (let i = 0; i < dataset.length; i++) {
      datasetNums.push(dataset[i].orgs.length);
    }

    const aryMax = function (a, b) { return Math.max(a, b); }
    const circleNum = datasetNums.reduce(aryMax); //TODO これはユーザーParameterとして入力する形でもいいかも（円の数はデータに依存するため）

    // show venns corresponds to data(circle numbers to draw)
    const vennDiagrams = this.root.querySelectorAll('.venn-diagram');
    Array.from(vennDiagrams).forEach((vennDiagram, i) => {
      vennDiagram.getAttribute('id') === `venn-diagram${circleNum}` ? vennDiagram.style.display = "block" : vennDiagram.style.display = "none";
    })

    // assign labels to each circles : set as parameter by user 
    const LABEL0 = this.params["label-0"];
    const LABEL1 = this.params["label-1"];
    const LABEL2 = this.params["label-2"];
    const LABEL3 = this.params["label-3"];
    const LABEL4 = this.params["label-4"];

    //get paths(=venn shapes) and texts(=venn labels), and these nodelists are listed in vennSet3Arr's order
    const part1Paths = this.root.querySelectorAll('.part1-path');
    const part1Texts = this.root.querySelectorAll('.part1-text');
    const vennSet1Arr = ['1-0'];

    const part2Paths = this.root.querySelectorAll('.part2-path');
    const part2Texts = this.root.querySelectorAll('.part2-text');
    const vennSet2Arr = ['2-0', '2-1', '2-0_1'];

    const part3Paths = this.root.querySelectorAll('.part3-path');
    const part3Texts = this.root.querySelectorAll('.part3-text');
    const vennSet3Arr = ['3-0', '3-1', '3-2', '3-0_1', '3-0_2', '3-1_2', '3-0_1_2'];

    const part4Paths = this.root.querySelectorAll('.part4-path');
    const part4Texts = this.root.querySelectorAll('.part4-text');
    const vennSet4Arr = ['4-0', '4-1', '4-2', '4-3', '4-0_1', '4-0_2', '4-0_3', '4-1_2', '4-1_3', '4-2_3', '4-0_1_2', '4-0_1_3', '4-0_2_3', '4-1_2_3', '4-0_1_2_3'];
    
    const part5Paths = this.root.querySelectorAll('.part5-path');
    const part5Texts = this.root.querySelectorAll('.part5-text');
    const vennSet5Arr = ['5-0', '5-1', '5-2', '5-3', '5-4', '5-0_1', '5-0_2', '5-0_3', '5-0_4', '5-1_2', '5-1_3', '5-1_4', '5-2_3', '5-2_4', '5-3_4', '5-0_1_2', '5-0_1_3', '5-0_1_4', '5-0_2_3', '5-0_2_4', '5-0_3_4', '5-1_2_3', '5-1_2_4', '5-1_3_4', '5-2_3_4', '5-0_1_2_3', '5-0_1_2_4', '5-0_1_3_4', '5-0_2_3_4', '5-1_2_3_4', '5-0_1_2_3_4'];

    switch (circleNum) {
      case 1:
        set1Venn();
        break;
      case 2:
        set2Venn();
        break;
      case 3:
        set3Venn();
        break;
      case 4:
        set4Venn();
        break;
      case 5:
        set5Venn();
        break;
      default:
        console.log(`Circle number(${circleNum}) is invalid. Please set from 1 to 5 circles.`);
    }
    

    //set tooltip for fixed venn
    const tooltip = d3.select(fixedArea)
      .append('div')
      .attr('class', 'fixed-tooltip');

    //function: set highlight event which fire when hovered
    function highlightParts(vennSetArr, pathsArr, TextsArr, targetElm, label, count) {
      d3.select(targetElm)
        .on("mouseenter", function (e) {
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
          for (let i = 0; i < vennSetArr.length; i++) {
            if (targetElm.id === `venn-shape-set${vennSetArr[i]}` || targetElm.id === `venn-text-set${vennSetArr[i]}`) {
              pathsArr[i].dataset.highlight = "selected";
              TextsArr[i].dataset.highlight = "selected";
            } else {
              pathsArr[i].dataset.highlight = "unselected";
              TextsArr[i].dataset.highlight = "unselected";
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
        .on("mouseleave", function () {
          tooltip.style("display", "none");
          Array.from(pathsArr).forEach(path => {
            path.dataset.highlight = "default";
          });
          Array.from(TextsArr).forEach(text => {
            text.dataset.highlight = "default";
          });
        });
    }

    //【organism num: 2】set highlight event and count labels to each parts
    function set1Venn(){
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
  
        if (hasLabel0) { //1-0 (=vennSet1Arr[0])
          highlightParts(vennSet1Arr, part1Paths, part1Texts, part1Paths[0], data.orgs, data.count);
          highlightParts(vennSet1Arr, part1Paths, part1Texts, part1Texts[0], data.orgs, data.count);
          part1Texts[0].textContent = data.count;
        };
      })
    }

    //【organism num: 2】set highlight event and count labels to each parts
    function set2Venn(){
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
        const hasLabel1 = orgArray.includes(LABEL1); //boolean
  
        if (hasLabel0 && hasLabel1) { //2-0_1 (=vennSet2Arr[2])
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Paths[2], data.orgs, data.count);
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Texts[2], data.orgs, data.count);
          part2Texts[2].textContent = data.count;
        } else if (hasLabel1) { //2-1 (=vennSet2Arr[1])
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Paths[1], data.orgs, data.count);
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Texts[1], data.orgs, data.count);
          part2Texts[1].textContent = data.count;
        } else if (hasLabel0) { //2-0 (=vennSet2Arr[0])
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Paths[0], data.orgs, data.count);
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Texts[0], data.orgs, data.count);
          part2Texts[0].textContent = data.count;
        };
      })
    }

    //【organism num: 3】set highlight event and count labels to each parts
    function set3Venn(){
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
        const hasLabel1 = orgArray.includes(LABEL1); //boolean
        const hasLabel2 = orgArray.includes(LABEL2); //boolean
  
        if (hasLabel0 && hasLabel1 && hasLabel2) { //3-0_1_2 (=vennSet3Arr[6])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[6], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[6], data.orgs, data.count);
          part3Texts[6].textContent = data.count;
        } else if (hasLabel0 && hasLabel1) { //3-0_1 (=vennSet3Arr[3])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[3], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[3], data.orgs, data.count);
          part3Texts[3].textContent = data.count;
        } else if (hasLabel1 && hasLabel2) { //3-1_2 (=vennSet3Arr[5])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[5], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[5], data.orgs, data.count);
          part3Texts[5].textContent = data.count;
        } else if (hasLabel0 && hasLabel2) { //3-0_2 (=vennSet3Arr[4])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[4], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[4], data.orgs, data.count);
          part3Texts[4].textContent = data.count;
        } else if (hasLabel0) { //3-0 (=vennSet3Arr[0])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[0], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[0], data.orgs, data.count);
          part3Texts[0].textContent = data.count;
        } else if (hasLabel1) { //3-1 (=vennSet3Arr[1])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[1], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[1], data.orgs, data.count);
          part3Texts[1].textContent = data.count;
        } else if (hasLabel2) { //3-1 (=vennSet3Arr[2])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[2], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[2], data.orgs, data.count);
          part3Texts[2].textContent = data.count;
        };
      })
    }

    //【organism num: 4】set highlight event and count labels to each parts
    function set4Venn(){
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
        const hasLabel1 = orgArray.includes(LABEL1); //boolean
        const hasLabel2 = orgArray.includes(LABEL2); //boolean
        const hasLabel3 = orgArray.includes(LABEL3); //boolean
    
        if (hasLabel0 && hasLabel1 && hasLabel2 && hasLabel3) { //4-0_1_2_3 (=vennSet4Arr[14])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[14], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[14], data.orgs, data.count);
          part4Texts[14].textContent = data.count;
        } else if (hasLabel1 && hasLabel2 && hasLabel3) { //4-1_2_3 (=vennSet4Arr[13])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[13], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[13], data.orgs, data.count);
          part4Texts[13].textContent = data.count;
        } else if (hasLabel0 && hasLabel2 && hasLabel3) { //4-0_2_3 (=vennSet4Arr[12])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[12], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[12], data.orgs, data.count);
          part4Texts[12].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel3) { //4-0_1_3 (=vennSet4Arr[11])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[11], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[11], data.orgs, data.count);
          part4Texts[11].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel2) { //4-0_1_2 (=vennSet4Arr[10])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[10], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[10], data.orgs, data.count);
          part4Texts[10].textContent = data.count;
        } else if (hasLabel2 && hasLabel3) { //4-2_3 (=vennSet4Arr[9])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[9], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[9], data.orgs, data.count);
          part4Texts[9].textContent = data.count;
        } else if (hasLabel1 && hasLabel3) { //4-1_3 (=vennSet4Arr[8])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[8], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[8], data.orgs, data.count);
          part4Texts[8].textContent = data.count;
        } else if (hasLabel1 && hasLabel2) { //4-1_2 (=vennSet4Arr[7])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[7], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[7], data.orgs, data.count);
          part4Texts[7].textContent = data.count;
        } else if (hasLabel0 && hasLabel3) { //4-0_3 (=vennSet4Arr[6])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[6], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[6], data.orgs, data.count);
          part4Texts[6].textContent = data.count;
        } else if (hasLabel0 && hasLabel2) { //4-0_2 (=vennSet4Arr[5])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[5], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[5], data.orgs, data.count);
          part4Texts[5].textContent = data.count;
        } else if (hasLabel0 && hasLabel1) { //4-0_1 (=vennSet4Arr[4])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[4], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[4], data.orgs, data.count);
          part4Texts[4].textContent = data.count;
        } else if (hasLabel3) { //4-3 (=vennSet4Arr[3])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[3], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[3], data.orgs, data.count);
          part3Texts[3].textContent = data.count;
        } else if (hasLabel2) { //4-2 (=vennSet4Arr[2])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[2], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[2], data.orgs, data.count);
          part4Texts[2].textContent = data.count;
        } else if (hasLabel1) { //4-1 (=vennSet4Arr[1])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[1], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[1], data.orgs, data.count);
          part4Texts[1].textContent = data.count;
        } else if (hasLabel0) { //4-0 (=vennSet4Arr[0])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[0], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[0], data.orgs, data.count);
          part4Texts[0].textContent = data.count;
        };
      })
    }

    //【organism num: 5】set highlight event and count labels to each parts
    function set5Venn(){
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
        const hasLabel1 = orgArray.includes(LABEL1); //boolean
        const hasLabel2 = orgArray.includes(LABEL2); //boolean
        const hasLabel3 = orgArray.includes(LABEL3); //boolean
        const hasLabel4 = orgArray.includes(LABEL4); //boolean
    
        if (hasLabel0 && hasLabel1 && hasLabel2 && hasLabel3 && hasLabel4) { //5-0_1_2_3_4 (=vennSet5Arr[14])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[30], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[30], data.orgs, data.count);
          part5Texts[30].textContent = data.count;
        } else if (hasLabel1 && hasLabel2 && hasLabel3 && hasLabel4) { //5-1_2_3_4 (=vennSet5Arr[29])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[29], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[29], data.orgs, data.count);
          part5Texts[29].textContent = data.count;
        } else if (hasLabel0 && hasLabel2 && hasLabel3 && hasLabel4) { //5-0_2_3_4 (=vennSet5Arr[28])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[28], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[28], data.orgs, data.count);
          part5Texts[28].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel3 && hasLabel4) { //5-0_1_3_4 (=vennSet5Arr[27])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[27], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[27], data.orgs, data.count);
          part5Texts[27].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel2 && hasLabel4) { //5-0_1_2_4 (=vennSet5Arr[26])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[26], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[26], data.orgs, data.count);
          part5Texts[26].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel2 && hasLabel3) { //5-0_1_2_3 (=vennSet5Arr[25])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[25], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[25], data.orgs, data.count);
          part5Texts[25].textContent = data.count;
        } else if (hasLabel2 && hasLabel3 && hasLabel4) { //5-2_3_4 (=vennSet5Arr[24])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[24], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[24], data.orgs, data.count);
          part5Texts[24].textContent = data.count;
        } else if (hasLabel1 && hasLabel3 && hasLabel4) { //5-1_3_4 (=vennSet5Arr[23])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[23], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[23], data.orgs, data.count);
          part5Texts[23].textContent = data.count;
        } else if (hasLabel1 && hasLabel2 && hasLabel4) { //5-1_2_4 (=vennSet5Arr[22])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[22], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[22], data.orgs, data.count);
          part5Texts[22].textContent = data.count;
        } else if (hasLabel1 && hasLabel2 && hasLabel3) { //5-1_2_3 (=vennSet5Arr[21])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[21], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[21], data.orgs, data.count);
          part5Texts[21].textContent = data.count;
        } else if (hasLabel0 && hasLabel3 && hasLabel4) { //5-0_3_4 (=vennSet5Arr[20])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[20], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[20], data.orgs, data.count);
          part5Texts[20].textContent = data.count;
        } else if (hasLabel0 && hasLabel2 && hasLabel4) { //5-0_2_4 (=vennSet5Arr[19])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[19], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[19], data.orgs, data.count);
          part5Texts[19].textContent = data.count;
        } else if (hasLabel0 && hasLabel2 && hasLabel3) { //5-0_2_3 (=vennSet5Arr[18])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[18], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[18], data.orgs, data.count);
          part5Texts[18].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel4) { //5-0_1_4 (=vennSet5Arr[17])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[17], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[17], data.orgs, data.count);
          part5Texts[17].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel3) { //5-0_1_3 (=vennSet5Arr[16])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[16], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[16], data.orgs, data.count);
          part5Texts[16].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel2) { //5-0_1_2 (=vennSet5Arr[15])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[15], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[15], data.orgs, data.count);
          part5Texts[15].textContent = data.count;
        } else if (hasLabel3 && hasLabel4) { //5-3_4 (=vennSet5Arr[14])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[14], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[14], data.orgs, data.count);
          part5Texts[14].textContent = data.count;
        } else if (hasLabel2 && hasLabel4) { //5-2_4 (=vennSet5Arr[13])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[13], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[13], data.orgs, data.count);
          part5Texts[13].textContent = data.count;
        } else if (hasLabel2 && hasLabel3) { //5-2_3 (=vennSet5Arr[12])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[12], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[12], data.orgs, data.count);
          part5Texts[12].textContent = data.count;
        } else if (hasLabel1 && hasLabel4) { //5-1_4 (=vennSet5Arr[11])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[11], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[11], data.orgs, data.count);
          part5Texts[11].textContent = data.count;
        } else if (hasLabel1 && hasLabel3) { //5-1_3 (=vennSet5Arr[10])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[10], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[10], data.orgs, data.count);
          part5Texts[10].textContent = data.count;
        } else if (hasLabel1 && hasLabel2) { //5-1_2 (=vennSet5Arr[9])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[9], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[9], data.orgs, data.count);
          part5Texts[9].textContent = data.count;
        } else if (hasLabel0 && hasLabel4) { //5-0_4 (=vennSet5Arr[8])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[8], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[8], data.orgs, data.count);
          part5Texts[8].textContent = data.count;
        } else if (hasLabel0 && hasLabel3) { //5-0_3 (=vennSet5Arr[7])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[7], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[7], data.orgs, data.count);
          part5Texts[7].textContent = data.count;
        } else if (hasLabel0 && hasLabel2) { //5-0_2 (=vennSet5Arr[6])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[6], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[6], data.orgs, data.count);
          part5Texts[6].textContent = data.count;
        } else if (hasLabel0 && hasLabel1) { //5-0_1 (=vennSet5Arr[5])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[5], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[5], data.orgs, data.count);
          part5Texts[5].textContent = data.count;
        } else if (hasLabel4) { //5-4 (=vennSet5Arr[4])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[4], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[4], data.orgs, data.count);
          part5Texts[4].textContent = data.count;
        } else if (hasLabel3) { //4-3 (=vennSet5Arr[3])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[3], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[3], data.orgs, data.count);
          part5Texts[3].textContent = data.count;
        } else if (hasLabel2) { //5-2 (=vennSet5Arr[2])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[2], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[2], data.orgs, data.count);
          part5Texts[2].textContent = data.count;
        } else if (hasLabel1) { //5-1 (=vennSet5Arr[1])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[1], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[1], data.orgs, data.count);
          part5Texts[1].textContent = data.count;
        } else if (hasLabel0) { //5-0 (=vennSet5Arr[0])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[0], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[0], data.orgs, data.count);
          part5Texts[0].textContent = data.count;
        };
      })
    }

  }
}
