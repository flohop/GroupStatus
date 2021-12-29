import { MaterialIcons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import React, { useContext } from "react";
import Firebase from "../../../config/firebase";
import { CurrentUserContext } from "../../shared/types";
import { currentUserContext } from "./CurrentUserProvider";

const auth = Firebase.auth();

const LogoutButton: React.FC = ({}) => {
  const { logoutUser } = useContext(currentUserContext) as CurrentUserContext;

  const logoutHandler = async () => {
    await logoutUser().catch((err) => {
      console.log("Something went wrong signing out the user:", err);
    });
  };

  return (
    <IconButton
      icon={<MaterialIcons name="logout" size={24} color="black" />}
      onPress={logoutHandler}
    />
  );
};
export default LogoutButton;
