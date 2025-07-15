import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus, { ElNotification } from "element-plus";
import App from "./App.vue";
import router from "./router";
import Echo from "./echo";

window.Echo = Echo;

const doctor_id = 10;

// window.Echo.private(`clinic.${import.meta.env.VITE_PUSHER_APP_NAME}.doctor.${doctor_id}`).listen(".clinic.antrian", (e) => {
//     console.log("📥 Pesan dari perawat ke dokter:", e);
// });

window.Echo.private(`clinic.adiyasa.doctor.${doctor_id}`).listen(".clinic.perawat", (e) => {
    ElNotification({
        title: "Pengambilan Obat",
        message: `
    <div>
    ${e.message}<br />
      <button class="mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
        Lihat
      </button>
    </div>
  `,
        type: "info",
        dangerouslyUseHTMLString: true,
        onClick: () => {
            router.push("/pharmacy");
        },
    });
});

// window.Echo.channel("klinik_adiyasa").listen(".antrian", (e) => {
//     console.log("📥 Pesan real-time dari antrian:", e);
// });

import "element-plus/dist/index.css";
import "./assets/css/tailwind.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
const pinia = createPinia();

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(VueApexCharts);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
