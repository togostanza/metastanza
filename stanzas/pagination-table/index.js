import Stanza from "togostanza/stanza";

import { createApp } from "vue";
import App from "./app.vue";

export default class PaginationTable extends Stanza {
  async render() {
    const style = this.root.querySelector("style");
    fetch(this.params["insert-css-url"])
      .then((response) => response.text())
      .then((data) => {
        style.insertAdjacentHTML("beforeend", data);
      });

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";
    main.parentNode.style.padding = this.params["padding"];
    createApp(App, this.params).mount(main);
  }
}
