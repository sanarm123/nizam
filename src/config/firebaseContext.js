import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = require("./config/firebaseConfig");


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase
