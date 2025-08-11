import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAtNufUleVp598WJ96k68POaW70rumAStQ",
  authDomain: "photos-48f12.firebaseapp.com",
  projectId: "photos-48f12",
  storageBucket: "photos-48f12.firebasestorage.app",
  messagingSenderId: "447427743098",
  appId: "1:447427743098:web:c38c13622a4b2bfe1bdac3",
  measurementId: "G-21LKQR97EM"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const storage = getStorage(app);
export const db = getFirestore(app);
