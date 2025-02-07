import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

function FirebaseConfig() {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
    databaseURL: "https://words-cloud-2f487-default-rtdb.asia-southeast1.firebasedatabase.app",
  };

  const app = initializeApp(firebaseConfig);

  return getDatabase(app);
}

export default FirebaseConfig;
