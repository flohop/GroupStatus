import Firebase from "../../../config/firebase";
import { Group } from "../../shared/types";
import { firestoreToGroup } from "../auth/firestoreToGroup";

const firestore = Firebase.firestore();

export const getGroupFromFirestore = async (
  groupId: string
): Promise<Group | undefined> => {
  const response = await firestore.collection("groups").doc(groupId).get();

  if (response.data()) {
    return firestoreToGroup(response.data()!);
  }

  return undefined;
};
