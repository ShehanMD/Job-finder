import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDkCzO8U8VHe95f7ikExMiUXjOrfcmeBeI",
  authDomain: "test-96c95.firebaseapp.com",
  databaseURL: "https://test-96c95-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-96c95",
  storageBucket: "test-96c95.firebasestorage.app",
  messagingSenderId: "271077040403",
  appId: "1:271077040403:web:bc75c8ddad93c530f5fae6",
  measurementId: "G-60F4YBCQFM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);