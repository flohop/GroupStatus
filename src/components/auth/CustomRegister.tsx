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
import { Keyboard, KeyboardAvoidingView } from "react-native";
import Firebase from "../../../config/firebase";
import userNameExists from "../../util/auth/usernameExists";

const auth = Firebase.auth();

type CustomRegisterProps = {};

const CustomRegister: React.FC<CustomRegisterProps> = ({}) => {
  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(true);
  const [usernameError, setUsernameError] = useState("");

  const [email, setEmail] = useState("");
  const [validMail, setValidMail] = useState(true);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);

  const [registerDisabled, setRegisterDisabled] = useState(false);

  const [usernameTaken, setUsernameTaken] = useState(false);
  const [isSomeError, setIsSomeError] = useState(false);

  const [emailIsTaken, setEmailIsTaken] = useState(false);

  // refs to blur, when hiding the keyboard
  const usernameRef = useRef<any>();
  const emailRef = useRef<any>();
  const passwordRef = useRef<any>();
  const confirmPasswordRef = useRef<any>();

  useEffect(() => {
    const blurInput = Keyboard.addListener("keyboardDidHide", () => {
      usernameRef.current.blur();
      emailRef.current.blur();
      passwordRef.current.blur();
      confirmPasswordRef.current.blur();
    });
    return () => {
      blurInput.remove();
    };
  }, []);

  useEffect(() => {
    if (validName && validMail && validPassword && validConfirmPassword) {
      setRegisterDisabled(false);
    } else {
      setRegisterDisabled(true);
    }
  }, [validName, validMail, validPassword, validConfirmPassword]);

  const registerHandler = async () => {
    // to prevent register in without any input values, add an additional check
    if (
      password.length > 0 &&
      email.length > 0 &&
      username.length > 0 &&
      passwordConfirm.length > 0
    ) {
      if (!(await userNameExists(username))) {
        // create firebase auth user
        await auth
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            if (res.user) {
              res.user.updateProfile({
                displayName: username,
                photoURL:
                  "https://image.flaticon.com/icons/png/512/456/456212.png",
              });
            }
          })
          .catch((err) => {
            // something went wrong
            console.log("Error: ", err);

            if (String(err).includes("email address")) {
              setEmailIsTaken(true);
            } else {
              setIsSomeError(true);
            }
          });
      } else {
        // username is already taken, take another one
        setUsernameTaken(true);
      }
    } else {
      // set all to invalid
      setValidMail(false);
      setValidName(false);
      setValidPassword(false);
      setValidConfirmPassword(false);
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
    // TODO: check if password is strong enough. At least 6 chars
    setPassword(newString);

    if (newString.length < 6 && newString.length > 0) {
      setValidPassword(false);
    } else {
      setValidPassword(true);
    }
  };

  const passwordConfirmInputHandler = (newString: string) => {
    setPasswordConfirm(newString);

    if (newString.length > 0 && newString !== password) {
      setValidConfirmPassword(false);
    } else {
      setValidConfirmPassword(true);
    }
  };

  const usernameHandler = (newName: string) => {
    newName = newName.replace(/\s+/g, "");
    setUsername(newName);

    if (newName.length > 0 && newName.length <= 3) {
      setUsernameError("Must be longer than 3 characters");
      setValidName(false);
    } else {
      setValidName(true);
    }
  };

  return (
    <Box>
      <Box w="100%" opacity={isSomeError ? 100 : 0}>
        <Collapse isOpen={isSomeError}>
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
              Something went wrong. Please try again later.
            </Alert.Description>
          </Alert>
        </Collapse>
      </Box>

      <Box w="100%" opacity={emailIsTaken ? 100 : 0}>
        <Collapse isOpen={emailIsTaken}>
          <Alert
            status="error"
            action={
              <IconButton
                icon={<CloseIcon size="xs" />}
                onPress={() => setEmailIsTaken(false)}
              />
            }
            actionProps={{
              alignSelf: "center",
            }}
          >
            <Alert.Icon />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>Email is already taken.</Alert.Description>
          </Alert>
        </Collapse>
      </Box>

      <Box w="100%" opacity={usernameTaken ? 100 : 0}>
        <Collapse isOpen={usernameTaken}>
          <Alert
            status="error"
            action={
              <IconButton
                icon={<CloseIcon size="xs" />}
                onPress={() => setUsernameTaken(false)}
              />
            }
            actionProps={{
              alignSelf: "center",
            }}
          >
            <Alert.Icon />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>Username already taken</Alert.Description>
          </Alert>
        </Collapse>
      </Box>
      <FormControl isRequired isInvalid={!validName}>
        <Stack mx={4}>
          <FormControl.Label>Username</FormControl.Label>
          <Input
            p={2}
            placeholder="What should we call you?"
            onChangeText={usernameHandler}
            secureTextEntry={false}
            ref={usernameRef}
          />
          <FormControl.ErrorMessage>{usernameError}</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl isRequired isInvalid={!validMail}>
        <Stack mx={4}>
          <FormControl.Label>Email</FormControl.Label>
          <KeyboardAvoidingView enabled={false}>
            <Input
              p={2}
              placeholder="Please enter your email"
              onChangeText={emailInputHandler}
              keyboardType="email-address"
              autoCompleteType="email"
              ref={emailRef}
            />
          </KeyboardAvoidingView>
          <FormControl.ErrorMessage>Invalid Email</FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl isRequired isInvalid={!validPassword}>
        <Stack mx={4}>
          <FormControl.Label>Password</FormControl.Label>
          <Input
            p={2}
            placeholder="Please enter a password"
            onChangeText={passwordInputHandler}
            secureTextEntry={true}
            ref={passwordRef}
          />
          <FormControl.ErrorMessage>
            Password must be at least 6 characters long
          </FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <FormControl isRequired isInvalid={!validConfirmPassword}>
        <Stack mx={4}>
          <FormControl.Label>Reenter Password</FormControl.Label>
          <Input
            p={2}
            placeholder="Please enter your password again"
            onChangeText={passwordConfirmInputHandler}
            secureTextEntry={true}
            ref={confirmPasswordRef}
          />
          <FormControl.ErrorMessage>
            Passwords do not match
          </FormControl.ErrorMessage>
        </Stack>
      </FormControl>

      <Stack mx={4} my={2}>
        <Button
          size="lg"
          onPress={registerHandler}
          isDisabled={registerDisabled}
          bg="#2FEBDB"
        >
          Register
        </Button>
      </Stack>
    </Box>
  );
};
export default CustomRegister;
