import { d as defineStanzaElement } from './stanza-element-c2a08f7a.js';
import './index-b2de29ee.js';
import { g as getFormatedJson, s as select } from './metastanza_utils-0648515a.js';
import { l as lodash_mapvalues } from './index-832e9a5c.js';
import './timer-be811b16.js';

async function devOverviewDev2(stanza, params) {
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {},
  });

  const apis = JSON.parse(params.apis);

  draw(stanza.root.querySelector("#chart"), apis);
}

async function draw(element, apis) {
  const labelMargin = 100;
  const width = 700;
  const height = 50;

  const dataset = {};
  for (const api of apis) {
    dataset[api] = await getFormatedJson(api, element);
  }

  let body = {};

  for (let id = 0; id < apis.length; id++) {
    const api = apis[id];
    // first render
    const div = select(element)
      .append("div")
      .attr("id", "div_" + id)
      .attr("class", "bar");
    const svg = div
      .append("svg")
      .attr("width", width + labelMargin)
      .attr("height", height);
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", height / 2)
      .attr("alignment-baseline", "central")
      .text(
        dataset[api].type.charAt(0).toUpperCase() + dataset[api].type.slice(1)
      );

    [dataset[api].data, dataset[api].total] = setData(
      dataset[api].data,
      width,
      height,
      labelMargin
    );
    dataset[api].id = id;

    svg.attr("id", "svg_" + dataset[api].type.replace(/\s/g, "_"));

    // bar group
    const bar_g = svg
      .selectAll(".bar-g")
      .data(dataset[api].data)
      .enter()
      .append("g")
      .attr("class", "bar-g")
      .on("mouseover", function (e, d) {
        svg
          .append("text")
          .attr("id", d.onclick_list[0].id)
          .text(d.label + ": " + d.count + "/" + d.origCount)
          .attr("x", function () {
            const x = d.barStart + d.barWidth / 2;
            const left = x - this.getBBox().width / 2;
            const right = x + this.getBBox().width / 2;
            if (left > labelMargin + 10 && right < labelMargin + width - 10) {
              d.textAnchor = "middle";
              return x;
            } else if (left < labelMargin + 10) {
              d.textAnchor = "start";
              return labelMargin + 10;
            }
            d.textAnchor = "end";
            return labelMargin + width - 10;
          })
          .attr("y", height / 2)
          .attr("text-anchor", d.textAnchor)
          .attr("dominant-baseline", "central");
      })
      .on("mouseout", function (e, d) {
        svg.select("text#" + d.onclick_list[0].id).remove();
      })
      .on("click", async function (e, d) {
        // re-render
        const key = dataset[api].type.replace(/\s/g, "_");
        const value = d.onclick_list[0].id;
        if (
          select(e.currentTarget)
            .select("#selected-sign-" + d.onclick_list[0].id)
            .style("display") === "none"
        ) {
          if (body[key]) {
            body[key].push(value);
          } else {
            body[key] = [value];
          }
          for (const api of apis) {
            getDataAndRender(element, api, body, dataset);
          }
          select(e.currentTarget)
            .select("#selected-sign-" + d.onclick_list[0].id)
            .style("display", "block");
        } else {
          if (body[key].length === 1) {
            delete body[key];
          } else {
            for (let i = 0; i < body[key].length; i++) {
              if (body[key][i] === value) {
                body[key].splice(i, 1);
                break;
              }
            }
          }
          for (const api of apis) {
            getDataAndRender(element, api, body, dataset);
          }
          select(e.currentTarget)
            .select("#selected-sign-" + d.onclick_list[0].id)
            .style("display", "none");
        }
      });

    // bg bar
    bar_g
      .append("rect")
      .attr("class", "na-bar")
      .attr("x", function (d) {
        return d.barStart;
      })
      .attr("y", 0)
      .attr("width", function (d) {
        return d.barWidth;
      })
      .attr("height", height);

    // ratio bar
    bar_g
      .append("rect")
      .attr("x", function (d) {
        return d.barStart;
      })
      .attr("y", 0)
      .attr("width", function (d) {
        return d.barWidth;
      })
      .attr("height", height)
      .attr("id", function (d) {
        return d.onclick_list[0].id;
      })
      .attr("class", function (d, i) {
        if (d.label !== "None") {
          return "target-bar bar-style-" + i;
        }
        return "bar-style-na";
      });

    // selected sign
    bar_g
      .append("rect")
      .attr("x", function (d) {
        return d.barStart;
      })
      .attr("y", height - 10)
      .attr("width", function (d) {
        return d.barWidth;
      })
      .attr("height", 10)
      .attr("id", function (d) {
        return "selected-sign-" + d.onclick_list[0].id;
      })
      .attr("class", "selected-sign");
  }

  const initDataset = JSON.parse(JSON.stringify(dataset));
  select(element)
    .append("p")
    .html("&gt; Reset")
    .style("cursor", "pointer")
    .on("click", function () {
      // reset-render
      body = {};
      for (const api of apis) {
        dataset[api].data = changeData(
          dataset[api],
          JSON.parse(JSON.stringify(initDataset[api].data)),
          width,
          height,
          labelMargin
        );
        reRender(element, dataset[api]);
      }
      select(element)
        .selectAll("rect.selected-sign")
        .style("display", "none");
    });

  async function getDataAndRender(element, api, body, dataset) {
    const newData = await getFormatedJson(
      api,
      element.querySelector("#div_" + dataset[api].id),
      lodash_mapvalues(body, (v) => v.join(","))
    );
    dataset[api].data = changeData(
      dataset[api],
      newData.data,
      width,
      height,
      labelMargin
    );
    reRender(element, dataset[api]);
  }

  function reRender(element, dataset) {
    const svg = select(element)
      .select("#svg_" + dataset.type.replace(/\s/g, "_"));
    svg
      .selectAll(".target-bar")
      .data(dataset.data)
      .transition()
      .delay(200)
      .duration(1000)
      .attr("x", function (d) {
        return d.barStart;
      })
      .attr("width", function (d) {
        return d.targetBarWidth;
      });
  }

  function setData(data, width, height, labelMargin) {
    let total = 0;
    for (const category of data) {
      total += parseFloat(category.count);
    }

    let start = labelMargin;
    for (let i = 0; i < data.length; i++) {
      let barWidth = (width * parseFloat(data[i].count)) / total;
      if (data.length - 1 === i) {
        barWidth = width - start + labelMargin;
      }
      data[i].origCount = data[i].count;
      data[i].barStart = start;
      data[i].barWidth = barWidth;
      data[i].targetBarWidth = 0;
      start += barWidth;
    }
    data.push({
      label: "None",
      count: "0",
      barStart: width + labelMargin,
      barWidth: 0,
      onclick_list: [{ id: "n-a" }],
    });
    return [data, total];
  }

  function changeData(dataset, newData, width, height, labelMargin) {
    const data = dataset.data;
    const label2data = {};
    if (!newData[0]) {
      newData = [
        {
          label: "None",
          count: "1",
          onclick_list: [{ id: "n-a" }],
        },
      ];
    }
    for (const category of newData) {
      label2data[category.label] = category;
    }
    let start = labelMargin;
    for (let i = 0; i < data.length; i++) {
      if (label2data[data[i].label]) {
        data[i].count = label2data[data[i].label].count;
      } else {
        data[i].count = 0;
      }
      let targetBarWidth = (width * parseFloat(data[i].count)) / dataset.total;
      if (data.length - 1 === i) {
        targetBarWidth = width - start + labelMargin;
      }
      data[i].targetBarWidth = targetBarWidth;
      start += targetBarWidth;
    }
    return data;
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': devOverviewDev2
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "dev-overview-dev2",
	"stanza:label": "dev Overview dev2",
	"stanza:definition": "",
	"stanza:type": "MetaStanza",
	"stanza:display": "Chart",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "TogoStanza",
	"stanza:address": "admin@biohackathon.org",
	"stanza:contributor": [
],
	"stanza:created": "2020-11-04",
	"stanza:updated": "2020-11-04",
	"stanza:parameter": [
	{
		"stanza:key": "apis",
		"stanza:example": "[\"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=species\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=organ\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=disease\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=sample_type\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=cell_line\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=modification\", \"https://db-dev.jpostdb.org/rest/api/stat_chart_filtering?type=instrument\"]",
		"stanza:description": "api list",
		"stanza:required": true
	}
],
	"stanza:about-link-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--series-0-color",
		"stanza:type": "color",
		"stanza:default": "#ffa8a8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-1-color",
		"stanza:type": "color",
		"stanza:default": "#ffffa8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-2-color",
		"stanza:type": "color",
		"stanza:default": "#a8ffa8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-3-color",
		"stanza:type": "color",
		"stanza:default": "#a8ffff",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-4-color",
		"stanza:type": "color",
		"stanza:default": "#a8a8ff",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-5-color",
		"stanza:type": "color",
		"stanza:default": "#ffa8ff",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-6-color",
		"stanza:type": "color",
		"stanza:default": "#ffd3a8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-7-color",
		"stanza:type": "color",
		"stanza:default": "#d3ffa8",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-8-color",
		"stanza:type": "color",
		"stanza:default": "#a8ffd3",
		"stanza:description": "bar color"
	},
	{
		"stanza:key": "--series-9-color",
		"stanza:type": "color",
		"stanza:default": "#a8d3ff",
		"stanza:description": "bar color"
	}
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>\n  Overview 2\n</h1>\n<div id=\"chart\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=dev-overview-dev2.js.map
