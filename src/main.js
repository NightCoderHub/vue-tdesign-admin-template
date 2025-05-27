import { createApp } from "vue";
import App from "./App.vue";
import { store } from "./store";
import router from "./router";

import "tdesign-vue-next/es/style/index.css";

import "./permission";
import "@/style/index.scss";

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");
