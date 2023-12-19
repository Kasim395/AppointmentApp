

import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'
import 'firebase/compat/firestore';

const firebaseConfig = {

    apiKey: "AIzaSyAQsTdwqUcDkHP94k6gcbuZ3sEaXg78Jj0",
  
    authDomain: "appointment-e3bb3.firebaseapp.com",
  
    projectId: "appointment-e3bb3",
  
    storageBucket: "appointment-e3bb3.appspot.com",
  
    messagingSenderId: "405558325881",
  
    appId: "1:405558325881:web:738ece48a0798f0d9ddaa8"
  
  };
  
  
  
let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const db = app.firestore();


export {db} 