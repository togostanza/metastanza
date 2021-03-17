import { createApp } from "vue";
import App from "./app.vue";

export default async function tableWithPagination(stanza, params, foo) {
  stanza.importWebFontCSS('./assets/font/fontello.css');
  const main = stanza.root.querySelector("main");
  createApp(App, params).mount(main);
}
