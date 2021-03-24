import { createApp } from "vue";
import App from "./app.vue";

export default async function scrollTable(stanza, params) {
  const main = stanza.root.querySelector("main");
  createApp(App, params).mount(main);
}
