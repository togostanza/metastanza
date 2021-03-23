import './index-b2de29ee.js';
import { d as dsvFormat } from './dsv-cd3740c6.js';

var csv$1 = dsvFormat(",");

var csvParse = csv$1.parse;

var tsv$1 = dsvFormat("\t");

var tsvParse = tsv$1.parse;

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

var csv = dsvParse(csvParse);
var tsv = dsvParse(tsvParse);

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
  return tsv(url);
}

function loadCSV(url) {
  // expect CSV data with a header line
  return csv(url);
}

async function loadJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

async function loadSPARQL(url) {
  const json = await loadJSON(url);
  return sparql2table(json);
}

// async function sparql2tree(url){
//   const json = await loadJSON(url);
//   const treeJson = sparql2table(json); //rootのオブジェクトが必要
//   const rootNode = {
//     "child_name": sparql2table(json)[0].root_name
//   }

//   treeJson.unshift(rootNode);
//   treeJson.forEach(data => {
//     if(!treeJson.some(datam => data.parent_name === datam.child_name)) {
//       console.log('親無し', data)
//     }
//   })
//   return treeJson;

//   //test loading function
//   const array1 = sparql2table(json); //rootのオブジェクトが必要
//   const rootNode = {
//     "child_name": sparql2table(json)[0].root_name
//   }

//   array1.unshift(rootNode);
//   array1.forEach(data => {
//     if(!array1.some(datam => data.parent_name === datam.child_name)) {
//       console.log('親無し', data)
//     }
//   })
//   console.log("array1",array1);

//   const testData =
//   [
//     {
//       "child_name": "first",
//     },
//     {
//       "child_name": "second",
//       "parent_name": "first"
//     },
//     {
//       "child_name": "forth",
//       "parent_name": "first"
//     },
//     {
//       "child_name": "third",
//       "parent_name": "second"
//     }
//   ]
//   console.log('testData',testData)

//   return array1;
//   return testData;
// }

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
//# sourceMappingURL=load-data-a2861a31.js.map
