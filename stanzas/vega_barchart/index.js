import vegaEmbed from "vega-embed";

export default async function vegaBarchart(stanza, params) {
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
  // spec.width = getComputedStyle(stanza.root.host).getPropertyValue("var(--width)")
  // spec.height = getComputedStyle(stanza.root.host).getPropertyValue("var(--height)")

  //stanzaのpadding
  spec.padding = params["padding"];

  //イベントなど設定できるかと思ったができない
  // spec.signals[0].on[0].events = "click"
  // spec.signals[0].on[1].events = "click"

  //棒・スケールに関する設定
  spec.scales[0].paddingInner = params["padding-inner"]
  spec.scales[0].paddingOuter = params["padding-outer"]
  // spec.scales[0].paddingInner = getComputedStyle(stanza.root.host).getPropertyValue("--padding-inner")
  // spec.scales[0].paddingOuter = getComputedStyle(stanza.root.host).getPropertyValue("--padding-outer")
  
  //軸に関する設定
  spec.axes[0].orient = params["orient-of-xscale"]
  spec.axes[1].orient = params["orient-of-yscale"]
  // spec.axes[0].orient = getComputedStyle(stanza.root.host).getPropertyValue("--orient-of-xscale")
  // spec.axes[1].orient = getComputedStyle(stanza.root.host).getPropertyValue("--orient-of-yscale")
  spec.axes[0].title = params["title-of-xaxis"]
  spec.axes[1].title = params["title-of-yaxis"]
  spec.axes[0].encode = {
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
        "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-size")},
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

  spec.axes[1].encode = {
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
        "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-size")},
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

  //rect（棒）の描画について
  spec.marks[0].encode ={
    "enter": {
      "x": {"scale": "xscale", "field": "category"},
      "width": {"scale": "xscale", "band": params["bar-width"]},
      "y": {"scale": "yscale", "field": "amount"},
      "y2": {"scale": "yscale", "value": 0},
    },
    "update": {
      "fill": {"value": "var(--basic-fill-color)"}
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
      "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
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
