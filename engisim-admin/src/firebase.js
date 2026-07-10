import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc, addDoc, onSnapshot, serverTimestamp, query, where, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDHOCyG4pK1w8GvX1HW4CoTfEmTsZLrOhI",
    authDomain: "admin-engisim-dashboard.web.app",
    projectId: "engineering-universe",
    storageBucket: "engineering-universe.firebasestorage.app",
    messagingSenderId: "554467542997",
    appId: "1:554467542997:web:81a7b48b5df3fcf03fdf5c",
    measurementId: "G-E4EX3KF4ZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc, addDoc, onSnapshot, serverTimestamp, query, where, orderBy, limit };
