import { ResponseType } from "expo-auth-session";
import * as Facebook from "expo-auth-session/providers/facebook";
import { useToast } from "native-base";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { FACEBOOK_CLIENT_ID } from "react-native-dotenv";
import Firebase from "../../../config/firebase";
import { CurrentUserContext, User } from "../../shared/types";
import { googleLogin } from "../../util/auth/GoogleLogin";

export const currentUserContext = React.createContext<CurrentUserContext>({
  user: {
    displayName: "",
    email: "",
    phoneNumber: null,
    photoUrl: "",
    provider: "password",
    uid: "",
  } as User,
  deleteUser: () => {
    return new Promise<boolean>((resolve, reject) => {
      resolve(true);
    });
  },
  logoutUser: () => {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  },
});

const firestore = Firebase.firestore();
const auth = Firebase.auth();

type ProviderProps = {};

export const CurrentUserProvider: React.FC<ProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_CLIENT_ID,
    responseType: ResponseType.Token,
  });

  const toast = useToast();

  useEffect(() => {
    const unsub = firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .onSnapshot((doc) => {
        setUser(doc.data() as User);
      });

    return () => {
      unsub();
    };
  }, []);

  const deleteUser = async () => {
    // 1. delete from firestore
    if (auth.currentUser !== null) {
      console.log("Trying to delete user");

      await firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .delete()
        .then((res) => {
          console.log("Delete firestore entry of user");
        })
        .catch((err) => {
          console.log("Could not delete user in firestore: ", err);
        });

      // 2. delete from authentication
      await auth.currentUser
        .delete()
        .then(() => {
          console.log("Deleted account successfully");
        })
        .catch(() => {
          toast.show({ title: "Please reauthenticate" });
          auth.currentUser?.getIdTokenResult().then(async (res) => {
            switch (res.signInProvider) {
              case "google.com": {
                await googleLogin().catch((err) =>
                  console.log("Something went wrong: ", err)
                );
                break;
              }
              case "facebook.com": {
                await promptAsync().catch((err) =>
                  console.log("Something went wrong: ", err)
                );
                break;
              }
              case "password": {
                // TODO: add reauth

                break;
              }
              default: {
                console.log(
                  "Something went wrong, current provider: ",
                  res.signInProvider
                );
              }
            }
            // now delete the user
            console.log("about to delete the user");

            auth.currentUser
              ?.delete()
              .then((res) => {})
              .catch((err) => {
                console.log("error deleting the firestore user: ", err);
              });

            // lastly, clear the store
            toast.show({ title: "Bye :D" });
          });
        });
    }

    // if everything went wrong, return true
    return true;
  };

  const logoutUser = () => {
    return auth.signOut();
  };

  return (
    <currentUserContext.Provider value={{ user, deleteUser, logoutUser }}>
      {children}
    </currentUserContext.Provider>
  );
};
