import vegaEmbed from "vega-embed";
import { reduce } from "vega-lite/build/src/encoding";

export default async function barchart(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].values = [
    {"category": "value1", "amount": 1},
    {"category": "value2", "amount": 7},
    {"category": "value3", "amount": 5},
    {"category": "value4", "amount": 9},
  ]

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"];
  spec.height = params["height"];

  //stanzaのpadding
  spec.padding = params["padding"];

  //イベントなど設定できるかと思ったができない
  // spec.signals[0].on[0].events = "click"
  // spec.signals[0].on[1].events = "click"

  //棒・スケールに関する設定
  spec.scales[0].paddingInner = params["padding-inner"]
  spec.scales[0].paddingOuter = params["padding-outer"]

  //軸に関する設定
  spec.axes[0] =
  {
    "scale": "xscale",
    "orient": params["orient-of-xaxis"],
    "title": params["title-of-xaxis"],
    "grid": params["xgrid"] === "true",
    "gridColor": "var(--xgrid-color)",
    "gridDash": getComputedStyle(stanza.root.host).getPropertyValue("--xgrid-dash"),
    "gridOpacity":getComputedStyle(stanza.root.host).getPropertyValue("--xgrid-opacity"),
    "gridWidth": getComputedStyle(stanza.root.host).getPropertyValue("--xgrid-width"),
    "ticks": params["xtick"] === "true",
    "encode": {
      "axis": {
        "update": {
        }
      },
      "ticks": {
        "update": {
          "stroke": {"value": "var(--tick-color)"},
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
          "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
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
          "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--axis-width")},
          "zindex": {"value": "1"}
        }
      }
    }
  }

  spec.axes[1] = 
  {
    "scale": "yscale",
    "orient": params["orient-of-yaxis"],
    "bandPosition": 0.5,
    "title": params["title-of-yaxis"],
    "grid": params["ygrid"] === "true",
    "gridColor": "var(--ygrid-color)",
    "gridDash": getComputedStyle(stanza.root.host).getPropertyValue("--ygrid-dash"),
    "gridOpacity": getComputedStyle(stanza.root.host).getPropertyValue("--ygrid-opacity"),
    "gridWidth": getComputedStyle(stanza.root.host).getPropertyValue("--ygrid-width"),
    "ticks": params["ytick"] === "true",
    "encode": {
      "axis": {
        "update": {
        }
      },
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
          "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
          "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-size")}
        },
        "hover": {
          "fill": {"value": "var(--emphasized-color)"}
        }
      },
      "title": {
        "update": {
          "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
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

  //rect（棒）の描画について
  spec.marks[0].encode ={
    "enter": {
      "x": {"scale": "xscale", "field": "category"},
      "width": {"scale": "xscale", "band": params["bar-width"]},
      "y": {"scale": "yscale", "field": "amount"},
      "y2": {"scale": "yscale", "value": 0}
    },
    "update": {
      "fill": {"value": "var(--series-0-color)"},
      },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"}
    }
  }

  spec.marks[1].encode ={
    "enter": {
      "align": {"value": "center"},
      "baseline": {"value": "bottom"},
      "fill": {"value": "var(--emphasized-color)"},
      "font": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
      "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--fontsize-of-value")},
      "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--fontweight-of-value")}
    },
    "update": {
      "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
      "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -1},
      "text": {"signal": "tooltip.amount"},
      "fillOpacity": [
        {"test": "datum === tooltip", "value": 0},
        {"value": 1}
      ]
    }
  }
  // spec.marks[0].encode.update.fill.value = "var(--bar-color)"
  // spec.marks[0].encode.hover.fill.value = "var(--emphasized-color)"
  // spec.marks[1].encode.enter.fill.value = "var(--emphasized-color)"
  // spec.marks[1].encode.enter.fontSize = {value: params["fontsize-of-value"]}
  // spec.marks[1].encode.enter.fontWeight = {value: params["fontweight-of-value"]}

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}
