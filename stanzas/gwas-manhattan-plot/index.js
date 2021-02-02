import * as d3 from "d3";
import { getFormatedJson, appendDlButton } from "@/lib/metastanza_utils.js";
import a_dataset from "../gwas-manhattan-plot/gwas.var2.json.js";

// convert data

// study name
const study_name = Object.keys(a_dataset)[0]; //(single per a json)
// console.log(...study_name); //"B型肝炎に関する統合的臨床ゲノムデータベースの構築を目指す研究"
// study_name = study_name[0];
console.log("【study_name】", study_name);

//project data and project names(each of them are single per a json)
let project = Object.values(a_dataset)[0];
project = project[0];
console.log("【project】", project);

let project_name = Object.keys(project);
project_name = project_name[0];
console.log("【project_name】", project_name);

// stage data and stage names
const stages = Object.values(project);
console.log("【stages】", stages);

const stage_name = Object.keys(...stages)[0]; // can be 4 variations
console.log("【stage_name】", stage_name);

// get stage information
const stage = Object.values(...stages);
console.log("【conditions】", stage);

// get condition of each stage
const condition1 = stage[0].condition1;
const condition2 = stage[0].condition2;
console.log("【condition1】", condition1);
console.log("【condition2】", condition2);

// variants
let variants = stage[0].variants; //init
console.log("【variants】", variants);

// adjust datas
for (let i = 0; i < variants.length; i++) {
  // convert chromosome data from 'chrnum' to 'num'
  let chr = variants[i].chr;
  chr = chr.replace("chr", "");
  variants[i].chr = chr;
  console.log(variants[i].chr);

  const pval = variants[i]["p-value"];
  String(pval);

  const physical_pos = variants[i]["stop"];
  String(physical_pos);
}

export default async function gwasManhattanPlot(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      greeting: `Hello, ${params["say-to"]}!`,
      study_name,
      project_name,
      stage_name,
      condition1,
      condition2,
    },
  });

  console.log(params.api);
  const dataset = await getFormatedJson(
    params.api,
    stanza.root.querySelector("#chart")
  );
  console.log("dataset", dataset);
  console.log("a_dataset", a_dataset);
  console.log("variants", variants);

  if (typeof variants === "object") {
    draw(variants, stanza, params);
    appendDlButton(
      stanza.root.querySelector("#chart"),
      stanza.root.querySelector("svg"),
      "manhattan_plot",
      stanza
    );
  }

  //get checked stage
  const stageBtn = stanza.root.querySelectorAll(".stage-btn");
  const stageLabel = stanza.root.querySelectorAll(".stage-label");
  for(let i=0; i<stageBtn.length; i++){
    stageBtn[i].addEventListener("click",checkStage);
    if(stageBtn[i].checked != true){
      stageLabel[i].style.color = "#99acb2";
    }
  }

  function checkStage(){
    let flag = false;
    for(let i=0; i<stageBtn.length;i++){
      stageLabel[i].style.color = "#99acb2";
        if(stageBtn[i].checked){ 
            flag = true;
            variants = stage[i].variants;
            stageLabel[i].style.color = "#000000";
            console.log(variants)
        }
      }
    if(!flag){ 
      stageBtn[0].checked = true;
    }
  }
}

