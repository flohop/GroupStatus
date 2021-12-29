import Firebase from "../../../config/firebase";
import { Group, Status } from "../../shared/types";

const firestore = Firebase.firestore();

export const changeStatusInFirebase = async (
  newStatus: Status,
  group: Group,
  userId: string
) => {
  const docRef = firestore.collection("groups").doc(group.groupId);

  // get the rest of the values, in [userId], bcs they get overwritten
  const path = "members." + userId + ".status";

  // the current users status is not yet updated in the store/Group Object.
  // so if 4/5 are ready in the group objet and the new status is "active" we set allReady to true

  let everyoneIsReady = false;

  const statusArray: Status[] = [];
  let numberOfReady = 0;

  group.members.forEach((v) => {
    if (v.status === "active") numberOfReady++;
    statusArray.push(v.status);
  });

  if (statusArray.length - numberOfReady === 1 && newStatus === "active") {
    everyoneIsReady = true;
  }

  const res = await docRef
    .update({
      [path]: newStatus,
      everyoneIsReady: everyoneIsReady,
    })
    .catch((err) => {
      console.log("Error updating the field: ", err);
    });
};
