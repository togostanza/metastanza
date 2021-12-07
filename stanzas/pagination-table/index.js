import Stanza from "togostanza/stanza";
import { createApp } from "vue";
import App from "./app.vue";

import {
  appendCustomCss,
  downloadJSONMenuItem,
  downloadCSVMenuItem,
} from "togostanza-utils";

export default class PaginationTable extends Stanza {
  menu() {
    return [
      downloadJSONMenuItem(this, "table.json", this._component?.json()),
      downloadCSVMenuItem(this, "table.csv", this._component?.json()),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    main.parentNode.style.padding = this.params["padding"];

    this._app?.unmount();
    this._app = createApp(App, this.params);
    this._component = this._app.mount(main);
  }
}
