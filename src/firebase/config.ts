// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyALDL3XQowc-KKv6OfWqrv4vgh0Xd80bUU",
    authDomain: "app-ferreteria-aea05.firebaseapp.com",
    databaseURL: "https://app-ferreteria-aea05-default-rtdb.firebaseio.com",
    projectId: "app-ferreteria-aea05",
    storageBucket: "app-ferreteria-aea05.firebasestorage.app",
    messagingSenderId: "185078444414",
    appId: "1:185078444414:web:c9da18ae5410f0dc66032f"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
