import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";
import * as d3 from "d3";
import venn from "venn.js";
import Color from "color";
import {
  downloadSvgMenuItem,
  downloadPngMenuItem,
  appendCustomCss,
} from "togostanza-utils";
import ToolTip from "@/lib/ToolTip";
import Legend from "@/lib/Legend";

export default class VennStanza extends Stanza {
  // colorSeries;
  // data;
  // totals;
  // dataLabels;
  // numberOfData;
  // venn;
  // tooltip;
  // legend;

  menu() {
    return [
      downloadSvgMenuItem(this, "vennstanza"),
      downloadPngMenuItem(this, "vennstanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    this.colorSeries = this.getColorSeries();

    this.renderTemplate({ template: "stanza.html.hbs" });

    // append tooltip, legend
    const root = this.root.querySelector(":scope > div");
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
      this.legend = new Legend();
      root.append(this.legend);
    }

    // get data
    this.data = await this.getData();
    console.log(this.data);
    this.totals = this.data.map((datum) => {
      const total = {
        set: datum.set,
        size: 0,
      };
      const matchedData = this.data.filter((datum2) =>
        datum.set.every((item) => datum2.set.indexOf(item) !== -1)
      );
      total.size = matchedData.reduce((acc, datum) => acc + datum.size, 0);
      return total;
    });
    this.dataLabels = Array.from(
      new Set(this.data.map((datum) => datum.set).flat())
    );
    this.numberOfData = this.dataLabels.length;
    this.venn = new Map();

    // draw
    switch (this.params["chart-type"]) {
      case "Venn diagram":
        this.drawVennDiagram();
        break;
      case "Euler diagram":
        this.drawEulerDiagram();
        break;
    }
  }

  drawVennDiagram() {
    // set common parameters and styles
    const container = this.root.querySelector("#venn-diagrams");
    const svgWidth = this.params["width"];
    const svgHeight = this.params["height"];
    container.style.width = svgWidth + "px";
    container.style.height = svgHeight + "px";

    // show venn diagram corresponds to data(circle numbers to draw)
    const selectedDiagram = this.root.querySelector(
      `.venn-diagram[data-number-of-data="${this.numberOfData}"]`
    );
    if (!selectedDiagram) {
      console.error(
        "Venn diagrams with more than six elements are not supported. Please try using Euler diagrams."
      );
      return;
    }
    selectedDiagram.classList.add("-current");
    this.venn.set("node", selectedDiagram);

    // set scale
    const containerRect = this.root
      .querySelector("main")
      .getBoundingClientRect();
    const rect = selectedDiagram.getBoundingClientRect();
    const margin = Math.max(rect.x - containerRect.x, rect.y - containerRect.y);
    const scale = Math.min(
      svgWidth / (rect.width + margin * 2),
      svgHeight / (rect.height + margin * 2)
    );
    selectedDiagram.setAttribute("transform", `scale(${scale})`);
    const labelFontSize = +window
      .getComputedStyle(this.element)
      .getPropertyValue("--togostanza-label-font-size")
      .trim();
    selectedDiagram.querySelectorAll("text").forEach((text) => {
      text.style.fontSize = labelFontSize / scale + "px";
    });

    // shapes
    selectedDiagram.querySelectorAll(":scope > g").forEach((group) => {
      const targets = group.dataset.targets.split(",").map((target) => +target);
      const labels = targets.map((target) => this.dataLabels[target]);
      const count =
        this.data.find((datum) => {
          return (
            datum.set.length === labels.length &&
            labels.every((label) =>
              datum.set.find((label2) => label === label2)
            )
          );
        })?.size ?? "";
      // set color
      const color = this.getBlendedColor(targets);
      group
        .querySelector(":scope > .part")
        .setAttribute("fill", color.toString());
      // set label
      group.querySelector(":scope > text.label").textContent = labels.join(",");
      group.querySelector(":scope > text.value").textContent = count;
      // tooltip
      group.dataset.tooltip = `<strong>${labels.join("∩")}</strong>: ${count}`;
      group.dataset.tooltipHtml = true;
      // this.setTooltip(group);
    });
    this.tooltip.setup(selectedDiagram.querySelectorAll("[data-tooltip]"));

    // legend
    const items = this.data.map((datum) => {
      const id = datum.set
        .map((item) => this.dataLabels.indexOf(item))
        .sort()
        .join(",");
      const color = this.getBlendedColor(
        datum.set.map((item) => this.dataLabels.indexOf(item))
      );
      return Object.fromEntries([
        ["id", id],
        ["label", datum.set.map((item) => item).join("∩")],
        ["color", color.toString()],
        ["value", datum.size],
        [
          "node",
          selectedDiagram.querySelector(`:scope > g[data-targets="${id}"]`),
        ],
      ]);
    });
    this.legend.setup(items, this.root.querySelector("main"), {
      fadeoutNodes: selectedDiagram.querySelectorAll(":scope > g"),
    });
  }

  drawEulerDiagram() {
    const container = this.root.querySelector("#euler-diagram");
    container.style.width = this.params["width"] + "px";
    container.style.height = this.params["height"] + "px";
    container.dataset.blendMode = this.params["blend-mode"];
    const d3Container = d3.select(container);
    const convertedData = this.totals.map((datum) =>
      Object.fromEntries([
        ["sets", datum.set],
        ["size", datum.size],
      ])
    );
    const euler = venn
      .VennDiagram()
      .width(this.params["width"])
      .height(this.params["height"]);
    d3Container.datum(convertedData).call(euler);
    const labelFontSize = +window
      .getComputedStyle(this.element)
      .getPropertyValue("--togostanza-label-font-size")
      .trim();

    // path
    // d3Container.selectAll('.venn-circle path')
    //   .style('fill', (d, i) => this.colorSeries[i])
    //   .style('stroke', (d, i) => this.colorSeries[i]);

    const legendItems = [];
    container.querySelectorAll(".venn-area").forEach((group) => {
      const labels = group.dataset.vennSets.split("_");
      const targets = labels.map((label) => this.dataLabels.indexOf(label));
      const count =
        this.totals.find((datum) => {
          return (
            datum.set.length === labels.length &&
            labels.every((label) =>
              datum.set.find((label2) => label === label2)
            )
          );
        })?.size ?? "";
      // set color
      const color = this.getBlendedColor(targets);
      const path = group.querySelector(":scope > path");
      path.style.fill = color.toString();
      path.style.fillOpacity = 1;
      // set labels
      const labelNode = group.querySelector(":scope > text > tspan");
      labelNode.textContent = labels.join(",");
      const countNode = labelNode.cloneNode();
      const y = +countNode.getAttribute("y");
      countNode.textContent = count;
      group.querySelector(":scope > text").append(countNode);
      labelNode.setAttribute("y", y - labelFontSize * 0.5);
      countNode.setAttribute("y", y + labelFontSize * 0.5);
      // tooltip
      group.dataset.tooltip = `<strong>${labels.join("∩")}</strong>: ${count}`;
      group.dataset.tooltipHtml = true;
      // legend
      legendItems.push({
        id: group.dataset.vennSets,
        label: labels.join("∩"),
        color: color.toString(),
        value: count,
        node: group,
      });
    });
    this.tooltip.setup(container.querySelectorAll("[data-tooltip]"));

    // legend
    this.legend.setup(legendItems, this.root.querySelector("main"), {
      fadeoutNodes: container.querySelectorAll(".venn-area"),
    });
  }

  getColorSeries() {
    const getPropertyValue = (key) =>
      window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map((variable) => getPropertyValue(variable).trim());
  }

  getBlendedColor(targets) {
    let blendedColor = Color(this.colorSeries[targets[0]]);
    targets.forEach((target, index) => {
      if (index > 0) {
        blendedColor = blendedColor.mix(
          Color(this.colorSeries[target]),
          1 / (index + 1)
        );
      }
    });
    const ratio = (targets.length - 1) / (this.numberOfData - 1);
    switch (this.params["blend-mode"]) {
      case "multiply":
        blendedColor = blendedColor.saturate(ratio);
        blendedColor = blendedColor.darken(ratio * 0.5);
        break;
      case "screen":
        blendedColor = blendedColor.saturate(ratio);
        blendedColor = blendedColor.lighten(ratio * 0.5);
        break;
    }
    return blendedColor;
  }

  async getData() {
    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );
    // // processing
    // for (const datum of data) {
    //   datum.orgs = datum.orgs.split(', ');
    //   datum.count = Number(datum.count);
    // }
    return data;
  }
}
