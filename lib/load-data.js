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

async function loadJSON(url, accept = "application/json") {
  const res = await fetch(url, { headers: { Accept: accept } });
  return await res.json();
}

async function loadSPARQL(url) {
  const json = await loadJSON(url, "application/sparql-results+json");
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
//     if(!treeJson.some(datum => data.parent_name === datum.child_name)) {
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
//     if(!array1.some(datum => data.parent_name === datum.child_name)) {
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
      row[key] = item[key] ? item[key].value : "";
    });
    return row;
  });
}
