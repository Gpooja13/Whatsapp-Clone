import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBXX4PnxA6Wm8frwfTXH6jqfH_7ydh7R9E",
    authDomain: "whatsapp-clone-a2578.firebaseapp.com",
    projectId: "whatsapp-clone-a2578",
    storageBucket: "whatsapp-clone-a2578.appspot.com",
    messagingSenderId: "252390158446",
    appId: "1:252390158446:web:9af4c2168e8d970428367f",
    measurementId: "G-TRNR82Z38D"
  };

  const app=initializeApp(firebaseConfig);
  export const firebaseAuth=getAuth(app);