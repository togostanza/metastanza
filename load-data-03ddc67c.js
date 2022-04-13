import { s as select } from './index-847f2a80.js';
import { c as csv, t as tsv } from './dsv-cde6fd06.js';

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

async function loadJSON(url, requestInit) {
  const res = await fetch(url, requestInit);
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
  "data:image/gif;base64,R0lGODlhPAAUAMQaAKLc5ZnZ49zy9bnl7Kje57Ti6vP7/Pn9/ej2+b/n7dHt8tnw9Mvr8azg6KDb5e74+vj9/eb1+Nbw9OL097Pi6tPu86be59/z9q7g6cDn7v///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODcxRkIwQUU2Mjk1Q0NDRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4QzM5QjBEQzkwNjMxMUUzOTQyOTlENEM0NjEzRDEwQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4QzM5QjBEQjkwNjMxMUUzOTQyOTlENEM0NjEzRDEwQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyODAxMTc0MDcyMDY4MTE4NzFGQjBBRTYyOTVDQ0NFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0MDcyMDY4MTE4NzFGQjBBRTYyOTVDQ0NFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEBQoAGgAsAAAAADwAFAAABWKgJo5kaZ5oqq5s676wKgxADQxCrL9GYf+AgmFHRBkIQCBhWGyKfElgwdkURKM56o52BQ60u24UrBMnyTEzEA1T/9gvrvoLb1nd2ToLKp7qW0diS38uPVdChDAzPziJjo+QIQAh+QQJCgAaACwIAAgABAAEAAAFCuCRJCIAjCY5HiEAIfkECQoAGgAsAAAAADwAFAAABUegJo5kaZ5oqq5s675wLM90bd94rtcHghy7oIAAABAEwdyBWDQCkzZEs4mARqfFqpW2nBKe29mweAzbej+zes1uu9/wuHwWAgAh+QQJCgAaACwAAAAAPAAUAAAFd6AmjmRpnmiqrmzrvrAqDEANDEKsv0Zh/4CCYUdEPQhAIGFYhCESBEJiglAgk8BC86XAerG57QrxLf8G4lXCzAakVdf2952Ky7F01PruzZ/IfElofiZdgT9hhCVPUVNVdl5aii5HZUuTPD5YQpgxM2eJnaKjpBohACH5BAkKABoALAAAAAA8ABQAAAV0oCaOZGmeaKqubOu+cPpIA2ADgxDv6iEoigHmRrQVDLyk6MAoOosEpHJXeFpvhWmsee3qtK1DdzwAtwTjsZmlSHfXq7bbCleh5896SowvlvUoXH02X4AmB1WDWYYpgm5RjD0/QUNWR5EwMzU3OZhTB56hOyEAIfkECQoAGgAsAAAAADwAFAAABXmgJo5kaZ5oqq6suWRN4FCUEzTZ0u48GVmBoHAYtER6SNWCyCTqktDRpUkVXqJQiK1KdUCwyAqXWwH3YmNqw8xLc9ktiLsKZ8nnzToLn9er0HxBa34pYoFBZYQoWodeiilTgVePKUt4T5QpP2lGmS0vMTM1NzmepjwhACH5BAkKABoALAAAAAA8ABQAAAV2oCaOZGmeaKqubOu+sCoMQA0M0hPvrlHYwBpmoFAIDrzkyEAIOoMMZfL3rNYKSOlLYO0ColoXzWvNhlfkruC8OqStCrbK/X7G5an6c41HjfU2Zn0lXIA1YIMnVHoFiSlMegyCjiU+VkNFR5QsM0A4OpuhoqMiIQAh+QQJCgAaACwAAAAAPAAUAAAFeKAmjmRpnmiqrmzrvrAqDEANDEKsv0Zh/4CCYUdEGQhAIOFRbI58SaUCMUkQCAmE0yWIeqOKLYv2Ldu04pR5DUikUQe2mfA+xeVfet2E/7r3JWR9QGiAI12DP2GGJVBlBFNVV1mMJkePTJUtPV5CmjAzPzifpKWmIQAh+QQJCgAaACwAAAAAPAAUAAAFhKAmjmRpnmiqrmzrvrAqDEANDEKsv0Zh/4CCYUdEGQhAIGFYbIp8SWDB2RREo7nSAYE4UFW0K3BQEiABhOzXJI6SDucawbsutZMkRBJRt99/eXt9JH+AI3A/c4MjYX9kJGZyaotWhZMiW12LJVBtU5suR21LoDydUkylLzM/OKqvsLEkIQAh+QQFCgAaACwAAAAAPAAUAAAFcKAmjmRpnmiqrmzrvrAqDEANDEKsv0Zh/4CCYUdEGQhAIGFYbIp8SWDB2RREoznqjnYFDrS7blR1SCQOYJI4qUrUEunRGth+x0XzH9mMvnPnX3cuVnlZgi1QYlOHLkdiS4w8iVJMkS8zPziWm5ydJCEAOw==";

export { loadData as l };
//# sourceMappingURL=load-data-03ddc67c.js.map
