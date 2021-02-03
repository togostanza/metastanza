import metastanza from "@/lib/metastanza_utils.js";
import { span } from "vega";
import { filter, sort } from "d3";
import { forEach } from "vega-lite/build/src/encoding";

import { createApp } from 'vue';
import App from './app.vue';

export default async function tableWithPagination(stanza, params) {
  const main = stanza.root.querySelector('main');
  createApp(App, params).mount(main);
}
