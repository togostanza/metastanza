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
  
  //stanzaのpadding
  spec.padding = params["padding"];

  //イベントなど設定できるかと思ったができない
  // spec.signals[0].on[0].events = "click"
  // spec.signals[0].on[1].events = "click"

  //棒・スケールに関する設定
  spec.scales[0].paddingInner = params["padding-inner"]
  spec.scales[0].paddingOuter = params["padding-outer"]

  //軸に関する設定
  spec.axes[0].orient = params["orient-of-xscale"]
  spec.axes[1].orient = params["orient-of-yscale"]
  spec.axes[0].title = params["title-of-xaxis"]
  spec.axes[1].title = params["title-of-yaxis"]
  spec.axes[0].encode = {
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

  spec.axes[1].encode = {
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
      "fontSize": {value: params["fontsize-of-value"]}
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
