import { s as select } from './index-1e0b4ea1.js';

var EOL = {},
    EOF = {},
    QUOTE = 34,
    NEWLINE = 10,
    RETURN = 13;

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function(name, i) {
    return JSON.stringify(name) + ": d[" + i + "] || \"\"";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function(row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function(row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

function pad(value, width) {
  var s = value + "", length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}

function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6)
    : year > 9999 ? "+" + pad(year, 6)
    : pad(year, 4);
}

function formatDate(date) {
  var hours = date.getUTCHours(),
      minutes = date.getUTCMinutes(),
      seconds = date.getUTCSeconds(),
      milliseconds = date.getUTCMilliseconds();
  return isNaN(date) ? "Invalid Date"
      : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
      + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
      : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
      : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
      : "");
}

function dsvFormat(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // current line number
        t, // current token
        eof = N <= 0, // current token followed by EOF?
        eol = false; // current token followed by EOL?

    // Strip the trailing newline.
    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL;

      // Unescape quotes.
      var i, j = I, c;
      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
        if ((i = I) >= N) eof = true;
        else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      }

      // Find next delimiter or newline.
      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
        else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      }

      // Return last token before EOF.
      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF) row.push(t), t = token();
      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  function preformatBody(rows, columns) {
    return rows.map(function(row) {
      return columns.map(function(column) {
        return formatValue(row[column]);
      }).join(delimiter);
    });
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
  }

  function formatBody(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return preformatBody(rows, columns).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(value) {
    return value == null ? ""
        : value instanceof Date ? formatDate(value)
        : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
        : value;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatBody: formatBody,
    formatRows: formatRows,
    formatRow: formatRow,
    formatValue: formatValue
  };
}

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

function showLoadingIcon(element) {
  if (element.offsetHeight < 30) {
    select(element).transition().duration(100).style("min-height", "30px");
  }
  select(element)
    .append("div")
    .attr("class", "metastanza-loading-icon-div")
    .attr("id", "metastanza-loading-icon-div")
    .style("position", "absolute")
    .style("top", "10px")
    .style("left", Math.floor(element.offsetWidth / 2) - 30 + "px")
    .append("img")
    .attr("class", "metastanza-loading-icon")
    .attr("src", loadingIconGif);
}

function hideLoadingIcon(element) {
  select(element).select("#metastanza-loading-icon-div").remove();
}

function displayApiError(element, error) {
  select(element).select(".metastanza-error-message-div").remove();
  const p = select(element)
    .append("div")
    .attr("class", "metastanza-error-message-div")
    .append("p")
    .attr("class", "metastanza-error-message");
  p.append("span").text("MetaStanza API error");
  p.append("br");
  p.append("span").text(error);
}

async function loadJSON(url, accept = "application/json") {
  const res = await fetch(url, { headers: { Accept: accept } });
  return await res.json();
}

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

async function loadSPARQL(url) {
  const json = await loadJSON(url, "application/sparql-results+json");
  return sparql2table(json);
}

function getLoader(type) {
  switch (type) {
    case "tsv":
      return tsv;
    case "csv":
      return csv;
    case "sparql-results-json":
      return loadSPARQL;
    case "json":
    default:
      return loadJSON;
  }
}

async function loadData(url, type = "json", mainElement = null) {
  const loader = getLoader(type);
  let data = null;

  try {
    if (mainElement) {
      showLoadingIcon(mainElement);
    }

    data = await loader(url);
  } catch (error) {
    if (mainElement) {
      const detail =
        error.name === "AbortError"
          ? "Error: Request timed out."
          : error.toString();

      displayApiError(mainElement, detail);
    }

    throw error;
  } finally {
    if (mainElement) {
      hideLoadingIcon(mainElement);
    }
  }

  return data;
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

const loadingIconGif =
  "data:image/gif;base64,R0lGODlhPAAUAMQaAKLc5ZnZ49zy9bnl7Kje57Ti6vP7/Pn9/ej2+b/n7dHt8tnw9Mvr8azg6KDb5e74+vj9/eb1+Nbw9OL097Pi6tPu86be59/z9q7g6cDn7v///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODcxRkIwQUU2Mjk1Q0NDRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4QzM5QjBEQzkwNjMxMUUzOTQyOTlENEM0NjEzRDEwQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4QzM5QjBEQjkwNjMxMUUzOTQyOTlENEM0NjEzRDEwQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyODAxMTc0MDcyMDY4MTE4NzFGQjBBRTYyOTVDQ0NFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0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";

export { loadData as l };
//# sourceMappingURL=load-data-0be92417.js.map
