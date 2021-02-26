import vegaEmbed from "vega-embed";

export default async function barchart(stanza, params) {
  function css(key) {
    return getComputedStyle(stanza.root.host).getPropertyValue(key);
  }
  const chartType = params["chart-type"];

  //width,height,padding
  const width = Number(params["width"]);
  const height = Number(params["height"]);
  const padding = Number(params["padding"]);

  //data
  const labelVariable = params["label-variable"]; //x
  const valueVariable = params["value-variable"]; //y
  const groupVariable = params["group-variable"]; //z

  function constructData(chartType) {
    switch (chartType) {
      case "grouped":
        return [
          {
            name: "table",
            url: params["your-data"],
          },
        ];
      case "stacked":
        return [
          {
            name: "table",
            url: params["your-data"],
            transform: [
              {
                type: "stack",
                field: valueVariable,
                groupby: [labelVariable],
                sort: { field: groupVariable },
              },
            ],
          },
        ];
    }
  }
  console.log(constructData(chartType));

  //axes
  const axes = [
    {
      scale: "xscale",
      orient: params["xaxis-orient"],
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["xtick"] === "true",
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title: labelVariable,
      titleColor: "var(--title-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-size"),
      titleFontWeight: css("--title-weight"),
      titlePadding: Number(css("--title-padding")),
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            dx: { value: params["xlabel-horizonal-offset"] },
            dy: { value: params["xlabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: { value: css("--font-family") },
            fontSize: { value: css("--label-size") },
          },
        },
      },
    },
    {
      scale: "yscale",
      orient: params["yaxis-orient"],
      domainColor: "var(--axis-color)",
      domainWidth: css("--axis-width"),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: css("--grid-dash"),
      gridOpacity: css("--grid-opacity"),
      gridWidth: css("--grid-width"),
      ticks: params["ytick"] === "true",
      tickColor: "var(--tick-color)",
      tickSize: css("--tick-size"),
      tickWidth: css("--tick-width"),
      title: valueVariable,
      titleColor: "var(--title-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--title-size"),
      titleFontWeight: css("--title-weight"),
      titlePadding: Number(css("--title-padding")),
      zindex: 0,
      encode: {
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
            dx: { value: params["ylabel-horizonal-offset"] },
            dy: { value: params["ylabel-vertical-offset"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: css("--font-family"),
            },
            fontSize: { value: css("--label-size") },
            // limit: 1
          },
        },
      },
    },
  ];

  // legend
  const legends = [
    {
      fill: "color",
      orient: "none",
      legendX: width + 40,
      legendY: "0",
      title: groupVariable,
      titleColor: "var(--legendtitle-color)",
      titleFont: css("--font-family"),
      titleFontSize: css("--legendtitle-size"),
      titleFontWeight: css("--legendtitle-weight"),
      labelColor: "var(--legendlabel-color)",
      labelFont: css("--font-family"),
      labelFontSize: css("--legendlabel-size"),
      symbolStrokeColor: css("--stroke-color"),
      symbolStrokeWidth: css("--stroke-width"),
    },
  ];

  const colorScale = {
    name: "color",
    type: "ordinal",
    domain: { data: "table", field: groupVariable },
    range: [
      "var(--series-0-color)",
      "var(--series-1-color)",
      "var(--series-2-color)",
      "var(--series-3-color)",
      "var(--series-4-color)",
      "var(--series-5-color)",
    ],
  };

  function constructScale(chartType) {
    switch (chartType) {
      case "grouped":
        return [
          colorScale,
          {
            name: "xscale",
            type: "linear",
            domain: { data: "table", field: valueVariable },
            range: "width",
          },
          {
            name: "yscale",
            type: "band",
            domain: { data: "table", field: labelVariable },
            range: "height",
            padding: 0.2,
            paddingInner: params["padding-inner"],
            paddingOuter: params["padding-outer"],
          },
        ];
      case "stacked":
        return [
          colorScale,
          ,
          {
            name: "xscale",
            type: "band",
            range: "width",
            domain: { data: "table", field: labelVariable },
            paddingInner: params["padding-inner"],
            paddingOuter: params["padding-outer"],
          },
          {
            name: "yscale",
            type: "linear",
            range: "height",
            nice: true,
            zero: true,
            domain: { data: "table", field: "y1" },
          },
        ];
    }
  }

  function constructMark(chartType) {
    switch (chartType) {
      case "grouped":
        return [
          {
            type: "group",
            from: {
              facet: {
                data: "table",
                name: "facet",
                groupby: labelVariable,
              },
            },
            encode: {
              enter: {
                y: { scale: "yscale", field: labelVariable },
              },
            },
            signals: [{ name: "height", update: "bandwidth('yscale')" }],
            scales: [
              {
                name: "pos",
                type: "band",
                range: "height",
                domain: { data: "facet", field: groupVariable },
              },
            ],
            marks: [
              {
                name: "bars",
                from: { data: "facet" },
                type: "rect",
                encode: {
                  enter: {
                    y: { scale: "pos", field: groupVariable },
                    height: { scale: "pos", band: 1 },
                    x: { scale: "xscale", field: valueVariable },
                    x2: { scale: "xscale", value: 0 },
                    fill: { scale: "color", field: groupVariable },
                    stroke: { value: "var(--stroke-color)" },
                    strokeWidth: {
                      value: css("--stroke-width"),
                    },
                  },
                },
              },
            ],
          },
        ];
      case "stacked":
        return [
          {
            type: "group",
            from: { data: "table" },
            encode: {
              enter: {
                x: { scale: "xscale", field: labelVariable },
                width: { scale: "xscale", band: params["bar-width"] },
                y: { scale: "yscale", field: "y0" },
                y2: { scale: "yscale", field: "y1" },
                fill: { scale: "color", field: groupVariable },
                stroke: { value: "var(--stroke-color)" },
                strokeWidth: { value: css("--stroke-width") },
              },
            },
          },
        ];
    }
  }

  const spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width,
    height,
    padding,
    data: constructData(chartType),
    scales: constructScale(chartType),
    axes,
    legends,
    marks: constructMark(chartType),
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
