import firebase from "firebase";
import Firebase from "../../../config/firebase";
import { Group, User } from "../../shared/types";

const firestore = Firebase.firestore();

firebase.firestore.FieldValue.arrayUnion;

export const leaveGroupFirebase = async (group: Group, user: User) => {
  const docRef = firestore.collection("groups").doc(group.groupId);

  const path = "members." + user.uid;

  if (group.membersArray.length === 1) {
    // last member is leaving, delete the group
    return docRef.delete();
  }

  return docRef.update({
    membersArray: firebase.firestore.FieldValue.arrayRemove(user.uid),
    [path]: firebase.firestore.FieldValue.delete(),
  });
};
