

import { getStorage } from "firebase/storage";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = require("./config/firebaseConfig");

export const firebaseContext =firebase.initializeApp(firebaseConfig);
export const storage = getStorage(firebase);





