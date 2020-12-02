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
            "stroke": {"value": params["tick-color"]}
            }
          },
          "labels": {
            "interactive": true,
            "update": {
              "fill": {"value": params["label-color"]},
              "fontSize": {"value": params["label-size"]},
            },
            "hover": {
              "fill": {"value": "var(--emphasized-color)"}
            }
          },
          "title": {
            "update": {
              "fontSize": {"value": params["title-size"]}
            }
          },
          "domain": {
            "update": {
              "stroke": {"value": params["axis-color"]},
              "strokeWidth": {"value": params["axis-width"]}
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
          "stroke": {"value": params["tick-color"]}
          }
        },
        "labels": {
          "interactive": true,
          "update": {
            "fill": {"value": params["label-color"]},
            "fontSize": {"value": params["label-size"]},
          },
          "hover": {
            "fill": {"value": "var(--emphasized-color)"}
          }
        },
        "title": {
          "update": {
            "fontSize": {"value": params["title-size"]}
          }
        },
        "domain": {
          "update": {
            "stroke": {"value": params["axis-color"]},
            "strokeWidth": {"value": params["axis-width"]}
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
      "symbolStrokeColor": params["stroke-color"],
      "symbolStrokeWidth": params["stroke-width"],
      "symbolOpacity": params["opacity"],
      "symbolType": params["symbol-type"],
      "symbolFillColor": {"value": "var(--basic-fill-color)"}
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
        "strokeWidth": {"value": params["stroke-width"]},
        "opacity": {"value": params["opacity"]},
        "stroke": {"value": params["stroke-color"]},
        "fill": {"value": "var(--basic-fill-color)"}
      },
      "hover": {
        "fill": {"value": "var(--emphasized-color)"},
      }
      }
    }
  ]

  // spec.axes[0].encode = {
  //   "ticks": {
  //     "update": {
  //     "stroke": {"value": params["tick-color"]}
  //     }
  //   },
  //   "labels": {
  //     "interactive": true,
  //     "update": {
  //       "fill": {"value": params["label-color"]},
  //       "fontSize": {"value": params["label-size"]},
  //     },
  //     "hover": {
  //       "fill": {"value": "var(--emphasized-color)"}
  //     }
  //   },
  //   "title": {
  //     "update": {
  //       "fontSize": {"value": params["title-size"]}
  //     }
  //   },
  //   "domain": {
  //     "update": {
  //       "stroke": {"value": params["axis-color"]},
  //       "strokeWidth": {"value": params["axis-width"]}
  //     }
  //   }
  // }

  // spec.axes[1].encode = {
  //   "ticks": {
  //     "update": {
  //     "stroke": {"value": params["tick-color"]}
  //     }
  //   },
  //   "labels": {
  //     "interactive": true,
  //     "update": {
  //       "fill": {"value": params["label-color"]},
  //       "fontSize": {"value": params["label-size"]},
  //     },
  //     "hover": {
  //       "fill": {"value": "var(--emphasized-color)"}
  //     }
  //   },
  //   "title": {
  //     "update": {
  //       "fontSize": {"value": params["title-size"]}
  //     }
  //   },
  //   "domain": {
  //     "update": {
  //       "stroke": {"value": params["axis-color"]},
  //       "strokeWidth": {"value": params["axis-width"]}
  //     }
  //   }
  // }

//   spec.axes[0].title = params["xaxes-title"]
//   spec.axes[1].title = params["yaxes-title"]
  
//   spec.legends[0].title = params["legends-title"]
//   spec.legends[0].symbolOpacity = "var(--opacity)"
//   spec.legends[0].symbolStrokeColor = "var(--plot-frame-color)"
//   // spec.legends[0].symbolStrokeWidth = "var(--stroke-width)"
//   // spec.legends[0].symbolType = ["symbol-type"]

//   spec.marks[0].encode.update.fill.value = "var(--plot-color)"
//   spec.marks[0].encode.update.stroke.value = "var(--plot-frame-color)"
//   spec.marks[0].encode.update.opacity.value = "var(--opacity)"
//   spec.marks[0].encode.update.strokeWidth.value = "var(--stroke-width)"
//   // spec.marks[0].encode.update.shape.value = ["symbol-type"]
//   spec.marks[0].encode.update.shape.value = params["--symbol-type"]

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}


