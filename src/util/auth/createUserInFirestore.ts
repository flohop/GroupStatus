import * as Notifications from "expo-notifications";
import firebase from "firebase";
import Firebase from "../../../config/firebase";

const firestore = Firebase.firestore();

export const createUserInFirestore = async (
  user: firebase.User,
  createdUser?: boolean
) => {
  // create the user, if it does not already exist

  // something wrong with ExpoPushToke, not registered with Firebase somehow

  // const devicePushToken = await Notifications.getDevicePushTokenAsync();

  let expoToken = await Notifications.getExpoPushTokenAsync({
    experienceId: "@flohop/GroupStatus",
  });

  await firestore
    .collection("users")
    .doc(user.uid)
    .set({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      provider: user.providerData[0]?.providerId,
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoURL,
      expoPushToken: expoToken,
    })
    .catch((err) => {
      console.log("Something went wrong adding user to firestore: ", err);
    });
};
