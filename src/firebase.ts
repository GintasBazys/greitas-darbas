import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBqRg34QOWgAxtkCZtyQM7p4C9oMIAkrTM",
    authDomain: "greitas-darbas.firebaseapp.com",
    projectId: "greitas-darbas",
    storageBucket: "greitas-darbas.appspot.com",
    messagingSenderId: "553487319598",
    appId: "1:553487319598:web:993e61d844b94d2e8c55bf",
    measurementId: "G-0R0FTM9HX2"
};

firebase.initializeApp(firebaseConfig);
const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");

const db = firebase.firestore();
const auth = firebase.auth();
const Auth = firebase.auth.Auth;
const storageRef = firebase.storage().ref();
const emailProvider = firebase.auth.EmailAuthProvider;

const usersCollection = db.collection("users");
const workerCollection = db.collection("workers");
const requestCollection = db.collection("requests");
const offersCollection = db.collection("offers");
const statisticsCollection = db.collection("statistics");
const messagesCollection = db.collection("messages");

export {
    db,
    auth,
    Auth,
    usersCollection,
    storageRef,
    secondaryApp,
    emailProvider,
    workerCollection,
    requestCollection,
    offersCollection,
    statisticsCollection,
    messagesCollection
};