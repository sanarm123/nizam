
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//Android Google console key: 402597814020-di3t5qd59sh1f760pfqm1m8m8u5hop0p.apps.googleusercontent.com

export const firebaseConfig2 = {
    apiKey: "AIzaSyDX89F7g298GO4Min2FHOmH1HFaBvm98YA",
    authDomain: "myworld-d76d2.firebaseapp.com",
    projectId: "myworld-d76d2",
    storageBucket: "myworld-d76d2.appspot.com",
    messagingSenderId: "402597814020",
    appId: "1:402597814020:web:cce617b9bf72d052b33a51"
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig2);
}







