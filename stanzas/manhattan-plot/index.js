import * as d3 from "d3";
import { appendDlButton } from "@/lib/metastanza_utils.js";
import data from "./gwas.var2.json";
import { pagination } from "./table.js";

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
const stageData = Object.values(project)[0];
let stageNames = Object.keys(stageData);

const fixedStageNamesOrder = [
  "discovery",
  "replication",
  "combined",
  "meta analysis",
  "not provided",
];
stageNames = fixedStageNamesOrder.filter((stageName) => {
  if (stageData[stageName]) {
    return true;
  } else {
    return false;
  }
});

//add stage information to each plot
for (let i = 0; i < stageNames.length; i++) {
  for (let j = 0; j < stageData[stageNames[i]].variants.length; j++) {
    stageData[stageNames[i]].variants[j].stage = stageNames[i];
  }
}

//combine variants to display
let totalVariants = [];
stageNames.forEach(
  (stage) => (totalVariants = totalVariants.concat(stageData[stage].variants))
);

// get stage information
const getVariants = () => {
  let variantsArray = [];
  stageNames.forEach((stage) => {
    if (stageData[stage].checked) {
      variantsArray = variantsArray.concat(stageData[stage].variants);
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

  let td, input, label;
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
    stageData[stageNames[i]].checked = true;
  }

  firstConditionList.insertAdjacentHTML(
    "beforeend",
    stageNames
      .map(
        (stage) =>
          `<td class="condition-key">${stageData[stage].condition1}</td>`
      )
      .join("")
  );
  secondConditionList.insertAdjacentHTML(
    "beforeend",
    stageNames
      .map(
        (stage) =>
          `<td class="condition-key">${stageData[stage].condition2}</td>`
      )
      .join("")
  );

  // adjust datum
  for (let i = 0; i < variants.length; i++) {
    // convert chromosome data from 'chrnum' to 'num'
    let chr = variants[i].chr;
    chr = chr.replace("chr", "");
    variants[i].chr = chr;

    const pValue = variants[i]["p-value"];
    String(pValue);

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
  const drawAreaHeight = areaHeight - paddingTop;

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

  let horizonalRange = []; // [begin position, end position]
  let verticalRange = []; // [begin position, end position]
  let maxLogP = 0;
  let maxLogPInt;
  let total;

  const getRangeLength = function (targetRange) {
    return targetRange[1] - targetRange[0];
  };

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
      const horizonalRangeLength = getRangeLength(horizonalRange);
      const verticalRangeLength = getRangeLength(verticalRange);
      if (horizonalDragBegin) {
        const horizonalDragEnd = d3.pointer(e)[0];
        // re-render
        if (horizonalDragBegin > horizonalDragEnd) {
          horizonalRange = [
            ((horizonalDragEnd - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
            ((horizonalDragBegin - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
          ];
        } else if (horizonalDragEnd > horizonalDragBegin) {
          horizonalRange = [
            ((horizonalDragBegin - marginLeft) / areaWidth) *
              horizonalRangeLength +
              horizonalRange[0],
            ((horizonalDragEnd - marginLeft) / areaWidth) *
              horizonalRangeLength +
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
        if (verticalDragBegin > verticalDragEnd) {
          const maxLog =
            verticalRange[1] -
            ((verticalDragEnd - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          const minLog =
            verticalRange[1] -
            ((verticalDragBegin - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          verticalRange = [minLog, maxLog];
        } else if (verticalDragEnd - verticalDragBegin > 0) {
          const maxLog =
            verticalRange[1] -
            ((verticalDragBegin - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          const minLog =
            verticalRange[1] -
            ((verticalDragEnd - paddingTop) / drawAreaHeight) *
              verticalRangeLength;
          verticalRange = [minLog, maxLog];
        }
        reRender();
        pagination(stanza.root, params, overThreshArray);
        svg.select("#selector").remove();
        horizonalDragBegin = false;
        verticalDragBegin = false;
      }
    });

  // slider
  const ctrlSvg = d3
    .select(controlElement)
    .append("svg")
    .attr("id", "slider_container")
    .attr("width", width)
    .attr("height", 24);
  ctrlSvg
    .append("text")
    .text("chr:")
    .attr("class", "info-key")
    .attr("fill", "#99ACB2")
    .attr("x", 4)
    .attr("y", 16)
    .attr("width", 10)
    .attr("height", 23);
  ctrlSvg
    .append("rect")
    .attr("x", marginLeft)
    .attr("y", 1)
    .attr("width", areaWidth)
    .attr("height", 23)
    .attr("fill", "#FFFFFF")
    .attr("stroke", "#99ACB2")
    .attr("stroke-width", "1px");
  ctrlSvg
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
            const slider = ctrlSvg.select("rect#slider");
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
            canvas
              .style(
                "left",
                ((horizonalRange[0] + move) / getRangeLength(horizonalRange)) *
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
            const slider = ctrlSvg.select("rect#slider");
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
            pagination(stanza.root, params, overThreshArray);
            horizonalDragBegin = false;
          }
        })
    );

  const sliderLabelGroup = ctrlSvg.append("g").attr("id", "sliderLabel");

  sliderLabelGroup
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

  sliderLabelGroup
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
      const horizonalRangeLength = getRangeLength(horizonalRange);
      let begin = horizonalRange[0] - horizonalRangeLength / 2;
      let end = horizonalRange[1] + horizonalRangeLength / 2;
      if (begin < 0) {
        begin = 0;
        end = horizonalRangeLength * 2;
        if (end > total) {
          end = total;
        }
      } else if (end > total) {
        end = total;
        begin = total - horizonalRangeLength * 2;
        if (begin < 0) {
          begin - 0;
        }
      }
      horizonalRange = [begin, end];
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "+")
    .on("click", function () {
      const horizonalRangeLength = getRangeLength(horizonalRange);
      const begin = horizonalRange[0] + horizonalRangeLength / 4;
      const end = horizonalRange[1] - horizonalRangeLength / 4;
      horizonalRange = [begin, end];
      reRender();
      pagination(stanza.root, params, overThreshArray);
    });
  ctrlBtn
    .append("input")
    .attr("type", "button")
    .attr("value", "reset")
    .on("click", function () {
      horizonalRange = [];
      verticalRange = [];
      reRender();
      pagination(stanza.root, params, overThreshArray);
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
    pagination(stanza.root, params, overThreshArray);
  });

  reRender();

  //listen stage checkbox event
  const stageBtn = stanza.root.querySelectorAll(".stage-btn");

  for (let i = 0; i < stageBtn.length; i++) {
    stageBtn[i].addEventListener("change", (e) => {
      const stageName = e.path[0].getAttribute("data-stage");
      stageData[stageName].checked = stageBtn[i].checked;
      variants = getVariants();
      reRender();
      pagination(stanza.root, params, overThreshArray);
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

    if (verticalRange[0] === undefined) {
      verticalRange = [lowThresh, maxLogPInt];
    }

    xLabelGroup.html("");
    yLabelGroup.html("");
    plotGroup.html("");

    plotGroup
      .selectAll(".plot")
      .data(variants)
      .enter()
      // filter: displayed range
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
          verticalRange[0] <= logValue &&
          logValue <= verticalRange[1]
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
          ((d.pos - horizonalRange[0]) / getRangeLength(horizonalRange)) *
            areaWidth +
          marginLeft
        );
      })
      .attr("cy", function (d) {
        const logValue = Math.log10(parseFloat(d[pValueKey])) * -1;
        return (
          ((verticalRange[1] - logValue) / getRangeLength(verticalRange)) *
            drawAreaHeight +
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
    renderCanvas(variants);

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
          ((pos - horizonalRange[0]) / getRangeLength(horizonalRange)) *
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
              getRangeLength(horizonalRange)) *
              areaWidth +
            marginLeft
          );
        } else {
          return (
            ((chromosomeStartPosition[d] - horizonalRange[0]) /
              getRangeLength(horizonalRange)) *
              areaWidth +
            marginLeft
          );
        }
      })
      .attr("y", paddingTop)
      .attr("width", function (d) {
        return (
          (chromosomeNtLength.hg38[d] / getRangeLength(horizonalRange)) *
          areaWidth
        );
      })
      .attr("opacity", "0.4")
      .attr("height", drawAreaHeight)
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
      let i = Math.floor(verticalRange[0]) + 1;
      i <= Math.ceil(verticalRange[1]);
      i++
    ) {
      const y =
        areaHeight -
        ((i - verticalRange[0]) / getRangeLength(verticalRange)) *
          drawAreaHeight;
      //Calucurate display of scale
      const tickNum = 20; //Tick number to display (set by manual)
      const tickInterval = Math.floor(getRangeLength(verticalRange) / tickNum);
      if (getRangeLength(verticalRange) < tickNum) {
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
      } else if (getRangeLength(verticalRange) >= tickNum) {
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
      .text(Math.floor(verticalRange[0]))
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
    ctrlSvg
      .select("rect#slider")
      .attr("x", marginLeft + (horizonalRange[0] / total) * areaWidth)
      .attr("width", (getRangeLength(horizonalRange) / total) * areaWidth)
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

  function renderCanvas(variants) {
    const horizonalRangeLength = getRangeLength(horizonalRange);
    if (canvas.node().getContext) {
      canvas.attr("width", (total / horizonalRangeLength) * areaWidth);
      canvas.attr("height", (total / horizonalRangeLength) * areaHeight);
      const ctx = canvas.node().getContext("2d");
      ctx.clearRect(0, 0, areaWidth, areaHeight);

      for (const d of variants) {
        const stage = d["stage"].replace(/\s/, "-").toLowerCase();
        ctx.beginPath();
        ctx.fillStyle = getComputedStyle(stanza.root.host).getPropertyValue(
          `--${stage}-color`
        );
        ctx.arc(
          (d.pos / horizonalRangeLength) * areaWidth,
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
        (horizonalRange[0] / horizonalRangeLength) * areaWidth + "px"
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

  pagination(stanza.root, params, overThreshArray);
}
