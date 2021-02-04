import { getFormatedJson, appendDlButton } from "@/lib/metastanza_utils.js";

export default async function text(stanza, params) {
  const dataset = await getFormatedJson(
    params.api,
    // stanza.root.querySelector("#chart")
  );
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      rows: [
        {
          value: dataset.value,
        }
      ]
    }
  });
}