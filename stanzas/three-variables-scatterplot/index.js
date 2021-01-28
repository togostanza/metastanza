import vegaEmbed from "vega-embed";

export default async function threeVariablesScatterplot(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  // width,hight,padding
  spec.width = params["width"];
  spec.height = params["height"];
  spec.padding = params["padding"];

  const xVariable = params["x-variable"];
  const yVariable = params["y-variable"];
  const zVariable = params["z-variable"];

  spec.data = [
    {
      name: "source",
      url: params["your-data"],
      transform: [
        {
          type: "filter",
          expr: `datum['${xVariable}'] != null && datum['${yVariable}'] != null && datum['${zVariable}'] != null`
        }
      ]
    }
  ]

  //scales
  spec.scales = [
    {
      name: "x",
      type: "linear",
      round: true,
      nice: true,
      zero: true,
      domain: {"data": "source", "field": xVariable},
      range: "width"
    },
    {
      name: "y",
      type: "linear",
      round: true,
      nice: true,
      zero: true,
      domain: {"data": "source", "field": yVariable},
      range: "height"
    },
    {
      name: "size",
      type: "linear",
      round: true,
      nice: false,
      zero: true,
      domain: {"data": "source", "field": zVariable},
      range: [4,361]
    }
  ]

  //axes
  spec.axes = [
    {
      scale: "x",
      orient: params["xaxis-orient"],
      title: xVariable,
      titleColor: "var(--title-color)",
      titlePadding:
        getComputedStyle(stanza.root.host).getPropertyValue("--title-padding") -
        0,
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
      tickCount: 5,
      domain: true,
      encode: {
        ticks: {
          update: {
            stroke: { value: "var(--tick-color)" },
          },
        },
        labels: {
          interactive: true,
          update: {
            angle: { value: params["xlabel-angle"] },
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
      title: yVariable,
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
      domain: true,
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
              )
            }
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
  ];

  // legend
  spec.legends = [
    {
      size: "size",
      format: "s",
      title: zVariable,
      titleColor: "var(--legendtitle-color)",
      labelColor: "var(--legendlabel-color)",
      encode: {
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legend-font"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendtitle-size"
              ),
            },
            fontWeight: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendtitle-weight"
              ),
            },
          },
        },
        labels: {
          interactive: true,
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legend-font"
              )
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendlabel-size"
              )
            }
          },
          text: { field: "value" },
        },
        symbols: {
          update: {
            shape: { value: params["symbol-shape"] },
            fill: { value: "var(--series-0-color)" },
            stroke: { value: "var(--stroke-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--stroke-width"
              )
            },
            opacity: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--opacity"
              )
            }
          }
        }
      }
    }
  ];

  //marks
  spec.marks = [
    {
      name: "marks",
      type: "symbol",
      from: { data: "source" },
      encode: {
        update: {
          x: { scale: "x", field: xVariable },
          y: { scale: "y", field: yVariable },
          size: { scale: "size", field: zVariable },
          shape: { value: params["symbol-shape"] },
          fill: { value: "var(--series-0-color)" },
          stroke: { value: "var(--stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--stroke-width"
            )
          },
          opacity: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--opacity"
            )
          }
        },
        hover: {
          fill: { value: "var(--emphasized-color)" },
          stroke: { value: "var(--hover-stroke-color)" },
          strokeWidth: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--hover-stroke-width"
            )
          },
          opacity: {
            value: getComputedStyle(stanza.root.host).getPropertyValue(
              "--hover-opacity"
            )
          }
        }
      }
    }
  ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
