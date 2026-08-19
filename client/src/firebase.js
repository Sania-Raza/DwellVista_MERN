// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-71085.firebaseapp.com",
  projectId: "mern-estate-71085",
  storageBucket: "mern-estate-71085.firebasestorage.app",
  messagingSenderId: "1089787975732",
  appId: "1:1089787975732:web:b25b939f984d0005d81261",
  measurementId: "G-KT2KSZMEZV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
