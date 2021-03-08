import * as d3 from "d3";

// TODO: test
export default function loadData(url, type = "json") {
  switch (type) {
    case "tsv":
      return loadTSV(url);
    case "csv":
      return loadCSV(url);
    case "sparql-results-json":
      return loadSPARQL(url);
    case "json":
    default:
      return loadJSON(url);
  }
}

function loadTSV(url) {
  // expect TSV data with a header line
  return d3.tsv(url);
}

function loadCSV(url) {
  // expect CSV data with a header line
  return d3.csv(url);
}

async function loadJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

function loadSPARQL(url) {
  const json = loadJSON(url);
  return sparql2table(json);
}

// TODO: test & improve
function sparql2table(json) {
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
