import { FontAwesome5 } from "@expo/vector-icons";
import { Button, Stack, useColorMode } from "native-base";
import React, { useState } from "react";
import { googleLogin } from "../../util/auth/GoogleLogin";

type GoogleSignInProps = {};

const GoogleSignIn: React.FC<GoogleSignInProps> = ({}) => {
  const { colorMode } = useColorMode();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const loginHandler = async () => {
    setButtonDisabled(true);
    await googleLogin().finally(() => setButtonDisabled(false));
  };

  return (
    <Stack mx={4} my={4}>
      <Button
        disabled={buttonDisabled}
        isLoading={buttonDisabled}
        onPress={loginHandler}
        bg="emerald.400"
        startIcon={
          <FontAwesome5
            name="google"
            size={24}
            color={colorMode === "light" ? "white" : "black"}
          />
        }
      >
        Sign in with Google
      </Button>
    </Stack>
  );
};
export default GoogleSignIn;
