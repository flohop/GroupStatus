import firebase from "firebase";
import Firebase from "../../../config/firebase";
import { Member } from "../../shared/types";

const firestore = Firebase.firestore();

firebase.firestore.FieldValue.arrayUnion;

export const joinGroupFirebase = async (groupId: string, newMember: Member) => {
  const docRef = firestore.collection("groups").doc(groupId);

  const path = "members." + newMember.uid;

  return docRef.update({
    membersArray: firebase.firestore.FieldValue.arrayUnion(newMember.uid),
    [path]: {
      isAdmin: false,
      name: newMember.name,
      photoUrl: newMember.photoUrl,
      status: "inactive",
      uid: newMember.uid,
      expoPushToken: newMember.expoPushToken,
    },
  });
};
