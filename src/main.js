import { createApp } from "vue";
import App from "./App.vue";
import { store } from "./store";
import router from "./router";

import "tdesign-vue-next/es/style/index.css";
import TDesign from "tdesign-vue-next";
import "./permission";
import "@/style/index.scss";

const app = createApp(App);
app.use(TDesign);
app.use(store);
app.use(router);
app.mount("#app");
