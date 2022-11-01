import { s as select } from './transform-0e5d4876.js';
import { c as csv, t as tsv } from './dsv-ac31b097.js';

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

export { loadData as l };
//# sourceMappingURL=load-data-ad9ea040.js.map
