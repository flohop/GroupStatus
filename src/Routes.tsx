import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import firebase from "firebase";
import { Text, useColorMode } from "native-base";
import React, { useEffect, useState } from "react";
// @ts-ignore
import Firebase from "../config/firebase";
import AppTabs from "./AppTabs";
import Auth from "./AuthTabs";
import { createUserInFirestore } from "./util/auth/createUserInFirestore";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
type RoutesProps = {};

// @ts-ignore
const auth = Firebase.auth();

const MyLightTheme = {
  ...DefaultTheme,
};

const MyDarkTheme: typeof DarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#36393f",
    primary: "#34d399",
  },
};

const Router: React.FC<RoutesProps> = ({}) => {
  const [isAuth, setIsAuth] = useState(false);

  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(
      async (user: firebase.User | null) => {
        if (user !== undefined && user !== null) {
          setIsAuth(true);
          // register the user in firestore, if he is not already registered
          createUserInFirestore(user);
        } else {
          setIsAuth(false);
        }
      }
    );
    return () => {
      unsub();
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  return (
    <NavigationContainer
      theme={colorMode === "light" ? MyLightTheme : MyDarkTheme}
    >
      {isAuth ? <AppTabs /> : <Auth />}
    </NavigationContainer>
  );
};
export default Router;
