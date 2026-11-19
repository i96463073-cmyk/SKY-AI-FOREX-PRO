// Firebase web configuration is public client configuration, not an admin secret.
// Replace every PASTE_... value with the values from Firebase Console > Project settings > Your apps.
window.SKY_CONFIG = {
  workerUrl: "https://sky-ai-forex-pro.i96463073.workers.dev",
  firebase: {
    apiKey: "PASTE_FIREBASE_WEB_API_KEY",
    authDomain: "sky-ai-forex-pro.firebaseapp.com",
    projectId: "sky-ai-forex-pro",
    storageBucket: "PASTE_YOUR_STORAGE_BUCKET",
    messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",
    appId: "PASTE_YOUR_WEB_APP_ID"
  }
};
