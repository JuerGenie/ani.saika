import { createApp } from "vue";
import Client from "./Client.vue";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "../../styles/global.css";
import "@mdi/font/css/materialdesignicons.css";

console.log("test", await import("vue"));
createApp(Client).mount(document.body);
