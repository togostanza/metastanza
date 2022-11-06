import { F as select } from './index-bfc9b220.js';

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

let style;

function showLoadingIcon(element) {
  if (element.offsetHeight < 30) {
    select(element).transition().duration(100).style("min-height", "30px");
  }

  const css = (key) => getComputedStyle(element).getPropertyValue(key);

  const spinnerColor = css("--togostanza-loading-spinner-color");

  select(element).classed("main-center", true);

  style = document.createElement("style");
  style.setAttribute("id", "spinner-css");

  style.innerHTML = getSpinnerCss(spinnerColor || "grey");
  element.getRootNode().appendChild(style);

  const container = select(element)
    .append("div")
    .attr("class", "metastanza-loading-icon-div")
    .attr("id", "metastanza-loading-icon-div");

  container.append("div").classed("loading", true);
  container.append("div").classed("circle", true);
}

function hideLoadingIcon(element) {
  style?.remove();
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

async function loadJSON(url, requestInit) {
  const res = await fetch(url, requestInit);
  return await res.json();
}

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

async function loadSPARQL(url, requestInit) {
  const requestInitWithHeader = {
    headers: {
      Accept: "application/sparql-results+json",
    },
    ...requestInit,
  };

  const json = await loadJSON(url, requestInitWithHeader);
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

let cache = null;
let cacheKey = null;

async function loadData(
  url,
  type = "json",
  mainElement = null,
  timeout = 10 * 60 * 1000
) {
  const _cacheKey = JSON.stringify({ url, type });
  if (cacheKey === _cacheKey) {
    return cache;
  }

  const loader = getLoader(type);
  let data = null;

  const controller = new AbortController();
  const requestInit = {
    signal: controller.signal,
  };

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    if (mainElement) {
      showLoadingIcon(mainElement);
    }
    data = await loader(url, requestInit);

    cache = data;
    cacheKey = _cacheKey;
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
    clearTimeout(timer);
  }

  return data;
}

function getSpinnerCss(color) {
  return `
  :host {
    --loading_spinner_background: ${color};
    --dot_1: rgba(255,255,255,1);
    --dot_2: rgba(255,255,255,0.8);
    --dot_3: rgba(255,255,255,0.6);
    --dot_4: rgba(255,255,255,0.3);
  }

  .main-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
  }

  .metastanza-loading-icon-div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    position: relative;
  }

  .circle {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: var(--loading_spinner_background);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .loading {
    height: 3.5px;
    width: 3.5px;
    border-radius: 50%;
    animation: load 1.5s infinite ease;
    z-index: 1;
  }

  @keyframes load {
    0%,
    100% {
      box-shadow: 0em -0.7em 0em 0em var(--dot_1), 0.5em -0.45em 0 0em var(--dot_4), 0.7em 0em 0 0em var(--dot_4),
        0.45em 0.4em 0 0em var(--dot_4), 0em 0.7em 0 0em var(--dot_4),
        -0.45em 0.45em 0 0em var(--dot_3),-0.7em 0em 0 0em var(--dot_4),
        -0.45em -0.45em 0 0em var(--dot_2);
    }
    12.5% {
      box-shadow: 0em -0.7em 0em 0em var(--dot_2), 0.5em -0.45em 0 0em var(--dot_1), 0.7em 0em 0 0em var(--dot_4),
        0.45em 0.4em 0 0em var(--dot_4), 0em 0.7em 0 0em var(--dot_4),
        -0.45em 0.45em 0 0em var(--dot_4),-0.7em 0em 0 0em var(--dot_4),
        -0.45em -0.45em 0 0em var(--dot_3);
    }
    25% {
      box-shadow: 0em -0.7em 0em 0em var(--dot_3), 0.5em -0.45em 0 0em var(--dot_2), 0.7em 0em 0 0em var(--dot_1),
        0.5em 0.45em 0 0em var(--dot_4), 0em 0.7em 0 0em var(--dot_4),
        -0.5em 0.45em 0 0em var(--dot_4),-0.7em 0em 0 0em var(--dot_4),
        -0.5em -0.45em 0 0em var(--dot_4);
    }
    37.5% {
      box-shadow: 0em -0.7em 0em 0em var(--dot_4), 0.5em -0.45em 0 0em var(--dot_3), 0.7em 0em 0 0em var(--dot_2),
        0.5em 0.45em 0 0em var(--dot_1), 0em 0.7em 0 0em var(--dot_4),
        -0.5em 0.45em 0 0em var(--dot_4),-0.7em 0em 0 0em var(--dot_4),
        -0.5em -0.45em 0 0em var(--dot_4);
    }
    50% {
      box-shadow: 0em -0.7em 0em 0em var(--dot_4), 0.5em -0.45em 0 0em var(--dot_4), 0.7em 0em 0 0em var(--dot_3),
        0.5em 0.45em 0 0em var(--dot_2), 0em 0.7em 0 0em var(--dot_1),
        -0.5em 0.45em 0 0em var(--dot_4),-0.7em 0em 0 0em var(--dot_4),
        -0.5em -0.45em 0 0em var(--dot_4);
    }
    62.5% {
      box-shadow: 0em -0.7em 0em 0em var(--dot_4), 0.5em -0.45em 0 0em var(--dot_4), 0.7em 0em 0 0em var(--dot_4),
        0.5em 0.45em 0 0em var(--dot_3), 0em 0.7em 0 0em var(--dot_2),
        -0.5em 0.45em 0 0em var(--dot_1),-0.7em 0em 0 0em var(--dot_4),
        -0.5em -0.45em 0 0em var(--dot_4);
    }
    75% {
      box-shadow: 0em -0.7em 0em 0em var(--dot_4), 0.5em -0.45em 0 0em var(--dot_4), 0.7em 0em 0 0em var(--dot_4),
        0.5em 0.45em 0 0em var(--dot_4), 0em 0.7em 0 0em var(--dot_3),
        -0.5em 0.45em 0 0em var(--dot_2),-0.7em 0em 0 0em var(--dot_1),
        -0.5em -0.45em 0 0em var(--dot_4);
    }
    87.5% {
      box-shadow: 0em -0.7em 0em 0em var(--dot_4), 0.5em -0.45em 0 0em var(--dot_4), 0.7em 0em 0 0em var(--dot_4),
        0.5em 0.45em 0 0em var(--dot_4), 0em 0.7em 0 0em var(--dot_4),
        -0.5em 0.45em 0 0em var(--dot_3),-0.7em 0em 0 0em var(--dot_2),
        -0.5em -0.45em 0 0em var(--dot_1);
    }
  `;
}

export { dsvFormat as d, loadData as l };
//# sourceMappingURL=load-data-98db05cd.js.map
