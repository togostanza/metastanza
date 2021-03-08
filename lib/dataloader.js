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
    let row = {};
    head.forEach(key) => {
      row[key] = item[key].value;
    }
    return row
  });
}

// TODO: implement for Vega
// https://vega.github.io/vega/data/flare.json
export function sparql2tree(json) {
  // nothing to do?
  return json
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
  const head = json.head.vars;
  const data = json.results.bindings;

  const opts = {
    "root":   params["root-variable"],
    "parent": params["parent-variable"],
    "child":  params["child-variable"],
    "value":  params["value-variable"]
  };

  let pair = d3.map();
  let size = d3.map();
  let root = data[0][opts.root].value;
  let parent = child = children = true;

  // generate a tree of parent => children data
  for (var i = 0; i < data.length; i++) {
    parent = data[i][opts.parent].value;
    child = data[i][opts.child].value;
    if (parent != child)n {
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
    var list = pair.get(node);
    if (list) {
      var children = list.map(function(d) { return traverse(d) });
      // sum of values of children
      var subtotal = d3.sum(children, function(d) { return d.value });
      // add a value of parent if exists
      var total = d3.sum([subtotal, size.get(node)]);
      return {"name": node, "children": children, "value": total};
    } else {
      return {"name": node, "value": size.get(node) || 1};
    }
  }
  let tree = traverse(root);

  //if (d3sparql.debug) { console.log(JSON.stringify(tree)) };
  return tree;
}

// TODO: test & create a metastanza showing a graph
export function sparql2d3graph(json, params) {
  const head = json.head.vars;
  const data = json.results.bindings;

  let opts = {
    "key1":   params['node1-variable'],
    "key2":   params['node2-variable'],
    "label1": params['label1-variable'],
    "label2": params['label2-variable'],
    "value1": params['value1-variable'],
    "value2": params['value21-variable']
  }
  let graph = {
    "nodes": [],
    "links": []
  };
  let check = d3.map();
  let index = 0;
  for (var i = 0; i < data.length; i++) {
    let key1 = data[i][opts.key1].value;
    let key2 = data[i][opts.key2].value;
    let label1 = opts.label1 ? data[i][opts.label1].value : key1;
    let label2 = opts.label2 ? data[i][opts.label2].value : key2;
    let value1 = opts.value1 ? data[i][opts.value1].value : false;
    let value2 = opts.value2 ? data[i][opts.value2].value : false;
    if (!check.has(key1)) {
      graph.nodes.push({"key": key1, "label": label1, "value": value1});
      check.set(key1, index);
      index++;
    }
    if (!check.has(key2)) {
      graph.nodes.push({"key": key2, "label": label2, "value": value2});
      check.set(key2, index);
      index++;
    }
    graph.links.push({"source": check.get(key1), "target": check.get(key2)});
  }
  //if (d3sparql.debug) { console.log(JSON.stringify(graph)) };
  return graph;
}

export async function getFormatedJson(url, element, post_params) {
  try {
    const res = await fetchReq(url, element, post_params);

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    const detail =
      error.name === "AbortError"
        ? "Error: Request timed out."
        : error.toString();

    displayApiError(element, detail);

    throw error;
  }
}