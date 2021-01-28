import vegaEmbed from "vega-embed";

export default async function devLinechart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());
  
  //width、height、padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = getComputedStyle(stanza.root.host).getPropertyValue(
    "--padding"
  )

    //delete default controller
    for (const signal of spec.signals) {
      delete signal.bind;
    }

  //data
  const labelVariable = params["label-variable"];
  const valueVariable = params["value-variable"];
  const groupVariable = params["group-variable"];
  spec.data = [
    {
      name: "table",
      // url: params["your-data"],
      values: [
        {"x": 0, "y": 28, "c":0}, {"x": 0, "y": 20, "c":1},
        {"x": 1, "y": 43, "c":0}, {"x": 1, "y": 35, "c":1},
        {"x": 2, "y": 81, "c":0}, {"x": 2, "y": 10, "c":1},
        {"x": 3, "y": 19, "c":0}, {"x": 3, "y": 15, "c":1},
        {"x": 4, "y": 52, "c":0}, {"x": 4, "y": 48, "c":1},
        {"x": 5, "y": 24, "c":0}, {"x": 5, "y": 28, "c":1},
        {"x": 6, "y": 87, "c":0}, {"x": 6, "y": 66, "c":1},
        {"x": 7, "y": 17, "c":0}, {"x": 7, "y": 27, "c":1},
        {"x": 8, "y": 68, "c":0}, {"x": 8, "y": 16, "c":1},
        {"x": 9, "y": 49, "c":0}, {"x": 9, "y": 25, "c":1}
      ]
    }
  ]
  //scale
  spec.scales = [
    {
      name: "x",
      type: "point",
      range: "width",
      domain: {data: "table", field: "x"}
    },
    {
      name: "y",
      type: "linear",
      range: "height",
      nice: true,
      zero: true,
      domain: {data: "table", field: "y"}
    },
    {
      name: "color",
      type: "ordinal",
      range: [
        "var(--series-0-color)",
        "var(--series-1-color)",
        "var(--series-2-color)",
        "var(--series-3-color)",
        "var(--series-4-color)",
        "var(--series-5-color)",
      ],
      domain: {data: "table", field: "c"}
    }
  ]

  //axes
  spec.axes = [
    {
      scale: "x",
      orient: params["xaxis-orient"],
      title: params["xaxis-title"],
      titleColor: "var(--title-color)",
      titlePadding:
        Number(getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")),
      grid: params["xgrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      ticks: params["xtick"] === "true",
      encode: {
        ticks: {
          update: {
            stroke: { value: "var(--tick-color)" },
          }
        },
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font"
              )
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-size"
              )
            }
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          },
        },
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font"
              )
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-size"
              )
            },
            fontWeight: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-weight"
              )
            }
          }
        },
        domain: {
          update: {
            stroke: { value: "var(--axis-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--axis-width"
              )
            }
          }
        }
      }
    },
    {
      scale: "y",
      orient: params["yaxis-orient"],
      title: params["yaxis-title"],
      titleColor: "var(--title-color)",
      titlePadding:
        Number(getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")),
      grid: params["ygrid"] === "true",
      gridColor: "var(--grid-color)",
      gridDash: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-dash"
      ),
      gridOpacity: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-opacity"
      ),
      gridWidth: getComputedStyle(stanza.root.host).getPropertyValue(
        "--grid-width"
      ),
      ticks: params["ytick"] === "true",
      encode: {
        ticks: {
          update: {
            stroke: { value: "var(--tick-color)" },
          }
        },
        labels: {
          interactive: true,
          update: {
            angle: { value: params["ylabel-angle"] },
            fill: { value: "var(--label-color)" },
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-size"
              ),
            },
          },
          hover: {
            fill: { value: "var(--emphasized-color)" },
          }
        },
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--label-font"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-size"
              ),
            },
            fontWeight: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--title-weight"
              )
            }
          }
        },
        domain: {
          update: {
            stroke: { value: "var(--axis-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--axis-width"
              )
            }
          }
        }
      }
    }
  ]

  spec.marks = [
    {
      type: "group",
      from: {
        facet: {
          name: "series",
          data: "table",
          groupby: "c"
        }
      },
      "marks": [
        {
          type: "line",
          from: {data: "series"},
          encode: {
            enter: {
              x: {scale: "x", field: "x"},
              y: {scale: "y", field: "y"},
              stroke: {scale: "color", field: "c"},
              strokeWidth: {
                value: getComputedStyle(stanza.root.host).getPropertyValue(
                  "--stroke-width"
                )
              }
            },
            update: {
              interpolate: {signal: "interpolate"},
              strokeOpacity: {value: 1}
            },
            hover: {
              fill: {value: "var(--emphasized-color)"}
              // strokeOpacity: {value: 0.5}
            }
          }
        }
      ]
    }
  ]

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
