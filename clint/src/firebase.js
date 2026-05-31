import { initializeApp } from "firebase/app"

import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAU4WRR2S_sVbCLdd09mYRL6AekMKU5ZTI",
  authDomain: "roomsathi-8d5b8.firebaseapp.com",
  projectId: "roomsathi-8d5b8",
  storageBucket: "roomsathi-8d5b8.firebasestorage.app",
  messagingSenderId: "337951494283",
  appId: "1:337951494283:web:fe8534ecd91a5941cf448e"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)