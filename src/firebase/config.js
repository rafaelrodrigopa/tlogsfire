import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Adicione esta importação


const firebaseConfig = {
  apiKey: "AIzaSyBWUcuzeJzgiC7klXcmixIQ9sRuMARlLAc",
  authDomain: "charadamotos-a4106.firebaseapp.com",
  projectId: "charadamotos-a4106",
  storageBucket: "charadamotos-a4106.firebasestorage.app",
  messagingSenderId: "489918819274",
  appId: "1:489918819274:web:3cb45fdcf624107ed9fd33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Crie a instância do storage

export { db, storage, auth }; // Exporte ambos