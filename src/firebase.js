import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2rGPkwIw82TCWEBThj863LNRapx-k9Jc",
  authDomain: "invoice-app-9a687.firebaseapp.com",
  projectId: "invoice-app-9a687",
  storageBucket: "invoice-app-9a687.appspot.com",
  messagingSenderId: "1066331690891",
  appId: "1:1066331690891:web:342d520498cc472462418e",
  measurementId: "G-MBX35PFG91",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();