import { createApp } from "vue";
import App from "./App.vue";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./styles/global.css";
import "@mdi/font/css/materialdesignicons.css";

console.log("test", await import("vue"));

createApp(App).mount("#app");
