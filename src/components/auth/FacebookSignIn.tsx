import { FontAwesome5 } from "@expo/vector-icons";
import { ResponseType } from "expo-auth-session";
import * as Facebook from "expo-auth-session/providers/facebook";
import firebase from "firebase";
import { Button, Stack, useColorMode } from "native-base";
import React from "react";
// @ts-ignore
import { FACEBOOK_CLIENT_ID } from "react-native-dotenv";
import Firebase from "../../../config/firebase";

const auth = Firebase.auth();

type FacebookSignInProps = {};

const FacebookSignIn: React.FC<FacebookSignInProps> = ({}) => {
  const { colorMode } = useColorMode();
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_CLIENT_ID,
    responseType: ResponseType.Token,
  });

  const loginHandler = async () => {
    await promptAsync()
      .then((res) => {
        if (res?.type === "success") {
          const { access_token } = res.params;

          const credential =
            firebase.auth.FacebookAuthProvider.credential(access_token);
          // Sign in with the credential from the Facebook user.
          auth.signInWithCredential(credential);
        } else if (response?.type === "error") {
          console.log("error: ", response.error);
        }
      })
      .catch((err) => console.log("callback error: ", err));
  };

  return (
    <Stack mx={4} my={4}>
      <Button
        onPress={loginHandler}
        bg="emerald.400"
        startIcon={
          <FontAwesome5
            name="facebook"
            size={24}
            color={colorMode === "light" ? "white" : "black"}
          />
        }
        isLoading={!request}
        disabled={!request}
      >
        Sign in with Facebook
      </Button>
    </Stack>
  );
};
export default FacebookSignIn;
