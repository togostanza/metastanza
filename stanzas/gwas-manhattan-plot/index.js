import * as d3 from "d3";
import { appendDlButton } from "@/lib/metastanza_utils.js";
import data from "../gwas-manhattan-plot/gwas.var2.json";

//when you put json url
// console.log(params.api);
// const dataset = await getFormatedJson(
//   params.api,
//   stanza.root.querySelector("#chart")
// );
// console.log("dataset", dataset);

// study name(single per a json)
const dataset = data.dataset;
const study_name = Object.keys(dataset)[0];

//project data and project names(single per a json)
const project = Object.values(dataset)[0][0];
const project_name = Object.keys(project)[0];

// stage data and stage names
const stages = Object.values(project);
const stage_info = stages[0];

let stage_names = Object.keys(stage_info);
const fixed_order_stage_names = [
  "discovery",
  "replication",
  "combined",
  "meta-analysis",
  "not provided",
];
stage_names = fixed_order_stage_names.filter((stage_name) => {
  if (stage_info[stage_name]) {
    return true;
  } else {
    return false;
  }
});

//add stage information to each plot
for (let i = 0; i < stage_names.length; i++) {
  for (let j = 0; j < stages[0][stage_names[i]].variants.length; j++) {
    stages[0][stage_names[i]].variants[j].stage = stage_names[i];
  }
}

//combine variants to display
let total_variants = [];
stage_names.forEach(
  (stage) =>
    (total_variants = total_variants.concat(stage_info[stage].variants))
);

// get stage information
const getVariants = () => {
  let variantsArray = [];
  stage_names.forEach((stage) => {
    if (stage_info[stage].checked) {
      variantsArray = variantsArray.concat(stage_info[stage].variants);
    }
  });
  return variantsArray;
};
let variants = total_variants; //init

export default async function gwasManhattanPlot(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      study_name,
      project_name,
    },
  });

  //append checkbox and its conditions to filter stages
  const stageList = stanza.root.querySelector("#stageList");
  const firstConditionList = stanza.root.querySelector("#firstConditionList");
  const secondConditionList = stanza.root.querySelector("#secondConditionList");

  let td;
  let input;
  let label;

  for (let i = 0; i < stage_names.length; i++) {
    td = document.createElement("td");
    input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", "stage-btn");
    input.setAttribute("id", `${stage_names[i]}Btn`);
    input.setAttribute("name", "stage");
    input.setAttribute("value", stage_names[i]);
    input.setAttribute("checked", true);
    input.setAttribute("data-stage", stage_names[i]);
    label = document.createElement("label");
    label.textContent = stage_names[i];
    label.setAttribute("for", `${stage_names[i]}Btn`);
    label.setAttribute("data-stage", stage_names[i]);
    stageList.appendChild(td);
    td.appendChild(input);
    td.appendChild(label);
    stage_info[stage_names[i]].checked = true;
  }

  for (let i = 0; i < stage_names.length; i++) {
    td = document.createElement("td");
    td.setAttribute("class", "condition-key");
    td.innerText = stage_info[stage_names[i]].condition1;
    firstConditionList.appendChild(td);
  }

  for (let i = 0; i < stage_names.length; i++) {
    td = document.createElement("td");
    td.setAttribute("class", "condition-key");
    td.innerText = stage_info[stage_names[i]].condition2;
    secondConditionList.appendChild(td);
  }

  // adjust datum
  for (let i = 0; i < variants.length; i++) {
    // convert chromosome data from 'chrnum' to 'num'
    const chr = variants[i].chr;
    chr = chr.replace("chr", "");
    variants[i].chr = chr;

    const pval = variants[i]["p-value"];
    String(pval);

    const physical_pos = variants[i]["stop"];
    String(physical_pos);
  }

  if (typeof variants === "object") {
    draw(stanza, params);
    appendDlButton(
      stanza.root.querySelector("#chart"),
      stanza.root.querySelector("svg"),
      "manhattan_plot",
      stanza
    );
  }
}

