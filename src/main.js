import { createApp } from "vue";
import App from "./App.vue";
import { store } from "./store";
import router from "./router";

import "tdesign-vue-next/es/style/index.css";
import "@/style/index.scss";

import "./permission";

import directives from "./directives";
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key]);
});

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");