// import vegaEmbed from "vega-embed";

// export default function vegaScatterplot(stanza, params) {
//   // let spec = await fetch(params["src-url"]).then((res) => res.json());
//   let spec = {
//     "$schema": "https://vega.github.io/schema/vega/v5.json",
//     "description": "A basic scatter plot example depicting automobile statistics.",
//     "width": 200,
//     "height": 200,
//     "padding": 5,
  
//     "data": [
//       {
//         "name": "source",
//         "url": "data/cars.json",
//         "transform": [
//           {
//             "type": "filter",
//             "expr": "datum['Horsepower'] != null && datum['Miles_per_Gallon'] != null && datum['Acceleration'] != null"
//           }
//         ]
//       }
//     ],
  
//     "scales": [
//       {
//         "name": "x",
//         "type": "linear",
//         "round": true,
//         "nice": true,
//         "zero": true,
//         "domain": {"data": "source", "field": "Horsepower"},
//         "range": "width"
//       },
//       {
//         "name": "y",
//         "type": "linear",
//         "round": true,
//         "nice": true,
//         "zero": true,
//         "domain": {"data": "source", "field": "Miles_per_Gallon"},
//         "range": "height"
//       },
//       {
//         "name": "size",
//         "type": "linear",
//         "round": true,
//         "nice": false,
//         "zero": true,
//         "domain": {"data": "source", "field": "Acceleration"},
//         "range": [4,361]
//       }
//     ],
  
//     "axes": [
//       {
//         "scale": "x",
//         "grid": true,
//         "domain": false,
//         "orient": "bottom",
//         "tickCount": 5,
//         "title": "Horsepower"
//       },
//       {
//         "scale": "y",
//         "grid": true,
//         "domain": false,
//         "orient": "left",
//         "titlePadding": 5,
//         "title": "Miles_per_Gallon"
//       }
//     ],
  
//     "legends": [
//       {
//         "size": "size",
//         "title": "Acceleration",
//         "format": "s",
//         "symbolStrokeColor": "#4682b4",
//         "symbolStrokeWidth": 2,
//         "symbolOpacity": 0.5,
//         "symbolType": "circle"
//       }
//     ],
  
//     "marks": [
//       {
//         "name": "marks",
//         "type": "symbol",
//         "from": {"data": "source"},
//         "encode": {
//           "update": {
//             "x": {"scale": "x", "field": "Horsepower"},
//             "y": {"scale": "y", "field": "Miles_per_Gallon"},
//             "size": {"scale": "size", "field": "Acceleration"},
//             "shape": {"value": "circle"},
//             "strokeWidth": {"value": 2},
//             "opacity": {"value": 0.5},
//             "stroke": {"value": "#4682b4"},
//             "fill": {"value": "transparent"}
//           }
//         }
//       }
//     ]
//   };

//   console.log(spec)

//   // spec.data[0].values = fetch('https://vega.github.io/vega-lite/data/cars.json').then((res) => res.json());
//   // spec.data[0].url = 'https://vega.github.io/vega-lite/data/cars.json'
//   spec.data[0].url = params["your-data"]

//   spec.axes[0].title = params["xaxes-title"]
//   spec.axes[1].title = params["yaxes-title"]
  
//   spec.legends[0].title = params["legends-title"]
//   spec.legends[0].symbolOpacity = "var(--opacity)"
//   spec.legends[0].symbolStrokeColor = "var(--plot-frame-color)"
//   // spec.legends[0].symbolStrokeWidth = "var(--stroke-width)"
//   // spec.legends[0].symbolType = ["symbol-type"]

//   spec.marks[0].encode.update.fill.value = "var(--plot-color)"
//   spec.marks[0].encode.update.stroke.value = "var(--plot-frame-color)"
//   spec.marks[0].encode.update.opacity.value = "var(--opacity)"
//   spec.marks[0].encode.update.strokeWidth.value = "var(--stroke-width)"
//   // spec.marks[0].encode.update.shape.value = ["symbol-type"]
//   spec.marks[0].encode.update.shape.value = params["--symbol-type"]


//   const el = stanza.root.querySelector("main");
//   const opts = {
//     renderer: "svg"
//   };
//   vegaEmbed(el, spec, opts);
// }