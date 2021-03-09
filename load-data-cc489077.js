import './index-b010e6ef.js';
import { d as dsvFormat } from './dsv-cd3740c6.js';

var csv = dsvFormat(",");

var csvParse = csv.parse;

var tsv = dsvFormat("\t");

var tsvParse = tsv.parse;

function responseText(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.text();
}

function text(input, init) {
  return fetch(input, init).then(responseText);
}

function dsvParse(parse) {
  return function(input, init, row) {
    if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
    return text(input, init).then(function(response) {
      return parse(response, row);
    });
  };
}

var csv$1 = dsvParse(csvParse);
var tsv$1 = dsvParse(tsvParse);

// TODO: test
function loadData(url, type = "json") {
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
  return tsv$1(url);
}

function loadCSV(url) {
  // expect CSV data with a header line
  return csv$1(url);
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

export { loadData as l };
//# sourceMappingURL=load-data-cc489077.js.map
