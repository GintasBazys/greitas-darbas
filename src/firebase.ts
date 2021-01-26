import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBqRg34QOWgAxtkCZtyQM7p4C9oMIAkrTM",
    authDomain: "greitas-darbas.firebaseapp.com",
    projectId: "greitas-darbas",
    storageBucket: "greitas-darbas.appspot.com",
    messagingSenderId: "553487319598",
    appId: "1:553487319598:web:993e61d844b94d2e8c55bf",
    measurementId: "G-0R0FTM9HX2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const Auth = firebase.auth.Auth;

const usersCollection = db.collection("users");

export {
    db,
    auth,
    Auth,
    usersCollection
};