import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC1zlJfJ4v6HRmlRzx_zhVJCsvcj7Toplc",
  authDomain: "dfdd-91dcddf.firebaseapp.com",
  databaseURL: "https://dfdd-91dcddf.firebaseio.com",
  projectId: "dfdd-91dcddf",
  storageBucket: "dfdd-91dcddf.firebasestorage.app",
  messagingSenderId: "293507507958",
  appId: "1:293507507958:web:f252050a0456a32e8ceed7",
  measurementId: "G-YQKEJEZZG9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);