async function draw(dataset, stanza, params) {
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
  console.log(variants[0].rsId);

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
  const xlabel_g = svg.append("g").attr("id", "x_label");
  const ylabel_g = svg.append("g").attr("id", "y_label");

  let range = []; // [begin position, en _position]
  let max_log_p = 0;
  let max_log_p_int;
  let total;

  // axis line
  axis_g
    .append("path") //x軸
    .attr("d", "M " + marginLeft + ", " + areaHeight + " H " + width + " Z")
    .attr("class", "axis-line");
  axis_g
    .append("path") //y軸
    .attr("d", "M " + marginLeft + ", 0 V " + areaHeight + " Z")
    .attr("class", "axis-line");

  // select range by drag
  let dragBegin = false;
  svg
    .on("mousedown", function (e) {
      // d3.pointer(e)[1]はイベント発火時のy座標
      if (d3.pointer(e)[1] <= areaHeight) {
        //イベント発火時のy座標が、描画範囲内にあるとき（＝描画範囲がクリックされたとき）
        dragBegin = d3.pointer(e)[0]; //dragBeginの値を、イベント発火時のx座標とする
        svg //半透明の矩形を作成しsvgにappend
          .append("rect")
          .attr("fill", "rgba(128, 128, 128, 0.2)")
          .attr("stroke", "black")
          .attr("x", dragBegin) //矩形のx座標はdragBegin
          .attr("y", 0) //矩形のy座標はゼロ
          .attr("width", 0)
          .attr("height", areaHeight) //高さは描画範囲とする（y軸の選択なし）
          .attr("id", "selector");
      }
    })
    .on("mousemove", function (e) {
      if (dragBegin) {
        //dragBeginの値がある場合、
        const dragEnd = d3.pointer(e)[0]; //dragEndをイベント発火時のx座標とする
        if (dragBegin < dragEnd) {
          svg.select("#selector").attr("width", dragEnd - dragBegin); //selecter（矩形）にwidthを与える
        } else {
          svg
            .select("#selector")
            .attr("x", dragEnd) //この場合、イベント発火時のx軸を再定義する必要がある
            .attr("width", dragBegin - dragEnd);
        }
      }
    })
    .on("mouseup", function (e) {
      if (dragBegin) {
        const dragEnd = d3.pointer(e)[0];
        // re-render //⇦矩形サイズが5以下の場合、rangeを変更
        if (-5 > dragEnd - dragBegin) {
          range = [
            (dragEnd / width) * (range[1] - range[0]) + range[0],
            (dragBegin / width) * (range[1] - range[0]) + range[0],
          ];
          reRender();
        } else if (dragEnd - dragBegin > 5) {
          range = [
            (dragBegin / width) * (range[1] - range[0]) + range[0],
            (dragEnd / width) * (range[1] - range[0]) + range[0],
          ];
          reRender();
        }
        svg.select("#selector").remove(); //矩形を除去
        dragBegin = false;
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

  function reRender() {
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
    max_log_p = 0;

    plot_g.html("");
    xlabel_g.html("");
    ylabel_g.html("");

    plot_g
      .selectAll(".plot")
      .data(dataset)
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
        return range[0] <= d.pos && d.pos <= range[1];
      })
      // filter: low p-value
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
        // set max log(p-value)
        if (max_log_p < Math.log10(parseFloat(d[p_value_key])) * -1) {
          max_log_p = Math.log10(parseFloat(d[p_value_key])) * -1;
        }
        return areaHeight;
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

    // set 'cy' from max log(p-value) (int)
    if (max_log_p_int === undefined) {
      max_log_p_int = Math.floor(max_log_p);
    }
    plot_g.selectAll(".plot").attr("cy", function (d) {
      return (
        areaHeight -
        ((Math.log10(parseFloat(d[p_value_key])) * -1 - low_thresh) *
          areaHeight) /
          max_log_p_int
      );
    });

    console.log("over_thresh_array", over_thresh_array);

    renderCanvas(range);

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
    for (let i = Math.floor(low_thresh) + 1; i <= max_log_p_int; i++) {
      const y = areaHeight - ((i - low_thresh) * areaHeight) / max_log_p_int;
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

      // overthresh-line (high_thresh)
      if (i === high_thresh) {
        // let y = areaHeight - ((i - low_thresh) * areaHeight) / max_log_p_int;
        axis_g
          .append("path") //x軸
          .attr("d", "M " + marginLeft + ", " + y + " H " + width + " Z")
          .attr("class", "overthresh-line");
      }
    }
    // y zero (low_thresh)
    ylabel_g
      .append("text")
      .text(low_thresh)
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
  }

  function renderCanvas(range) {
    if (canvas.node().getContext) {
      canvas.attr("width", (total / (range[1] - range[0])) * areaWidth);
      const ctx = canvas.node().getContext("2d");
      ctx.clearRect(0, 0, areaWidth, areaHeight);
      for (const d of dataset) {
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
        fields: [
          {
            label: "First name",
            required: true,
          },
          {
            label: "Middle name",
            required: false,
          },
          {
            label: "Last name",
            required: true,
          },
        ],
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
      console.log(start + chromosomeNtLength.hg38[ch]);
    }
    ctrl_button.select("#range_text").html(text);
  }
}