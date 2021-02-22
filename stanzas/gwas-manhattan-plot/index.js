import * as d3 from "d3";
import { getFormatedJson, appendDlButton } from "@/lib/metastanza_utils.js";
import data from "../gwas-manhattan-plot/gwas.var2.json";

const dataset = data.dataset;
// study name
const study_name = Object.keys(dataset)[0]; //(single per a json)
console.log("【study_name】", study_name);

//project data and project names(each of them are single per a json)
let project = Object.values(dataset)[0];
project = project[0];
console.log("【project】", project);

let project_name = Object.keys(project);
project_name = project_name[0];
console.log("【project_name】", project_name);

// stage data and stage names
const stages = Object.values(project);
console.log("【stages】", stages);
console.log("【...stages】", ...stages);

const stage_info = stages[0];

const stage_names = Object.keys(stage_info);
console.log("【stage_names】", stage_names);

// get condition of each stage
const condition1 = stage_info[stage_names[0]].condition1;
const condition2 = stage_info[stage_names[0]].condition2;

let total_variants = []
stage_names.forEach(stage => total_variants = total_variants.concat(stage_info[stage].variants))
console.log('total_variants', total_variants)

// get stage information
const getVariants = () => {
  let variantsArray = [];
  stage_names.forEach(stage => {
    if(stage_info[stage].checked){
      variantsArray = variantsArray.concat(stage_info[stage].variants);
    }
  })
  return variantsArray;
}
let variants = total_variants; //init

// const condition2 = stage_info[0].condition2;

// let variants_datum;
// for (let i = 0; i < stage_info.length; i++) {
//   console.log("【stage_names】" + i, stage_names[i]);
//   console.log("【stage_info】" + i, stage_info[i]);
//   console.log("【condition1】" + i, stage_info[i].condition1);
//   console.log("【condition2】" + i, stage_info[i].condition2);
//   console.log("【stage_info[i].variants】" + i, stage_info[i].variants);
// }


export default async function gwasManhattanPlot(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      greeting: `Hello, ${params["say-to"]}!`,
      title: params["title"],
      study_name,
      project_name,
      // stage_name,
      condition1,
      condition2,
    },
  });
  
  //append checkbox to filter stages
  const stageList = stanza.root.querySelector("#stageList");
  let li;
  let input;
  let label;
  let stageCheckboxStatus = {};
  
  for(let i = 0; i < stage_names.length; i++){
    li = document.createElement("li");
    input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", "stage-btn");
    input.setAttribute("name", "stage");
    input.setAttribute("value",stage_names[i]);
    input.setAttribute("checked",true);
    input.setAttribute("data-stage",stage_names[i]);
    label = document.createElement("label");
    label.textContent = stage_names[i];
    stageList.appendChild(li);
    li.appendChild(input);
    li.appendChild(label);
    stage_info[stage_names[i]].checked = true;
  }

  console.log('stage_info',stage_info)
  
  // adjust datas
  for (let i = 0; i < variants.length; i++) {
    // convert chromosome data from 'chrnum' to 'num'
    let chr = variants[i].chr;
    chr = chr.replace("chr", "");
    variants[i].chr = chr;
    // console.log(variants[i].chr);
  
    const pval = variants[i]["p-value"];
    String(pval);
  
    const physical_pos = variants[i]["stop"];
    String(physical_pos);
    
  }

  // console.log(params.api); //when you put json url
  // const dataset = await getFormatedJson(
  //   params.api,
  //   stanza.root.querySelector("#chart")
  // );
  // console.log("dataset", dataset);
  // console.log("dataset", dataset);
  // console.log("variants", variants);


  if (typeof variants === "object") {
    draw(stanza, params);
    appendDlButton(
      stanza.root.querySelector("#chart"),
      stanza.root.querySelector("svg"),
      "manhattan_plot",
      stanza
    );
    // selectAll();
  }
}

