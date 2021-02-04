import { getFormatedJson, appendDlButton } from "@/lib/metastanza_utils.js";

export default async function text(stanza, params) {
  const dataset = await getFormatedJson(
    params.api,
    // stanza.root.querySelector("#chart")
  );
  console.log(dataset);
  console.log(dataset.value);
  
  stanza.render({
    template: "stanza.html.hbs",
    parameters: {
      fields: [
        {
          label: 'First name',
          required: true
        },
        {
          label: 'Middle name',
          required: false
        },
        {
          label: 'Last name',
          required: true
        },
      ],
      rows: [
        {
          value: dataset.value,
        }
      ]
    }
  });
}