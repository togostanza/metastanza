import vegaEmbed from "vega-embed";

export default async function piechart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  let srcData = fetch('http://togostanza.org/sparqlist/api/metastanza_chart')
  .then(function (response) {
    return response.json();
  }).then(function (myjson) {
    // 読み込ませたいSPALQlistの配列データにおける各オブジェクトにidを追加
    for(let i=0; i < myjson.values.length; i++){
      myjson.values[i].id = i;
    }
    
    // オブジェクトのキー名を、vegaが読み込める状態に変更（countをfieldに変更）
    let src = myjson.values;
    let dst = [];
    for (let i = 0; i < src.length; i++) {
      dst.push({
        category: src[i].category,
        field: src[i].count-0,
        id: src[i].id
      });
    }
    // console.log(dst);
    return dst
  });

  // idおよびfieldのkey/valueを持ったオブジェクトの配列（SPALQlistのデータ）を、vegaのデフォルトのデータと置き換えたい
  console.log(srcData);
  console.log(spec.data[0].values);
  
  spec.data[0].values = srcData;
  
  console.log(spec.data[0].values);



  //stanza（描画範囲）のwidth・height（うまく効かない…広くなってしまう？）
  // spec.width = params["width"]
  // spec.height = params["height"]
  // spec.autosize = params["autosize"]
  spec.padding = { left: 5, top: 5, right: 150, bottom: 5 };

  // scales: カラースキームを指定
  spec.scales[0].range = [
    "var(--series-0-color)",
    "var(--series-1-color)",
    "var(--series-2-color)",
    "var(--series-3-color)",
    "var(--series-4-color)",
    "var(--series-5-color)",
  ];

  //円の描画について
  //（デフォルトのコントローラを削除）
  for (const signal of spec.signals) {
    delete signal.bind;
  }

  spec.signals[2].value = params["inner-padding-angle"];
  spec.signals[3].value = params["inner-radius"];

  spec.marks[0].encode = {
    enter: {
      fill: { scale: "color", field: "id" },
      x: { signal: "width / 2" },
      y: { signal: "height / 2" },
    },
    update: {
      startAngle: { field: "startAngle" },
      endAngle: { field: "endAngle" },
      padAngle: { signal: "padAngle" },
      innerRadius: { signal: "innerRadius" },
      outerRadius: { signal: "width / 2" },
      cornerRadius: { signal: "cornerRadius" },
      fill: { scale: "color", field: "id" },
      stroke: { value: "var(--stroke-color)" },
      strokeWidth: { value: "var(--stroke-width)" },
    },
    hover: {
      fill: { value: "var(--emphasized-color)" },
      stroke: { value: "var(--hover-stroke-color)" },
      strokeWidth: { value: "var(--hover-stroke-width)" },
    },
  };

  // // hover時にvalueを出したい
  // spec.marks[1].encode = {
  //   "enter": {
  //     // "align": {"value": "center"},
  //     // "baseline": {"value": "bottom"},
  //     "fill": {"value": "var(--emphasized-color)"},
  //     // "font":{"value": getComputedStyle(stanza.root.host).getPropertyValue("--label-font")},
  //     // "fontSize": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--fontsize-of-value")},
  //     // "fontWeight": {"value": getComputedStyle(stanza.root.host).getPropertyValue("--fontweight-of-value")}
  //   },
  //   "update": {
  //     "x": {"signal": "tooltip.category", "band": 0.5},
  //     "y": {"signal": "tooltip.amount", "offset": -1},
  //     "text": {"signal": "tooltip.id"},
  //     "fillOpacity": [
  //       {"test": "datum === tooltip", "value": 0},
  //       {"value": 1}
  //     ]
  //   }
  // }

  //legendを出す
  spec.legends = [
    {
      fill: "color",
      orient: "none",
      legendX: "220",
      legendY: "5",
      title: params["legend-title"],
      titleColor: "var(--legendtitle-color)",
      labelColor: "var(--legendlabel-color)",
      encode: {
        title: {
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legend-font"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendtitle-size"
              ),
            },
            fontWeight: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendtitle-weight"
              ),
            },
          },
        },
        labels: {
          interactive: true,
          update: {
            font: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legend-font"
              ),
            },
            fontSize: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--legendlabel-size"
              ),
            },
          },
          text: { field: "value" },
        },
      },
    },
  ];

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
