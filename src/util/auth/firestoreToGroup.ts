// convert a Groups Firestore Document to the Group Type (needed bcs member is a Map, but firestore does not have that type)
import firebase from "firebase";
import { Group, Member } from "../../shared/types";

export const firestoreToGroup = (
  fGroup: firebase.firestore.DocumentData
): Group => {
  const membersMap = new Map<string, Member>();

  for (const key in fGroup.members) {
    membersMap.set(key, fGroup.members[key]);
  }

  return {
    groupId: fGroup.groupId,
    name: fGroup.name,
    members: membersMap,
    membersArray: fGroup.membersArray,
    everyoneIsReady: fGroup.everyoneIsReady,
  };
};
