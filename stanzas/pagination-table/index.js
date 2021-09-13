import Stanza from "togostanza/stanza";
import { createApp, h } from "vue";
import App from "./app.vue";

import { appendCustomCss } from "@/lib/metastanza_utils.js";

export default class PaginationTable extends Stanza {
  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    this._setMainPadding();

    const self = this;
    this._app = createApp({
      render() {
        return h(App, self.params);
      },
    });
    this._component = this._app.mount(main);
  }

  _setMainPadding() {
    const main = this.root.querySelector("main");
    main.parentNode.style.padding = this.params["padding"];
  }

  handleAttributeChange(name) {
    if (name === "padding") {
      this._setMainPadding();
    }
    this._component?.$forceUpdate();
  }
}
