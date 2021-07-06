import { z as Selection, A as root } from './index-a60af4a2.js';

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

function appendDlButton(buttonDiv, svg, filename, root) {
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
      downloadImg(select(svg), d.type, filename, root);
      dlListDiv.style("display", "none");
    })
    .on("mouseover", function () {
      this.classList.add("hover");
    })
    .on("mouseout", function () {
      this.classList.remove("hover");
    });

  const downloadImg = function (svg, format, filename, root) {
    let url, img, canvas, context;
    const pngZoom = 2; // png resolution rate

    svg.attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg");

    let style = "";
    console.log('root.querySelector("style")', root.querySelector("style"));
    if (root.host && root.querySelector("style")) {
      style += root
        .querySelector("style")
        .innerHTML.replace(/[\r\n]/g, "")
        .match(/^\s*:host\s*{(.+)}\s*$/)[1];
    }
    console.log("root.host", root.host);

    const outerCode = document
      .querySelector(".overflow-auto")
      .innerHTML.replace("<code>", "")
      .replace("</code>", "");
    const customizedStyle = outerCode
      .replaceAll('""', "")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .match(/<style>[\s\S]*?<\/style>/);
    if (customizedStyle) {
      //when customize styles exist
      style += customizedStyle[0]
        .replace("<style>", "")
        .replace("</style>", "")
        .replace(/[\r\n]/g, "")
        .match(/^\s*togostanza-.+\s{\s(.+\s)+}\s*$/)[1];
    }

    const tmp = svg.node().outerHTML.match(/^([^>]+>)([\s\S]+)$/);
    const string = tmp[1] + "<style>svg{" + style + "}</style>" + tmp[2];
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

export { appendDlButton as a, select as s };
//# sourceMappingURL=metastanza_utils-1e6af370.js.map
