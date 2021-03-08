import * as d3 from "d3";

// TODO: test
export function loadData(url, data_source = false) {
  switch (data_source) {
    case "tsv":
      return loadTSV(url);
    case "csv":
      return loadCSV(url);
    case "sparql":
      return loadSPARQL(url);
    default:
      return loadJSON(url);
  }
}

export function loadTSV(url) {
  // expect TSV data with a header line
  return d3.tsv(url);
}

export function loadCSV(url) {
  // expect CSV data with a header line
  return d3.csv(url);
}

export async function loadJSON(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export function loadSPARQL(url) {
  const json = loadJSON(url);
  const data = sparql2table(json);
  return data;
}

// TODO: test & improve
export function sparql2table(json) {
  const head = json.head.vars;
  const data = json.results.bindings;

  return data.map((item) => {
    const row = {};
    head.forEach((key) => {
      row[key] = item[key].value;
    });
    return row;
  });
}

// TODO: implement for Vega
// https://vega.github.io/vega/data/flare.json
export function sparql2tree(json) {
  // nothing to do?
  return json;
}

export function convert2d3(data, stanza_type) {
  switch (stanza_type) {
    case "table":
      return sparql2table(data);
    case "tree":
      return sparql2d3tree(data);
    case "graph":
      return sparql2d3graph(data);
  }
}

// Generate a typical D3.js tree data (not for Vega tree data)
// e.g. https://github.com/d3/d3-hierarchy
export function sparql2d3tree(json, params) {
  const data = json.results.bindings;

  const opts = {
    root: params["root-variable"],
    parent: params["parent-variable"],
    child: params["child-variable"],
    value: params["value-variable"],
  };

  const pair = d3.map();
  const size = d3.map();
  const root = data[0][opts.root].value;
  let children = true;

  // generate a tree of parent => children data
  for (var i = 0; i < data.length; i++) {
    const parent = data[i][opts.parent].value;
    const child = data[i][opts.child].value;
    if (parent !== child) {
      if (pair.has(parent)) {
        children = pair.get(parent);
        children.push(child);
      } else {
        children = [child];
      }
      pair.set(parent, children);
      if (data[i][opts.value]) {
        size.set(child, data[i][opts.value].value);
      }
    }
  }

  // traverse a tree from the root node
  function traverse(node) {
    const list = pair.get(node);
    if (list) {
      const children = list.map(function (d) {
        return traverse(d);
      });
      // sum of values of children
      const subtotal = d3.sum(children, function (d) {
        return d.value;
      });
      // add a value of parent if exists
      const total = d3.sum([subtotal, size.get(node)]);
      return { name: node, children, value: total };
    } else {
      return { name: node, value: size.get(node) || 1 };
    }
  }

  return traverse(root);
}

// TODO: test & create a metastanza showing a graph
export function sparql2d3graph(json, params) {
  const data = json.results.bindings;

  const opts = {
    key1: params["node1-variable"],
    key2: params["node2-variable"],
    label1: params["label1-variable"],
    label2: params["label2-variable"],
    value1: params["value1-variable"],
    value2: params["value21-variable"],
  };
  const graph = {
    nodes: [],
    links: [],
  };
  const check = d3.map();
  let index = 0;
  for (var i = 0; i < data.length; i++) {
    const key1 = data[i][opts.key1].value;
    const key2 = data[i][opts.key2].value;
    const label1 = opts.label1 ? data[i][opts.label1].value : key1;
    const label2 = opts.label2 ? data[i][opts.label2].value : key2;
    const value1 = opts.value1 ? data[i][opts.value1].value : false;
    const value2 = opts.value2 ? data[i][opts.value2].value : false;
    if (!check.has(key1)) {
      graph.nodes.push({ key: key1, label: label1, value: value1 });
      check.set(key1, index);
      index++;
    }
    if (!check.has(key2)) {
      graph.nodes.push({ key: key2, label: label2, value: value2 });
      check.set(key2, index);
      index++;
    }
    graph.links.push({ source: check.get(key1), target: check.get(key2) });
  }
  //if (d3sparql.debug) { console.log(JSON.stringify(graph)) };
  return graph;
}
