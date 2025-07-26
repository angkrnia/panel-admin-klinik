import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import { baseUrl } from "./config/axios";

window.Pusher = Pusher;

export default new Echo({
  broadcaster: "pusher",
  key: "local", // bebas, asal cocok di backend
  wsHost: "ws.adiyasamedicalcenter.com", // atau sesuai domain kamu di Cloudflare
  wsPort: 443,
  forceTLS: true,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  cluster: "mt1",

  authEndpoint: baseUrl + "/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${Cookies.get("TOKEN")}`,
    },
  },
});
