import Stanza from "togostanza/stanza";

import {
  copyHTMLSnippetToClipboardMenuItem,
  appendCustomCss,
} from "togostanza-utils";

import { createApp } from "vue";
import App from "./app.vue";

export default class ScrollTable extends Stanza {
  menu() {
    return [copyHTMLSnippetToClipboardMenuItem(this)];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    main.parentNode.style.padding = this.params["padding"];

    this._app?.unmount();
    this._app = createApp(App, this.params);
    this._app.mount(main);
  }
}
