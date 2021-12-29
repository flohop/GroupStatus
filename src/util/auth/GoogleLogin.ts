import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import {
  // @ts-ignore
  GOOGLE_AUTH_ANDROID_DEV_KEY,
  // @ts-ignore
  GOOGLE_AUTH_IOS_DEV_KEY,
  // @ts-ignore
  GOOGLE_AUTH_WEB_KEY,
} from "react-native-dotenv";
import Firebase from "../../../config/firebase";

const auth = Firebase.auth();

export const googleLogin = async () => {
  await Google.logInAsync({
    iosClientId: GOOGLE_AUTH_IOS_DEV_KEY,
    androidClientId: GOOGLE_AUTH_ANDROID_DEV_KEY,
    clientId: GOOGLE_AUTH_WEB_KEY,
  })
    .then(async (response) => {
      if (response.type === "success") {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          response.idToken,
          response.accessToken
        );
        auth.signInWithCredential(credential);
      }
    })
    .catch((err) => {
      console.log("Something went wrong: ", err);
    });
};
