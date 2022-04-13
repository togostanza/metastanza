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

export { csv as c, tsv as t };
//# sourceMappingURL=dsv-cde6fd06.js.map
