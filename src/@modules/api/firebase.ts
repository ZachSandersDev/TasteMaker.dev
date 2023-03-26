import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDHjABk4TA-27nkZYRqGLhmKlhIZ8vZE0c",
  authDomain: "recipie-awesome.firebaseapp.com",
  databaseURL: "https://recipie-awesome-default-rtdb.firebaseio.com",
  projectId: "recipie-awesome",
  storageBucket: "recipie-awesome.appspot.com",
  messagingSenderId: "697196279945",
  appId: "1:697196279945:web:cece9617ad353f29b0ee58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