async function draw(stanza, params) {
  const width = 800;
  const height = 400;
  const marginLeft = 40;
  const marginBottom = 30;
  const paddingTop = 10;
  const areaWidth = width - marginLeft;
  const areaHeight = height - marginBottom;

  const chart_element = stanza.root.querySelector("#chart");
  const control_element = stanza.root.querySelector("#control");
  let over_thresh_array;

  if (params.low_thresh === "") {
    params.low_thresh = 4;
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
  // if (params.label_key === "") {
  //   params.label_key = "label";
  // }
  const low_thresh = parseFloat(params.low_thresh);
  let high_thresh = parseFloat(params.high_thresh);

  const even_and_odd = params.even_and_odd === "true";
  const chromosome_key = params.chromosome_key;
  const position_key = params.position_key;
  const p_value_key = params.p_value_key;
  // const label_key = params.label_key;

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
  const chromosomeSumLength = {};
  Object.keys(chromosomeNtLength).forEach((ref) => {
    chromosomeSumLength[ref] = Object.keys(chromosomeNtLength[ref]).reduce(
      (acc, chr) => chromosomeNtLength[ref][chr] + acc,
      0
    );
  });

  const chromosomeArray = Object.values(chromosomeNtLength.hg38);
  const chromosomeStartPosition = {};
  let startPos = 0;
  for (let i = 0; i < chromosomeArray.length; i++) {
    const chr = chromosomes[i];
    if (chr === "1") {
      chromosomeStartPosition[chr] = 0;
    } else {
      startPos += chromosomeArray[i - 1];
      chromosomeStartPosition[chr] = startPos;
    }
  }

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
  const axis_g = svg.append("g").attr("id", "axis");
  const ytitle = svg.append("g").attr("id", "y_title");
  const xlabel_g = svg.append("g").attr("id", "x_label");
  const ylabel_g = svg.append("g").attr("id", "y_label");
  const plot_g = svg.append("g").attr("id", "plot_group");
  const threshline_g = svg.append("g").attr("id", "thresh_line");
  const tooltip = d3
    .select(chart_element)
    .append("div")
    .attr("class", "tooltip");

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

  ytitle
    .append("text")
    .text("-log₁₀(p-value)")
    .attr("class", "axis-title")
    .attr("x", -areaHeight / 2)
    .attr("y", marginLeft - 32)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle");

  // select range by drag
  let dragBegin = false;
  let dragBeginVertical = false;

  svg
    .on("mousedown", function (e) {
      if (d3.pointer(e)[1] <= areaHeight) {
        dragBegin = d3.pointer(e)[0];
        dragBeginVertical =
          d3.pointer(e)[1] <= paddingTop ? paddingTop : d3.pointer(e)[1];
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
        // re-render
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
        svg.select("#selector").remove();
        reRender();
        dragBegin = false;
      }
      if (dragBeginVertical) {
        const dragEndVertical =
          d3.pointer(e)[1] > areaHeight ? areaHeight : d3.pointer(e)[1];
        // re-render
        const rangeVerticalLength = rangeVertical[1] - rangeVertical[0];
        if (0 > dragEndVertical - dragBeginVertical) {
          const maxLog =
            rangeVertical[1] -
            ((dragEndVertical - paddingTop) / (areaHeight - paddingTop)) *
              rangeVerticalLength;
          const minLog =
            rangeVertical[1] -
            ((dragBeginVertical - paddingTop) / (areaHeight - paddingTop)) *
              rangeVerticalLength;
          rangeVertical = [minLog, maxLog];
        } else if (dragEndVertical - dragBeginVertical > 0) {
          const maxLog =
            rangeVertical[1] -
            ((dragBeginVertical - paddingTop) / (areaHeight - paddingTop)) *
              rangeVerticalLength;
          const minLog =
            rangeVertical[1] -
            ((dragEndVertical - paddingTop) / (areaHeight - paddingTop)) *
              rangeVerticalLength;
          rangeVertical = [minLog, maxLog];
        }
        reRender();
        pagination.init();
        svg.select("#selector").remove();
        dragBegin = false;
        dragBeginVertical = false;
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
            pagination.init();
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
    .append("span")
    .attr("class", "info-key")
    .text("Position:  ")
    .append("span")
    .attr("class", "range-text")
    .attr("id", "range_text");
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
      pagination.init();
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
      pagination.init();
    });
  ctrl_button
    .append("input")
    .attr("type", "button")
    .attr("value", "reset")
    .on("click", function () {
      range = [];
      rangeVertical = [];
      reRender();
      pagination.init();
    });
  ctrl_button
    .append("label")
    .attr("class", "info-key -threshold")
    .text("Threshold:  ")
    .append("input")
    .attr("class", "threshold-input")
    .attr("id", "threshold")
    .attr("type", "text")
    .attr("value", "8");

  const threshold = stanza.root.querySelector("#threshold");
  threshold.addEventListener("input", function () {
    high_thresh = parseFloat(threshold.value);
    reRender();
    pagination.init();
  });

  reRender();

  //listen stage checkbox event
  const stageBtn = stanza.root.querySelectorAll(".stage-btn");

  for (let i = 0; i < stageBtn.length; i++) {
    stageBtn[i].addEventListener("change", (e) => {
      const stageName = e.path[0].getAttribute("data-stage");
      stage_info[stageName].checked = stageBtn[i].checked;
      variants = getVariants();
      reRender();
      pagination.init();
    });
  }

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

    xlabel_g.html("");
    ylabel_g.html("");
    plot_g.html("");

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
        const logValue = Math.log10(parseFloat(d[p_value_key])) * -1;
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
        return d["stage"].toLowerCase();
      })
      .attr("cx", function (d) {
        return (
          ((d.pos - range[0]) / (range[1] - range[0])) * areaWidth + marginLeft
        );
      })
      .attr("cy", function (d) {
        const logValue = Math.log10(parseFloat(d[p_value_key])) * -1;
        return (
          ((rangeVertical[1] - logValue) /
            (rangeVertical[1] - rangeVertical[0])) *
            (areaHeight - paddingTop) +
          paddingTop
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
        tooltip
          .style("display", "block")
          .style("left", `${d3.pointer(e)[0] + 8}px`)
          .style(
            "top",
            `${d3.pointer(e)[1]}px`
          ).html(`<p class="tooltip-chr">chr${d.chr}:${d.start}</p>
                <ul class="tooltip-info">
                  <li><span class="tooltip-key">rsId:&nbsp;</span>${d.rsId}</li>
                  <li><span class="tooltip-key">Gene name:&nbsp;</span>${d.gene_name}</li>
                  <li><span class="tooltip-key">Ref/Alt:&nbsp;</span>${d.ref}/${d.alt}</li>
                  <li><span class="tooltip-key">P-value:&nbsp;</span>${d["p-value"]}</li>
                </ul>`);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
      });
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

    // x axis label
    xlabel_g
      .selectAll(".xBackground")
      .data(chromosomes)
      .enter()
      .append("rect")
      .attr("class", "axisLabel xBackground")
      .attr("x", function (d) {
        if (
          chromosomeStartPosition[d] < range[0] &&
          range[0] < chromosomeStartPosition[d + 1]
        ) {
          return (
            ((chromosomeStartPosition[d] - range[0]) / (range[1] - range[0])) *
              areaWidth +
            marginLeft
          );
        } else {
          return (
            ((chromosomeStartPosition[d] - range[0]) / (range[1] - range[0])) *
              areaWidth +
            marginLeft
          );
        }
      })
      .attr("y", paddingTop)
      .attr("width", function (d) {
        return (chromosomeNtLength.hg38[d] / (range[1] - range[0])) * areaWidth;
      })
      .attr("opacity", "0.4")
      .attr("height", areaHeight - paddingTop)
      .attr("fill", function (d) {
        if (d % 2 === 0 || d === "Y") {
          return "#EEEEEE";
        } else if (d % 2 !== 0 || d === "X") {
          return "#FFFFFF";
        }
      });

    // y axis label
    ylabel_g
      .append("rect")
      .attr("fill", "#FFFFFF")
      .attr("width", marginLeft - 1)
      .attr("height", areaHeight);

    const overThreshLine = stanza.root.querySelectorAll(".overthresh-line");
    for (
      let i = Math.floor(rangeVertical[0]) + 1;
      i <= Math.ceil(rangeVertical[1]);
      i++
    ) {
      const y =
        areaHeight -
        ((i - rangeVertical[0]) / (rangeVertical[1] - rangeVertical[0])) *
          (areaHeight - paddingTop);
      //calucurate display of scale
      const scaleNum = rangeVertical[1] - rangeVertical[0];
      const tickNum = 20; //Tick number to display(set by manual)
      const tickInterval = Math.floor(scaleNum / tickNum);
      if (rangeVertical[1] - rangeVertical[0] < tickNum) {
        ylabel_g
          .append("text")
          .text(i)
          .attr("class", "axisLabel yLabel")
          .attr("x", marginLeft - 12)
          .attr("y", y)
          .attr("text-anchor", "end");
        ylabel_g
          .append("path")
          .attr("class", "axis-line")
          .attr(
            "d",
            "M " + (marginLeft - 6) + ", " + y + " H " + marginLeft + " Z"
          );
      } else if (scaleNum >= tickNum) {
        if (i % tickInterval === 0) {
          ylabel_g
            .append("text")
            .text(i)
            .attr("class", "axisLabel yLabel")
            .attr("x", marginLeft - 12)
            .attr("y", y)
            .attr("text-anchor", "end");
          ylabel_g
            .append("path")
            .attr("class", "axis-line")
            .attr(
              "d",
              "M " + (marginLeft - 6) + ", " + y + " H " + marginLeft + " Z"
            );
        }
      }
      if (i === high_thresh) {
        threshline_g
          .append("path")
          .attr("d", "M " + marginLeft + ", " + y + " H " + width + " Z")
          .attr("class", "overthresh-line");
      }
    }
    for (let i = 0; i < overThreshLine.length; i++) {
      overThreshLine[i].remove();
    }

    // y zero (low_thresh)
    ylabel_g
      .append("text")
      .text(Math.floor(rangeVertical[0]))
      .attr("class", "axisLabel yLabel")
      .attr("x", marginLeft - 12)
      .attr("y", areaHeight)
      .attr("text-anchor", "end");
    ylabel_g
      .append("path")
      .attr("class", "axis-line")
      .attr(
        "d",
        "M " + (marginLeft - 8) + ", " + areaHeight + " H " + marginLeft + " Z"
      );

    // slider
    ctrl_svg
      .select("rect#slider")
      .attr("x", marginLeft + (range[0] / total) * areaWidth)
      .attr("width", ((range[1] - range[0]) / total) * areaWidth)
      .attr("transform", "translate(0, 0)");

    const totalOverThreshVariants = stanza.root.querySelector(
      "#totalOverThreshVariants"
    );
    totalOverThreshVariants.innerText = over_thresh_array.length;
    setRange(range);
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
  }

  function setRange(range) {
    let start = 0;
    let text = "";
    for (const ch of chromosomes) {
      if (start + chromosomeNtLength.hg38[ch] >= range[0] && !text) {
        text += " chr" + ch + ":" + Math.floor(range[0]);
      }
      if (start + chromosomeNtLength.hg38[ch] >= range[1]) {
        text += " - chr" + ch + ":" + Math.floor(range[1] - start);
        break;
      }
      start += chromosomeNtLength.hg38[ch];
    }
    ctrl_button.select("#range_text").html(text);
  }

  function Pagination() {
    const pageBtns = stanza.root.querySelectorAll(".page-btn");
    const prevBtn = stanza.root.querySelector("#prevBtn");
    const nextBtn = stanza.root.querySelector("#nextBtn");
    const firstBtn = stanza.root.querySelector("#firstBtn");
    const lastBtn = stanza.root.querySelector("#lastBtn");

    let current_page = 1;
    const records_per_page = params["records_per_page"];
    const total_pages = Math.ceil(over_thresh_array.length / records_per_page);

    this.init = function () {
      updateTable(1);
      addEventListeners();
    };

    const surroundingPages = function () {
      let start, end;
      if (current_page <= 3) {
        start = 1;
        end = Math.min(start + 4, total_pages);
      } else if (total_pages - current_page <= 3) {
        end = total_pages;
        start = Math.max(end - 4, 1);
      } else {
        start = Math.max(current_page - 2, 1);
        end = Math.min(current_page + 2, total_pages);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const addEventListeners = function () {
      prevBtn.addEventListener("click", () => {
        updateTable(current_page - 1);
      });
      nextBtn.addEventListener("click", () => {
        updateTable(current_page + 1);
      });
      firstBtn.addEventListener("click", () => {
        updateTable(1);
      });
      lastBtn.addEventListener("click", () => {
        updateTable(total_pages);
      });
    };

    const updateTable = function (page) {
      current_page = page;
      const listingTable = stanza.root.querySelector("#listingTable");
      listingTable.innerHTML = "";
      const tableHeadArray = [
        "gene_name",
        "rsId",
        "chr",
        "pos",
        "ref",
        "alt",
        "p-value",
      ];

      for (
        let i = (page - 1) * records_per_page;
        i < page * records_per_page && i < over_thresh_array.length;
        i++
      ) {
        const tr = document.createElement("tr");
        for (let j = 0; j < tableHeadArray.length; j++) {
          const td = document.createElement("td");
          if (over_thresh_array[i][`${tableHeadArray[j]}`]) {
            if (tableHeadArray[j] == "gene_name") {
              const displayedGeneName =
                over_thresh_array[i][`${tableHeadArray[j]}`];
              td.innerHTML = `<a href="https://mgend.med.kyoto-u.ac.jp/gene/info/${over_thresh_array[i].rsId}#locuszoom-link">${displayedGeneName}</a>`;
            } else {
              td.innerText = over_thresh_array[i][`${tableHeadArray[j]}`];
            }
          } else {
            td.innerText = "";
          }
          tr.appendChild(td);
        }
        listingTable.appendChild(tr);
      }

      updatePagination();
    };

    const updatePagination = function () {
      const pageNumber = stanza.root.querySelector("#pageNumber");
      pageNumber.innerHTML = "";
      const surrounding_pages = surroundingPages();

      for (const i of surrounding_pages) {
        const page_num = document.createElement("span");
        page_num.innerText = i;
        page_num.setAttribute("class", "page-btn");

        if (i == current_page) {
          page_num.classList.add("current");
        }

        page_num.addEventListener("click", () => {
          updateTable(i);
        });
        pageNumber.append(page_num);
      }
      pageBtns.forEach((pageBtns) => (pageBtns.style.display = "flex"));

      if (current_page == 1) {
        firstBtn.style.display = "none";
        prevBtn.style.display = "none";
      }

      if (current_page == total_pages) {
        nextBtn.style.display = "none";
        lastBtn.style.display = "none";
      }
    };
  }
  const pagination = new Pagination();
  pagination.init();
}
