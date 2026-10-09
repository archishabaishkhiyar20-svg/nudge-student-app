import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging.js";

// Replace these placeholder values with your Firebase web app config.
const firebaseConfig = {
   apiKey: "AIzaSyDirexfBxfJo4T7iYShb6IE7pK8WQR7Lc4",
  authDomain: "nudge-9cabe.firebaseapp.com",
  projectId: "nudge-9cabe",
  storageBucket: "nudge-9cabe.firebasestorage.app",
  messagingSenderId: "345017095891",
  appId: "1:345017095891:web:f63a2304a71ea10ca26626",
  measurementId: "G-L2CP06ZQ8Z"
};

// Your Web Push public key from Firebase Console.
const vapidKey = "YOUR_WEB_PUSH_PUBLIC_KEY";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function enableNudgePushNotifications() {
    try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            alert("Please allow notifications to enable Nudge reminders.");
            return;
        }

        const registration = await navigator.serviceWorker.ready;

        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            alert("Couldn't register this device for push notifications.");
            return;
        }

        // Temporary: keep the token on this device for testing.
        localStorage.setItem("nudgeFcmToken", token);

        alert("Nudge push notifications are enabled on this device!");
        console.log("Nudge push registration successful.");
    } catch (error) {
    console.error("Nudge push setup failed:", error);

    alert(
        "Firebase error: " +
        (error.code || error.name || "Unknown") +
        "\n" +
        error.message
    );
}

onMessage(messaging, payload => {
    console.log("Nudge received a foreground message:", payload);
});
