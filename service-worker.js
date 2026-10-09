importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

const CACHE_NAME = "nudge-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon.svg"
];

// Use the SAME Firebase config as firebase-messaging.js.
firebase.initializeApp({
 apiKey: "AIzaSyDirexfBxfJo4T7iYShb6IE7pK8WQR7Lc4",
  authDomain: "nudge-9cabe.firebaseapp.com",
  projectId: "nudge-9cabe",
  storageBucket: "nudge-9cabe.firebasestorage.app",
  messagingSenderId: "345017095891",
  appId: "1:345017095891:web:f63a2304a71ea10ca26626",
  measurementId: "G-L2CP06ZQ8Z"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const notificationTitle =
    payload.notification?.title || "Nudge 🔔";

  const notificationOptions = {
    body: payload.notification?.body || "You have a new reminder!",
    icon: "./icon-192.png",
    data: {
      url: "./"
    }
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(event.notification.data?.url || "./")
  );
});

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
