import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider  } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { fbc } from "./fbc";


const app = initializeApp(fbc);


export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();