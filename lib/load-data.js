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

async function loadSPARQL(url) {
  const json = await loadJSON(url);
  console.log('sparql2table(json)',sparql2table(json))
  console.log('sparql2table(json)[0].root_name',sparql2table(json)[0].root_name)
  return sparql2table(json);

  // const array1 = sparql2table(json); //rootのオブジェクトが必要
  // const rootNode = {
  //   "child_name": sparql2table(json)[0].root_name
  // }

  // console.log("array1.unshift(rootNode)",array1.unshift(rootNode));
  // console.log("array1",array1);

  // const testData =
  // [
  //   {
  //     "child_name": "first",
  //     // "parent_name": 1,      
  //     // "name": "flare"
  //   },
  //   {
  //     "child_name": "third",
  //     // "name": "cluster",
  //     "parent_name": "second"
  //   },
  //   {
  //     "child_name": "second",
  //     // "name": "analytics",
  //     "parent_name": "first"
  //   },
  // ]
  // console.log('testData',testData)
  // // return array1;
  // return testData;

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
