import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, where } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Using actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHOCyG4pK1w8GvX1HW4CoTfEmTsZLrOhI",
    authDomain: "engineering-universe.firebaseapp.com",
    projectId: "engineering-universe",
    storageBucket: "engineering-universe.firebasestorage.app",
    messagingSenderId: "554467542997",
    appId: "1:554467542997:web:81a7b48b5df3fcf03fdf5c",
    measurementId: "G-E4EX3KF4ZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();

// Microsoft/Bing Auth Provider (User requested Bing OAuth)
const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
    // Optional: force login prompt
    prompt: 'consent'
});

export { 
    app, 
    auth, 
    db, 
    googleProvider, 
    microsoftProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    where
};
