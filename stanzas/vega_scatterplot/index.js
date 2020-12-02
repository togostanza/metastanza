import vegaEmbed from "vega-embed";

export default async function vegaScatterplot(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url = params["your-data"]

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"]; 
  spec.height = params["height"];
  
  //stanzaのpadding
  spec.padding = params["padding"];

  //スケールに関する設定
  spec.scales[0].paddingInner = params["padding-inner"]
  spec.scales[0].paddingOuter = params["padding-outer"]

  //軸に関する設定
  spec.axes =[
    {
      "scale": "x",
      "grid": params["xgrid"],
      "domain": false,
      "orient": params["orient-of-xscale"],
      "tickCount": 5,
      "title": params["title-of-xaxis"],
      "encode": {
          "ticks": {
            "update": {
            "stroke": {"value": "var(--tick-color)"}
            }
          },
          "labels": {
            "interactive": true,
            "update": {
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
              "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")}
            }
          },
          "domain": {
            "update": {
              "stroke": {"value": "var(--axis-color)"},
              "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--axis-width")}
            }
          }
        }
    },
    {
      "scale": "y",
      "grid": params["ygrid"],
      "domain": false,
      "orient": params["orient-of-yscale"],
      "titlePadding": 5,
      "title": params["title-of-yaxis"],
      "encode": {
        "ticks": {
          "update": {
          "stroke": {"value": "var(--tick-color)"}
          }
        },
        "labels": {
          "interactive": true,
          "update": {
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
            "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")}
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

  spec.legends = [
    {
      "size": "size",
      "title": params["title-of-legend"],
      "format": "s",
      "symbolStrokeColor": "var(--stroke-color)",
      "symbolStrokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
      "symbolOpacity": getComputedStyle(stanza.root.host).getPropertyValue("--opacity"),
      "symbolType": params["symbol-type"],
      "symbolFillColor": {"value": "var(--basic-fill-color)"},
      "labelFont": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
      "labelFontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--title-size")},
      "titleFont": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")}
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
        "shape": {"value": params["symbol-type"]},
        "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
        "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--opacity")},
        "stroke": {"value": "var(--stroke-color)"},
        "fill": {"value": "var(--basic-fill-color)"}
      },
      "hover": {
        "fill": {"value": "var(--emphasized-color)"},
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