import * as d3 from "d3";
import { appendDlButton } from "@/lib/metastanza_utils.js";
import data from "./gwas.var2.json";

//when you put json url
// console.log(params["data-url"]]);
// const dataset = await getFormatedJson(
//   params["data-url"],
//   stanza.root.querySelector("#chart")
// );
// console.log("dataset", dataset);

// study name(single per a json)
const dataset = data.dataset;
const studyName = Object.keys(dataset)[0];

//project data and project names (single per a json)
const project = Object.values(dataset)[0][0];
const projectName = Object.keys(project)[0];

// stage data and stage names
const stages = Object.values(project);
const stageDatum = stages[0];
let stageNames = Object.keys(stageDatum);

const fixedStageNamesOrder = [
  "discovery",
  "replication",
  "combined",
  "meta analysis",
  "not provided",
];

stageNames = fixedStageNamesOrder.filter((stageName) => {
  if (stageDatum[stageName]) {
    return true;
  } else {
    return false;
  }
});

//add stage information to each plot
for (let i = 0; i < stageNames.length; i++) {
  for (let j = 0; j < stages[0][stageNames[i]].variants.length; j++) {
    stages[0][stageNames[i]].variants[j].stage = stageNames[i];
  }
}

//combine variants to display
let totalVariants = [];
stageNames.forEach(
  (stage) => (totalVariants = totalVariants.concat(stageDatum[stage].variants))
);

// get stage information
const getVariants = () => {
  let variantsArray = [];
  stageNames.forEach((stage) => {
    if (stageDatum[stage].checked) {
      variantsArray = variantsArray.concat(stageDatum[stage].variants);
    }
  });
  return variantsArray;
};
let variants = totalVariants; //init

