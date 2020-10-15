const url = 'http://togostanza.org/sparqlist/api/d3sparql_barchart';

export default async function barchart(stanza, params) {
  const data = await fetch(url).then(res => res.json());

  const items = data.results.bindings.map((row) => {
    return {
      label: row.pref.value,
      value: row.area.value
    };
  });

  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {items}
  });
}
