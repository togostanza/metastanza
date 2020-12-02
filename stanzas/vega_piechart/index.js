import vegaEmbed from "vega-embed";

export default async function vegaPiechart(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());

  //stanza（描画範囲）のwidth・height（うまく効かない…広くなってしまう？）
  // spec.width = params["width"]
  // spec.height = params["height"]
  // spec.autosize = params["autosize"]

// カラースキームを独自で作成したい
  // vega.scheme('metastabasic', ['#AB3F61', '#F7EF8D', '#F7749E', '#5CD5F7', '#4895AB', '#4895AB']);
  // spec.scales[0].range.scheme = 'pastel1';
  // spec.scales[0].range.scheme = params["color-scheme"];
  spec.scales[0].range = [
    'var(--series-0-color)',
    'var(--series-1-color)',
    'var(--series-2-color)',
    'var(--series-3-color)',
    'var(--series-4-color)',
    'var(--series-5-color)'
  ]

//legendを出す
  spec.legend =[
  {
    "fill": "color",
    "encode": {
      "title": {
        "update": {
          "fontSize": {"value": 14}
        }
      },
      "labels": {
        "interactive": true,
        "update": {
          "fontSize": {"value": 12},
          "fill": {"value": "black"}
        },
        "hover": {
          "fill": {"value": "firebrick"}
        }
      },
      "symbols": {
        "update": {
          "stroke": {"value": "transparent"}
        }
      },
      "legend": {
        "update": {
          "stroke": {"value": "#ccc"},
          "strokeWidth": {"value": 1.5}
        }
      }
    }
  }
]

//円の描画について（表示されているパラメータを消したい・・・） 
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
  

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}