import loadData from "@/lib/load-data";

export default async function text(stanza, params) {
  const dataset = await loadData(params["data-url"], params["data-type"]);

  console.log(dataset.value);
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
}
