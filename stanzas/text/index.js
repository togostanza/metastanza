import loadData from "@/lib/load-data";

export default async function text(stanza, params) {
  stanza.importWebFontCSS('https://use.fontawesome.com/releases/v5.6.3/css/all.css');
  const dataset = await loadData(params["data-url"], params["data-type"]);
  const textBlob = new Blob([dataset.value], {
    type: "text/plain",
  });

  const textUrl = URL.createObjectURL(textBlob);
  console.log(textUrl);

  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      rows: [
        {
          value: dataset.value,
        },
      ],
      textUrl: URL.createObjectURL(textBlob),
    },
  });
  const width = params["width"];
  const height = params["height"];
  const padding = params["padding"];
  const table = stanza.root.querySelector("table");
  table.setAttribute(
    `style`,
    `width: ${width}px; height: ${height}px; padding: ${padding}px;`
  );

  const menu = stanza.root.querySelector(".menu");
  switch (params["metastanza-menu-placement"]) {
    case "top-left":
      break;
    case "top-right":
      menu.setAttribute("style", "justify-content: flex-end;");
      break;
    case "bottom-left":
      menu.setAttribute("style", "flex-direction: column-reverse;");
      break;
    case "bottom-right":
      menu.setAttribute("style", "justify-content flex-end; flex-direction: column-reverse;");
      break;
    case "none":
      menu.setAttribute("style", "display: none;");
      break;
  }
}
