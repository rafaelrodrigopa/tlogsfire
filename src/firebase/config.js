import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWUcuzeJzgiC7klXcmixIQ9sRuMARlLAc",
  authDomain: "charadamotos-a4106.firebaseapp.com",
  projectId: "charadamotos-a4106",
  storageBucket: "charadamotos-a4106.firebasestorage.app",
  messagingSenderId: "489918819274",
  appId: "1:489918819274:web:3cb45fdcf624107ed9fd33"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

{/*Inclusa o firestora para operacoes de crud*/}
export const db = getFirestore(app);