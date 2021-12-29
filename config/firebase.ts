import firebase from "firebase/app";
import "firebase/auth";
import Constants from "expo-constants";

// Initialize Firebase
const firebaseConfig = {
  apiKey: (Constants as any).manifest.extra.apiKey,
  authDomain: (Constants as any).manifest.extra.authDomain,
  projectId: (Constants as any).manifest.extra.projectId,
  storageBucket: (Constants as any).manifest.extra.storageBucket,
  messagingSenderId: (Constants as any).manifest.extra.messagingSenderId,
  appId: (Constants as any).manifest.extra.appId,
  databaseUrl: (Constants as any).manifest.extra.databaseUrl,
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase as firebase.app.App;
