import Firebase from "../../../config/firebase";

const firestore = Firebase.firestore();

// returns true, if the display Name already exists in the firestore
// returns true if the username exists, false otherwise
export default async function userNameExists(
  username: string
): Promise<boolean> {
  let response = false;

  await firestore
    .collection("users")
    .where("displayName", "==", username)
    .get()
    .then((res) => {
      // if the res is not empty a user exists with that name
      if (!res.empty) {
        response = true;
      }
    })
    .catch((err) => {
      console.log("Error in userNamExists(): ", err);
    });

  return response;
}
