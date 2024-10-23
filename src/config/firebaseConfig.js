import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBkzQguetTGT3WH_YbWT_cwN4WuAsjUDeM",
    databaseURL: "https://o-jogo-do-numero-default-rtdb.europe-west1.firebasedatabase.app",
    authDomain: "o-jogo-do-numero.firebaseapp.com",
    projectId: "o-jogo-do-numero",
    storageBucket: "o-jogo-do-numero.appspot.com",
    messagingSenderId: "87388965924",
    appId: "1:87388965924:web:cebe30d07daab91f875cb1",
    measurementId: "G-ZZ2N557J9M"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { database, auth, analytics };