export default async function manhattanPlot(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      studyName,
      projectName,
    },
  });

  //append checkbox and its conditions to filter stages
  const stageList = stanza.root.querySelector("#stageList");
  const firstConditionList = stanza.root.querySelector("#firstConditionList");
  const secondConditionList = stanza.root.querySelector("#secondConditionList");

  let td;
  let input;
  let label;

  for (let i = 0; i < stageNames.length; i++) {
    td = document.createElement("td");
    input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("class", "stage-btn");
    input.setAttribute("id", `${stageNames[i]}Btn`);
    input.setAttribute("name", "stage");
    input.setAttribute("value", stageNames[i]);
    input.setAttribute("checked", true);
    input.setAttribute("data-stage", stageNames[i]);
    label = document.createElement("label");
    label.textContent = stageNames[i];
    label.setAttribute("for", `${stageNames[i]}Btn`);
    label.setAttribute("data-stage", stageNames[i]);
    stageList.appendChild(td);
    td.appendChild(input);
    td.appendChild(label);
    stageDatum[stageNames[i]].checked = true;
  }

  for (let i = 0; i < stageNames.length; i++) {
    td = document.createElement("td");
    td.setAttribute("class", "condition-key");
    td.innerText = stageDatum[stageNames[i]].condition1;
    firstConditionList.appendChild(td);
  }

  for (let i = 0; i < stageNames.length; i++) {
    td = document.createElement("td");
    td.setAttribute("class", "condition-key");
    td.innerText = stageDatum[stageNames[i]].condition2;
    secondConditionList.appendChild(td);
  }

  // adjust datum
  for (let i = 0; i < variants.length; i++) {
    // convert chromosome data from 'chrnum' to 'num'
    let chr = variants[i].chr;
    chr = chr.replace("chr", "");
    variants[i].chr = chr;

    const pval = variants[i]["p-value"];
    String(pval);

    const physicalPosition = variants[i]["stop"];
    String(physicalPosition);
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

  const chartElement = stanza.root.querySelector("#chart");
  const controlElement = stanza.root.querySelector("#control");
  let overThreshArray;

  if (params.lowThresh === "") {
    params.lowThresh = 4;
  }
  if (params.highThresh === "") {
    params.highThresh = Infinity;
  }
  if (params.chromosomeKey === "") {
    params.chromosomeKey = "chr";
  }
  if (params.positionKey === "") {
    params.positionKey = "position";
  }
  if (params.pValueKey === "") {
    params.pValueKey = "p-value";
  }

  const lowThresh = parseFloat(params.lowThresh);
  let highThresh = parseFloat(params.highThresh);

  const chromosomeKey = params.chromosomeKey;
  const positionKey = params.positionKey;
  const pValueKey = params.pValueKey;

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

  const canvasDiv = d3
    .select(chartElement)
    .append("div")
    .style("width", areaWidth + "px")
    .style("overflow", "hidden")
    .style("position", "absolute")
    .style("left", marginLeft + "px");
  const canvas = canvasDiv
    .append("canvas")
    .attr("width", areaWidth)
    .attr("height", areaHeight)
    .style("position", "relative");
  const svg = d3
    .select(chartElement)
    .append("svg")
    .attr("width", width)
    .attr("height", height + 10);
  const axisGroup = svg.append("g").attr("id", "axis");
  const sliderShadowGroup = svg.append("g").attr("id", "slider_shadow");
  const xLabelGroup = svg.append("g").attr("id", "x_label");
  const yLabelGroup = svg.append("g").attr("id", "y_label");
  const yTitle = svg.append("g").attr("id", "y_title");
  const plotGroup = svg.append("g").attr("id", "plot_group");
  const threshlineGroup = svg.append("g").attr("id", "thresh_line");
  const tooltip = d3
    .select(chartElement)
    .append("div")
    .attr("class", "tooltip");

  let horizonalRange = []; // [begin position, end _position]
  let varticalRange = []; // [begin position, end _position]
  let maxLogP = 0;
  let maxLogPInt;
  let total;

  // axis line
  axisGroup
    .append("path")
    .attr("d", "M " + marginLeft + ", " + areaHeight + " H " + width + " Z")
    .attr("class", "axis-line");
  axisGroup
    .append("path")
    .attr("d", "M " + marginLeft + ", 0 V " + areaHeight + " Z")
    .attr("class", "axis-line");

  yTitle
    .append("text")
    .text("-log₁₀(p-value)")
    .attr("class", "axis-title")
    .attr("x", -areaHeight / 2)
    .attr("y", marginLeft - 32)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle");

  // select range by drag
  let horizonalDragBegin = false;
  let verticalDragBegin = false;

  svg
    .on("mousedown", function (e) {
      if (d3.pointer(e)[1] <= areaHeight) {
        horizonalDragBegin = d3.pointer(e)[0];
        verticalDragBegin =
          d3.pointer(e)[1] <= paddingTop ? paddingTop : d3.pointer(e)[1];
        svg
          .append("rect")
          .attr("fill", "rgba(128, 128, 128, 0.2)")
          .attr("stroke", "#000000")
          .attr("x", horizonalDragBegin)
          .attr("y", verticalDragBegin)
          .attr("width", 0)
          .attr("height", 0)
          .attr("id", "selector");
      }
    })
    .on("mousemove", function (e) {
      if (horizonalDragBegin) {
        const horizonalDragEnd = d3.pointer(e)[0];
        if (horizonalDragBegin < horizonalDragEnd) {
          svg
            .select("#selector")
            .attr("width", horizonalDragEnd - horizonalDragBegin);
        } else {
          svg
            .select("#selector")
            .attr("x", horizonalDragEnd)
            .attr("width", horizonalDragBegin - horizonalDragEnd);
        }
      }
      if (verticalDragBegin) {
        const verticalDragEnd =
          d3.pointer(e)[1] > areaHeight ? areaHeight : d3.pointer(e)[1];
        if (verticalDragBegin < verticalDragEnd) {
          svg
            .select("#selector")
            .attr("height", verticalDragEnd - verticalDragBegin);
        } else {
          svg
            .select("#selector")
            .attr("y", verticalDragEnd)
            .attr("height", verticalDragBegin - verticalDragEnd);
        }
      }
    })
    .on("mouseup", function (e) {
      if (horizonalDragBegin) {
        const horizonalDragEnd = d3.pointer(e)[0];
        // re-render
        if (5 > horizonalDragEnd - horizonalDragBegin) {
          horizonalRange = [
            ((horizonalDragEnd - marginLeft) / areaWidth) *
              (horizonalRange[1] - horizonalRange[0]) +
              horizonalRange[0],
            ((horizonalDragBegin - marginLeft) / areaWidth) *
              (horizonalRange[1] - horizonalRange[0]) +
              horizonalRange[0],
          ];
        } else if (horizonalDragEnd - horizonalDragBegin > 5) {
          horizonalRange = [
            ((horizonalDragBegin - marginLeft) / areaWidth) *
              (horizonalRange[1] - horizonalRange[0]) +
              horizonalRange[0],
            ((horizonalDragEnd - marginLeft) / areaWidth) *
              (horizonalRange[1] - horizonalRange[0]) +
              horizonalRange[0],
          ];
        }
        svg.select("#selector").remove();
        reRender();
        horizonalDragBegin = false;
      }
      if (verticalDragBegin) {
        const verticalDragEnd =
          d3.pointer(e)[1] > areaHeight ? areaHeight : d3.pointer(e)[1];
        // re-render
        const rangeVerticalLength = varticalRange[1] - varticalRange[0];
        if (0 > verticalDragEnd - verticalDragBegin) {
          const maxLog =
            varticalRange[1] -
            ((verticalDragEnd - paddingTop) / (areaHeight - paddingTop)) *
              rangeVerticalLength;
          const minLog =
            varticalRange[1] -
            ((verticalDragBegin - paddingTop) / (areaHeight - paddingTop)) *
              rangeVerticalLength;
          varticalRange = [minLog, maxLog];
        } else if (verticalDragEnd - verticalDragBegin > 0) {
          const maxLog =
            varticalRange[1] -
            ((verticalDragBegin - paddingTop) / (areaHeight - paddingTop)) *
              rangeVerticalLength;
          const minLog =
            varticalRange[1] -
            ((verticalDragEnd - paddingTop) / (areaHeight - paddingTop)) *
              rangeVerticalLength;
          varticalRange = [minLog, maxLog];
        }
        reRender();
        pagination.init();
        svg.select("#selector").remove();
        horizonalDragBegin = false;
        verticalDragBegin = false;
      }
    });

  // slider
  const ctrl_svg = d3
    .select(controlElement)
    .append("svg")
    .attr("id", "slider_container")
    .attr("width", width)
    .attr("height", 24);
  ctrl_svg
    .append("text")
    .text("chr:")
    .attr("class", "info-key")
    .attr("fill", "#99ACB2")
    .attr("x", 4)
    .attr("y", 16)
    .attr("width", 10)
    .attr("height", 23);
  ctrl_svg
    .append("rect")
    .attr("x", marginLeft)
    .attr("y", 1)
    .attr("width", areaWidth)
    .attr("height", 23)
    .attr("fill", "#FFFFFF")
    .attr("stroke", "#99ACB2")
    .attr("stroke-width", "1px");
  ctrl_svg
    .append("rect")
    .attr("id", "slider")
    .attr("x", marginLeft)
    .attr("y", 1)
    .attr("width", areaWidth)
    .attr("height", 22)
    .attr("fill", "var(--slider-color)")
    .attr("stroke", "#99ACB2")
    .call(
      d3
        .drag()
        .on("start", function (e) {
          horizonalDragBegin = e.x;
        })
        .on("drag", function (e) {
          if (horizonalDragBegin) {
            const slider = ctrl_svg.select("rect#slider");
            let delta = e.x - horizonalDragBegin;
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
            // renderCanvas([horizonalRange[0] + move, horizonalRange[1] + move]);
            canvas
              .style(
                "left",
                ((horizonalRange[0] + move) /
                  (horizonalRange[0] - horizonalRange[1])) *
                  areaWidth +
                  "px"
              )
              .style("display", "block");
            setRange([horizonalRange[0] + move, horizonalRange[1] + move]);
            plotGroup.html("");
            xLabelGroup.html("");
          }
        })
        .on("end", function (e) {
          if (horizonalDragBegin) {
            // re-render
            const slider = ctrl_svg.select("rect#slider");
            let delta = e.x - horizonalDragBegin;
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
            horizonalRange = [
              horizonalRange[0] + move,
              horizonalRange[1] + move,
            ];
            reRender();
            pagination.init();
            horizonalDragBegin = false;
          }
        })
    );

  const sliderlabel_g = ctrl_svg.append("g").attr("id", "sliderLabel");

  sliderlabel_g
    .selectAll(".slider-label")
    .data(chromosomes)
    .enter()
    .append("text")
    .attr("class", "axis-label slider-label")
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
      return (pos / chromosomeSumLength.hg38) * areaWidth + marginLeft;
    })
    .attr("y", 18)
    .attr("fill", "#2F4D76");

  sliderlabel_g
    .selectAll(".slider-ine")
    .data(chromosomes)
    .enter()
    .append("path")
    .attr("class", "slider-line")
    .attr("d", function (d) {
      let pos = chromosomeNtLength.hg38[d];
      for (const ch of chromosomes) {
        if (ch === d) {
          break;
        }
        pos += chromosomeNtLength.hg38[ch];
      }
      const sliderLinePos =
        (pos / chromosomeSumLength.hg38) * areaWidth + marginLeft;
      return "M " + sliderLinePos + ", " + 2 + " V " + 24 + " Z";
    });

  // button
  const ctrlBtn = d3
    .select(controlElement)
    .append("div")
    .attr("id", "ctrl_button");
  ctrlBtn
    .append("span")
    .attr("class", "info-key")
    .text("Position:  ")
    .append("span")
    .attr("class", "range-text")
    .attr("id", "range_text");
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "-")
    .on("click", function () {
      let begin =
        horizonalRange[0] - (horizonalRange[1] - horizonalRange[0]) / 2;
      let end = horizonalRange[1] + (horizonalRange[1] - horizonalRange[0]) / 2;
      if (begin < 0) {
        begin = 0;
        end = (horizonalRange[1] - horizonalRange[0]) * 2;
        if (end > total) {
          end = total;
        }
      } else if (end > total) {
        end = total;
        begin = total - (horizonalRange[1] - horizonalRange[0]) * 2;
        if (begin < 0) {
          begin - 0;
        }
      }
      horizonalRange = [begin, end];
      reRender();
      pagination.init();
    });
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "+")
    .on("click", function () {
      const begin =
        horizonalRange[0] + (horizonalRange[1] - horizonalRange[0]) / 4;
      const end =
        horizonalRange[1] - (horizonalRange[1] - horizonalRange[0]) / 4;
      horizonalRange = [begin, end];
      reRender();
      pagination.init();
    });
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "reset")
    .on("click", function () {
      horizonalRange = [];
      varticalRange = [];
      reRender();
      pagination.init();
    });
  ctrlBtn
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
    highThresh = parseFloat(threshold.value);
    reRender();
    pagination.init();
  });

  reRender();

  //listen stage checkbox event
  const stageBtn = stanza.root.querySelectorAll(".stage-btn");

  for (let i = 0; i < stageBtn.length; i++) {
    stageBtn[i].addEventListener("change", (e) => {
      const stageName = e.path[0].getAttribute("data-stage");
      stageDatum[stageName].checked = stageBtn[i].checked;
      variants = getVariants();
      reRender();
      pagination.init();
    });
  }

  function reRender() {
    if (horizonalRange[0] === undefined) {
      horizonalRange = [
        0,
        Object.values(chromosomeNtLength.hg38).reduce(
          (sum, value) => sum + value
        ),
      ];
      total = horizonalRange[1];
    }

    overThreshArray = [];

    const pValueArray = variants.map(
      (variant) => Math.log10(parseFloat(variant["p-value"])) * -1
    );
    maxLogP = Math.max(...pValueArray);

    if (maxLogPInt === undefined) {
      maxLogPInt = Math.floor(maxLogP);
    }

    if (varticalRange[0] === undefined) {
      varticalRange = [lowThresh, maxLogPInt];
    }

    xLabelGroup.html("");
    yLabelGroup.html("");
    plotGroup.html("");

    plotGroup
      .selectAll(".plot")
      .data(variants)
      .enter()
      // filter: display range
      .filter(function (d) {
        if (!d.pos) {
          // calculate  accumulated position
          let pos = 0;
          for (const ch of chromosomes) {
            if (ch === d[chromosomeKey]) {
              break;
            }
            pos += chromosomeNtLength.hg38[ch];
          }
          d.pos = pos + parseInt(d[positionKey]);
        }
        const logValue = Math.log10(parseFloat(d[pValueKey])) * -1;
        return (
          horizonalRange[0] <= d.pos &&
          d.pos <= horizonalRange[1] &&
          varticalRange[0] <= logValue &&
          logValue <= varticalRange[1]
        );
      })
      .filter(function (d) {
        return Math.log10(parseFloat(d[pValueKey])) * -1 > lowThresh;
      })
      .append("circle")
      .attr("fill", function (d) {
        const stage = d["stage"].replace(/\s/, "-");
        return `var(--${stage}-color)`;
      })
      .attr("cx", function (d) {
        return (
          ((d.pos - horizonalRange[0]) /
            (horizonalRange[1] - horizonalRange[0])) *
            areaWidth +
          marginLeft
        );
      })
      .attr("cy", function (d) {
        const logValue = Math.log10(parseFloat(d[pValueKey])) * -1;
        return (
          ((varticalRange[1] - logValue) /
            (varticalRange[1] - varticalRange[0])) *
            (areaHeight - paddingTop) +
          paddingTop
        );
      })
      .attr("r", 2)
      // filter: high p-value
      .filter(function (d) {
        if (Math.log10(parseFloat(d[pValueKey])) * -1 > highThresh) {
          overThreshArray.push(d);
        }
        return Math.log10(parseFloat(d[pValueKey])) * -1 > highThresh;
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
    renderCanvas(variants, horizonalRange);

    // x axis label
    xLabelGroup
      .selectAll(".x-label")
      .data(chromosomes)
      .enter()
      .append("text")
      .attr("class", "axis-label x-label")
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
          ((pos - horizonalRange[0]) /
            (horizonalRange[1] - horizonalRange[0])) *
            areaWidth +
          marginLeft
        );
      })
      .attr("y", areaHeight + 20);

    // chart background
    xLabelGroup
      .selectAll(".x-background")
      .data(chromosomes)
      .enter()
      .append("rect")
      .attr("class", "axis-label x-background")
      .attr("x", function (d) {
        if (
          chromosomeStartPosition[d] < horizonalRange[0] &&
          horizonalRange[0] < chromosomeStartPosition[d + 1]
        ) {
          return (
            ((chromosomeStartPosition[d] - horizonalRange[0]) /
              (horizonalRange[1] - horizonalRange[0])) *
              areaWidth +
            marginLeft
          );
        } else {
          return (
            ((chromosomeStartPosition[d] - horizonalRange[0]) /
              (horizonalRange[1] - horizonalRange[0])) *
              areaWidth +
            marginLeft
          );
        }
      })
      .attr("y", paddingTop)
      .attr("width", function (d) {
        return (
          (chromosomeNtLength.hg38[d] /
            (horizonalRange[1] - horizonalRange[0])) *
          areaWidth
        );
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
    yLabelGroup
      .append("rect")
      .attr("fill", "#FFFFFF")
      .attr("width", marginLeft - 1)
      .attr("height", areaHeight);

    const overThreshLine = stanza.root.querySelectorAll(".overthresh-line");
    for (
      let i = Math.floor(varticalRange[0]) + 1;
      i <= Math.ceil(varticalRange[1]);
      i++
    ) {
      const y =
        areaHeight -
        ((i - varticalRange[0]) / (varticalRange[1] - varticalRange[0])) *
          (areaHeight - paddingTop);
      //Calucurate display of scale
      const scaleNum = varticalRange[1] - varticalRange[0];
      const tickNum = 20; //Tick number to display (set by manual)
      const tickInterval = Math.floor(scaleNum / tickNum);
      if (varticalRange[1] - varticalRange[0] < tickNum) {
        yLabelGroup
          .append("text")
          .text(i)
          .attr("class", "axis-label y-label")
          .attr("x", marginLeft - 12)
          .attr("y", y)
          .attr("text-anchor", "end");
        yLabelGroup
          .append("path")
          .attr("class", "axis-line")
          .attr(
            "d",
            "M " + (marginLeft - 6) + ", " + y + " H " + marginLeft + " Z"
          );
      } else if (scaleNum >= tickNum) {
        if (i % tickInterval === 0) {
          yLabelGroup
            .append("text")
            .text(i)
            .attr("class", "axis-label y-label")
            .attr("x", marginLeft - 12)
            .attr("y", y)
            .attr("text-anchor", "end");
          yLabelGroup
            .append("path")
            .attr("class", "axis-line")
            .attr(
              "d",
              "M " + (marginLeft - 6) + ", " + y + " H " + marginLeft + " Z"
            );
        }
      }
      if (i === highThresh) {
        threshlineGroup
          .append("path")
          .attr("d", "M " + marginLeft + ", " + y + " H " + width + " Z")
          .attr("class", "overthresh-line");
      }
    }
    for (let i = 0; i < overThreshLine.length; i++) {
      overThreshLine[i].remove();
    }

    // y zero (lowThresh)
    yLabelGroup
      .append("text")
      .text(Math.floor(varticalRange[0]))
      .attr("class", "axis-label y-label")
      .attr("x", marginLeft - 12)
      .attr("y", areaHeight)
      .attr("text-anchor", "end");
    yLabelGroup
      .append("path")
      .attr("class", "axis-line")
      .attr(
        "d",
        "M " + (marginLeft - 8) + ", " + areaHeight + " H " + marginLeft + " Z"
      );

    // slider
    ctrl_svg
      .select("rect#slider")
      .attr("x", marginLeft + (horizonalRange[0] / total) * areaWidth)
      .attr(
        "width",
        ((horizonalRange[1] - horizonalRange[0]) / total) * areaWidth
      )
      .attr("transform", "translate(0, 0)");

    const totalOverThreshVariants = stanza.root.querySelector(
      "#totalOverThreshVariants"
    );
    totalOverThreshVariants.innerText = overThreshArray.length;
    setRange(horizonalRange);

    //slider shadow (Show only when chart is zoomed)
    const sliderShadow = stanza.root.querySelectorAll(".slider-shadow");
    for (let i = 0; i < sliderShadow.length; i++) {
      sliderShadow[i].remove();
    }

    if (
      horizonalRange[0] !== 0 &&
      horizonalRange[1] !== chromosomeSumLength.hg38
    ) {
      sliderShadowGroup
        .append("path")
        .attr("class", "slider-shadow")
        .attr("fill", "var(--slider-color)")
        .attr("opacity", "0.4")
        .attr(
          "d",
          `
          M ${marginLeft} ${areaHeight}
          L ${width} ${areaHeight}
          L ${
            (horizonalRange[1] / chromosomeSumLength.hg38) * areaWidth +
            marginLeft
          } ${height + 10}
          L ${
            (horizonalRange[0] / chromosomeSumLength.hg38) * areaWidth +
            marginLeft
          } ${height + 10}
          z
        `
        );
    }
  }

  function renderCanvas(variants, varticalRange) {
    if (canvas.node().getContext) {
      canvas.attr(
        "width",
        (total / (horizonalRange[1] - horizonalRange[0])) * areaWidth
      );
      canvas.attr(
        "height",
        (total / (varticalRange[1] - varticalRange[0])) * areaHeight
      );
      const ctx = canvas.node().getContext("2d");
      ctx.clearRect(0, 0, areaWidth, areaHeight);
      console.log("sliderShadowGroup", sliderShadowGroup);

      for (const d of variants) {
        const stage = d["stage"].replace(/\s/, "-").toLowerCase();
        ctx.beginPath();
        ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue(
          `--${stage}-color`
        );
        ctx.arc(
          (d.pos / (horizonalRange[1] - horizonalRange[0])) * areaWidth,
          areaHeight -
            ((Math.log10(parseFloat(d[pValueKey])) * -1 - lowThresh) *
              areaHeight) /
              maxLogPInt,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      canvas.style(
        "left",
        (horizonalRange[0] / (horizonalRange[0] - horizonalRange[1])) *
          areaWidth +
          "px"
      );
    }
    canvas.style("display", "none");
  }

  function setRange(horizonalRange) {
    let start = 0;
    let text = "";
    for (const ch of chromosomes) {
      if (start + chromosomeNtLength.hg38[ch] >= horizonalRange[0] && !text) {
        text += " chr" + ch + ":" + Math.floor(horizonalRange[0]);
      }
      if (start + chromosomeNtLength.hg38[ch] >= horizonalRange[1]) {
        text += " - chr" + ch + ":" + Math.floor(horizonalRange[1] - start);
        break;
      }
      start += chromosomeNtLength.hg38[ch];
    }
    ctrlBtn.select("#range_text").html(text);
  }

  function Pagination() {
    const pageBtns = stanza.root.querySelectorAll(".page-btn");
    const prevBtn = stanza.root.querySelector("#prevBtn");
    const nextBtn = stanza.root.querySelector("#nextBtn");
    const firstBtn = stanza.root.querySelector("#firstBtn");
    const lastBtn = stanza.root.querySelector("#lastBtn");

    let currentPage = 1;
    const recordsPerPage = params["recordsPerPage"];
    const totalPage = Math.ceil(overThreshArray.length / recordsPerPage);

    this.init = function () {
      updateTable(1);
      addEventListeners();
    };

    const surroundingPages = function () {
      let start, end;
      if (currentPage <= 3) {
        start = 1;
        end = Math.min(start + 4, totalPage);
      } else if (totalPage - currentPage <= 3) {
        end = totalPage;
        start = Math.max(end - 4, 1);
      } else {
        start = Math.max(currentPage - 2, 1);
        end = Math.min(currentPage + 2, totalPage);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const addEventListeners = function () {
      prevBtn.addEventListener("click", () => {
        updateTable(currentPage - 1);
      });
      nextBtn.addEventListener("click", () => {
        updateTable(currentPage + 1);
      });
      firstBtn.addEventListener("click", () => {
        updateTable(1);
      });
      lastBtn.addEventListener("click", () => {
        updateTable(totalPage);
      });
    };

    const updateTable = function (page) {
      currentPage = page;
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
        let i = (page - 1) * recordsPerPage;
        i < page * recordsPerPage && i < overThreshArray.length;
        i++
      ) {
        const tr = document.createElement("tr");
        for (let j = 0; j < tableHeadArray.length; j++) {
          const td = document.createElement("td");
          if (overThreshArray[i][`${tableHeadArray[j]}`]) {
            if (tableHeadArray[j] === "gene_name") {
              const displayedGeneName =
                overThreshArray[i][`${tableHeadArray[j]}`];
              td.innerHTML = `<a href="https://mgend.med.kyoto-u.ac.jp/gene/info/${overThreshArray[i].entrez_id}#locuszoom-link">${displayedGeneName}</a>`;
            } else {
              td.innerText = overThreshArray[i][`${tableHeadArray[j]}`];
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
      const surroundingPage = surroundingPages();

      for (const i of surroundingPage) {
        const pageNumBtn = document.createElement("span");
        pageNumBtn.innerText = i;
        pageNumBtn.setAttribute("class", "page-btn");

        if (i === currentPage) {
          pageNumBtn.classList.add("current");
        }

        pageNumBtn.addEventListener("click", () => {
          updateTable(i);
        });
        pageNumber.append(pageNumBtn);
      }
      pageBtns.forEach((pageBtns) => (pageBtns.style.display = "flex"));

      if (currentPage === 1) {
        firstBtn.style.display = "none";
        prevBtn.style.display = "none";
      }

      if (currentPage === totalPage) {
        nextBtn.style.display = "none";
        lastBtn.style.display = "none";
      }
    };
  }
  const pagination = new Pagination();
  pagination.init();
}
