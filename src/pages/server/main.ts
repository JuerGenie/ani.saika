import { createApp } from "vue";
import Server from "./Server.vue";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "../../styles/global.css";
import "@mdi/font/css/materialdesignicons.css";

console.log("test", await import("vue"));
createApp(Server).mount(document.body);
