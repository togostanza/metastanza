import Stanza from "togostanza/stanza";
import loadData from "togostanza-utils/load-data";

import { appendCustomCss } from "togostanza-utils";
import { OntologyBrowser } from "./components/OntologyBrowser";

export default class Linechart extends Stanza {
  menu() {
    return [];
  }

  render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const params = Object.entries(this.params).map(([key, value]) => {
      return { name: key, value };
    });

    const root = this.root.querySelector("main");

    this.ontologyViewer = new OntologyBrowser(root, params);
  }
}
