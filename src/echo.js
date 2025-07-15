import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import { baseUrl } from "./config/axios";

window.Pusher = Pusher;

export default new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    wsHost: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
    wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    forceTLS: import.meta.env.VITE_PUSHER_SCHEME === "https",
    encrypted: false,
    disableStats: true,
    enabledTransports: ["ws"],
    cluster: "",

    authEndpoint: baseUrl + "/broadcasting/auth",
    auth: {
        headers: {
            Authorization: `Bearer ${Cookies.get("TOKEN")}`,
        },
    },
});
