import vegaEmbed from "vega-embed";

export default async function tree(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url ="https://vega.github.io/vega/data/flare.json"

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"]; 
  spec.height = params["height"];
  
  //stanzaのpadding
  spec.padding = params["padding"];

  //scales: カラースキームを指定
  spec.scales[0].type = "ordinal"

  spec.scales[0].range = [
    'var(--series-0-color)',
    'var(--series-1-color)',
    'var(--series-2-color)',
    'var(--series-3-color)',
    'var(--series-4-color)',
    'var(--series-5-color)'
  ]
  
  //legendを出す
  spec.legends =
  [
    {
      "fill": "color",
      "title": params["legend-title"],
      "titleColor": "var(--legendtitle-color)",
      "labelColor": "var(--legendlabel-color)",
      "orient": "top--left",
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
              "stroke": {"value": "var(--stroke-color)"},
              "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")},
              "opacity": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--opacity")}
            }
          }
      }
    }
  ]

  //marks:描画について

  //（デフォルトのコントローラを削除） 
  for (let signal of spec.signals)
    { 
      delete(signal.bind); 
    } 

  spec.marks[0].encode ={
    "update": {
      "path": {"field": "path"},
      "stroke": {"value": "var(--branch-color)"}
    },
    "hover": {
      "stroke": {"value": "var(--emphasized-color)"}
    }
  }

  spec.marks[1].encode ={
    "enter": {
      "size": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--node-size")},
      "stroke": {"value": "var(--stroke-color)"}
    },
    "update": {
      "x": {"field": "x"},
      "y": {"field": "y"},
      "fill": {"scale": "color", "field": "depth"},
      "stroke": {"value": "var(--stroke-color)"},
      "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")}
    },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"},
      "stroke": {"value": "var(--hover-stroke-color)"},
      "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-stroke-width")}
    }
  }
  
  spec.marks[2].encode ={
    "enter": {
      "text": {"field": "name"},
      "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
      "fontSize": {"value": params["label-size"]},
      "baseline": {"value": "middle"},
    },
    "update": {
      "x": {"field": "x"},
      "y": {"field": "y"},
      "dx": {"signal": "datum.children ? -7 : 7"},
      "align": {"signal": "datum.children ? 'right' : 'left'"},
      "opacity": {"signal": "labels ? 1 : 0"},
      "fill": {"value": "var(--label-color)"}
      // hoverした時の文字色が薄い場合は文字にstrokecolorをつけたほうがよいかも？（検討）
      // "stroke": {"value": ""},
      // "strokeWidth": {"value": ""}
      // "stroke": {"value": "var(--stroke-color)"},
      // "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--stroke-width")}
    },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"},
      // "stroke": {"value": "var(--hover-stroke-color)"},
      // "strokeWidth": {"value": "0.5"}
      // "strokeWidth": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--hover-stroke-width")}
    }
  }


  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}
