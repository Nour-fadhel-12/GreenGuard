// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Import Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyCVRw7HODngPW68Gt-tV5OnLZ2VZYU6Y1M",
  authDomain: "greenguard-b8353.firebaseapp.com",
  databaseURL: "https://greenguard-b8353-default-rtdb.firebaseio.com",
  projectId: "greenguard-b8353",
  storageBucket: "greenguard-b8353.firebasestorage.app",
  messagingSenderId: "644217637687",
  appId: "1:644217637687:web:ce7b1f3d919ab0ef8868b2",
  measurementId: "G-J6N9B7RL6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Initialize Realtime Database

export { auth, database }; // Export both auth and database