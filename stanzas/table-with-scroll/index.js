import { createApp } from "vue";
import App from "./app.vue";

export default async function tableWithPagination(stanza, params) {
  const main = stanza.root.querySelector("main");
  main.setAttribute(
    `style`,
    `width: ${params["width"]}px;
    height: ${params["height"]}px;
    padding: ${params["padding"]}px;`
  );
  createApp(App, params).mount(main);
}
