import vegaEmbed from "vega-embed";

export default function vegaScatterplot(stanza, params) {
  //let spec = await fetch(params["src-url"]).then((res) => res.json());
  let spec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "A basic scatter plot example depicting automobile statistics.",
    "width": 200,
    "height": 200,
    "padding": 5,
  
    "data": [
      {
        "name": "source",
        "url": "data/cars.json",
        "transform": [
          {
            "type": "filter",
            "expr": "datum['Horsepower'] != null && datum['Miles_per_Gallon'] != null && datum['Acceleration'] != null"
          }
        ]
      }
    ],
  
    "scales": [
      {
        "name": "x",
        "type": "linear",
        "round": true,
        "nice": true,
        "zero": true,
        "domain": {"data": "source", "field": "Horsepower"},
        "range": "width"
      },
      {
        "name": "y",
        "type": "linear",
        "round": true,
        "nice": true,
        "zero": true,
        "domain": {"data": "source", "field": "Miles_per_Gallon"},
        "range": "height"
      },
      {
        "name": "size",
        "type": "linear",
        "round": true,
        "nice": false,
        "zero": true,
        "domain": {"data": "source", "field": "Acceleration"},
        "range": [4,361]
      }
    ],
  
    "axes": [
      {
        "scale": "x",
        "grid": true,
        "domain": false,
        "orient": "bottom",
        "tickCount": 5,
        "title": "Horsepower"
      },
      {
        "scale": "y",
        "grid": true,
        "domain": false,
        "orient": "left",
        "titlePadding": 5,
        "title": "Miles_per_Gallon"
      }
    ],
  
    "legends": [
      {
        "size": "size",
        "title": "Acceleration",
        "format": "s",
        "symbolStrokeColor": "#4682b4",
        "symbolStrokeWidth": 2,
        "symbolOpacity": 0.5,
        "symbolType": "circle"
      }
    ],
  
    "marks": [
      {
        "name": "marks",
        "type": "symbol",
        "from": {"data": "source"},
        "encode": {
          "update": {
            "x": {"scale": "x", "field": "Horsepower"},
            "y": {"scale": "y", "field": "Miles_per_Gallon"},
            "size": {"scale": "size", "field": "Acceleration"},
            "shape": {"value": "circle"},
            "strokeWidth": {"value": 2},
            "opacity": {"value": 0.5},
            "stroke": {"value": "#4682b4"},
            "fill": {"value": "transparent"}
          }
        }
      }
    ]
  };

  console.log(spec)

  // spec.data[0].values = fetch('https://vega.github.io/vega-lite/data/cars.json').then((res) => res.json());
  // spec.data[0].url = 'https://vega.github.io/vega-lite/data/cars.json'
  spec.data[0].url = params["your-data"]

  spec.axes[0].title = params["xaxes-title"]
  spec.axes[1].title = params["yaxes-title"]
  
  spec.legends[0].title = params["legends-title"]
  spec.legends[0].symbolOpacity = "var(--opacity)"
  spec.legends[0].symbolStrokeColor = "var(--plot-frame-color)"
  // spec.legends[0].symbolStrokeWidth = "var(--stroke-width)"
  // spec.legends[0].symbolType = ["symbol-type"]

  spec.marks[0].encode.update.fill.value = "var(--plot-color)"
  spec.marks[0].encode.update.stroke.value = "var(--plot-frame-color)"
  spec.marks[0].encode.update.opacity.value = "var(--opacity)"
  spec.marks[0].encode.update.strokeWidth.value = "var(--stroke-width)"
  // spec.marks[0].encode.update.shape.value = ["symbol-type"]
  spec.marks[0].encode.update.shape.value = params["--symbol-type"]


  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  vegaEmbed(el, spec, opts);
}