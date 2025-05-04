// app/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBchza_4ytPjB-7bWVEmIGKNCqRU5f39O8",
  authDomain: "piw-uriasz.firebaseapp.com",
  projectId: "piw-uriasz",
  storageBucket: "piw-uriasz.firebasestorage.app",
  messagingSenderId: "955301523231",
  appId: "1:955301523231:web:e84db7d3709c0c9c484a2a",
  measurementId: "G-PZFKWH6TQB"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
