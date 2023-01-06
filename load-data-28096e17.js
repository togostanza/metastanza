import { F as select } from './index-f95f22d4.js';

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
  const spinnerBgColor = css("--togostanza-loading_spinner-bg_color");
  const spinnerColor = css("--togostanza-loading_spinner-color");

  style = document.createElement("style");
  style.setAttribute("id", "spinner-css");

  style.innerHTML = getSpinnerCss(
    spinnerBgColor || "rgba(0,0,0,0.2)",
    spinnerColor || "#fff"
  );
  element.getRootNode().appendChild(style);

  const container = select(element)
    .append("div")
    .classed("metastanza-loading-icon-div", true)
    .attr("id", "metastanza-loading-icon-div");

  const wrap = container.append("div").classed("spinner-wrap", true);
  const circle = wrap.append("div").classed("circle", true);
  const spinner = circle
    .append("div")
    .classed("spinner", true)
    .attr("style", "--count: 12");

  for (let i = 0; i < 12; i++) {
    spinner.append("span").attr("style", `--index: ${i}`);
  }
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

function withAcceptHeader(fetcher, accept) {
  return (url, requestInit) => {
    const requestInitWithHeader = {
      headers: {
        Accept: accept,
      },
      ...requestInit,
    };

    return fetcher(url, requestInitWithHeader);
  };
}

function loadJSON(url, requestInit) {
  return fetch(url, requestInit).then((res) => res.json());
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
  const json = await fetch(url, requestInit).then((res) => res.json());

  return sparql2table(json);
}

async function loadElasticsearch(url, requestInit) {
  const json = await fetch(url, requestInit).then((res) => res.json());

  return json.hits.hits.map((hit) => hit._source);
}

function getLoader(type) {
  switch (type) {
    case "text":
      return withAcceptHeader(text, "text/plain");
    case "tsv":
      return withAcceptHeader(tsv, "text/tab-separated-values");
    case "csv":
      return withAcceptHeader(csv, "text/csv");
    case "sparql-results-json":
      return withAcceptHeader(loadSPARQL, "application/sparql-results+json");
    case "elasticsearch":
      return withAcceptHeader(loadElasticsearch, "application/json");
    case "json":
    default:
      return withAcceptHeader(loadJSON, "application/json");
  }
}

let cache = null;
let cacheKey = null;

async function loadData(
  url,
  type = "json",
  mainElement = null,
  timeout = 10 * 60 * 1000,
  limit = null,
  offset = null
) {
  const _cacheKey = JSON.stringify({ url, type, limit, offset });
  if (cacheKey === _cacheKey) {
    return cache;
  }

  const u = new URL(url);
  if (limit) {
    u.searchParams.set(type === "elasticsearch" ? "size" : "limit", limit);
  }
  if (offset) {
    u.searchParams.set(type === "elasticsearch" ? "from" : "offset", offset);
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
    data = await loader(u, requestInit);

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

function getSpinnerCss(bgColor, spinnerColor) {
  return `
  :host {
    --loading_spinner_bg_color: ${bgColor};
    --loading_spinner_color: ${spinnerColor};
  }

  .metastanza-loading-icon-div {
    display: flex;
    align-items: center;
    height: 150px;
  }

  .spinner-wrap {
    position: absolute;
    left: 50%;
  }

  .circle {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--loading_spinner_bg_color);
    transform: translate(-50%, -50%);
  }

  .spinner {
    position: absolute;
    inset: 50%;
    animation: spin 2s steps(var(--count), end) infinite;
  }

  .spinner span {
    position: absolute;
    height: 2px;
    width: 4px;
    top: -1px;
    left: -2px;
    background-color: var(--loading_spinner_color);
    border-radius: 1.5px;
    transform: rotate(calc(var(--index) * 30deg)) translateX(6px) scaleY(0.5);
    opacity: calc(var(--index) / var(--count));
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  `;
}

export { dsvFormat as d, loadData as l };
//# sourceMappingURL=load-data-28096e17.js.map
