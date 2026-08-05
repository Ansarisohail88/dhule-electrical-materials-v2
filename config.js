// Firebase Configuration & Initialization for VoltPro Electrical Materials
// Replace the config object below with your Firebase project credentials from Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyCRwZ-hAx8gg9ZdunMDEJcHDKGx2vLI_q8",
  authDomain: "dhule-electrical.firebaseapp.com",
  projectId: "dhule-electrical",
  storageBucket: "dhule-electrical.firebasestorage.app",
  messagingSenderId: "386096215168",
  appId: "1:386096215168:web:ae596fa7b499ecd2d5e265"
};

// Initialize Firebase if SDK is loaded
let db = null;
let isFirebaseActive = false;

if (typeof firebase !== 'undefined' && firebase.apps) {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    isFirebaseActive = true;
    console.log("⚡ VoltPro: Firebase Firestore initialized successfully.");
  } catch (e) {
    console.warn("⚡ VoltPro: Firebase init failed or using offline fallback mode.", e);
  }
} else {
  console.log("⚡ VoltPro: Running in LocalStorage mode (Firebase SDK not loaded).");
}
