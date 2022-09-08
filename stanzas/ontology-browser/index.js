import Stanza from "togostanza/stanza";

import { appendCustomCss } from "togostanza-utils";
import { OntologyBrowser } from "./components/OntologyBrowser";

export default class Linechart extends Stanza {
  menu() {
    return [];
  }

  render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const root = this.root.querySelector("main");

    if (!this.ontologyViewer) {
      this.ontologyViewer = new OntologyBrowser(root);
    }

    this.ontologyViewer.updateParams(this.params);
  }
}
