import { Box, Divider, Heading, ScrollView } from "native-base";
import React from "react";
import CustomLogin from "./components/auth/CustomSignIn";
import FacebookSignIn from "./components/auth/FacebookSignIn";
import GoogleSignIn from "./components/auth/GoogleSignIn";
type LoginProps = {};

const Login: React.FC<LoginProps> = ({}) => {
  return (
    <Box flex={1}>
      <Box flex={1} justifyContent="center">
        <Heading alignSelf={{ base: "center", md: "center" }}>
          Welcome Back
        </Heading>
      </Box>
      <ScrollView flex={3}>
        <Box alignContent="center" flex={1}>
          <GoogleSignIn />
          <FacebookSignIn />
          <Divider my={4} />
          <CustomLogin />
        </Box>
      </ScrollView>
    </Box>
  );
};
export default Login;
