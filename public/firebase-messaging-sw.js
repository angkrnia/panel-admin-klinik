importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBNobSA29VuHuIBnxquspP68omOSTWmlC4",
    authDomain: "dev-adiyasa.firebaseapp.com",
    projectId: "dev-adiyasa",
    storageBucket: "dev-adiyasa.firebasestorage.app",
    messagingSenderId: "919205361636",
    appId: "1:919205361636:web:bc8527c60bd637c49479f1",
    measurementId: "G-S0VM63T3VY",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "Notifikasi";
    const options = {
        body: payload.notification?.body || payload.data?.message || "Ada notifikasi baru.",
        icon: payload.notification?.icon || "/favicon.ico",
        data: payload.data || {},
    };

    self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ("focus" in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
