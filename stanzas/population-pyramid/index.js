import vegaEmbed from "vega-embed";
import Stanza from "togostanza/stanza";

export default class populationPyramid extends Stanza {
  async render() {
    //width,height,padding
    const width = this.params["width"],
      height = this.params["height"];

    const signals = [
      { name: "chartWidth", value: 300 },
      { name: "chartPad", value: 20 },
      { name: "width", update: "2 * chartWidth + chartPad" },
      {
        name: "year",
        value: 2000,
        bind: { input: "range", min: 1850, max: 2000, step: 10 },
      },
    ];

    const data = [
      {
        name: "population",
        url: "https://vega.github.io/vega/data/population.json",
      },
      {
        name: "popYear",
        source: "population",
        transform: [{ type: "filter", expr: "datum.year == year" }],
      },
      {
        name: "males",
        source: "popYear",
        transform: [{ type: "filter", expr: "datum.sex == 1" }],
      },
      {
        name: "females",
        source: "popYear",
        transform: [{ type: "filter", expr: "datum.sex == 2" }],
      },
      {
        name: "ageGroups",
        source: "population",
        transform: [{ type: "aggregate", groupby: ["age"] }],
      },
    ];

    const scales = [
      {
        name: "y",
        type: "band",
        range: [{ signal: "height" }, 0],
        round: true,
        domain: { data: "ageGroups", field: "age" },
      },
      {
        name: "c",
        type: "ordinal",
        domain: [1, 2],
        range: [
          "var(--stogozana-group2-color)",
          "var(--stogozana-group1-color)",
        ],
      },
    ];

    const text = {
      type: "text",
      interactive: false,
      from: { data: "ageGroups" },
      encode: {
        enter: {
          x: { signal: "chartWidth + chartPad / 2" },
          y: { scale: "y", field: "age", band: 0.5 },
          text: { field: "age" },
          baseline: { value: "middle" },
          align: { value: "center" },
          fill: { value: "#000" },
        },
      },
    };

    // Marks of Spec consist of 2 groups
    // Group specific Axes + Marks + Scales are set first -> then groups
    const groupAxes = (groupNum) => {
      const groupTitle = `group${groupNum}-title`;
      return {
        orient: "bottom",
        scale: "x",
        format: "s",
        title: this.params[groupTitle],
        titleFont: "var(--togostanza-font-family)",
        titleFontWeight: "var(--togostanza-title-font-weight)",
        titleColor: "var(--togostanza-title-font-color)",
      };
    };

    const groupMarks = (groupData) => {
      return {
        type: "rect",
        from: { data: groupData },
        encode: {
          enter: {
            x: { scale: "x", field: "people" },
            x2: { scale: "x", value: 0 },
            y: { scale: "y", field: "age" },
            height: { scale: "y", band: 1, offset: -1 },
            fill: { scale: "c", field: "sex" },
          },
        },
      };
    };

    const groupScales = (num) => {
      return {
        name: "x",
        type: "linear",
        range:
          num === 1
            ? [{ signal: "chartWidth" }, 0]
            : [0, { signal: "chartWidth" }],
        nice: true,
        zero: true,
        domain: { data: "population", field: "people" },
      };
    };

    const group1 = {
      type: "group",

      encode: {
        update: {
          x: { value: 0 },
          height: { signal: "height" },
        },
      },
      scales: [groupScales(1)],
      axes: [groupAxes(1)],
      marks: [groupMarks("females")],
    };

    const group2 = {
      type: "group",

      encode: {
        update: {
          x: { signal: "chartWidth + chartPad" },
          height: { signal: "height" },
        },
      },

      scales: [groupScales(2)],
      axes: [groupAxes(2)],
      marks: [groupMarks("males")],
    };

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding: 5,
      marks: [text, group1, group2],
      scales,
      signals,
      data,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await vegaEmbed(el, spec, opts);
  }
}
