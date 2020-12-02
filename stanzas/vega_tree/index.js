import vegaEmbed from "vega-embed";

export default async function vegaTree(stanza, params) {
  let spec = await fetch(params["src-url"]).then((res) => res.json());
  spec.data[0].url ="https://vega.github.io/vega/data/flare.json"

  //stanza（描画範囲）のwidth・height
  spec.width = params["width"]; 
  spec.height = params["width"];
  
  //stanzaのpadding
  spec.padding = params["padding"];

  //scales
  spec.scales[0].range = {"scheme": params["color-scheme"]}


  //Marks:描画について
  spec.marks[0].encode ={
    "update": {
      "path": {"field": "path"},
      "stroke": {"value": params["branch-color"]}
    },
    "hover": {
      "stroke": {"value": "var(--emphasized-color)"}
    }
  }

  spec.marks[1].encode ={
    "enter": {
      "size": {"value": params["node-size"]},
      "stroke": {"value": params["stroke-color"]}
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
      "font":{"value": params["label-font"]},
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

  const el = stanza.root.querySelector("main");
  const opts = {
    renderer: "svg"
  };
  await vegaEmbed(el, spec, opts);
}
