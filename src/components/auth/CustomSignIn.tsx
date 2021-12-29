import * as EmailValidator from "email-validator";
import {
  Alert,
  Box,
  Button,
  CloseIcon,
  Collapse,
  FormControl,
  IconButton,
  Input,
  Stack,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import Firebase from "../../../config/firebase";

const auth = Firebase.auth();

type CustomLoginProps = {};

// TODO: if login did not work, show an error message

const CustomLogin: React.FC<CustomLoginProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [validMail, setValidMail] = useState(true);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);

  const [loginDisabled, setLoginDisabled] = useState(false);

  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isWrongEmail, setIsWrongEmail] = useState(false);
  const [isSomeError, setIsSomeError] = useState(false);
  const [canSendEmail, setCanSenEmail] = useState(true);

  const [showEmailSent, setShowEmailSent] = useState(false);

  const passwordRef = useRef<any>();
  const emailRef = useRef<any>();

  useEffect(() => {
    const blurInput = Keyboard.addListener("keyboardDidHide", () => {
      passwordRef.current.blur();
      emailRef.current.blur();
    });
    return () => {
      blurInput.remove();
    };
  }, []);

  useEffect(() => {
    let unmounted;
    unmounted = false;
    if (!unmounted) {
      if (validMail && validPassword) {
        setLoginDisabled(false);
      } else {
        setLoginDisabled(true);
      }
    }
    return () => {
      unmounted = true;
    };
  }, [validMail, validPassword]);

  const loginHandler = () => {
    // to prevent login in without any input values, add an additional check
    if (password.length >= 6 && email.length > 1) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          // do something?
        })
        .catch((err) => {
          // something went wrong, show the invalid password text
          if (String(err).includes("password")) {
            // user exists, but password is wrong
            setIsWrongPassword(true);
          } else if (String(err).includes("identifier")) {
            // user mail does not exists
            setIsWrongEmail(true);
          } else {
            setIsSomeError(true);
          }

          console.log("error: ", err);
        });
    } else if (password.length < 6 && email.length < 2) {
      setValidPassword(false);
      setValidMail(false);
    } else if (password.length < 6) {
      setValidPassword(false);
    } else {
      setValidMail(false);
    }
  };

  const emailInputHandler = (newString: string) => {
    const formattedString = newString.replace(/\s+/g, ""); // remove whitespace
    setEmail(formattedString);

    if (
      formattedString.length > 0 &&
      !EmailValidator.validate(formattedString)
    ) {
      setValidMail(false);
    } else {
      setValidMail(true);
    }
  };

  const passwordInputHandler = (newString: string) => {
    setPassword(newString);

    if (newString.length < 6) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  };

  const sendForgotMail = () => {
    // 1. test if the user entered a mail
    if (validMail && email.length > 0) {
      setCanSenEmail(true);
      auth.useDeviceLanguage();
      auth.sendPasswordResetEmail(email).finally(() => {
        // Password reset mail got sent!
        setShowEmailSent(true);
      });
      // send the mail
    } else {
      setCanSenEmail(false);
    }
  };

  return (
    <Box>
      {/* The alert dialogs. Hidden by default */}
      <Box w="100%" opacity={isWrongPassword ? 100 : 0}>
        <Collapse isOpen={isWrongPassword}>
          <Alert
            status="error"
            action={
              <IconButton
                icon={<CloseIcon size="xs" />}
                onPress={() => setIsWrongEmail(false)}
              />
            }
            actionProps={{
              alignSelf: "center",
            }}
          >
            <Alert.Icon />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>The password is wrong.</Alert.Description>
          </Alert>
        </Collapse>
      </Box>

      <Box w="100%" opacity={isWrongEmail ? 100 : 0}>
        <Collapse isOpen={isWrongEmail}>
          <Alert
            status="error"
            action={
              <IconButton
                icon={<CloseIcon size="xs" />}
                onPress={() => setIsWrongEmail(false)}
              />
            }
            actionProps={{
              alignSelf: "center",
            }}
          >
            <Alert.Icon />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>No user with that Email.</Alert.Description>
          </Alert>
        </Collapse>
      </Box>

      <Box w="100%">
        <Collapse opacity={isSomeError ? 100 : 0}>
          <Alert
            status="error"
            action={
              <IconButton
                icon={<CloseIcon size="xs" />}
                onPress={() => setIsSomeError(false)}
              />
            }
            actionProps={{
              alignSelf: "center",
            }}
          >
            <Alert.Icon />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
              Something on our side went wrong. Please try again later, we're
              very sorry
            </Alert.Description>
          </Alert>
        </Collapse>
      </Box>

      <Box w="100%" opacity={showEmailSent ? 100 : 0}>
        <Collapse isOpen={showEmailSent}>
          <Alert
            status="success"
            action={
              <IconButton
                icon={<CloseIcon size="xs" />}
                onPress={() => setShowEmailSent(false)}
              />
            }
            actionProps={{
              alignSelf: "center",
            }}
          >
            <Alert.Icon />
            <Alert.Title>Success</Alert.Title>
            <Alert.Description>
              If the email exists, we sent a reset link to it.
            </Alert.Description>
          </Alert>
        </Collapse>
      </Box>

      <Box w="100%" opacity={canSendEmail ? 0 : 100}>
        <Collapse isOpen={!canSendEmail}>
          <Alert
            status="error"
            action={
              <IconButton
                icon={<CloseIcon size="xs" />}
                onPress={() => setCanSenEmail(true)}
              />
            }
            actionProps={{
              alignSelf: "center",
            }}
          >
            <Alert.Icon />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>
              Please enter an email. If it exists, we will send a reset link to
              it.
            </Alert.Description>
          </Alert>
        </Collapse>
      </Box>

      <FormControl isRequired isInvalid={!validMail}>
        <Stack mx={4}>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            p={2}
            ref={emailRef}
            placeholder="Please enter your email"
            onChangeText={emailInputHandler}
            keyboardType="email-address"
          />
          <FormControl.ErrorMessage>Invalid Email</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl isRequired isInvalid={!validPassword}>
        <Stack mx={4}>
          <FormControl.Label>Password</FormControl.Label>
          <Input
            p={2}
            ref={passwordRef}
            placeholder="Please enter your password"
            onChangeText={passwordInputHandler}
            secureTextEntry={true}
          />
          <FormControl.ErrorMessage>
            Password must be at least 6 characters long
          </FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <Stack mx={4} my={2}>
        <Button
          size="lg"
          onPress={loginHandler}
          isDisabled={loginDisabled}
          bg="#2FEBDB"
        >
          Login
        </Button>
      </Stack>

      <Box>
        <Button variant="link" onPress={sendForgotMail}>
          Forgot Password?
        </Button>
      </Box>
    </Box>
  );
};
export default CustomLogin;
