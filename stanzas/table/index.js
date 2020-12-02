export default async function table(stanza, params) {

  const sayTo = params['say-to'] || 'world';

  let table = {
    header: ["hoge", "fuga", "piyo"],
    data: [
      {col: ["r1-c1", "r1-c2", "cr1-c3"]},
      {col: ["a", "b", "c"]}
    ]
  };
  
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
      greeting: `Hello, ${params['say-to']}!`
    }
  });
}
