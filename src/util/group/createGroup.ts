import uniqid from "uniqid";
import Firebase from "../../../config/firebase";
import { Group, Member, User } from "../../shared/types";

const firestore = Firebase.firestore();

export const createGroupFirestore = (name: string, admin: User): Group => {
  const randomId = uniqid();

  firestore
    .collection("groups")
    .doc(randomId)
    .set({
      groupId: randomId,
      name,
      iconUrl: "", // add later
      members: {
        [admin.uid]: {
          isAdmin: true,
          name: admin.displayName,
          status: "inactive",
          uid: admin.uid,
          photoUrl: admin.photoUrl,
          expoPushToken: admin.expoPushToken,
        },
      },
      membersArray: [admin.uid],
      everyoneIsReady: false,
    });

  const members = new Map<string, Member>();
  members.set(String(admin.uid), {
    isAdmin: true,
    name: admin.displayName,
    status: "inactive",
    uid: admin.uid,
    photoUrl: admin.photoUrl,
    expoPushToken: admin.expoPushToken,
  });

  return {
    groupId: randomId,
    name,
    iconUrl: "", // add later
    members,
    membersArray: [admin.uid],
    everyoneIsReady: false,
  };
};
