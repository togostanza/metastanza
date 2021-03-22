import { S as Selection, r as root } from './index-b2de29ee.js';

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

function appendDlButton(buttonDiv, svg, filename, stanza) {
  const dlButtonSVG = select(buttonDiv)
    .append("svg")
    .attr("id", "dl_button")
    .attr("width", 32)
    .attr("height", 32);
  const dlListDiv = select(buttonDiv)
    .append("div")
    .attr("id", "dl_list")
    .style("display", "none");
  const g = dlButtonSVG
    .append("g")
    .attr("class", "circle_g")
    .on("click", function () {
      if (dlListDiv.style("display") === "none") {
        dlListDiv.style("display", "block");
      } else {
        dlListDiv.style("display", "none");
      }
    })
    .on("mouseover", function () {
      this.classList.add("hover");
    })
    .on("mouseout", function () {
      this.classList.remove("hover");
    });
  g.append("circle")
    .attr("cx", 16)
    .attr("cy", 16)
    .attr("r", 15)
    .attr("fill", "#FFFFFF");
  // .attr("stroke", "#000000");
  g.append("circle")
    .attr("cx", 8)
    .attr("cy", 16)
    .attr("r", 2)
    .attr("fill", "#000000");
  g.append("circle")
    .attr("cx", 16)
    .attr("cy", 16)
    .attr("r", 2)
    .attr("fill", "#000000");
  g.append("circle")
    .attr("cx", 24)
    .attr("cy", 16)
    .attr("r", 2)
    .attr("fill", "#000000");

  const listData = [
    { text: "Save as SVG", type: "svg" },
    { text: "Save as PNG", type: "png" },
  ];

  const dlListUl = dlListDiv.append("ul");
  dlListUl
    .selectAll(".dl_type")
    .data(listData)
    .enter()
    .append("li")
    .attr("class", "dl_type")
    .text(function (d) {
      return d.text;
    })
    .on("click", function (e, d) {
      downloadImg(select(svg), d.type, filename, stanza);
      dlListDiv.style("display", "none");
    })
    .on("mouseover", function () {
      this.classList.add("hover");
    })
    .on("mouseout", function () {
      this.classList.remove("hover");
    });

  const downloadImg = function (svg, format, filename, stanza) {
    let url, img, canvas, context;
    const pngZoom = 2; // png resolution rate

    svg.attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg");

    let style = "";
    if (stanza.root.host && stanza.root.host.querySelector("style")) {
      style += stanza.root.host
        .querySelector("style")
        .innerHTML.replace(/[\r\n]/g, "");
    }
    if (stanza && stanza.root.querySelector("style")) {
      style += stanza.root
        .querySelector("style")
        .innerHTML.replace(/[\r\n]/g, "");
    }
    const tmp = svg.node().outerHTML.match(/^([^\>]+\>)([\s\S]+)$/);
    console.log(
      "svg.node().outerHTML",
      svg.node().outerHTML.match(/^([^\>]+\>)/)[1]
    );
    const string = tmp[1] + "<style>" + style + "</style>" + tmp[2];
    const w = parseInt(svg.style("width"));
    const h = parseInt(svg.style("height"));

    // downloading function
    const aLinkClickDL = function () {
      if (format === "png") {
        context.drawImage(img, 0, 0, w, h, 0, 0, w * pngZoom, h * pngZoom);
        url = canvas.node().toDataURL("image/png");
      }

      const a = select("body").append("a");
      a.attr("class", "downloadLink")
        .attr("download", filename)
        .attr("href", url)
        .text("test")
        .style("display", "none");

      a.node().click();

      setTimeout(function () {
        window.URL.revokeObjectURL(url);
        if (format === "png") {
          canvas.remove();
        }
        a.remove();
      }, 10);
    };

    if (format === "svg") {
      // SVG
      filename += ".svg";
      const blobObject = new Blob([string], {
        type: "data:image/svg+xml;base64",
      });
      url = window.URL.createObjectURL(blobObject);
      aLinkClickDL();
    } else if (format === "png") {
      // PNG
      console.log(string);
      filename += ".png";
      img = new Image();
      img.src = "data:image/svg+xml;utf8," + encodeURIComponent(string);
      img.addEventListener("load", aLinkClickDL, false);

      canvas = select("body")
        .append("canvas")
        .attr("width", w * pngZoom)
        .attr("height", h * pngZoom)
        .style("display", "none");
      context = canvas.node().getContext("2d");
    }
  };
}

async function getFormatedJson(url, element, post_params) {
  try {
    const res = await fetchReq(url, element, post_params);

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    const detail =
      error.name === "AbortError"
        ? "Error: Request timed out."
        : error.toString();

    displayApiError(element, detail);

    throw error;
  }
}

async function fetchReq(url, element, post_params) {
  //// url:     API URL
  //// element: target element for loding icon, error message
  //// params:  API parameters for the POST method

  // loading icon img
  if (element) {
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

  try {
    // fetch options
    let options;

    if (post_params) {
      // post
      const params = new URLSearchParams();

      for (const [k, v] of Object.entries(post_params)) {
        params.append(k, v);
      }

      options = {
        method: "post",
        body: params,
        headers: {
          Accept: "application/json",
        },
      };
    } else {
      options = {
        method: "get",
        headers: { Accept: "application/json" },
      };
    }

    return await fetchWithTimeout(url, options, { timeout: 600_000 });
  } finally {
    if (element) {
      select(element).select("#metastanza-loading-icon-div").remove();
    }
  }
}

async function fetchWithTimeout(url, options, { timeout }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    return res;
  } finally {
    clearTimeout(timer);
  }
}

function displayApiError(element, error) {
  select(element)
    .append("div")
    .attr("class", "metastanza-error-message-div")
    .append("p")
    .attr("class", "metastanza-error-message")
    .html("MetaStanza API error:<br>" + error);
}

const loadingIconGif =
  "data:image/gif;base64,R0lGODlhPAAUAMQaAKLc5ZnZ49zy9bnl7Kje57Ti6vP7/Pn9/ej2+b/n7dHt8tnw9Mvr8azg6KDb5e74+vj9/eb1+Nbw9OL097Pi6tPu86be59/z9q7g6cDn7v///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODcxRkIwQUU2Mjk1Q0NDRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4QzM5QjBEQzkwNjMxMUUzOTQyOTlENEM0NjEzRDEwQSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4QzM5QjBEQjkwNjMxMUUzOTQyOTlENEM0NjEzRDEwQSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAyODAxMTc0MDcyMDY4MTE4NzFGQjBBRTYyOTVDQ0NFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0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";

export { appendDlButton as a, getFormatedJson as g, select as s };
//# sourceMappingURL=metastanza_utils-0648515a.js.map
