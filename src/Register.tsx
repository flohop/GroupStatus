import { Box, Divider, Heading, ScrollView } from "native-base";
import React from "react";
import CustomRegister from "./components/auth/CustomRegister";
import FacebookSignIn from "./components/auth/FacebookSignIn";
import GoogleSignIn from "./components/auth/GoogleSignIn";
type RegisterProps = {};

const Register: React.FC<RegisterProps> = ({}) => {
  return (
    <Box flex={1}>
      <Box flex={1} justifyContent="center">
        <Heading alignSelf={{ base: "center", md: "center" }}>Register</Heading>
      </Box>
      <ScrollView flex={4}>
        <Box alignContent="center" flex={1}>
          <GoogleSignIn />
          <FacebookSignIn />
          <Divider my={4} />
          <Heading alignSelf={{ base: "center", md: "flex-start" }} size="sm">
            Create Account
          </Heading>
          <CustomRegister />
        </Box>
      </ScrollView>
    </Box>
  );
};
export default Register;
