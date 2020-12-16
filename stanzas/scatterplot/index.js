import vegaEmbed from "vega-embed";

export default async function scatterplot(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url = params["your-data"]

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"]; 
  spec.height = params["height"];
  
  //stanzaのpadding
  spec.padding = params["padding"];

  //軸に関する設定
  spec.axes =[
    {
      "scale": "x",
      "orient": params["xaxis-orient"],
      "title": params["xaxis-title"],
      "titlePadding": getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")-0,
      "grid": params["xgrid"] === "true",
      "gridColor": "var(--grid-color)",
      "gridDash": getComputedStyle(stanza.root.host).getPropertyValue("--grid-dash"),
      "gridOpacity":getComputedStyle(stanza.root.host).getPropertyValue("--grid-opacity"),
      "gridWidth": getComputedStyle(stanza.root.host).getPropertyValue("--grid-width"),
      "ticks": params["xtick"] === "true",
      "tickCount": 5,
      "domain": false,
      "encode": {
          "ticks": {
            "update": {
            "stroke": {"value": "var(--tick-color)"}
            }
          },
          "grids": {
            "update": {
              "zindex": {"value": "0"}
            }
          },
          "labels": {
            "interactive": true,
            "update": {
              "angle": {"value": params["xlabel-angle"]},
              "fill": {"value": "var(--label-color)"},
              "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
              "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-size")}
            },
            "hover": {
              "fill": {"value": "var(--emphasized-color)"}
            }
          },
          "title": {
            "update": {
              "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
              "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")},
              "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-weight")}
            }
          },
          "domain": {
            "update": {
              "stroke": {"value": "var(--axis-color)"},
              "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--axis-width")},
              "zindex": {"value": "1"}
            }
          }
        }
    },
    {
      "scale": "y",
      "orient": params["yaxis-orient"],
      "title": params["yaxis-title"],
      "titlePadding": getComputedStyle(stanza.root.host).getPropertyValue("--title-padding")-0,
      "grid": params["ygrid"] === "true",
      "gridColor": "var(--grid-color)",
      "gridDash": getComputedStyle(stanza.root.host).getPropertyValue("--grid-dash"),
      "gridOpacity": getComputedStyle(stanza.root.host).getPropertyValue("--grid-opacity"),
      "gridWidth": getComputedStyle(stanza.root.host).getPropertyValue("--grid-width"),
      "ticks": params["ytick"] === "true",
      "domain": false,
      "encode": {
        "ticks": {
          "update": {
          "stroke": {"value": "var(--tick-color)"}
          }
        },
        "grids": {
          "update": {
            "zindex": {"value": "0"}
          }
        },
        "labels": {
          "interactive": true,
          "update": {
            "angle": {"value": params["ylabel-angle"]},
            "fill": {"value": "var(--label-color)"},
            "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
            "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-size")}
          },
          "hover": {
            "fill": {"value": "var(--emphasized-color)"}
          }
        },
        "title": {
          "update": {
            "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
            "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")},
            "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-weight")}
          }
        },
        "domain": {
          "update": {
            "stroke": {"value": "var(--axis-color)"},
            "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--axis-width")}
          }
        }
      }
    }
  ]

// legendに関する設定
  spec.legends = [
    {
      "size": "size",
      "format": "s",
      "title": params["legend-title"],
      "titleColor": "var(--legendtitle-color)",
      "labelColor": "var(--legendlabel-color)",
      "encode": {
        "title": {
          "update": {
            "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legend-font")},
            "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legendtitle-size")},
            "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legendtitle-weight")}
          }
        },
        "labels": {
          "interactive": true,
          "update": {
            "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legend-font")},
            "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--legendlabel-size")}},
            "text": {"field": "value"}
          },
          "symbols": {
            "update": {
              "shape": {"value": params["symbol-shape"]},
              "fill": {"value": "var(--series-0-color)"},
              "stroke": {"value": "var(--stroke-color)"},
              "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
              "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--opacity")}
            }
          }
        }
      }
    ]

  spec.marks= [
    {
    "name": "marks",
    "type": "symbol",
    "from": {"data": "source"},
    "encode": {
      "update": {
        "x": {"scale": "x", "field": "Horsepower"},
        "y": {"scale": "y", "field": "Miles_per_Gallon"},
        "size": {"scale": "size", "field": "Acceleration"},
        "shape": {"value": params["symbol-shape"]},
        "fill": {"value": "var(--series-0-color)"},
        "stroke": {"value": "var(--stroke-color)"},
        "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
        "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--opacity")}
      },
      "hover": {
        "fill": {"value": "var(--emphasized-color)"},
        "stroke": {"value": "var(--hover-stroke-color)"},
        "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-stroke-width")},
        "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-opacity")}   
        }
      }
    }
  ]

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}