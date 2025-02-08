import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import {  enableIndexedDbPersistence } from "firebase/firestore";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoGrrpWVMQhsOwZfe8E6Eh3S94SMlG5Z0",
  authDomain: "innov8ers-twise.firebaseapp.com",
  projectId: "innov8ers-twise",
  storageBucket: "innov8ers-twise.appspot.com",
  messagingSenderId: "620600015630",
  appId: "1:620600015630:web:e3fe1084859924c991355f"
};

// Check if Firebase is already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  console.error("Persistence failed:", err);
});
export { db };
