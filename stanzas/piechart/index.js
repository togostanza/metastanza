import vegaEmbed from "vega-embed";

export default async function piechart(stanza, params) {
  const spec = await fetch(params["src-url"]).then((res) => res.json());

  // let srcData = fetch('http://togostanza.org/sparqlist/api/metastanza_chart')
  // .then(function (response) {
  //   return response.json();
  // }).then(function (myjson) {
  //   // 読み込ませたいSPALQlistの配列データにおける各オブジェクトにidを追加
  //   for(let i=0; i < myjson.values.length; i++){
  //     myjson.values[i].id = i;
  //   }

  //   // オブジェクトのキー名を、vegaが読み込める状態に変更（countをfieldに変更）
  //   let src = myjson.values;
  //   let dst = [];
  //   for (let i = 0; i < src.length; i++) {
  //     dst.push({
  //       category: src[i].category,
  //       id: src[i].id,
  //       field: src[i].count-0
  //     });
  //   }
  //   console.log(dst);
  //   return dst
  // });

  // // idおよびfieldのkey/valueを持ったオブジェクトの配列（SPALQlistのデータ）を、vegaのデフォルトのデータと置き換えたい
  // console.log(srcData);
  // console.log(spec.data[0].values);
  // spec.data[0].values = srcData;
  // console.log(spec.data[0].values);

  // spec.data[0].url = params["your-data"];
  // spec.data[0].async = true;

  // spec.data[0] =
  //   {
  //     "name": "table",
  //     "url": params["your-data"],
  //     // "values": [
  //     //   {"id": 1, "field": 4},
  //     //   {"id": 2, "field": 6},
  //     //   {"id": 3, "field": 10},
  //     //   {"id": 4, "field": 3},
  //     //   {"id": 5, "field": 7},
  //     //   {"id": 6, "field": 8}
  //     // ],
  //     "transform": [
  //       {
  //         "type": "pie",
  //         "field": "count",
  //         "startAngle": {"signal": "startAngle"},
  //         "endAngle": {"signal": "endAngle"},
  //         "sort": {"signal": "sort"}
  //       }
  //     ]
  //   }

  //stanza（描画範囲）のwidth・height（うまく効かない…広くなってしまう？）
  // spec.width = params["width"]
  // spec.height = params["height"]
  // spec.autosize = params["autosize"]
  spec.padding = { left: 5, top: 5, right: 150, bottom: 30 };

  // scales(color scheme)
  spec.scales[0].range = [
    "var(--series-0-color)",
    "var(--series-1-color)",
    "var(--series-2-color)",
    "var(--series-3-color)",
    "var(--series-4-color)",
    "var(--series-5-color)",
  ];

  //円の描画
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
        symbols: {
          update: {
            shape: { value: params["symbol-shape"] },
            stroke: { value: "var(--stroke-color)" },
            strokeWidth: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--stroke-width"
              ),
            },
            opacity: {
              value: getComputedStyle(stanza.root.host).getPropertyValue(
                "--opacity"
              ),
            },
          },
        },
      },
    },
  ];

  spec.title = {
    text: params["figuretitle"], //"Title of this figure",
    orient: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-orient"
    ),
    anchor: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-anchor"
    ),
    color: getComputedStyle(stanza.root.host).getPropertyValue("--label-color"),
    dx:
      getComputedStyle(stanza.root.host).getPropertyValue(
        "--figuretitle-horizonal-offset"
      ) - 0,
    dy:
      getComputedStyle(stanza.root.host).getPropertyValue(
        "--figuretitle-vertical-offset"
      ) - 0,
    font: getComputedStyle(stanza.root.host).getPropertyValue("--label-font"),
    fontSize: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-font-size"
    ),
    fontWeight: getComputedStyle(stanza.root.host).getPropertyValue(
      "--figuretitle-font-weight"
    ),
  };

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg",
  };
  await vegaEmbed(el, spec, opts);
}
