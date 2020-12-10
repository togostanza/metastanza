import vegaEmbed from "vega-embed";

export default async function vegaPiechart(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());

  //stanza（描画範囲）のwidth・height（うまく効かない…広くなってしまう？）
  // spec.width = params["width"]
  // spec.height = params["height"]
  // spec.autosize = params["autosize"]

// scales: カラースキームを指定
  spec.scales[0].range = [
    'var(--series-0-color)',
    'var(--series-1-color)',
    'var(--series-2-color)',
    'var(--series-3-color)',
    'var(--series-4-color)',
    'var(--series-5-color)'
  ]


//円の描画について
  //（デフォルトのコントローラを削除） 
  for (let signal of spec.signals)
    { 
      delete(signal.bind); 
    } 
  
  spec.signals[2].value = params["inner-padding-angle"]
  spec.signals[3].value = params["inner-radius"]

  spec.marks[0].encode = {
    "enter": {
      "fill": {"scale": "color", "field": "id"},
      "x": {"signal": "width / 2"},
      "y": {"signal": "height / 2"}
    },
    "update": {
      "startAngle": {"field": "startAngle"},
      "endAngle": {"field": "endAngle"},
      "padAngle": {"signal": "padAngle"},
      "innerRadius": {"signal": "innerRadius"},
      "outerRadius": {"signal": "width / 2"},
      "cornerRadius": {"signal": "cornerRadius"},
      "fill": {"scale": "color", "field": "id"}
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
      "orient": "top-right",
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