import { d as defineStanzaElement } from './stanza-element-c2a08f7a.js';
import './index-b2de29ee.js';
import { g as getFormatedJson, a as appendDlButton, s as select } from './metastanza_utils-0648515a.js';
import { p as pointer, d as drag } from './drag-53c70e65.js';
import './timer-be811b16.js';

async function manhattanPlotCanvas(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      title: params.title,
    },
  });

  console.log(params.api);
  const dataset = await getFormatedJson(
    params.api,
    stanza.root.querySelector("#chart")
  );

  draw(dataset, stanza, params);

  appendDlButton(
    stanza.root.querySelector("#chart"),
    stanza.root.querySelector("svg"),
    "manhattan_plot",
    stanza
  );
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

  const canvas_div = select(chart_element)
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
  const svg = select(chart_element)
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
    .append("path")
    .attr("d", "M " + marginLeft + ", " + areaHeight + " H " + width + " Z")
    .attr("class", "axis-line");
  axis_g
    .append("path")
    .attr("d", "M " + marginLeft + ", 0 V " + areaHeight + " Z")
    .attr("class", "axis-line");

  // select range by drag
  let dragBegin = false;
  svg
    .on("mousedown", function (e) {
      if (pointer(e)[1] <= areaHeight) {
        dragBegin = pointer(e)[0];
        svg
          .append("rect")
          .attr("fill", "rgba(128, 128, 128, 0.2)")
          .attr("stroke", "black")
          .attr("x", dragBegin)
          .attr("y", 0)
          .attr("width", 0)
          .attr("height", areaHeight)
          .attr("id", "selector");
      }
    })
    .on("mousemove", function (e) {
      if (dragBegin) {
        const dragEnd = pointer(e)[0];
        if (dragBegin < dragEnd) {
          svg.select("#selector").attr("width", dragEnd - dragBegin);
        } else {
          svg
            .select("#selector")
            .attr("x", dragEnd)
            .attr("width", dragBegin - dragEnd);
        }
      }
    })
    .on("mouseup", function (e) {
      if (dragBegin) {
        const dragEnd = pointer(e)[0];
        // re-render
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
        svg.select("#selector").remove();
        dragBegin = false;
      }
    });

  // slider
  const ctrl_svg = select(control_element)
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
    .attr("fill", "#8888ff")
    .call(
      drag()
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
  const ctrl_button = select(control_element)
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
        return Math.log10(parseFloat(d[p_value_key])) * -1 > high_thresh;
      })
      .classed("over-thresh-plot", true)
      .on("mouseover", function (e, d) {
        svg
          .append("text")
          .text(d[label_key]) //.text(d.dbSNP_RS_ID + ", " + d.Symbol)
          .attr("x", pointer(e)[0] + 10)
          .attr("y", pointer(e)[1])
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
    }
    //// y zero (low_thresh)
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

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': manhattanPlotCanvas
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "manhattan-plot-canvas",
	"stanza:label": "Manhattan plot canvas",
	"stanza:definition": "Manhattan plot metastanza for GWAS data",
	"stanza:type": "MetaStanza",
	"stanza:display": "Graph",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "TogoStanza",
	"stanza:address": "admin@biohackathon.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-10",
	"stanza:updated": "2020-11-10",
	"stanza:parameter": [
	{
		"stanza:key": "api",
		"stanza:example": "https://db-dev.jpostdb.org/test/gwas_test.json",
		"stanza:description": "api (https://db-dev.jpostdb.org/test/gwas_test.json)",
		"stanza:required": true
	},
	{
		"stanza:key": "title",
		"stanza:example": "Manhattan plot",
		"stanza:description": "title",
		"stanza:required": false
	},
	{
		"stanza:key": "chromosome_key",
		"stanza:example": "Chromosome",
		"stanza:description": "key to a chromosome in data frame. default: 'chromosome'",
		"stanza:required": false
	},
	{
		"stanza:key": "position_key",
		"stanza:example": "Physical_position",
		"stanza:description": "key to a position on chromosome in data frame. default: 'position'",
		"stanza:required": false
	},
	{
		"stanza:key": "p_value_key",
		"stanza:example": "CLR_C_BMI_pv",
		"stanza:description": "key to a p-value in data frame. default: 'p-value'",
		"stanza:required": false
	},
	{
		"stanza:key": "label_key",
		"stanza:example": "dbSNP_RS_ID",
		"stanza:description": "key to a label in data frame. default: 'label'",
		"stanza:required": false
	},
	{
		"stanza:key": "low_thresh",
		"stanza:example": "1",
		"stanza:description": "filtering threshold. =log10(p-value) default: 0.5",
		"stanza:required": false
	},
	{
		"stanza:key": "high_thresh",
		"stanza:example": "4",
		"stanza:description": "highlight shreshold. =log10(p-value)",
		"stanza:required": false
	},
	{
		"stanza:key": "even_and_odd",
		"stanza:example": false,
		"stanza:description": "color type",
		"stanza:required": false
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--over-thresh-color",
		"stanza:type": "color",
		"stanza:default": "#ff0000",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-even-color",
		"stanza:type": "color",
		"stanza:default": "#888888",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-odd-color",
		"stanza:type": "color",
		"stanza:default": "#444444",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-1-color",
		"stanza:type": "color",
		"stanza:default": "#ffb6b9",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-2-color",
		"stanza:type": "color",
		"stanza:default": "#fae3d9",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-3-color",
		"stanza:type": "color",
		"stanza:default": "#bbded6",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-4-color",
		"stanza:type": "color",
		"stanza:default": "#8ac6d1",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-5-color",
		"stanza:type": "color",
		"stanza:default": "#a39391",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-6-color",
		"stanza:type": "color",
		"stanza:default": "#716e77",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-7-color",
		"stanza:type": "color",
		"stanza:default": "#ecd6c7",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-8-color",
		"stanza:type": "color",
		"stanza:default": "#e79686",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-9-color",
		"stanza:type": "color",
		"stanza:default": "#cff09e",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-10-color",
		"stanza:type": "color",
		"stanza:default": "#a8dba8",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-11-color",
		"stanza:type": "color",
		"stanza:default": "#79bd9a",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-12-color",
		"stanza:type": "color",
		"stanza:default": "#3b8686",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-13-color",
		"stanza:type": "color",
		"stanza:default": "#a1bd93",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-14-color",
		"stanza:type": "color",
		"stanza:default": "#e1dda1",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-15-color",
		"stanza:type": "color",
		"stanza:default": "#90a9c6",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-16-color",
		"stanza:type": "color",
		"stanza:default": "#1794ac",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-17-color",
		"stanza:type": "color",
		"stanza:default": "#B9A7C2",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-18-color",
		"stanza:type": "color",
		"stanza:default": "#B6D0C9",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-19-color",
		"stanza:type": "color",
		"stanza:default": "#C2DFEA",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-20-color",
		"stanza:type": "color",
		"stanza:default": "#8C95AA",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-21-color",
		"stanza:type": "color",
		"stanza:default": "#C7AFBD",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-22-color",
		"stanza:type": "color",
		"stanza:default": "#a4bf5b",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-X-color",
		"stanza:type": "color",
		"stanza:default": "#79a2a6",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--ch-Y-color",
		"stanza:type": "color",
		"stanza:default": "#CCCC99",
		"stanza:description": "chromosome plot"
	},
	{
		"stanza:key": "--greeting-align",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"left",
			"center",
			"right"
		],
		"stanza:default": "center",
		"stanza:description": "text align of greeting"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h1 id=\"manhattan-title\">\n  "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":2,"column":2},"end":{"line":2,"column":11}}}) : helper)))
    + "\n</h1>\n\n<div id=\"chart\"></div>\n<div id=\"control\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=manhattan-plot-canvas.js.map
