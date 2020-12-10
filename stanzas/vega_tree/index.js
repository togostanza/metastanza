import vegaEmbed from "vega-embed";

export default async function vegaTree(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url ="https://vega.github.io/vega/data/flare.json"

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"]; 
  spec.height = params["width"];
  
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
      "fill": {"scale": "color", "field": "depth"}
    },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"}
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
    },
    "hover": {
      "fill": {"value": "var(--emphasized-color)"}
    }
  }

  //legendを出す
  spec.legends =
  [
    {
      "fill": "color",
      "title": params["title-of-legend"],
      "orient": "bottom-left",
      "encode": {
        // "symbols": {"enter": {"fillOpacity": {"value": 0.5}}},
        "labels": {"update": {"text": {"field": "value"}}}
      }
      // ,
      // "legend":{
      //   "layout": {
      //     "bottom": {
      //       "anchor": "middle",
      //       "direction": "vertical",
      //       "center": true,
      //       "margin": 2,
      //     }
      //   }
      // } 
    }
  ]

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}