async function draw(stanza, params) {
  const width = 800;
  const height = 400;
  const marginLeft = 30;
  const marginBottom = 30;
  const areaWidth = width - marginLeft;
  const areaHeight = height - marginBottom;

  const chart_element = stanza.root.querySelector("#chart");
  const control_element = stanza.root.querySelector("#control");
  let over_thresh_array;

  if (params.low_thresh === "") {
    params.low_thresh = 0.5;
  }
  if (params.high_thresh === "") {
    params.high_thresh = Infinity;
  }
  if (params.chromosome_key === "") {
    params.chromosome_key = "chromosome";
  }
  if (params.position_key === "") {
    params.position_key = "position";
  }
  if (params.p_value_key === "") {
    params.p_value__key = "p-value";
  }
  if (params.label_key === "") {
    params.label_key = "label";
  }
  const low_thresh = parseFloat(params.low_thresh);
  const high_thresh = parseFloat(params.high_thresh);
  const even_and_odd = params.even_and_odd === "true";
  const chromosome_key = params.chromosome_key;
  const position_key = params.position_key;
  const p_value_key = params.p_value_key;
  const label_key = params.label_key;

  console.log(label_key);
  // console.log(variants[0].rsId);

  const chromosomes = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "X",
    "Y",
  ];

  const chromosomeNtLength = {
    hg38: {
      1: 248956422,
      2: 242193529,
      3: 198295559,
      4: 190214555,
      5: 181538259,
      6: 170805979,
      7: 159345973,
      8: 145138636,
      9: 138394717,
      10: 133797422,
      11: 135086622,
      12: 133275309,
      13: 114364328,
      14: 107043718,
      15: 101991189,
      16: 90338345,
      17: 83257441,
      18: 80373285,
      19: 58617616,
      20: 64444167,
      21: 46709983,
      22: 50818468,
      X: 156040895,
      Y: 57227415,
      // 1: 3000000000,
      // 2: 3000000000,
      // 3: 3000000000,
      // 4: 3000000000,
      // 5: 3000000000,
      // 6: 3000000000,
      // 7: 3000000000,
      // 8: 3000000000,
      // 9: 3000000000,
      // 10: 3000000000,
      // 11: 3000000000,
      // 12: 3000000000,
      // 13: 3000000000,
      // 14: 3000000000,
      // 15: 3000000000,
      // 16: 3000000000,
      // 17: 3000000000,
      // 18: 3000000000,
      // 19: 3000000000,
      // 20: 3000000000,
      // 21: 3000000000,
      // 22: 3000000000,
      // X: 3000000000,
      // Y: 3000000000,
    },
  };

  const canvas_div = d3
    .select(chart_element)
    .append("div")
    .style("width", areaWidth + "px")
    .style("overflow", "hidden")
    .style("position", "absolute")
    .style("left", marginLeft + "px");
  const canvas = canvas_div
    .append("canvas")
    .attr("width", areaWidth)
    .attr("height", areaHeight)
    .style("position", "relative");
  const svg = d3
    .select(chart_element)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  const plot_g = svg.append("g").attr("id", "plot_group");
  const axis_g = svg.append("g").attr("id", "axis");
  const threshline_g = svg.append("g").attr("id", "thresh_line");
  const xlabel_g = svg.append("g").attr("id", "x_label");
  const ylabel_g = svg.append("g").attr("id", "y_label");

  let range = []; // [begin position, end _position]
  let rangeVertical = []; // [begin position, end _position]
  let max_log_p = 0;
  let max_log_p_int;
  let total;

  // axis line
  axis_g
    .append("path")
    .attr("d", "M " + marginLeft + ", " + areaHeight + " H " + width + " Z")
    .attr("class", "axis-line");
  axis_g
    .append("path")
    .attr("d", "M " + marginLeft + ", 0 V " + areaHeight + " Z")
    .attr("class", "axis-line");

  // select range by drag
  let dragBegin = false;
  let dragBeginVertical = false;
  console.log("rangeVertical", rangeVertical);

  svg
    .on("mousedown", function (e) {
      if (d3.pointer(e)[1] <= areaHeight) {
        dragBegin = d3.pointer(e)[0];
        dragBeginVertical = d3.pointer(e)[1] <= 60 ? 60 : d3.pointer(e)[1];
        console.log("mousedown(start) dragBeginVertical", dragBeginVertical);
        console.log("mousedown(start) dragBegin", dragBegin);
        console.log("mousedown(start) d3.pointer(e)", d3.pointer(e));
        svg
          .append("rect")
          .attr("fill", "rgba(128, 128, 128, 0.2)")
          .attr("stroke", "black")
          .attr("x", dragBegin)
          .attr("y", dragBeginVertical)
          .attr("width", 0)
          .attr("height", 0)
          .attr("id", "selector");
      }
    })
    .on("mousemove", function (e) {
      if (dragBegin) {
        const dragEnd = d3.pointer(e)[0];
        if (dragBegin < dragEnd) {
          svg.select("#selector").attr("width", dragEnd - dragBegin);
        } else {
          svg
            .select("#selector")
            .attr("x", dragEnd)
            .attr("width", dragBegin - dragEnd);
        }
      }
      if (dragBeginVertical) {
        const dragEndVertical =
          d3.pointer(e)[1] > areaHeight ? areaHeight : d3.pointer(e)[1];
        if (dragBeginVertical < dragEndVertical) {
          svg
            .select("#selector")
            .attr("height", dragEndVertical - dragBeginVertical);
        } else {
          svg
            .select("#selector")
            .attr("y", dragEndVertical)
            .attr("height", dragBeginVertical - dragEndVertical);
        }
      }
    })
    .on("mouseup", function (e) {
      if (dragBegin) {
        const dragEnd = d3.pointer(e)[0];
        // re-render //矩形サイズが5以下の場合、rangeを変更
        if (5 > dragEnd - dragBegin) {
          range = [
            ((dragEnd - marginLeft) / areaWidth) * (range[1] - range[0]) +
              range[0],
            ((dragBegin - marginLeft) / areaWidth) * (range[1] - range[0]) +
              range[0],
          ];
        } else if (dragEnd - dragBegin > 5) {
          range = [
            ((dragBegin - marginLeft) / areaWidth) * (range[1] - range[0]) +
              range[0],
            ((dragEnd - marginLeft) / areaWidth) * (range[1] - range[0]) +
              range[0],
          ];
        }
        console.log("mouseup(end) dragBegin, dragEnd", dragBegin, dragEnd);
        console.log("mouseup(end) range", range);
        svg.select("#selector").remove(); //矩形を除去
        reRender();
        dragBegin = false;
      }
      if (dragBeginVertical) {
        const dragEndVertical = d3.pointer(e)[1] > 370 ? 370 : d3.pointer(e)[1]; //一時的
        // console.log('mouseup(end) dragBeginVertical', dragBeginVertical)
        // console.log('mouseup(end) dragEndVertical', dragEndVertical)
        // console.log('mouseup(end)) d3.pointer(e)',d3.pointer(e))
        // re-render
        const rangeVerticalLength = rangeVertical[1] - rangeVertical[0];
        if (0 > dragEndVertical - dragBeginVertical) {
          // if (-5 > dragEndVertical - dragBeginVertical) {
          // console.log('mouseup(end) rangeVertical', rangeVertical)
          // console.log('mouseup(end) dragBeginVertical', dragBeginVertical)
          // console.log('mouseup(end) dragEndVertical', dragEndVertical)
          const maxLog =
            rangeVertical[1] -
            ((dragEndVertical - 60) / 310) * rangeVerticalLength;
          const minLog =
            rangeVertical[1] -
            ((dragBeginVertical - 60) / 310) * rangeVerticalLength;
          console.log("mouseup(end)2nd rangeVertical", rangeVertical);
          rangeVertical = [minLog, maxLog];
          // console.log('minLog', minLog)
          // console.log('maxLog', maxLog)
        } else if (dragEndVertical - dragBeginVertical > 0) {
          // } else if (dragEndVertical - dragBeginVertical > 5) {
          // console.log('mouseup(end) dragBeginVertical', dragBeginVertical)
          // console.log('mouseup(end) dragEndVertical', dragEndVertical)
          // console.log('mouseup(end) rangeVertical', rangeVertical)
          const maxLog =
            rangeVertical[1] -
            ((dragBeginVertical - 60) / 310) * rangeVerticalLength;
          const minLog =
            rangeVertical[1] -
            ((dragEndVertical - 60) / 310) * rangeVerticalLength;
          console.log("mouseup(end)2nd rangeVertical", rangeVertical);
          rangeVertical = [minLog, maxLog];
          // console.log('minLog', minLog)
          // console.log('maxLog', maxLog)
        }
        reRender();
        svg.select("#selector").remove(); //矩形を除去
        dragBegin = false;
        dragBeginVertical = false;
        // console.log('rangeVertical',rangeVertical)
        // console.log('range',range)
      }
    });

  // slider
  const ctrl_svg = d3
    .select(control_element)
    .append("svg")
    .attr("width", width)
    .attr("height", 20);
  ctrl_svg
    .append("path")
    .attr("d", "M " + marginLeft + ", 10 H " + width + " Z")
    .attr("stroke", "#888888")
    .attr("stroke-width", "2px");
  ctrl_svg
    .append("rect")
    .attr("id", "slider")
    .attr("x", marginLeft)
    .attr("y", 2)
    .attr("width", areaWidth)
    .attr("height", 16)
    .attr("fill", "#C2E3F2")
    .call(
      d3
        .drag()
        .on("start", function (e) {
          dragBegin = e.x;
        })
        .on("drag", function (e) {
          if (dragBegin) {
            const slider = ctrl_svg.select("rect#slider");
            let delta = e.x - dragBegin;
            if (parseFloat(slider.attr("x")) + delta < marginLeft) {
              delta = (parseFloat(slider.attr("x")) - marginLeft) * -1;
            } else if (
              parseFloat(slider.attr("x")) +
                parseFloat(slider.attr("width")) +
                delta >
              width
            ) {
              delta =
                width -
                (parseFloat(slider.attr("x")) +
                  parseFloat(slider.attr("width")));
            }
            slider.attr("transform", "translate(" + delta + ", 0)");
            const move = (delta / areaWidth) * total;
            // renderCanvas([range[0] + move, range[1] + move]);
            canvas
              .style(
                "left",
                ((range[0] + move) / (range[0] - range[1])) * areaWidth + "px"
              )
              .style("display", "block");
            setRange([range[0] + move, range[1] + move]);
            plot_g.html("");
            xlabel_g.html("");
          }
        })
        .on("end", function (e) {
          if (dragBegin) {
            // re-render
            const slider = ctrl_svg.select("rect#slider");
            let delta = e.x - dragBegin;
            if (parseFloat(slider.attr("x")) + delta < marginLeft) {
              delta = (parseFloat(slider.attr("x")) - marginLeft) * -1;
            } else if (
              parseFloat(slider.attr("x")) +
                parseFloat(slider.attr("width")) +
                delta >
              width
            ) {
              delta =
                width -
                (parseFloat(slider.attr("x")) +
                  parseFloat(slider.attr("width")));
            }
            const move = (delta / areaWidth) * total;
            range = [range[0] + move, range[1] + move];
            reRender();
            dragBegin = false;
          }
        })
    );

  // button
  const ctrl_button = d3
    .select(control_element)
    .append("div")
    .attr("id", "ctrl_button");
  ctrl_button
    .append("input")
    .attr("type", "button")
    .attr("value", "-")
    .on("click", function () {
      let begin = range[0] - (range[1] - range[0]) / 2;
      let end = range[1] + (range[1] - range[0]) / 2;
      if (begin < 0) {
        begin = 0;
        end = (range[1] - range[0]) * 2;
        if (end > total) {
          end = total;
        }
      } else if (end > total) {
        end = total;
        begin = total - (range[1] - range[0]) * 2;
        if (begin < 0) {
          begin - 0;
        }
      }
      range = [begin, end];
      reRender();
    });
  ctrl_button
    .append("input")
    .attr("type", "button")
    .attr("value", "+")
    .on("click", function () {
      const begin = range[0] + (range[1] - range[0]) / 4;
      const end = range[1] - (range[1] - range[0]) / 4;
      range = [begin, end];
      reRender();
    });
  ctrl_button.append("span").attr("id", "range_text");
  ctrl_button
    .append("input")
    .attr("type", "button")
    .attr("value", "reset")
    .on("click", function () {
      range = [];
      reRender();
    });

  reRender();

  //listen stage checkbox event
  const stageBtn = stanza.root.querySelectorAll(".stage-btn");
  console.log('stageBtn', stageBtn)
  for(let i = 0; i<stageBtn.length; i++){
    stageBtn[i].addEventListener("change", (e) => {
      console.log('CLICKED')
      let stageName = e.path[0].getAttribute("data-stage");
      stage_info[stageName].checked = stageBtn[i].checked;
      variants = getVariants()
      reRender()
    });
  }

  function reRender() {
    console.log('variants.length', variants.length)
    if (range[0] === undefined) {
      range = [
        0,
        Object.values(chromosomeNtLength.hg38).reduce(
          (sum, value) => sum + value
        ),
      ];
      total = range[1];
    }

    over_thresh_array = [];

    const p_value_array = variants.map(
      (variant) => Math.log10(parseFloat(variant["p-value"])) * -1
    );
    max_log_p = Math.max(...p_value_array);

    if (max_log_p_int === undefined) {
      max_log_p_int = Math.floor(max_log_p);
    }

    if (rangeVertical[0] === undefined) {
      rangeVertical = [low_thresh, max_log_p_int];
    }

    plot_g.html("");
    xlabel_g.html("");
    ylabel_g.html("");
    plot_g
      .selectAll(".plot")
      .data(variants)
      .enter()
      // filter: display range
      .filter(function (d) {
        if (!d.pos) {
          // calculate  accumulated position
          let pos = 0;
          for (const ch of chromosomes) {
            if (ch === d[chromosome_key]) {
              break;
            }
            pos += chromosomeNtLength.hg38[ch];
          }
          d.pos = pos + parseInt(d[position_key]);
        }
        let logValue = Math.log10(parseFloat(d[p_value_key])) * -1;
        return (
          range[0] <= d.pos &&
          d.pos <= range[1] &&
          rangeVertical[0] <= logValue &&
          logValue <= rangeVertical[1]
        );
      })
      .filter(function (d) {
        return Math.log10(parseFloat(d[p_value_key])) * -1 > low_thresh;
      })
      .append("circle")
      .attr("class", function (d) {
        if (even_and_odd) {
          let tmp = "even";
          if (
            d[chromosome_key] === "X" ||
            parseInt(d[chromosome_key]) % 2 === 1
          ) {
            tmp = "odd";
          }
          return "plot ch_" + tmp;
        }
        return "plot ch_" + d[chromosome_key];
      })
      .attr("cx", function (d) {
        return (
          ((d.pos - range[0]) / (range[1] - range[0])) * areaWidth + marginLeft
        );
      })
      .attr("cy", function (d) {
        let logValue = Math.log10(parseFloat(d[p_value_key])) * -1;
        return (
          ((rangeVertical[1] - logValue) /
            (rangeVertical[1] - rangeVertical[0])) *
            310 +
          60
        );
      })
      .attr("r", 2)
      // filter: high p-value
      .filter(function (d) {
        if (Math.log10(parseFloat(d[p_value_key])) * -1 > high_thresh) {
          over_thresh_array.push(d);
        }
        return Math.log10(parseFloat(d[p_value_key])) * -1 > high_thresh;
      })
      .classed("over-thresh-plot", true)
      .on("mouseover", function (e, d) {
        svg
          .append("text")
          .text(d[label_key]) //.text(d.dbSNP_RS_ID + ", " + d.Symbol)
          .attr("x", d3.pointer(e)[0] + 10)
          .attr("y", d3.pointer(e)[1])
          .attr("id", "popup_text");
      })
      .on("mouseout", function () {
        svg.select("#popup_text").remove();
      });
    // plot_g.selectAll(".plot").attr("cy", function (d) {
    //   return (
    //     areaHeight - ((Math.log10(parseFloat(d[p_value_key])) * -1 - low_thresh) * areaHeight) / max_log_p_int
    //   );
    // });

    renderCanvas(variants, range);

    // x axis label
    xlabel_g
      .selectAll(".xLabel")
      .data(chromosomes)
      .enter()
      .append("text")
      .attr("class", "axisLabel xLabel")
      .text(function (d) {
        return d;
      })
      .attr("x", function (d) {
        let pos = chromosomeNtLength.hg38[d] / 2;
        for (const ch of chromosomes) {
          if (ch === d) {
            break;
          }
          pos += chromosomeNtLength.hg38[ch];
        }
        return (
          ((pos - range[0]) / (range[1] - range[0])) * areaWidth + marginLeft
        );
      })
      .attr("y", areaHeight + 20);

    // y axis label
    const overThreshLine = stanza.root.querySelectorAll(".overthresh-line");

    for (
      let i = Math.floor(rangeVertical[0]) + 1;
      i <= Math.ceil(rangeVertical[1]);
      i++
    ) {
      const y =
        areaHeight -
        ((i - rangeVertical[0]) / (rangeVertical[1] - rangeVertical[0])) *
          (areaHeight - 60); //一時的に
      // const y = areaHeight - ((i - rangeVertical[0]) * areaHeight) / rangeVertical[1];
      ylabel_g
        .append("text")
        .text(i)
        .attr("class", "axisLabel yLabel")
        .attr("x", marginLeft - 16)
        .attr("y", y)
        .attr("text-anchor", "end");
      ylabel_g
        .append("path")
        .attr("class", "axis-line")
        .attr(
          "d",
          "M " + (marginLeft - 10) + ", " + y + " H " + marginLeft + " Z"
        );

      if (i === high_thresh) {
        threshline_g
          .append("path")
          .attr("d", "M " + marginLeft + ", " + y + " H " + width + " Z")
          .attr("class", "overthresh-line");
      }
    }
    for(let i=0; i<overThreshLine.length; i++){
      overThreshLine[i].remove();
    }

    // y zero (low_thresh)
    ylabel_g
      .append("text")
      .text(Math.floor(rangeVertical[0]))
      .attr("class", "axisLabel yLabel")
      .attr("x", marginLeft - 16)
      .attr("y", areaHeight)
      .attr("text-anchor", "end");
    ylabel_g
      .append("path")
      .attr("class", "axis-line")
      .attr(
        "d",
        "M " + (marginLeft - 10) + ", " + areaHeight + " H " + marginLeft + " Z"
      );

    // slider
    ctrl_svg
      .select("rect#slider")
      .attr("x", marginLeft + (range[0] / total) * areaWidth)
      .attr("width", ((range[1] - range[0]) / total) * areaWidth)
      .attr("transform", "translate(0, 0)");

    setRange(range);
    // overThreshLine.remove();
  }

  function renderCanvas(variants, rangeVertical) {
    if (canvas.node().getContext) {
      canvas.attr("width", (total / (range[1] - range[0])) * areaWidth);
      canvas.attr(
        "height",
        (total / (rangeVertical[1] - rangeVertical[0])) * areaHeight
      );
      const ctx = canvas.node().getContext("2d");
      ctx.clearRect(0, 0, areaWidth, areaHeight);
      for (const d of variants) {
        ctx.beginPath();
        if (Math.log10(parseFloat(d[p_value_key])) * -1 > high_thresh) {
          ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue(
            "--over-thresh-color"
          );
        } else if (even_and_odd) {
          let tmp = "even";
          if (
            d[chromosome_key] === "X" ||
            parseInt(d[chromosome_key]) % 2 === 1
          ) {
            tmp = "odd";
          }
          ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue(
            "--ch-" + tmp + "-color"
          );
        } else {
          ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue(
            "--ch-" + d[chromosome_key] + "-color"
          );
        }
        ctx.arc(
          (d.pos / (range[1] - range[0])) * areaWidth,
          areaHeight -
            ((Math.log10(parseFloat(d[p_value_key])) * -1 - low_thresh) *
              areaHeight) /
              max_log_p_int,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      canvas.style(
        "left",
        (range[0] / (range[0] - range[1])) * areaWidth + "px"
      );
    }
    canvas.style("display", "none");

    stanza.render({
      template: "table.html.hbs",
      selector: "#table",
      parameters: {
        arrays: over_thresh_array,
      },
    });
  }

  function setRange(range) {
    let start = 0;
    let text = "";
    for (const ch of chromosomes) {
      if (start + chromosomeNtLength.hg38[ch] >= range[0] && !text) {
        text += " Ch." + ch + ":" + Math.floor(range[0]);
      }
      if (start + chromosomeNtLength.hg38[ch] >= range[1]) {
        text += " - Ch." + ch + ":" + Math.floor(range[1] - start);
        break;
      }
      start += chromosomeNtLength.hg38[ch];
      // console.log(start + chromosomeNtLength.hg38[ch]);
    }
    ctrl_button.select("#range_text").html(text);
  }
}
