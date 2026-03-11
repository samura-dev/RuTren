import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDsRVySqZDlMzLlOiIxLHKk7UtFzXHEogA",
    authDomain: "ru-tren.firebaseapp.com",
    projectId: "ru-tren",
    storageBucket: "ru-tren.firebasestorage.app",
    messagingSenderId: "955315598397",
    appId: "1:955315598397:web:877d4b5bffe7a1c84da654",
    measurementId: "G-C6F93JFZ9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
