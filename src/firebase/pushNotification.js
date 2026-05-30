import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, getToken, isSupported as isMessagingSupported, onMessage } from "firebase/messaging";
import { ElNotification } from "element-plus";
import { axiosAuth } from "../config/axios";

const firebaseConfig = {
    apiKey: "AIzaSyBNobSA29VuHuIBnxquspP68omOSTWmlC4",
    authDomain: "dev-adiyasa.firebaseapp.com",
    projectId: "dev-adiyasa",
    storageBucket: "dev-adiyasa.firebasestorage.app",
    messagingSenderId: "919205361636",
    appId: "1:919205361636:web:bc8527c60bd637c49479f1",
    measurementId: "G-S0VM63T3VY",
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const app = initializeApp(firebaseConfig);

let messaging = null;
let initialized = false;

async function initAnalytics() {
    if (await isAnalyticsSupported()) {
        getAnalytics(app);
    }
}

async function getFirebaseMessaging() {
    if (!(await isMessagingSupported())) return null;

    if (!messaging) {
        messaging = getMessaging(app);
    }

    return messaging;
}

async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return null;

    return navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

async function saveFcmToken(token) {
    await axiosAuth.post("/fcm-token", { token });
    localStorage.setItem("FCM_TOKEN", token);
}

function playNotificationBell() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
    gainNode.connect(audioContext.destination);

    [880, 1175].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.18);
        oscillator.connect(gainNode);
        oscillator.start(audioContext.currentTime + index * 0.18);
        oscillator.stop(audioContext.currentTime + index * 0.18 + 0.22);
    });
}

function listenForegroundMessages(currentMessaging) {
    onMessage(currentMessaging, (payload) => {
        const targetUrl = payload.data?.url;
        playNotificationBell();

        ElNotification({
            title: payload.notification?.title || "Notifikasi",
            message: payload.notification?.body || payload.data?.message || "Ada notifikasi baru.",
            type: "info",
            onClick: () => {
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            },
        });
    });
}

export async function initFirebasePushNotification() {
    if (initialized || typeof window === "undefined") return;
    initialized = true;

    try {
        await initAnalytics();

        if (!("Notification" in window)) return;

        const currentMessaging = await getFirebaseMessaging();
        if (!currentMessaging) return;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const serviceWorkerRegistration = await registerServiceWorker();
        const tokenOptions = serviceWorkerRegistration ? { serviceWorkerRegistration } : {};

        if (vapidKey) {
            tokenOptions.vapidKey = vapidKey;
        }

        const token = await getToken(currentMessaging, tokenOptions);
        if (token && token !== localStorage.getItem("FCM_TOKEN")) {
            await saveFcmToken(token);
        }

        listenForegroundMessages(currentMessaging);
    } catch (error) {
        initialized = false;
        console.error("[Firebase Push] Init failed:", error);
    }
}
