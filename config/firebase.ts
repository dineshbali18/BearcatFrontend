import { initializeApp } from "firebase/app";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// 1. create new project on firebase console
// 2. create a web app and copy the firebseConfigs below
const firebaseConfig = {
  apiKey: "AIzaSyBGQFsx67DsdEaThzvjy8jh-qWexCCoN_8",
  authDomain: "expense-tracker-test-64054.firebaseapp.com",
  projectId: "expense-tracker-test-64054",
  storageBucket: "expense-tracker-test-64054.appspot.com",
  messagingSenderId: "451101639624",
  appId: "1:451101639624:web:a441be84a3db583b0f76fd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// export const auth = initializeAuth(app);

export const firestore = getFirestore(app);
