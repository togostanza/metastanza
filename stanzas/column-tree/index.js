import Stanza from 'togostanza/stanza';

export default class ColumnTree extends Stanza {
  async render() {
    this.renderTemplate(
      {
        template: 'stanza.html.hbs',
        parameters: {
          greeting: `Hello, ${this.params['say-to']}!`
        }
      }
    );
  }
}
