import Stanza from "togostanza/stanza";
import { createApp } from "vue";
import App from "./app.vue";

import {appendCustomCss} from "@/lib/metastanza_utils.js";

export default class PaginationTable extends Stanza {
  async render() {
    appendCustomCss(this,this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    main.parentNode.style.padding = this.params["padding"];
    createApp(App, this.params).mount(main);
  }
}
