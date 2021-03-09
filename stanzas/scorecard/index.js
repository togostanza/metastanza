import loadData from "@/lib/load-data";

export default async function scorecard(stanza, params) {
  const dataset = await loadData(params["data-url"], params["data-type"]);
  console.log(dataset);
  console.log(Object.values(dataset)[0]);
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      scorecards: [
        {
          key: Object.keys(dataset)[0],
          value: Object.values(dataset)[0],
        },
      ],
    },
  });
}
